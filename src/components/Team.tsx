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

/** Intervalo do avanço automático. */
const AUTOPLAY_MS = 2200;
/** Depois de um toque, arraste ou clique, o autoplay espera esse tempo para voltar. */
const RESUME_AFTER_MS = 3000;

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

/** Distância entre o começo de um card e o do seguinte, lida do DOM para
 *  acompanhar o breakpoint (a largura do card muda com a tela). */
function stepOf(track: HTMLElement) {
  const [first, second] = Array.from(track.children) as HTMLElement[];
  if (!first) return track.clientWidth;
  return second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
}

/** Um card para o lado pedido; nas pontas, dá a volta até a outra ponta. */
function advance(track: HTMLElement, direction: 1 | -1, behavior: ScrollBehavior) {
  const max = track.scrollWidth - track.clientWidth;
  if (direction === 1 && track.scrollLeft >= max - 2) {
    track.scrollTo({ left: 0, behavior });
  } else if (direction === -1 && track.scrollLeft <= 2) {
    track.scrollTo({ left: max, behavior });
  } else {
    track.scrollBy({ left: direction * stepOf(track), behavior });
  }
}

/** O carrossel dá a volta nas pontas, então a seta nunca chega a um fim para desabilitar. */
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
            // Sem lazy: dentro da fita horizontal o navegador só pedia a foto quando o
            // card já estava entrando, e ela "pipocava" atrasada no meio da passagem.
            loading="eager"
            draggable={false}
            sizes="(max-width: 640px) 78vw, 352px"
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

/**
 * Carrossel da equipe sobre a rolagem nativa do navegador (scroll-snap). O arraste,
 * o embalo e o encaixe no card são do próprio sistema — no celular isso roda fora
 * da thread do JavaScript, então não engasga nem em Android modesto ou dentro do
 * navegador do WhatsApp. O JS só cuida do autoplay, das setas e dos pontos.
 */
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
  /** Card encostado na borda esquerda — alimenta os pontos do celular. */
  const [active, setActive] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [inView, setInView] = useState(false);
  /** Pausa enquanto alguém navega pelos cards no teclado. O mouse parado em cima não
   *  pausa: a fita parecia travada para quem só estava olhando. */
  const [focusWithin, setFocusWithin] = useState(false);

  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const lastInteraction = useRef(0);
  const scrollFrame = useRef(0);

  const visible = useMemo(
    () => teamMembers.filter((member) => member.groups.includes(specialty)),
    [specialty],
  );

  // A trilha é recriada a cada aba (key), então a medição acompanha a aba.
  useEffect(() => {
    const node = track.current;
    if (!node) return;
    const update = () => setHasOverflow(node.scrollWidth - node.clientWidth > 2);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [specialty]);

  // O relógio do autoplay só corre com a seção na tela: sem isso o ciclo começa
  // no carregamento e o visitante chega no meio de uma transição.
  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.3,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasOverflow || reducedMotion || !inView || focusWithin) return;
    const id = setInterval(() => {
      const node = track.current;
      // Quem acabou de mexer no carrossel está lendo: o autoplay espera um pouco.
      if (!node || Date.now() - lastInteraction.current < RESUME_AFTER_MS) return;
      advance(node, 1, "smooth");
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [hasOverflow, reducedMotion, inView, focusWithin, specialty]);

  useEffect(() => () => cancelAnimationFrame(scrollFrame.current), []);

  function markInteraction() {
    lastInteraction.current = Date.now();
  }

  // Um cálculo por frame no máximo, e o estado só muda quando o card da borda muda.
  function handleScroll() {
    if (scrollFrame.current) return;
    scrollFrame.current = requestAnimationFrame(() => {
      scrollFrame.current = 0;
      const node = track.current;
      if (!node) return;
      const atEnd = node.scrollLeft >= node.scrollWidth - node.clientWidth - 2;
      setActive(atEnd ? visible.length - 1 : Math.round(node.scrollLeft / stepOf(node)));
    });
  }

  function step(direction: 1 | -1) {
    const node = track.current;
    if (!node) return;
    markInteraction();
    advance(node, direction, reducedMotion ? "auto" : "smooth");
  }

  function selectSpecialty(next: TeamSpecialty) {
    if (next === specialty) return;
    setSpecialty(next);
    setActive(0);
  }

  function handleTabKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    const jump = event.key === "Home" ? 0 : event.key === "End" ? specialties.length - 1 : null;
    if (!delta && jump === null) return;

    event.preventDefault();
    const current = specialties.indexOf(specialty);
    const target = jump ?? (current + delta + specialties.length) % specialties.length;

    selectSpecialty(specialties[target]);
    // O foco acompanha a seleção: é o comportamento esperado de uma tablist
    // com ativação automática.
    const tabs = event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs[target]?.focus();
  }

  return (
    <section
      ref={section}
      id="equipe"
      className="scroll-mt-20 bg-white pt-16 pb-10 sm:pt-[88px] sm:pb-14"
    >
      <div className="mx-auto max-w-6xl px-6">
        <header className="max-w-3xl">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-teal-text">
            Conheça nossa equipe
          </h2>
        </header>

        {/* Abas à esquerda e setas à direita, na mesma linha. No celular as abas
            rolam na horizontal de borda a borda e as setas somem — lá o gesto é o
            arraste, e os pontos abaixo dos cards mostram onde se está. */}
        <div className="mt-8 flex items-center gap-4">
          <div
            role="tablist"
            aria-label="Especialidades da equipe"
            onKeyDown={handleTabKeyDown}
            className="-mx-6 flex min-w-0 flex-1 gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
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
            <div className="hidden shrink-0 items-center gap-2 sm:flex">
              <Arrow direction="prev" onClick={() => step(-1)} />
              <Arrow direction="next" onClick={() => step(1)} />
            </div>
          ) : null}
        </div>

        {/* A trilha vaza até a borda da tela (-mx-6) e devolve o recuo como padding:
            no celular o próximo card aparece cortado na lateral, o sinal de que dá
            para arrastar. */}
        <div
          id="equipe-carrossel"
          role="tabpanel"
          aria-labelledby={`tab-${specialty}`}
          className="-mx-6 mt-6 sm:mx-0"
          onFocusCapture={() => setFocusWithin(true)}
          onBlurCapture={() => setFocusWithin(false)}
        >
          <ul
            // Trocar a aba recria a lista: ela volta ao primeiro card e entra animada.
            key={specialty}
            ref={track}
            onScroll={handleScroll}
            onPointerDown={markInteraction}
            onWheel={markInteraction}
            onTouchStart={markInteraction}
            className="team-enter flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto overscroll-x-contain scroll-px-6 px-6 py-2 [scrollbar-width:none] sm:scroll-px-0 sm:gap-6 sm:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {visible.map((member) => (
              <li
                key={member.name}
                // 29rem cobre o card mais alto (nome em duas linhas) com folga: a
                // linha não encolhe ao trocar de aba, o que deslocaria a página.
                className="min-h-[29rem] w-[78%] max-w-[340px] shrink-0 snap-start sm:w-[340px] lg:w-[calc((100%-3rem)/3)] lg:max-w-none"
              >
                <MemberCard member={member} />
              </li>
            ))}
          </ul>
        </div>

        {hasOverflow ? (
          <div aria-hidden="true" className="mt-4 flex justify-center gap-1.5 sm:hidden">
            {visible.map((member, position) => (
              <span
                key={member.name}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  position === active ? "w-5 bg-navy" : "w-1.5 bg-navy/20"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
