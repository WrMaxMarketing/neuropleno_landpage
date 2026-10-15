"use client";

import { Component, Suspense, useEffect, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  MathUtils,
  Matrix3,
  Matrix4,
  Vector3,
  type Group,
  type Mesh,
  type ShaderMaterial,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { BRAIN_CONFIG, type ItemColumn } from "./config";

export type ProjectedPoint = { x: number; y: number };

type BrainSceneProps = {
  /** Índice da região acesa (ordem de BRAIN_CONFIG.regions). */
  activeIndex: number;
  /** Lado da lista de especialidades: a região para levemente virada para lá. */
  column: ItemColumn | null;
  reducedMotion: boolean;
  /** Fora da tela o render para (frameloop "never"). */
  running: boolean;
  isMobile: boolean;
  onReady: () => void;
  onError: () => void;
  /** Posição da região ativa na tela, em px relativos ao canvas — a cada frame. */
  onProject: (point: ProjectedPoint) => void;
};

/** Região acesa e ondas de sinal: usadas pelo corpo e pelos pontos. */
const regionChunk = /* glsl */ `
  uniform vec3 uCenters[4];
  uniform float uRadii[4];
  uniform float uIntensity[4];
  uniform float uTime;
  uniform float uWavePeriod;
  uniform float uWaveReach;

  float regionMask(vec3 p) {
    float mask = 0.0;
    for (int i = 0; i < 4; i++) {
      float d = distance(p, uCenters[i]);
      float m = 1.0 - smoothstep(uRadii[i] * 0.3, uRadii[i], d);
      mask = max(mask, m * uIntensity[i]);
    }
    return mask;
  }

  // Um anel que sai do centro da região ativa, percorre o córtex e se apaga ao se
  // afastar — o "sinal" partindo da área da especialidade.
  float signalWave(vec3 p) {
    float phase = fract(uTime / uWavePeriod);
    float radius = phase * uWaveReach;
    float wave = 0.0;
    for (int i = 0; i < 4; i++) {
      float d = distance(p, uCenters[i]);
      float ring = 1.0 - smoothstep(0.0, 0.07, abs(d - radius));
      wave = max(wave, ring * (1.0 - phase) * uIntensity[i]);
    }
    return wave;
  }
`;

const bodyVertexShader = /* glsl */ `
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

const bodyFragmentShader = /* glsl */ `
  uniform vec3 uShadow;
  uniform vec3 uDeep;
  uniform vec3 uRim;
  uniform float uDim;
  uniform float uDimTo;
  uniform float uPulsePeriod;
  ${regionChunk}

  varying vec3 vModelPos;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vViewDir);
    // Luz no alto, à esquerda e à frente (espaço da câmera): fica fixa enquanto o
    // cérebro gira, como num estúdio.
    vec3 l = normalize(vec3(-0.45, 0.8, 0.55));

    float diffuse = dot(n, l) * 0.5 + 0.5;
    diffuse *= diffuse;
    float fresnel = pow(1.0 - max(dot(n, v), 0.0), 2.6);

    // Corpo escuro, quase da cor do fundo: quem desenha o cérebro são os pontos de luz
    // e a borda. O sombreado leve só deixa ler os giros por baixo dos pontos.
    vec3 color = mix(uShadow * 0.7, uDeep, smoothstep(0.05, 0.9, diffuse));
    color += uRim * fresnel * 0.6;

    float mask = regionMask(vModelPos);
    float pulse = 0.5 + 0.5 * sin(uTime * 6.2831853 / uPulsePeriod);
    color *= mix(1.0, uDimTo, uDim * (1.0 - mask));
    // Brilho por dentro da região acesa; os pontos fazem o resto.
    color += uRim * mask * (0.22 + 0.18 * pulse);
    color += uRim * signalWave(vModelPos) * 0.25;

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

