/**
 * Ajustes do cérebro 3D da seção Especialidades. Tudo o que é "gosto" fica aqui:
 * velocidade do giro, flutuação, durações, cores e as regiões que acendem.
 *
 * Espaço do modelo (public/models/cerebro-3d.glb, normalizado para raio 1):
 *   +X = lado esquerdo do paciente · +Y = topo · +Z = frente (testa)
 */
export const BRAIN_CONFIG = {
  model: "/models/cerebro-3d.glb",

  view: {
    /** Inclinação para mostrar um pouco do topo, em graus. */
    tiltDeg: 12,
    /** Distância da câmera (unidades do modelo). */
    cameraDistance: 3.95,
    fov: 30,
  },

  idle: {
    /** Tempo de uma volta completa (360°), em segundos. Maior = mais devagar. */
    spinPeriodS: 40,
    /** Oscilação vertical, em px de tela. */
    floatAmplitudePx: 10,
    /** Ciclo completo da flutuação, em segundos. */
    floatPeriodS: 7,
  },

  select: {
    /** Duração do giro até a região selecionada, em segundos (easeInOut). */
    focusDurationS: 1.6,
    /** A região para um pouco deslocada para o lado do item clicado, em graus,
     *  para a linha de conexão ficar curta. 0 = exatamente de frente. */
    faceOffsetDeg: 22,
    /** Sem seleção por esse tempo, o cérebro volta a girar sozinho. */
    idleReturnMs: 4000,
    /** Tempo para o giro livre voltar à velocidade normal depois de uma seleção (maior = mais suave). */
    spinRampS: 1.5,
    /** Brilho do resto do cérebro quando uma região está acesa (0–1). */
    dimTo: 0.7,
    /** Período do pulso da região ativa, em segundos. */
    pulsePeriodS: 2,
    /** Velocidade do cross-fade entre regiões (maior = mais rápido). */
    regionFadeLambda: 4,
  },

  /** Limites de pixel ratio (desktop / mobile). */
  maxDpr: { desktop: 2, mobile: 1.5 },

  /** Tokens de cor lidos do tema (globals.css). Os hex são só reserva para o caso de a
   *  variável não existir. */
  colors: {
    shadow: { cssVar: "--color-navy", fallback: "#023047" },
    deep: { cssVar: "--color-navy-light", fallback: "#0a4a63" },
    base: { cssVar: "--color-teal", fallback: "#219ebc" },
    rim: { cssVar: "--color-cyan", fallback: "#3cbdd3" },
    hot: { cssVar: "--color-cyan-tint", fallback: "#e8f7fa" },
  },

  /** Uma região por especialidade, na mesma ordem dos itens da seção (Authority.tsx).
   *  Espalhadas em volta do cérebro para cada seleção girar até um ponto diferente.
   *  center em espaço do modelo, radius com falloff suave. */
  regions: [
    { name: "frontal", center: [0.3, 0.42, 0.62], radius: 0.4 },
    { name: "parietal", center: [0.32, 0.66, -0.32], radius: 0.4 },
    { name: "temporal", center: [-0.62, -0.05, -0.12], radius: 0.38 },
    { name: "occipital", center: [-0.3, 0.02, -0.8], radius: 0.36 },
  ] as { name: string; center: [number, number, number]; radius: number }[],
} as const;

/** Coluna da seção onde fica o item selecionado (define para que lado a região para). */
export type ItemColumn = "left" | "right";
