"use client";

import { Component, Suspense, useEffect, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Color, MathUtils, Matrix4, Vector3, type Group, type Mesh, type ShaderMaterial } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { BRAIN_CONFIG, type ItemColumn } from "./config";

export type ProjectedPoint = { x: number; y: number };

type BrainSceneProps = {
  /** Índice da região acesa (ordem de BRAIN_CONFIG.regions), ou null no idle. */
  activeIndex: number | null;
  /** Coluna do item ativo: a região para levemente deslocada para esse lado. */
  column: ItemColumn | null;
  reducedMotion: boolean;
  /** Fora da tela o render para (frameloop "never"). */
  running: boolean;
  isMobile: boolean;
  onReady: () => void;
  onError: () => void;
  /** Posição da região ativa na tela, em px relativos ao canvas — a cada frame. */
  onProject: (point: ProjectedPoint | null) => void;
};

const vertexShader = /* glsl */ `
  uniform mat4 uToModel;
  varying vec3 vModelPos;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    // O glb vem quantizado: a malha carrega uma escala própria. uToModel leva o vértice
    // de volta ao espaço normalizado do modelo, onde as regiões foram definidas.
    vModelPos = (uToModel * vec4(position, 1.0)).xyz;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uShadow;
  uniform vec3 uDeep;
  uniform vec3 uBase;
  uniform vec3 uRim;
  uniform vec3 uHot;
  uniform float uTime;
  uniform float uDim;
  uniform float uDimTo;
  uniform float uPulsePeriod;
  uniform vec3 uCenters[4];
  uniform float uRadii[4];
  uniform float uIntensity[4];

  varying vec3 vModelPos;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vViewDir);
    // Luz principal no alto, à esquerda e à frente (espaço da câmera): fica fixa enquanto
    // o cérebro gira, como num estúdio.
    vec3 l = normalize(vec3(-0.45, 0.8, 0.55));

    // Half-Lambert ao quadrado: sombras macias, as dobras escurecem sem ficar pretas.
    float diffuse = dot(n, l) * 0.5 + 0.5;
    diffuse *= diffuse;
    float fresnel = pow(1.0 - max(dot(n, v), 0.0), 2.5);
    float specular = pow(max(dot(n, normalize(l + v)), 0.0), 36.0);

    // Rampa de cor da paleta: navy nas dobras fundas, teal no corpo, cyan e cyan-tint
    // nas partes que pegam luz — o azul claro e luminoso da referência.
    vec3 color = mix(uShadow, uDeep, smoothstep(0.0, 0.18, diffuse));
    color = mix(color, uBase, smoothstep(0.08, 0.5, diffuse));
    color = mix(color, uRim, smoothstep(0.4, 0.95, diffuse) * 0.75);
    color = mix(color, uHot, smoothstep(0.8, 1.0, diffuse) * 0.25);
    color += uHot * specular * 0.45;
    // Borda brilhante (rim light), o aspecto de vidro da referência.
    color += uRim * fresnel * 0.7 + uHot * pow(fresnel, 3.0) * 0.4;

    float mask = 0.0;
    for (int i = 0; i < 4; i++) {
      float d = distance(vModelPos, uCenters[i]);
      float m = 1.0 - smoothstep(uRadii[i] * 0.3, uRadii[i], d);
      mask = max(mask, m * uIntensity[i]);
    }

    float pulse = 0.5 + 0.5 * sin(uTime * 6.2831853 / uPulsePeriod);
    color *= mix(1.0, uDimTo, uDim * (1.0 - mask));

    // Região ativa: cyan aceso, com o miolo pulsando até o cyan-tint.
    vec3 glow = uRim * (1.1 + 0.3 * diffuse);
    glow = mix(glow, uHot, smoothstep(0.55, 1.0, mask) * (0.35 + 0.4 * pulse));
    color = mix(color, glow, mask * 0.85);
    // Emissão somada: a região parece acesa por dentro, não só pintada.
    color += uRim * mask * (0.3 + 0.3 * pulse);

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

function themeColor(key: keyof typeof BRAIN_CONFIG.colors) {
  const { cssVar, fallback } = BRAIN_CONFIG.colors[key];
  const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
  return new Color(value || fallback);
}

const REGION_CENTERS = BRAIN_CONFIG.regions.map((region) => new Vector3(...region.center));
// Vetor de trabalho da projeção (evita alocar um por frame).
const scratch = new Vector3();

const TAU = Math.PI * 2;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** Leva um ângulo para (-PI, PI]: o giro até a região sempre pega o caminho mais curto. */
const wrapAngle = (a: number) => a - TAU * Math.round(a / TAU);

/** Ângulo de rotação (em Y) que deixa a região de frente para a câmera. */
function facingAngle(index: number, column: ItemColumn | null) {
  const center = REGION_CENTERS[index];
  // Girar θ em Y leva um ponto do azimute φ = atan2(x, z) para φ + θ; de frente é φ' = 0.
  // Um φ' negativo põe a região à esquerda da tela, perto do item da coluna esquerda.
  const offset = MathUtils.degToRad(BRAIN_CONFIG.select.faceOffsetDeg);
  const shift = column === "left" ? -offset : column === "right" ? offset : 0;
  return -Math.atan2(center.x, center.z) + shift;
}

function Brain({
  activeIndex,
  column,
  reducedMotion,
  onReady,
  onProject,
}: Omit<BrainSceneProps, "running" | "isMobile" | "onError">) {
  const gltf = useLoader(GLTFLoader, BRAIN_CONFIG.model, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });
  const group = useRef<Group>(null);
  const material = useRef<ShaderMaterial>(null);

  // Matriz da malha relativa à raiz do glb (a quantização guarda a escala ali).
  const { geometry, toModel } = useMemo(() => {
    gltf.scene.updateMatrixWorld(true);
    const mesh = gltf.scene.getObjectByProperty("isMesh", true) as Mesh;
    const matrix = new Matrix4().copy(gltf.scene.matrixWorld).invert().multiply(mesh.matrixWorld);
    return { geometry: mesh.geometry, toModel: matrix };
  }, [gltf]);

  const uniforms = useMemo(
    () => ({
      uToModel: { value: toModel },
      uShadow: { value: themeColor("shadow") },
      uDeep: { value: themeColor("deep") },
      uBase: { value: themeColor("base") },
      uRim: { value: themeColor("rim") },
      uHot: { value: themeColor("hot") },
      uTime: { value: 0 },
      uDim: { value: 0 },
      uDimTo: { value: BRAIN_CONFIG.select.dimTo },
      uPulsePeriod: { value: BRAIN_CONFIG.select.pulsePeriodS },
      uCenters: { value: REGION_CENTERS },
      uRadii: { value: BRAIN_CONFIG.regions.map((region) => region.radius) },
      uIntensity: { value: BRAIN_CONFIG.regions.map(() => 0) },
    }),
    [toModel],
  );

  useEffect(() => {
    onReady();
  }, [onReady]);

  // Giro: livre (velocidade constante) no idle; com seleção, um tween easeInOut que parte
  // do ângulo atual. Trocar de item no meio do caminho continua dali, sem salto.
  const motion = useRef({
    // Começa de perfil (lado esquerdo), como na referência.
    angle: -Math.PI / 2,
    speed: 0,
    focusing: false,
    from: 0,
    to: 0,
    start: 0,
  });
  const elapsed = useRef(0);

  useEffect(() => {
    const m = motion.current;
    if (activeIndex === null) {
      m.focusing = false;
      return;
    }
    m.focusing = true;
    m.from = m.angle;
    m.to = m.angle + wrapAngle(facingAngle(activeIndex, column) - m.angle);
    m.start = elapsed.current;
  }, [activeIndex, column]);

  useFrame(({ camera, size }, delta) => {
    const g = group.current;
    const mat = material.current;
    if (!g || !mat) return;
    // delta limitado: ao voltar de uma aba em segundo plano, nada salta.
    const dt = Math.min(delta, 0.1);
    elapsed.current += dt;
    const t = elapsed.current;
    const { idle, select, view } = BRAIN_CONFIG;
    const m = motion.current;

    if (m.focusing) {
      const progress = reducedMotion ? 1 : Math.min((t - m.start) / select.focusDurationS, 1);
      m.angle = m.from + (m.to - m.from) * easeInOutCubic(progress);
      m.speed = 0;
    } else if (!reducedMotion) {
      // A velocidade volta aos poucos: o cérebro retoma o giro em vez de arrancar.
      m.speed = MathUtils.damp(m.speed, TAU / idle.spinPeriodS, 3 / select.spinRampS, dt);
      m.angle += m.speed * dt;
    }

    // Canvas mais estreito que alto (mobile): a câmera recua para o perfil caber na largura.
    const distance = view.cameraDistance * Math.max(1, (size.height / size.width) * 1.04);
    camera.position.z = distance;
    // Unidades de mundo por pixel no plano do cérebro, para a flutuação ser em px de tela.
    const worldPerPx = (2 * distance * Math.tan(MathUtils.degToRad(view.fov / 2))) / size.height;
    const float = reducedMotion
      ? 0
      : idle.floatAmplitudePx * worldPerPx * Math.sin((t * TAU) / idle.floatPeriodS);

    // Ordem XYZ: primeiro gira em torno do próprio eixo vertical (Y), depois inclina (X).
    g.rotation.set(MathUtils.degToRad(view.tiltDeg), m.angle, 0, "XYZ");
    g.position.y = float;

    const u = mat.uniforms;
    u.uTime.value = t;
    const intensities = u.uIntensity.value as number[];
    for (let i = 0; i < intensities.length; i++) {
      intensities[i] = MathUtils.damp(
        intensities[i],
        i === activeIndex ? 1 : 0,
        select.regionFadeLambda,
        dt,
      );
    }
    u.uDim.value = MathUtils.damp(
      u.uDim.value,
      activeIndex === null ? 0 : 1,
      select.regionFadeLambda,
      dt,
    );

    if (activeIndex === null) {
      onProject(null);
      return;
    }
    g.updateMatrixWorld();
    scratch.copy(REGION_CENTERS[activeIndex]).applyMatrix4(g.matrixWorld).project(camera);
    onProject({
      x: ((scratch.x + 1) / 2) * size.width,
      y: ((1 - scratch.y) / 2) * size.height,
    });
  });

  return (
    <group ref={group}>
      {/* matrix = toModel: o espaço local do grupo é o espaço normalizado do modelo. */}
      <mesh geometry={geometry} matrix={toModel} matrixAutoUpdate={false}>
        <shaderMaterial
          ref={material}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>
    </group>
  );
}

class LoadBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function BrainScene({ running, isMobile, onError, ...brainProps }: BrainSceneProps) {
  const { view, maxDpr } = BRAIN_CONFIG;

  return (
    <Canvas
      aria-hidden="true"
      frameloop={running ? "always" : "never"}
      dpr={[1, isMobile ? maxDpr.mobile : maxDpr.desktop]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: view.fov, position: [0, 0, view.cameraDistance], near: 0.1, far: 20 }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", onError, { once: true });
      }}
    >
      <LoadBoundary onError={onError}>
        <Suspense fallback={null}>
          <Brain {...brainProps} />
        </Suspense>
      </LoadBoundary>
    </Canvas>
  );
}