const pointsVertexShader = /* glsl */ `
  uniform mat4 uToModel;
  uniform mat3 uNormalToModel;
  uniform float uSize;
  uniform float uGrowth;
  uniform float uLift;
  uniform float uPixelRatio;
  uniform float uCameraDistance;
  ${regionChunk}

  varying float vFacing;
  varying float vMask;
  varying float vWave;
  varying float vSeed;

  void main() {
    vec3 modelNormal = normalize(uNormalToModel * normal);
    // Um pouco para fora da superfície: o corpo opaco esconde só os pontos de trás.
    vec3 modelPos = (uToModel * vec4(position, 1.0)).xyz + modelNormal * uLift;
    vec4 mvPosition = modelViewMatrix * vec4(modelPos, 1.0);

    vFacing = dot(normalize(mat3(modelViewMatrix) * modelNormal), normalize(-mvPosition.xyz));
    vMask = regionMask(modelPos);
    vWave = signalWave(modelPos);
    // Variação fixa de brilho por ponto: a malha fica orgânica, não uniforme.
    vSeed = fract(sin(dot(position, vec3(12.9898, 78.233, 37.719))) * 43758.5453);

    float size = uSize * (1.0 + uGrowth * max(vMask, vWave));
    gl_PointSize = size * uPixelRatio * (uCameraDistance / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const pointsFragmentShader = /* glsl */ `
  uniform vec3 uRim;
  uniform vec3 uHot;
  uniform float uTime;
  uniform float uPulsePeriod;
  uniform float uDim;
  uniform float uDimTo;

  varying float vFacing;
  varying float vMask;
  varying float vWave;
  varying float vSeed;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float soft = 1.0 - smoothstep(0.15, 0.5, d);

    // Pontos de frente brilham mais; os do contorno ficam mais apagados.
    float facing = clamp(vFacing, 0.0, 1.0);
    float pulse = 0.5 + 0.5 * sin(uTime * 6.2831853 / uPulsePeriod);

    float base = (0.5 + 0.7 * facing) * (0.7 + 0.6 * vSeed);
    base *= mix(1.0, uDimTo, uDim * (1.0 - vMask));
    vec3 color = uRim * base;
    vec3 hot = mix(uRim, uHot, 0.55 + 0.25 * pulse);
    color = mix(color, hot * 1.15, vMask);
    color += uHot * vWave * 0.9;

    float alpha = soft * clamp(0.45 + 0.4 * facing + 0.5 * vMask + 0.6 * vWave, 0.0, 1.0);
    gl_FragColor = vec4(color, alpha);
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
/** Rotação em Y que mostra o perfil do hemisfério esquerdo (+X) de frente para a câmera. */
const PROFILE = -Math.PI / 2;
/** Altura do canvas (px) em que os pontos têm exatamente points.sizePx. */
const POINT_REFERENCE_HEIGHT = 520;

