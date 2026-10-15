"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { ProjectedPoint } from "./brain/BrainScene";
import { CtaButton } from "./CtaButton";

// O Three.js só baixa quando a seção se aproxima da tela, e nunca no servidor:
// o primeiro render da página não espera pelo 3D.
const BrainScene = dynamic(() => import("./brain/BrainScene"), { ssr: false });

const FALLBACK_IMAGE = "/images/especialidades/cerebro-3d-holograma.webp";

// A ordem define a região acesa no cérebro (BRAIN_CONFIG.regions): frontal, parietal,
// temporal e occipital.
const areas: {
  title: string;
  /** Linha curta da lista: o que a especialidade trata, para o paciente se achar pelo sintoma. */
  topics: string;
  highlight: string;
  description: string;
  cta: string;
}[] = [
  {
    title: "Neurologia",
    topics: "Enxaqueca, epilepsia, Parkinson, Alzheimer e AVC",
    highlight: "Entenda o que está acontecendo com seu corpo e volte a viver com mais segurança.",
    description:
      "Investigação e tratamento de dores de cabeça, enxaqueca, Parkinson, Alzheimer, epilepsia, AVC e outros sintomas neurológicos, com avaliação individualizada e acompanhamento especializado.",
    cta: "Agendar consulta",
  },
  {
    title: "Neurocirurgia",
    topics: "Tumores cerebrais, coluna e compressões nervosas",
    highlight: "Quando a cirurgia é necessária, precisão e experiência fazem diferença.",
    description:
      "Tratamento especializado de tumores cerebrais, doenças da coluna, compressões nervosas e outras condições neurocirúrgicas, sempre buscando a melhor estratégia para cada paciente.",
    cta: "Agendar avaliação",
  },
  {
    title: "Neurorradiologia",
    topics: "Aneurismas, angiografia e angioplastia de carótida",
    highlight: "Tratamentos modernos por cateter, com alta precisão e menor invasividade.",
    description:
      "Abordagem de aneurismas cerebrais, doenças vasculares, angioplastia de carótida, angiografia e outros procedimentos realizados pelos vasos sanguíneos.",
    cta: "Agendar avaliação",
  },
  {
    title: "Neurointervenção",
    topics: "AVC, aneurismas e vasos do cérebro, sem cortes",
    highlight: "Tratamento por dentro do vaso, sem cortes e com recuperação mais rápida.",
    description:
      "Procedimentos endovasculares guiados por imagem para AVC, aneurismas cerebrais e doenças dos vasos do cérebro e do pescoço, conduzidos por equipe com formação em neurorradiologia intervencionista.",
    cta: "Agendar avaliação",
  },
];

const tabId = (index: number) => `especialidade-${index}-aba`;
const panelId = (index: number) => `especialidade-${index}`;
const ordinal = (index: number) => String(index + 1).padStart(2, "0");

/** Tempo que o mouse precisa parar sobre um item para selecioná-lo: passar por cima a
 *  caminho de outro item não troca o painel. */
const HOVER_INTENT_MS = 140;

type SceneStatus = "waiting" | "loading" | "ready" | "failed";

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);
  return matches;
}

/**
 * Especialidades: lista, cérebro e painel. Uma especialidade está sempre escolhida —
 * a região dela fica acesa no cérebro e o painel mostra o que ela trata. No desktop a
 * lista fica à esquerda, ligada ao cérebro por uma linha de sinal, e o painel à
 * direita; no celular o cérebro vem primeiro, a lista vira uma fileira de abas logo
 * abaixo dele (o giro acontece à vista de quem tocou) e o painel fecha o bloco.
 */
