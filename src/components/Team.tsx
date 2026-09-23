"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { doctors } from "@/data/content";
import { CtaButton } from "./CtaButton";
import { SectionHeading } from "./SectionHeading";

const AUTOPLAY_MS = 9000;
const LAST = doctors.length - 1;
// Clones nas pontas ([último, ...médicos, primeiro]) para o carrossel dar a volta nos dois sentidos.
const slides = [doctors[LAST], ...doctors, doctors[0]];

function Arrow({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  const isPrev = direction === "prev";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? "Médico anterior" : "Próximo médico"}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-navy shadow-sm transition-colors hover:bg-cyan-tint hover:text-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
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

export function Team() {
  const [index, setIndex] = useState(1);
  const [animate, setAnimate] = useState(true);
  // Pausas independentes: o fim de um arraste não pode apagar a pausa do teclado.
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [inView, setInView] = useState(false);
  const [drag, setDrag] = useState(0);

  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const dragStart = useRef<number | null>(null);
  const dragged = useRef(false);

  // O relógio do autoplay só corre com o carrossel na tela. Sem isso o ciclo começa
  // no carregamento da página e o visitante chega no meio de uma transição.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.3,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || focused || dragging) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setAnimate(true);
      setIndex((current) => current + 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [inView, focused, dragging]);

  // Reativa a animação no frame seguinte ao salto silencioso entre clone e slide real.
  useEffect(() => {
    if (animate) return;
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    return () => cancelAnimationFrame(frame);
  }, [animate]);

  function handleTransitionEnd(event: React.TransitionEvent<HTMLUListElement>) {
    // transitionend borbulha: só o transform da própria trilha fecha o ciclo do clone.
    if (event.target !== event.currentTarget || event.propertyName !== "transform") return;

    if (index > LAST + 1) {
      setAnimate(false);
      setIndex(1);
    } else if (index < 1) {
      setAnimate(false);
      setIndex(LAST + 1);
    }
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
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
    const width = viewport.current?.clientWidth ?? 1;
    const threshold = Math.max(40, width * 0.15);

    setAnimate(true);
    if (drag <= -threshold) setIndex((current) => current + 1);
    else if (drag >= threshold) setIndex((current) => current - 1);

    dragStart.current = null;
    setDrag(0);
    setDragging(false);
  }

  // Um passo por clique; os clones das pontas cuidam da volta, como no autoplay.
  function move(step: 1 | -1) {
    setAnimate(true);
    setIndex((current) => current + step);
  }

  const active = (index - 1 + doctors.length) % doctors.length;

  return (
    <section ref={section} id="equipe" className="scroll-mt-20 bg-white py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Conheça nossa equipe"
          title="Médicos especialistas em neurologia e neurocirurgia"
        />

        {/* Sem pausa no hover: o carrossel ocupa a largura da seção e o cursor para
            em cima dele ao rolar a página, o que congelava o autoplay. A pausa no
            foco continua, para quem navega pelo teclado conseguir ler o card. */}
        <div onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
          <div
            ref={viewport}
            className="cursor-grab touch-pan-y overflow-hidden rounded-3xl active:cursor-grabbing"
            aria-label="Médicos da Clínica Neuropleno"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={handlePointerUp}
            // Impede que o arraste vire clique no botão de agendamento.
            onClickCapture={(event) => {
              if (dragged.current) {
                event.preventDefault();
                event.stopPropagation();
              }
            }}
          >
            <ul
              className={`flex ${animate ? "transition-transform duration-700 ease-in-out" : ""}`}
              style={{ transform: `translateX(calc(-${index * 100}% + ${drag}px))` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {slides.map((doctor, position) => (
                <li
                  key={position}
                  inert={position !== index}
                  className="grid w-full shrink-0 grid-cols-1 bg-navy text-white sm:grid-cols-[1fr_1fr]"
                >
                  <div className="flex flex-col justify-center p-8 sm:p-10">
                    <h3 className="text-balance text-2xl font-bold">{doctor.name}</h3>
                    <p className="mt-2 text-sm font-semibold text-cyan">{doctor.role}</p>
                    <ul className="mt-5 space-y-2.5 text-sm leading-relaxed text-white/90">
                      {doctor.highlights.map((highlight) => (
                        <li key={highlight} className="flex gap-2.5">
                          <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"
                            aria-hidden="true"
                          />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <CtaButton
                        variant="secondary"
                        message={`Olá! Gostaria de agendar uma consulta com ${doctor.name}.`}
                      >
                        {doctor.ctaLabel}
                      </CtaButton>
                    </div>
                  </div>
                  <div className="relative aspect-[4/5] w-full select-none sm:aspect-auto sm:min-h-[34rem]">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      fill
                      draggable={false}
                      sizes="(max-width: 640px) 100vw, 512px"
                      className="object-cover object-top"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Setas ao lado dos indicadores, e não sobrepostas ao card: o slide é um
              split de texto + foto, e uma seta flutuante cairia em cima da leitura. */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <Arrow direction="prev" onClick={() => move(-1)} />

            <div className="flex gap-2" role="tablist" aria-label="Escolher médico">
              {doctors.map((doctor, position) => (
                <button
                  key={doctor.name}
                  type="button"
                  role="tab"
                  aria-selected={position === active}
                  aria-label={doctor.name}
                  onClick={() => {
                    setAnimate(true);
                    setIndex(position + 1);
                  }}
                  className={`h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 ${
                    position === active ? "w-6 bg-navy" : "w-2.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>

            <Arrow direction="next" onClick={() => move(1)} />
          </div>
        </div>
      </div>
    </section>
  );
}
