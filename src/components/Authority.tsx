"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { BRAIN_CONFIG, type ItemColumn } from "./brain/config";
import type { ProjectedPoint } from "./brain/BrainScene";
import { CtaButton } from "./CtaButton";

// O Three.js só baixa quando a seção se aproxima da tela, e nunca no servidor:
// o primeiro render da página não espera pelo 3D.
const BrainScene = dynamic(() => import("./brain/BrainScene"), { ssr: false });

const FALLBACK_IMAGE = "/images/especialidades/cerebro-3d.webp";

// A ordem define a região acesa no cérebro (BRAIN_CONFIG.regions): frontal, parietal,
// temporal e occipital. Os dois primeiros itens ficam à esquerda do cérebro, os outros à direita.
const areas: {
  title: string;
  highlight: string;
  description: string;
}[] = [
  {
    title: "Neurologia",
    highlight: "Entenda o que está acontecendo com seu corpo e volte a viver com mais segurança.",
    description:
      "Investigação e tratamento de dores de cabeça, enxaqueca, Parkinson, Alzheimer, epilepsia, AVC e outros sintomas neurológicos, com avaliação individualizada e acompanhamento especializado.",
  },
  {
    title: "Neurocirurgia",
    highlight: "Quando a cirurgia é necessária, precisão e experiência fazem diferença.",
    description:
      "Tratamento especializado de tumores cerebrais, doenças da coluna, compressões nervosas e outras condições neurocirúrgicas, sempre buscando a melhor estratégia para cada paciente.",
  },
  {
    title: "Neurorradiologia",
    highlight: "Tratamentos modernos por cateter, com alta precisão e menor invasividade.",
    description:
      "Abordagem de aneurismas cerebrais, doenças vasculares, angioplastia de carótida, angiografia e outros procedimentos realizados pelos vasos sanguíneos.",
  },
  {
    title: "Neurointervenção",
    highlight: "Tratamento por dentro do vaso, sem cortes e com recuperação mais rápida.",
    description:
      "Procedimentos endovasculares guiados por imagem para AVC, aneurismas cerebrais e doenças dos vasos do cérebro e do pescoço, conduzidos por equipe com formação em neurorradiologia intervencionista.",
  },
];

const panelId = (index: number) => `especialidade-${index}`;
const headerId = (index: number) => `especialidade-${index}-titulo`;
// Curva das animações de abrir/fechar: a mesma desaceleração longa e macia do macOS/iOS.
const EASE_APPLE = "ease-[cubic-bezier(0.32,0.72,0,1)]";
const columnOf = (index: number): ItemColumn => (index < areas.length / 2 ? "left" : "right");

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

