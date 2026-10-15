"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  teamMembers,
  teamSpecialties,
  whatsappLink,
  type TeamMember,
  type TeamSpecialty,
} from "@/data/content";

/** Largura de um card e o vão entre eles. Vivem em CSS para o translate do
 *  carrossel ser puro `calc()` — sem medir nada em JavaScript. */
const CARD_WIDTH = "min(380px, 100vw - 72px)";
const GAP = 24;

/** Duração da saída e da entrada na troca de aba, em ms. */
const LEAVE_MS = 260;
const ENTER_MS = 400;
/** Deslocamento lateral da troca de aba. */
const SHIFT = "3rem";

const SLIDE_EASING = "cubic-bezier(0.2, 0.7, 0.2, 1)";

/** Intervalo do avanço automático. */
const AUTOPLAY_MS = 3200;

/**
 * `useSyncExternalStore` em vez de `useState` + listener: é a API feita para
 * assinar uma fonte externa como o matchMedia, e evita setState síncrono dentro
 * de efeito. No servidor devolve `false` (assume movimento permitido).
 */
function usePrefersReducedMotion() {
  const subscribe = useCallback((onChange: () => void) => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

function initialsOf(name: string) {
  return name
    .replace(/^(Dr|Dra)\.?\s+/i, "")
    .split(/\s+/)
    .filter((part) => part.length > 2)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** O carrossel é um laço infinito, então a seta nunca chega a um fim para desabilitar. */
function Arrow({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  const isPrev = direction === "prev";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? "Anterior" : "Próximo"}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#dfe7ee] bg-white text-navy shadow-sm transition-colors hover:bg-cyan-tint hover:text-teal-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-text focus-visible:ring-offset-2"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-5 w-5"
      >
        <path d={isPrev ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
      </svg>
    </button>
  );
}

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#dfe7ee] bg-white shadow-sm">
      <div className="relative h-[250px] w-full shrink-0 overflow-hidden bg-[linear-gradient(160deg,#0a4a73_0%,#042b44_100%)]">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.name}
            fill
            loading="lazy"
            draggable={false}
            sizes="(max-width: 420px) calc(100vw - 72px), 380px"
            className="object-cover object-top"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span
              aria-hidden="true"
              className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-2xl font-bold text-white ring-1 ring-white/25"
            >
              {initialsOf(member.name)}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-balance text-lg font-bold leading-snug text-navy">{member.name}</h3>
        <p className="mt-1.5 text-sm font-semibold text-teal-text">{member.role}</p>
        <p className="mt-1 text-[13px] text-[#5d7385]">{member.reg}</p>

        <Link
          href={member.link ?? whatsappLink(`Olá! Gostaria de agendar uma consulta com ${member.name}.`)}
          target="_blank"
          rel="noopener noreferrer"
          draggable={false}
          className="mt-auto inline-flex min-h-11 items-center justify-center self-start rounded-full border border-navy px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-text focus-visible:ring-offset-2"
        >
          Agendar consulta
        </Link>
      </div>
    </article>
  );
}

