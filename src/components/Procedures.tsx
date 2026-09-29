"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { procedures, whatsappLink } from "@/data/content";
import { SectionHeading } from "./SectionHeading";

// Velocidade da esteira, em pixels por segundo.
const SPEED = 85;
// Velocidade do deslocamento disparado pelas setas: quase um salto, mas animado —
// o rastro curto é o que mostra para que lado a esteira andou.
const ARROW_SPEED = 5200;

// A posição da esteira é nossa (um transform), e não o scrollLeft do navegador: com
// scroll nativo a seta "anterior" travava em zero — o navegador não deixa rolar para
// trás do início — e a rolagem suave brigava a cada frame com o autoplay, que escreve
// na mesma propriedade. Aqui os dois compartilham o mesmo offset e o loop é infinito
// nos dois sentidos.
function shiftTrack(el: HTMLUListElement | null, current: number, delta: number) {
  if (!el) return current;
  // A lista é duplicada: andar meia largura cai exatamente no mesmo card, então
  // rebobinar aí é invisível para quem assiste.
  const half = el.scrollWidth / 2;
  if (half <= 0) return current;
  const next = (((current + delta) % half) + half) % half;
  el.style.transform = `translate3d(${-next}px, 0, 0)`;
  return next;
}

function Arrow({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  const isPrev = direction === "prev";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? "Ver anteriores" : "Ver próximos"}
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

export function Procedures() {
  const loop = [...procedures, ...procedures];

  const track = useRef<HTMLUListElement>(null);
  const offset = useRef(0); // posição atual da esteira, em px
  const pending = useRef(0); // px que ainda faltam percorrer por causa das setas
  const paused = useRef(false);
  const pointer = useRef<number | null>(null);
  const lastX = useRef(0);
  const startX = useRef(0);
  const dragged = useRef(false);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frame = 0;
    let previous: number | null = null;

    const tick = (now: number) => {
      // Um dt gigante (aba em segundo plano, aparelho dormindo) viraria um pulo.
      const dt = previous === null ? 0 : Math.min(now - previous, 100);
      previous = now;

      let delta = 0;
      if (pending.current !== 0) {
        // O passo das setas tem prioridade sobre o autoplay: um clique durante a
        // esteira em movimento precisa avançar exatamente um card, nem mais.
        const max = (ARROW_SPEED * dt) / 1000;
        const step = Math.sign(pending.current) * Math.min(Math.abs(pending.current), max);
        const rest = pending.current - step;
        pending.current = Math.abs(rest) < 0.5 ? 0 : rest;
        delta = step;
      } else if (!paused.current && !reduced) {
        delta = (SPEED * dt) / 1000;
      }

      if (delta !== 0) offset.current = shiftTrack(el, offset.current, delta);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Um card por clique, medido no próprio DOM para acompanhar o breakpoint. Somar
  // (em vez de atribuir) faz cliques repetidos andarem um card cada, sem se cancelar.
  function move(step: 1 | -1) {
    const card = track.current?.firstElementChild?.clientWidth ?? 280;
    pending.current += step * card;
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointer.current = event.pointerId;
    lastX.current = event.clientX;
    startX.current = event.clientX;
    dragged.current = false;
    paused.current = true;
    pending.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (pointer.current !== event.pointerId) return;
    const dx = event.clientX - lastX.current;
    lastX.current = event.clientX;
    if (Math.abs(event.clientX - startX.current) > 8) dragged.current = true;
    // O conteúdo acompanha o dedo: arrastar para a esquerda avança a esteira.
    offset.current = shiftTrack(track.current, offset.current, -dx);
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (pointer.current !== event.pointerId) return;
    pointer.current = null;
    paused.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <section id="procedimentos" className="scroll-mt-20 bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="O que realizamos"
          title="Exames, consultas, procedimentos e tratamentos"
          description="Diagnóstico e tratamento clínico e cirúrgico das principais condições neurológicas, com equipe especializada em cada área."
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* A pausa mora na trilha, e não em um bloco que envolva também as setas: o
            cursor parado sobre uma seta não é alguém lendo um card, é alguém
            clicando — e congelar a esteira aí só atrapalha. */}
        <div
          className="cursor-grab touch-pan-y overflow-hidden rounded-2xl active:cursor-grabbing"
          onMouseEnter={() => {
            paused.current = true;
          }}
          onMouseLeave={() => {
            paused.current = false;
          }}
          onFocus={() => {
            paused.current = true;
          }}
          onBlur={() => {
            paused.current = false;
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          // Impede que o arraste vire clique no card e abra o WhatsApp sem querer.
          onClickCapture={(event) => {
            if (dragged.current) {
              event.preventDefault();
              event.stopPropagation();
            }
          }}
        >
          <ul ref={track} className="flex w-max will-change-transform">
            {loop.map((procedure, index) => (
              <li
                key={`${procedure.title}-${index}`}
                className="w-52 shrink-0 pr-4 sm:w-64 lg:w-72"
                aria-hidden={index >= procedures.length}
              >
                <Link
                  href={whatsappLink(
                    `Olá! Vim pelo site e gostaria de saber mais sobre o tratamento de ${procedure.title}.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  draggable={false}
                  tabIndex={index >= procedures.length ? -1 : 0}
                  className="group block overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
                >
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={procedure.image}
                      alt={procedure.title}
                      fill
                      draggable={false}
                      sizes="288px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="p-3 text-center text-sm font-semibold text-navy">
                    {procedure.title}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <Arrow direction="prev" onClick={() => move(-1)} />
          <Arrow direction="next" onClick={() => move(1)} />
        </div>
      </div>
    </section>
  );
}