/** Ângulo de rotação (em Y) que deixa a região de frente para a câmera. */
function facingAngle(index: number, column: ItemColumn | null) {
  const center = REGION_CENTERS[index];
  // Girar θ em Y leva um ponto do azimute φ = atan2(x, z) para φ + θ; de frente é φ' = 0.
  // Um φ' negativo põe a região à esquerda da tela, perto de uma lista à esquerda.
  const offset = MathUtils.degToRad(BRAIN_CONFIG.select.faceOffsetDeg);
  const shift = column === "left" ? -offset : column === "right" ? offset : 0;
  const limit = MathUtils.degToRad(BRAIN_CONFIG.select.maxTurnDeg);
  return MathUtils.clamp(-Math.atan2(center.x, center.z) + shift, PROFILE - limit, PROFILE + limit);
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
  const gl = useThree((state) => state.gl);
  const group = useRef<Group>(null);
  // Os uniforms são escritos a cada frame pelo material (ref), não pelo objeto do
  // useMemo: o React não permite mutar valores de hook fora do render.
  const material = useRef<ShaderMaterial>(null);

  // Matriz da malha relativa à raiz do glb (a quantização guarda a escala ali).
  const { geometry, pointGeometry, toModel, normalToModel } = useMemo(() => {
    gltf.scene.updateMatrixWorld(true);
    const mesh = gltf.scene.getObjectByProperty("isMesh", true) as Mesh;
    const matrix = new Matrix4().copy(gltf.scene.matrixWorld).invert().multiply(mesh.matrixWorld);
    // Os pontos usam os mesmos vértices, mas sem o índice: com ele cada vértice seria
    // desenhado uma vez por triângulo que o usa (~7 vezes), somando brilho e custo.
    const points = new BufferGeometry();
    points.setAttribute("position", mesh.geometry.getAttribute("position"));
    points.setAttribute("normal", mesh.geometry.getAttribute("normal"));
    return {
      geometry: mesh.geometry,
      pointGeometry: points,
      toModel: matrix,
      normalToModel: new Matrix3().getNormalMatrix(matrix),
    };
  }, [gltf]);

  useEffect(() => () => pointGeometry.dispose(), [pointGeometry]);

  // Um só objeto de uniforms para o corpo e os pontos: os dois leem o mesmo tempo,
  // a mesma região acesa e as mesmas cores.
  const uniforms = useMemo(() => {
    const { select, points, wave, view, regions } = BRAIN_CONFIG;
    return {
      uToModel: { value: toModel },
      uNormalToModel: { value: normalToModel },
      uShadow: { value: themeColor("shadow") },
      uDeep: { value: themeColor("deep") },
      uRim: { value: themeColor("rim") },
      uHot: { value: themeColor("hot") },
      uTime: { value: 0 },
      uDim: { value: 0 },
      uDimTo: { value: select.dimTo },
      uPulsePeriod: { value: select.pulsePeriodS },
      uCenters: { value: REGION_CENTERS },
      uRadii: { value: regions.map((region) => region.radius) },
      uIntensity: { value: regions.map(() => 0) },
      uWavePeriod: { value: wave.periodS },
      uWaveReach: { value: wave.reach },
      uSize: { value: points.sizePx },
      uGrowth: { value: points.activeGrowth },
      uLift: { value: points.lift },
      uPixelRatio: { value: 1 },
      uCameraDistance: { value: view.cameraDistance },
    };
  }, [toModel, normalToModel]);

  useEffect(() => {
    onReady();
  }, [onReady]);

  // O ângulo-base vai até a região escolhida num tween easeInOut que parte do ângulo
  // atual — trocar de item no meio do giro continua dali, sem salto. Por cima dele
  // corre um balanço leve, que mantém o cérebro vivo sem tirar a região de vista.
  const motion = useRef({
    // Começa de perfil (lado esquerdo) e gira até a primeira região ao aparecer.
    base: PROFILE,
    from: PROFILE,
    to: PROFILE,
    start: 0,
  });
  const elapsed = useRef(0);

  useEffect(() => {
    const m = motion.current;
    m.from = m.base;
    m.to = m.base + wrapAngle(facingAngle(activeIndex, column) - m.base);
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
    const { idle, select, view, points } = BRAIN_CONFIG;
    const m = motion.current;

    const progress = reducedMotion ? 1 : Math.min((t - m.start) / select.focusDurationS, 1);
    m.base = m.from + (m.to - m.from) * easeInOutCubic(progress);
    const sway = reducedMotion
      ? 0
      : MathUtils.degToRad(idle.swayDeg) * Math.sin((t * TAU) / idle.swayPeriodS);

    // Canvas mais estreito que alto (mobile): a câmera recua para o perfil caber na largura.
    const distance = view.cameraDistance * Math.max(1, (size.height / size.width) * 1.04);
    camera.position.z = distance;
    // Unidades de mundo por pixel no plano do cérebro, para a flutuação ser em px de tela.
    const worldPerPx = (2 * distance * Math.tan(MathUtils.degToRad(view.fov / 2))) / size.height;
    const float = reducedMotion
      ? 0
      : idle.floatAmplitudePx * worldPerPx * Math.sin((t * TAU) / idle.floatPeriodS);

    // Ordem XYZ: primeiro gira em torno do próprio eixo vertical (Y), depois inclina (X).
    g.rotation.set(MathUtils.degToRad(view.tiltDeg), m.base + sway, 0, "XYZ");
    g.position.y = float;

    // Corpo e pontos dividem o mesmo objeto de uniforms: escrever aqui vale para os dois.
    const u = mat.uniforms;
    // Com movimento reduzido o tempo para: o pulso e a onda viram um brilho fixo.
    if (!reducedMotion) u.uTime.value = t;
    u.uPixelRatio.value = gl.getPixelRatio();
    // Pontos acompanham o tamanho do palco: no celular o cérebro é menor, os pontos também.
    u.uSize.value = points.sizePx * MathUtils.clamp(size.height / POINT_REFERENCE_HEIGHT, 0.7, 1.15);
    const intensities = u.uIntensity.value as number[];
    for (let i = 0; i < intensities.length; i++) {
      intensities[i] = MathUtils.damp(
        intensities[i],
        i === activeIndex ? 1 : 0,
        select.regionFadeLambda,
        dt,
      );
    }
    u.uDim.value = MathUtils.damp(u.uDim.value, 1, select.regionFadeLambda, dt);

    g.updateMatrixWorld();
    scratch.copy(REGION_CENTERS[activeIndex]).applyMatrix4(g.matrixWorld).project(camera);
    onProject({
      x: ((scratch.x + 1) / 2) * size.width,
      y: ((1 - scratch.y) / 2) * size.height,
    });
  });

  return (
    <group ref={group}>
      {/* matrix = toModel: o espaço local da malha vira o espaço normalizado do modelo. */}
      <mesh geometry={geometry} matrix={toModel} matrixAutoUpdate={false}>
        <shaderMaterial
          ref={material}
          vertexShader={bodyVertexShader}
          fragmentShader={bodyFragmentShader}
          uniforms={uniforms}
        />
      </mesh>
      {/* Os pontos aplicam o toModel no shader, então a caixa de recorte da geometria
          (em espaço quantizado) não serve: frustumCulled desligado. */}
      <points geometry={pointGeometry} frustumCulled={false}>
        <shaderMaterial
          vertexShader={pointsVertexShader}
          fragmentShader={pointsFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
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