export function Team() {
  const reducedMotion = usePrefersReducedMotion();

  // Abas sem ninguém não aparecem — assim dá para preparar uma especialidade no
  // array de dados antes de haver profissional para ela.
  const specialties = useMemo(
    () =>
      teamSpecialties.filter((specialty) =>
        teamMembers.some((member) => member.groups.includes(specialty)),
      ),
    [],
  );

  const [specialty, setSpecialty] = useState<TeamSpecialty>(specialties[0]);
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(1);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  /** Desliga a transição no salto silencioso que fecha a volta do laço. */
  const [animate, setAnimate] = useState(true);
  const [inView, setInView] = useState(false);
  /** Pausa enquanto alguém lê um card pelo teclado. */
  const [focusWithin, setFocusWithin] = useState(false);

  /**
   * Ciclo da troca de aba. "leaving" apaga e desliza os cards atuais para a
   * esquerda; o conteúdo é trocado no fim dela. "entering" é o frame em que os
   * novos cards já existem, deslocados para a direita e invisíveis, ainda sem
   * transição — é o estado inicial que o navegador precisa pintar antes de a
   * animação de entrada poder partir dele.
   */
  const [phase, setPhase] = useState<"idle" | "leaving" | "entering">("idle");
  const pending = useRef<TeamSpecialty | null>(null);

  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const firstCard = useRef<HTMLLIElement>(null);
  const dragStart = useRef<number | null>(null);
  const dragged = useRef(false);

  const visible = useMemo(
    () => teamMembers.filter((member) => member.groups.includes(specialty)),
    [specialty],
  );

  const hasOverflow = visible.length > perView;

  /**
   * Laço infinito por duplicação: a trilha repete a lista inteira, então ao
   * passar do último card o visitante já está vendo a cópia do primeiro. Quando
   * a transição termina além do fim, o índice volta `visible.length` posições
   * com a animação desligada — o salto cai exatamente sobre um card idêntico e
   * por isso é invisível. Com tudo cabendo na tela não há o que rodar, e a
   * lista fica simples.
   */
  const slides = hasOverflow ? [...visible, ...visible] : visible;

  // Quantos cards cabem de uma vez. Precisa de medição porque a largura do card
  // é um min() de CSS; o resto do carrossel continua sendo calc() puro.
  useEffect(() => {
    const node = viewport.current;
    if (!node) return;

    // Mede o card pelo próprio elemento: `getPropertyValue("--card-width")`
    // devolveria a expressão `min(...)` crua, não o valor resolvido em pixels.
    const update = () => {
      const card = firstCard.current?.getBoundingClientRect().width;
      if (!card) return;
      setPerView(Math.max(1, Math.floor((node.clientWidth + GAP) / (card + GAP))));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    if (firstCard.current) observer.observe(firstCard.current);
    return () => observer.disconnect();
  }, []);

  // O relógio do autoplay só corre com a seção na tela: sem isso o ciclo começa
  // no carregamento e o visitante chega no meio de uma transição.
  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.2,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Sem laço não há para onde andar; durante a troca de aba o avanço
    // atropelaria a animação de entrada.
    if (!hasOverflow || reducedMotion || !inView || dragging || focusWithin || phase !== "idle") {
      return;
    }
    const id = setInterval(() => {
      setAnimate(true);
      setIndex((current) => current + 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [hasOverflow, reducedMotion, inView, dragging, focusWithin, phase]);

  // Reativa a animação no frame seguinte ao salto silencioso do laço.
  useEffect(() => {
    if (animate) return;
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    return () => cancelAnimationFrame(frame);
  }, [animate]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const id = setTimeout(() => {
      const next = pending.current;
      pending.current = null;
      if (next) {
        setSpecialty(next);
        setIndex(0);
        setAnimate(true);
      }
      setPhase("entering");
    }, LEAVE_MS);
    return () => clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "entering") return;
    // Dois frames: o primeiro pinta os cards deslocados e invisíveis, o segundo
    // dispara a transição a partir desse estado.
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setPhase("idle")));
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  function handleTrackTransitionEnd(event: React.TransitionEvent<HTMLUListElement>) {
    // transitionend borbulha: só o transform da própria trilha fecha o ciclo.
    if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
    if (!hasOverflow) return;

    if (index >= visible.length) {
      setAnimate(false);
      setIndex(index - visible.length);
    } else if (index < 0) {
      setAnimate(false);
      setIndex(index + visible.length);
    }
  }

  function step(direction: 1 | -1) {
    setAnimate(true);
    setIndex((current) => current + direction);
  }

  function selectSpecialty(next: TeamSpecialty) {
    // Clique na aba já ativa não faz nada; clique durante a transição é
    // ignorado, senão o ciclo de fases se sobrepõe e trava num estado invisível.
    if (next === specialty || phase !== "idle") return;

    if (reducedMotion) {
      setSpecialty(next);
      setIndex(0);
      setAnimate(true);
      return;
    }

    pending.current = next;
    setPhase("leaving");
  }

  function handleTabKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    const jump = event.key === "Home" ? 0 : event.key === "End" ? specialties.length - 1 : null;
    if (!step && jump === null) return;

    event.preventDefault();
    const current = specialties.indexOf(specialty);
    const target =
      jump ?? (current + step + specialties.length) % specialties.length;

    selectSpecialty(specialties[target]);
    // O foco acompanha a seleção: é o comportamento esperado de uma tablist
    // com ativação automática.
    const tabs = event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs[target]?.focus();
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!hasOverflow) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragStart.current = event.clientX;
    dragged.current = false;
    setDragging(true);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (dragStart.current === null) return;
    const delta = event.clientX - dragStart.current;
    if (Math.abs(delta) > 8) dragged.current = true;
    setAnimate(false);
    setDrag(delta);
  }

  function handlePointerUp() {
    if (dragStart.current === null) return;
    const threshold = Math.max(40, (viewport.current?.clientWidth ?? 1) * 0.12);

    setAnimate(true);
    if (drag <= -threshold) setIndex(index + 1);
    else if (drag >= threshold) setIndex(index - 1);

    dragStart.current = null;
    setDrag(0);
    setDragging(false);
  }

  const stageStyle: Record<"idle" | "leaving" | "entering", React.CSSProperties> = {
    idle: {
      opacity: 1,
      transform: "translateX(0)",
      transition: reducedMotion
        ? undefined
        : `opacity ${ENTER_MS}ms ease-out, transform ${ENTER_MS}ms ${SLIDE_EASING}`,
    },
    leaving: {
      opacity: 0,
      transform: `translateX(-${SHIFT})`,
      transition: `opacity ${LEAVE_MS}ms ease-in, transform ${LEAVE_MS}ms ease-in`,
    },
    entering: { opacity: 0, transform: `translateX(${SHIFT})` },
  };

  const tablistId = "equipe-especialidades";

  return (
    <section
      ref={section}
      id="equipe"
      className="scroll-mt-20 bg-white pt-16 pb-16 sm:pt-[88px] sm:pb-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <header className="max-w-3xl">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-teal-text">
            Conheça nossa equipe
          </h2>
        </header>

        {/* Abas à esquerda e setas à direita, na mesma linha. No celular as abas
            rolam na horizontal e as setas somem — lá o gesto é o arraste. */}
        <div className="mt-8 flex items-center gap-4">
          <div
            id={tablistId}
            role="tablist"
            aria-label="Especialidades da equipe"
            onKeyDown={handleTabKeyDown}
            className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {specialties.map((item) => {
              const isActive = item === specialty;

              return (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  id={`tab-${item}`}
                  aria-selected={isActive}
                  aria-controls="equipe-carrossel"
                  // Roving tabindex: o Tab entra na tablist pela aba ativa, e as
                  // setas do teclado percorrem as demais.
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => selectSpecialty(item)}
                  className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold sm:px-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-text focus-visible:ring-offset-2 ${
                    isActive
                      ? "border-navy bg-navy text-white"
                      : "border-[#dfe7ee] bg-white text-navy hover:border-navy/40 hover:bg-cyan-tint"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          {hasOverflow ? (
            <div className="flex shrink-0 items-center gap-2">
              <Arrow direction="prev" onClick={() => step(-1)} />
              <Arrow direction="next" onClick={() => step(1)} />
            </div>
          ) : null}
        </div>

        {/* A altura do carrossel vem do `min-h` dos cards (abaixo), não daqui:
            assim a linha nunca encolhe ao trocar de aba — que é o que
            deslocaria a página — e ainda cresce se um nome mais longo pedir,
            em vez de cortar o texto. */}
        <div
          ref={viewport}
          id="equipe-carrossel"
          role="tabpanel"
          aria-labelledby={`tab-${specialty}`}
          tabIndex={0}
          style={{ ["--card-width" as string]: CARD_WIDTH }}
          // A máscara é o "fade nas bordas": os cards somem gradualmente nas
          // laterais em vez de serem cortados em linha reta, o que deixa claro
          // que a fita continua para os dois lados. O prefixo -webkit é para o
          // Safari, que ainda não aceita `mask-image` sem ele.
          className={`mt-8 touch-pan-y overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-text focus-visible:ring-offset-4 ${
            // Só mascara quando há fita para os lados. Com tudo cabendo na tela o
            // degradê não teria nada para desvanecer e comeria a primeira letra
            // do nome do card encostado na borda esquerda.
            hasOverflow
              ? "[-webkit-mask-image:linear-gradient(to_right,transparent_0,black_24px,black_calc(100%-24px),transparent_100%)] [mask-image:linear-gradient(to_right,transparent_0,black_24px,black_calc(100%-24px),transparent_100%)] sm:[-webkit-mask-image:linear-gradient(to_right,transparent_0,black_56px,black_calc(100%-56px),transparent_100%)] sm:[mask-image:linear-gradient(to_right,transparent_0,black_56px,black_calc(100%-56px),transparent_100%)]"
              : ""
          }`}
          onFocusCapture={() => setFocusWithin(true)}
          onBlurCapture={() => setFocusWithin(false)}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
          // Impede que o fim de um arraste vire clique no botão de agendamento.
          onClickCapture={(event) => {
            if (dragged.current) {
              event.preventDefault();
              event.stopPropagation();
            }
          }}
        >
          <div style={stageStyle[phase]}>
            <ul
              className={`flex items-stretch ${hasOverflow ? "cursor-grab active:cursor-grabbing" : ""}`}
              style={{
                gap: `${GAP}px`,
                transform: `translateX(calc(${-index} * (var(--card-width) + ${GAP}px) + ${drag}px))`,
                transition:
                  !animate || dragging || reducedMotion
                    ? undefined
                    : `transform 450ms ${SLIDE_EASING}`,
              }}
              onTransitionEnd={handleTrackTransitionEnd}
            >
              {slides.map((member, position) => (
                <li
                  key={`${position}-${member.name}`}
                  ref={position === 0 ? firstCard : undefined}
                  // Card fora da janela sai da ordem de tabulação: sem isso o
                  // Tab levaria o foco para um card invisível e a viewport
                  // rolaria sozinha.
                  inert={position < index || position >= index + perView}
                  // 29rem cobre o card mais alto (o nome de duas linhas, medido
                  // em 435px) com uma folga pequena; `items-stretch` iguala
                  // todos os cards da linha a essa altura.
                  className="min-h-[29rem] shrink-0"
                  style={{ width: "var(--card-width)" }}
                >
                  <MemberCard member={member} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
