"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { doctors } from "@/data/content";
import { CtaButton } from "./CtaButton";
import { SectionHeading } from "./SectionHeading";

const AUTOPLAY_MS = 3000;
const LAST = doctors.length - 1;
// Clones nas pontas ([último, ...médicos, primeiro]) para o carrossel dar a volta nos dois sentidos.
const slides = [doctors[LAST], ...doctors, doctors[0]];

export function Team() {
  const [index, setIndex] = useState(1);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const [drag, setDrag] = useState(0);

  const viewport = useRef<HTMLDivElement>(null);
  const dragStart = useRef<number | null>(null);
  const dragged = useRef(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setAnimate(true);
      setIndex((current) => current + 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused]);

  // Reativa a animação no frame seguinte ao salto silencioso entre clone e slide real.
  useEffect(() => {
    if (animate) return;
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    return () => cancelAnimationFrame(frame);
  }, [animate]);

  function handleTransitionEnd() {
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
    setPaused(true);
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
    setPaused(false);
  }

  const active = (index - 1 + doctors.length) % doctors.length;

  return (
    <section id="equipe" className="scroll-mt-20 bg-white py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Nossa equipe"
          title="Médicos especialistas em neurologia e neurocirurgia"
        />

        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
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
                    <h3 className="text-2xl font-bold">{doctor.name}</h3>
                    <p className="mt-1 text-sm font-medium text-cyan">{doctor.credentials}</p>
                    <p className="mt-4 text-sm leading-relaxed text-white/90">{doctor.specialty}</p>
                    <div className="mt-6">
                      <CtaButton
                        variant="secondary"
                        message={`Olá! Gostaria de agendar uma consulta com ${doctor.name}.`}
                      >
                        Quero agendar agora
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

          <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="Escolher médico">
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
        </div>
      </div>
    </section>
  );
}