export function Authority() {
  const [selected, setSelected] = useState(0);
  const [status, setStatus] = useState<SceneStatus>("waiting");
  const [running, setRunning] = useState(false);

  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const section = useRef<HTMLElement>(null);
  const layout = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const line = useRef<SVGSVGElement>(null);
  const linePath = useRef<SVGPathElement>(null);
  const lineStart = useRef<SVGCircleElement>(null);
  const lineEnd = useRef<SVGCircleElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const hoverTimer = useRef(0);

  // Duas distâncias: carrega um pouco antes de a seção aparecer e renderiza só enquanto
  // ela está na tela.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const preload = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setStatus((s) => (s === "waiting" ? (supportsWebGL() ? "loading" : "failed") : s));
        preload.disconnect();
      },
      { rootMargin: "400px 0px" },
    );
    const visible = new IntersectionObserver(([entry]) => setRunning(entry.isIntersecting));
    preload.observe(el);
    visible.observe(el);
    return () => {
      preload.disconnect();
      visible.disconnect();
    };
  }, []);

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  const handleReady = useCallback(() => setStatus("ready"), []);
  const handleError = useCallback(() => setStatus("failed"), []);

  // Chamado a cada frame pela cena: escreve direto no SVG, sem re-render do React.
  const handleProject = useCallback(
    (point: ProjectedPoint) => {
      const svg = line.current;
      const path = linePath.current;
      const start = lineStart.current;
      const end = lineEnd.current;
      const box = layout.current?.getBoundingClientRect();
      const stageBox = stage.current?.getBoundingClientRect();
      const tab = tabs.current[selected];
      if (!svg || !path || !start || !end || !box || !stageBox || !tab || !isDesktop) {
        svg?.setAttribute("data-visible", "false");
        return;
      }

      const tabBox = tab.getBoundingClientRect();
      const sx = tabBox.right - box.left;
      const sy = tabBox.top + tabBox.height / 2 - box.top;
      const ex = stageBox.left + point.x - box.left;
      const ey = stageBox.top + point.y - box.top;
      const bend = (ex - sx) * 0.5;

      path.setAttribute("d", `M ${sx} ${sy} C ${sx + bend} ${sy}, ${ex - bend} ${ey}, ${ex} ${ey}`);
      start.setAttribute("cx", String(sx));
      start.setAttribute("cy", String(sy));
      end.setAttribute("cx", String(ex));
      end.setAttribute("cy", String(ey));
      svg.setAttribute("data-visible", "true");
    },
    [selected, isDesktop],
  );

  function select(index: number) {
    window.clearTimeout(hoverTimer.current);
    setSelected(index);
  }

  // Só o mouse seleciona por cima; no toque o pointerenter viria junto com o clique.
  function handlePointerEnter(event: PointerEvent<HTMLButtonElement>, index: number) {
    if (event.pointerType !== "mouse") return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setSelected(index), HOVER_INTENT_MS);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = areas.length - 1;
    const next: Record<string, number> = {
      ArrowDown: selected === last ? 0 : selected + 1,
      ArrowRight: selected === last ? 0 : selected + 1,
      ArrowUp: selected === 0 ? last : selected - 1,
      ArrowLeft: selected === 0 ? last : selected - 1,
      Home: 0,
      End: last,
    };
    const target = next[event.key];
    if (target === undefined) return;
    event.preventDefault();
    select(target);
    tabs.current[target]?.focus();
  }

  const showCanvas = status === "loading" || status === "ready";

  return (
    <section
      ref={section}
      id="especialidades"
      className="relative scroll-mt-20 overflow-x-clip bg-navy py-16 text-white sm:py-20 lg:py-24"
    >
      {/* Fundo: luz teal atrás do cérebro e uma malha de pontos que some nas bordas. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 50% 58%, color-mix(in srgb, var(--color-teal) 28%, transparent) 0%, transparent 72%), linear-gradient(180deg, var(--color-navy) 0%, color-mix(in srgb, var(--color-navy) 80%, var(--color-navy-light)) 100%)",
        }}
      />
      <div aria-hidden="true" className="specialty-backdrop pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan">
            Especialidades
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold text-white sm:text-4xl">
            Quatro especialidades integradas, do diagnóstico ao tratamento
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-cyan-tint/75">
            Escolha uma área para ver onde ela atua e o que tratamos.
          </p>
        </div>

        <div
          ref={layout}
          className="relative mt-8 grid grid-cols-1 items-center gap-6 sm:mt-10 lg:mt-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.45fr)_minmax(0,0.95fr)] lg:gap-8"
        >
          {/* Linha de sinal: só no desktop, onde lista e cérebro ficam lado a lado. */}
          <svg
            ref={line}
            aria-hidden="true"
            data-visible="false"
            className="pointer-events-none absolute inset-0 z-10 hidden h-full w-full overflow-visible opacity-0 transition-opacity duration-500 data-[visible=true]:opacity-100 lg:block"
          >
            <path
              ref={linePath}
              className="signal-line"
              fill="none"
              stroke="var(--color-cyan)"
              strokeOpacity={0.75}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
            <circle ref={lineStart} r={3} fill="var(--color-cyan)" />
            <circle ref={lineEnd} r={5} fill="var(--color-cyan-tint)" className="drop-shadow-[0_0_6px_var(--color-cyan)]" />
          </svg>

          <div
            ref={stage}
            className="relative mx-auto aspect-square w-full max-w-[340px] sm:max-w-[400px] lg:col-start-2 lg:row-start-1 lg:max-w-[520px]"
          >
            {/* Reserva enquanto o 3D carrega, e no lugar dele se o WebGL falhar. */}
            <Image
              src={FALLBACK_IMAGE}
              alt=""
              fill
              sizes="(max-width: 1024px) 400px, 520px"
              className={`object-contain transition-opacity duration-700 ${
                status === "ready" ? "opacity-0" : "opacity-100"
              }`}
            />
            {showCanvas && (
              <div
                className={`absolute inset-0 transition-opacity duration-700 ${
                  status === "ready" ? "opacity-100" : "opacity-0"
                }`}
              >
                <BrainScene
                  activeIndex={selected}
                  column={isDesktop ? "left" : null}
                  reducedMotion={reducedMotion}
                  running={running}
                  isMobile={isMobile}
                  onReady={handleReady}
                  onError={handleError}
                  onProject={handleProject}
                />
              </div>
            )}
          </div>

          {/* Abas. Celular: fileira que rola de borda a borda, logo abaixo do cérebro.
              Desktop: coluna à esquerda, com número, nome e o que a área trata. */}
          <div
            role="tablist"
            aria-label="Especialidades"
            aria-orientation={isDesktop ? "vertical" : "horizontal"}
            onKeyDown={handleKeyDown}
            onPointerLeave={() => window.clearTimeout(hoverTimer.current)}
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:justify-center sm:px-6 lg:col-start-1 lg:row-start-1 lg:mx-0 lg:flex-col lg:gap-2 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {areas.map((area, index) => {
              const isActive = index === selected;

              return (
                <button
                  key={area.title}
                  ref={(el) => {
                    tabs.current[index] = el;
                  }}
                  id={tabId(index)}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={panelId(index)}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => select(index)}
                  onPointerEnter={(event) => handlePointerEnter(event, index)}
                  className={`group relative flex min-h-11 shrink-0 touch-manipulation items-center rounded-full border px-4 text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-navy lg:w-full lg:flex-col lg:items-start lg:rounded-xl lg:border-transparent lg:py-4 lg:pl-6 lg:pr-4 lg:text-left ${
                    isActive
                      ? "border-cyan bg-cyan/15 text-white lg:bg-white/[0.06]"
                      : "border-white/15 text-cyan-tint/80 hover:border-cyan/50 hover:text-white lg:hover:bg-white/[0.03]"
                  }`}
                >
                  {/* Trilho à esquerda (desktop): aceso no item escolhido. */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-y-4 left-0 hidden w-0.5 rounded-full transition-colors duration-300 lg:block ${
                      isActive ? "bg-cyan shadow-[0_0_10px_var(--color-cyan)]" : "bg-white/10"
                    }`}
                  />
                  <span
                    aria-hidden="true"
                    className={`hidden font-mono text-xs tracking-[0.2em] lg:block ${
                      isActive ? "text-cyan" : "text-cyan/60"
                    }`}
                  >
                    {ordinal(index)}
                  </span>
                  <span className="lg:mt-1 lg:text-xl lg:font-bold">{area.title}</span>
                  <span
                    className={`hidden text-sm font-normal leading-snug transition-colors duration-300 lg:mt-1 lg:block ${
                      isActive ? "text-cyan-tint/85" : "text-cyan-tint/55"
                    }`}
                  >
                    {area.topics}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Painéis empilhados na mesma célula da grade: a altura é a do maior, então
              trocar de especialidade não empurra a página. Os ocultos ficam no HTML
              (SEO) com visibility hidden, fora do foco e do leitor de tela. */}
          <div className="grid lg:col-start-3 lg:row-start-1">
            {areas.map((area, index) => {
              const isActive = index === selected;

              return (
                <div
                  key={area.title}
                  id={panelId(index)}
                  role="tabpanel"
                  aria-labelledby={tabId(index)}
                  className={`[grid-area:1/1] rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-[opacity,transform,visibility] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none sm:p-7 ${
                    isActive ? "visible translate-y-0 opacity-100" : "invisible translate-y-2 opacity-0"
                  }`}
                >
                  <p className="font-mono text-xs tracking-[0.2em] text-cyan/80">
                    {ordinal(index)} / {ordinal(areas.length - 1)}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-white">{area.title}</h3>
                  <p className="mt-3 font-medium leading-snug text-cyan">{area.highlight}</p>
                  <p className="mt-3 text-sm leading-relaxed text-cyan-tint/80">{area.description}</p>
                  <CtaButton
                    size="md"
                    variant="accent"
                    message={`Olá! Gostaria de saber mais sobre ${area.title} na Clínica Neuropleno.`}
                    className="mt-6 w-full sm:w-auto"
                  >
                    {area.cta}
                  </CtaButton>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
