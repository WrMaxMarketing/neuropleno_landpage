/**
 * Ajustes do cérebro 3D da seção Especialidades. Tudo o que é "gosto" fica aqui:
 * balanço, flutuação, durações, pontos de luz, cores e as regiões que acendem.
 *
 * O visual é de "holograma": um corpo escuro com borda luminosa, coberto por uma
 * malha de pontos de luz (um ponto por vértice do modelo). A região da especialidade
 * escolhida acende e solta ondas de sinal pelo córtex.
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
    /** Balanço lateral em volta da região escolhida, em graus. Mantém o cérebro vivo
     *  sem tirar a região de vista. */
    swayDeg: 9,
    /** Ciclo completo do balanço, em segundos. */
    swayPeriodS: 10,
    /** Oscilação vertical, em px de tela. */
    floatAmplitudePx: 8,
    /** Ciclo completo da flutuação, em segundos. */
    floatPeriodS: 7,
  },

  select: {
    /** Duração do giro até a região selecionada, em segundos (easeInOut). */
    focusDurationS: 1.4,
    /** A região para um pouco virada para o lado da lista (desktop), em graus, para
     *  a linha de conexão ficar curta. 0 = exatamente de frente. */
    faceOffsetDeg: 15,
    /** Quanto o cérebro pode girar para cada lado do perfil (-90°), em graus. Além
     *  disso a silhueta some; a região fica visível na lateral mesmo sem estar de frente. */
    maxTurnDeg: 40,
    /** Brilho do resto do cérebro quando uma região está acesa (0–1). */
    dimTo: 0.7,
    /** Período do pulso da região ativa, em segundos. */
    pulsePeriodS: 2,
    /** Velocidade do cross-fade entre regiões (maior = mais rápido). */
    regionFadeLambda: 4,
  },

  points: {
    /** Diâmetro de cada ponto em px de tela, com a câmera na distância padrão. */
    sizePx: 2.6,
    /** Quanto o ponto cresce na região acesa (1 = dobra). */
    activeGrowth: 0.9,
    /** Afastamento da superfície (unidades do modelo): evita que o corpo esconda o
     *  ponto do próprio vértice. */
    lift: 0.008,
  },

  wave: {
    /** Intervalo entre duas ondas de sinal saindo da região ativa, em segundos. */
    periodS: 2.6,
    /** Até onde a onda chega antes de sumir (unidades do modelo). */
    reach: 1.1,
  },

  /** Limites de pixel ratio (desktop / mobile). */
  maxDpr: { desktop: 2, mobile: 1.5 },

  /** Tokens de cor lidos do tema (globals.css). Os hex são só reserva para o caso de a
   *  variável não existir. */
  colors: {
    /** Dobras do corpo (sombra). */
    shadow: { cssVar: "--color-navy", fallback: "#023047" },
    /** Corpo iluminado. */
    deep: { cssVar: "--color-navy-light", fallback: "#0a4a63" },
    /** Pontos e borda luminosa. */
    rim: { cssVar: "--color-cyan", fallback: "#3cbdd3" },
    /** Miolo da região acesa. */
    hot: { cssVar: "--color-cyan-tint", fallback: "#e8f7fa" },
  },

  /** Uma região por especialidade, na mesma ordem dos itens da seção (Authority.tsx).
   *  Todas na face lateral do hemisfério esquerdo (+X): cada seleção gira o cérebro
   *  para um ângulo diferente, mas sempre mostrando o perfil — de costas ou de frente
   *  ele vira uma bola sem forma. center em espaço do modelo, radius com falloff suave. */
  regions: [
    { name: "frontal", center: [0.5, 0.45, 0.55], radius: 0.42 },
    { name: "parietal", center: [0.55, 0.62, -0.25], radius: 0.42 },
    { name: "temporal", center: [0.68, -0.2, 0.15], radius: 0.4 },
    { name: "occipital", center: [0.55, 0.15, -0.62], radius: 0.38 },
  ] as { name: string; center: [number, number, number]; radius: number }[],
} as const;

/** Lado da tela em que fica a lista de especialidades (define para onde a região vira). */
export type ItemColumn = "left" | "right";