export function Authority() {
  // O hover (e o foco) só mostra a região no cérebro; o clique fixa e expande o card.
  // O hover vence enquanto dura, o foco vem depois e o item fixado é o que sobra.
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const [lingering, setLingering] = useState<number | null>(null);
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
  const lineDot = useRef<SVGCircleElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const current = hovered ?? focused ?? pinned;

  // Sem seleção, o destaque ainda fica alguns segundos antes de o cérebro voltar ao idle.
  // A última seleção é guardada durante o render (padrão do React para estado derivado).
  const [previous, setPrevious] = useState(current);
  if (current !== previous) {
    setPrevious(current);
    if (current !== null) setLingering(current);
  }
  useEffect(() => {
    if (current !== null) return;
    const id = setTimeout(() => setLingering(null), BRAIN_CONFIG.select.idleReturnMs);
    return () => clearTimeout(id);
  }, [current]);

  const active = current ?? lingering;

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

  // Card aberto flutua por cima do vizinho: clicar fora dele ou apertar Esc fecha, para
  // nenhum painel ficar "preso" cobrindo o card de baixo.
  useEffect(() => {
    if (pinned === null) return;
    const open = pinned;
    const handlePointer = (event: PointerEvent) => {
      const card = buttons.current[open]?.closest("li");
      if (card && !card.contains(event.target as Node)) setPinned(null);
    };
    const handleKey = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setPinned(null);
      buttons.current[open]?.focus();
    };
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [pinned]);

  // Espaço no fim da seção (desktop): só o que o card aberto mais alto precisa para não
  // passar do cérebro, mais um respiro de lg:pb-6. Medido de verdade, porque a altura dos
  // painéis muda com a largura da tela (texto quebra em mais ou menos linhas).
  const [panelRoom, setPanelRoom] = useState(0);
  useEffect(() => {
    const grid = layout.current;
    const stageEl = stage.current;
    if (!grid || !stageEl || !isDesktop) return;
    const measure = () => {
      const stageBottom = stageEl.getBoundingClientRect().bottom;
      let lowest = stageBottom;
      grid.querySelectorAll("li").forEach((item) => {
        const content = item.querySelector<HTMLElement>("[data-panel-content]");
        const top = item.getBoundingClientRect().top;
        // cabeçalho + conteúdo (altura natural, mesmo com o card fechado) + bordas
        lowest = Math.max(lowest, top + item.offsetHeight + (content?.offsetHeight ?? 0) + 2);
      });
      setPanelRoom(Math.ceil(lowest - stageBottom));
    };
    // Os painéis são absolutos e não mudam o tamanho da grade: além do resize, mede de
    // novo quando a fonte termina de carregar (ela muda a quebra de linha).
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [isDesktop]);

  const handleReady = useCallback(() => setStatus("ready"), []);
  const handleError = useCallback(() => setStatus("failed"), []);

  // Chamado a cada frame pela cena: escreve direto no SVG, sem re-render do React.
  const handleProject = useCallback(
    (point: ProjectedPoint | null) => {
      const svg = line.current;
      const path = linePath.current;
      const dot = lineDot.current;
      const box = layout.current?.getBoundingClientRect();
      const stageBox = stage.current?.getBoundingClientRect();
      const button = active === null ? null : buttons.current[active];
      if (!svg || !path || !dot || !box || !stageBox || !button || !point || !isDesktop) {
        svg?.setAttribute("data-visible", "false");
        return;
      }

      const buttonBox = button.getBoundingClientRect();
      const fromLeft = columnOf(active!) === "left";
      const sx = (fromLeft ? buttonBox.right : buttonBox.left) - box.left;
      const sy = buttonBox.top + buttonBox.height / 2 - box.top;
      const ex = stageBox.left + point.x - box.left;
      const ey = stageBox.top + point.y - box.top;
      const bend = (ex - sx) * 0.5;

      path.setAttribute("d", `M ${sx} ${sy} C ${sx + bend} ${sy}, ${ex - bend} ${ey}, ${ex} ${ey}`);
      dot.setAttribute("cx", String(ex));
      dot.setAttribute("cy", String(ey));
      svg.setAttribute("data-visible", "true");
    },
    [active, isDesktop],
  );

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = areas.length - 1;
    const next: Record<string, number> = {
      ArrowDown: index === last ? 0 : index + 1,
      ArrowRight: index === last ? 0 : index + 1,
      ArrowUp: index === 0 ? last : index - 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    if (next[event.key] === undefined) return;
    event.preventDefault();
    buttons.current[next[event.key]]?.focus();
  }

  function renderItem(index: number) {
    const area = areas[index];
    const isActive = index === active;
    const expanded = pinned === index;
    const isLeft = columnOf(index) === "left";

    return (
      // Desktop: o <li> guarda só a altura do cabeçalho e o card é absoluto dentro dele.
      // Aberto, o card cresce para baixo por cima do vizinho (painel flutuante): a seção
      // não muda de altura. No mobile o card abre dentro da lista, normalmente.
      <li key={area.title} className="relative lg:h-16">
        <div
          className={`overflow-hidden rounded-2xl border transition-[border-color,background-color,box-shadow] duration-500 lg:absolute lg:inset-x-0 lg:top-0 ${EASE_APPLE} ${
            expanded
              ? "z-30 border-cyan bg-navy shadow-[0_0_28px_-8px_var(--color-cyan)] lg:shadow-[0_24px_48px_-12px_var(--color-navy),0_0_28px_-8px_var(--color-cyan)]"
              : isActive
                ? "z-10 border-cyan bg-cyan/10 shadow-[0_0_28px_-8px_var(--color-cyan)]"
                : "z-10 border-white/10 bg-white/5 hover:border-cyan/50 hover:bg-white/10"
          }`}
        >
          <h3>
            <button
              ref={(el) => {
                buttons.current[index] = el;
              }}
              id={headerId(index)}
              type="button"
              aria-expanded={expanded}
              aria-controls={panelId(index)}
              onClick={() => setPinned((p) => (p === index ? null : index))}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setFocused(index)}
              onBlur={() => setFocused(null)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={`touch-manipulation flex min-h-16 w-full items-center gap-3 rounded-2xl px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan sm:px-5 sm:py-4 ${
                isLeft ? "lg:flex-row-reverse lg:text-right" : ""
              }`}
            >
              <span
                className={`flex-1 text-base font-bold transition-colors duration-300 sm:text-xl ${
                  isActive || expanded ? "text-white" : "text-cyan-tint"
                }`}
              >
                {area.title}
              </span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={`h-5 w-5 shrink-0 text-cyan transition-transform duration-500 ${EASE_APPLE} ${
                  expanded ? "rotate-180" : ""
                }`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </h3>

          {/* Expansão com grid-template-rows 0fr → 1fr: anima até a altura real do conteúdo,
              sem medir nada em JS. O texto fica sempre no HTML (SEO); fechado, vira inert
              para o "Saiba mais" não receber foco escondido. */}
          <div
            id={panelId(index)}
            role="region"
            aria-labelledby={headerId(index)}
            inert={!expanded}
            className={`grid transition-[grid-template-rows] duration-500 motion-reduce:transition-none ${EASE_APPLE} ${
              expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="min-h-0 overflow-hidden">
              <div
                data-panel-content
                className={`px-4 pb-5 transition-[opacity,transform] duration-500 motion-reduce:transition-none sm:px-5 lg:max-h-[calc(100svh-14rem)] lg:overflow-y-auto ${EASE_APPLE} ${
                  expanded ? "translate-y-0 opacity-100 delay-75" : "-translate-y-1.5 opacity-0"
                }`}
              >
                <div className="mb-4 h-px bg-white/10" />
                <p className="text-sm font-semibold text-cyan">{area.highlight}</p>
                <p className="mt-2 text-sm leading-relaxed text-cyan-tint">{area.description}</p>
                <CtaButton
                  size="md"
                  message={`Olá! Gostaria de saber mais sobre ${area.title} na Clínica Neuropleno.`}
                  className="mt-4 !min-h-10 !px-5 !py-2 text-sm"
                >
                  Saiba mais
                </CtaButton>
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }

  const showCanvas = status === "loading" || status === "ready";

  return (
    <section
      ref={section}
      id="especialidades"
      className="relative scroll-mt-20 overflow-x-clip bg-navy-light py-16 text-white lg:pt-5 lg:pb-6"
    >
      {/* Fundo: luz atrás do cérebro e feixes subindo de baixo, como um holograma. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 50%, color-mix(in srgb, var(--color-navy-light) 75%, var(--color-teal)) 0%, var(--color-navy-light) 75%)",
        }}
      />
      <div aria-hidden="true" className="brain-beams pointer-events-none absolute inset-0">
        {[14, 27, 38, 46, 54, 62, 73, 86].map((left, i) => (
          <span
            key={left}
            style={{
              left: `${left}%`,
              width: `${i % 3 === 0 ? 3 : i % 2 === 0 ? 1 : 2}px`,
              animationDelay: `${-i * 1.7}s`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Mesmo cabeçalho do SectionHeading, com as cores invertidas para o fundo escuro. */}
        <div className="mx-auto mb-10 max-w-2xl text-center lg:mb-0">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-cyan">
            Especialidades
          </p>
          <h2 className="text-balance text-3xl font-bold text-white sm:text-4xl">
            Cuidado neurológico completo, do diagnóstico ao tratamento
          </h2>
        </div>

        <div
          ref={layout}
          style={{ paddingBottom: isDesktop ? panelRoom : undefined }}
          className="relative grid grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-x-6"
        >
          {/* Linha de conexão: só no desktop, onde lista e cérebro ficam lado a lado. */}
          <svg
            ref={line}
            aria-hidden="true"
            data-visible="false"
            className="pointer-events-none absolute inset-0 z-10 hidden h-full w-full overflow-visible opacity-0 transition-opacity duration-500 data-[visible=true]:opacity-100 lg:block"
          >
            <path ref={linePath} fill="none" stroke="var(--color-cyan)" strokeWidth={1.25} />
            <circle ref={lineDot} r={4} fill="var(--color-cyan-tint)" />
          </svg>

          <div
            ref={stage}
            className="relative mx-auto h-[45vh] w-full max-w-[560px] lg:col-start-2 lg:row-start-1 lg:aspect-square lg:h-auto lg:w-[min(100%,calc(100svh-16rem))]"
          >
            <Image
              src={FALLBACK_IMAGE}
              alt=""
              fill
              sizes="(max-width: 1024px) 90vw, 560px"
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
                  activeIndex={active}
                  column={active === null ? null : columnOf(active)}
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

          {/* No mobile os quatro cards ficam empilhados abaixo do cérebro; no desktop o
              wrapper some (contents) e cada lista vai para um lado, alinhada ao topo do
              cérebro. Todo card abre para baixo (como um menu), por cima do vizinho, e usa a
              altura do cérebro mais o espaço medido em panelRoom — nunca sobe para perto do
              título. Como o card aberto flutua, a altura das colunas nunca muda. */}
          <div className="flex flex-col gap-3 lg:contents">
            <ul className="flex flex-col gap-3 lg:col-start-1 lg:row-start-1 lg:gap-5 lg:self-start lg:pt-6">
              {areas.map((_, index) => (columnOf(index) === "left" ? renderItem(index) : null))}
            </ul>
            <ul className="flex flex-col gap-3 lg:col-start-3 lg:row-start-1 lg:gap-5 lg:self-start lg:pt-6">
              {areas.map((_, index) => (columnOf(index) === "right" ? renderItem(index) : null))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
