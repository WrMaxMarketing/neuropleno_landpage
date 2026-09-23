"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { procedures, whatsappLink } from "@/data/content";
import { SectionHeading } from "./SectionHeading";

// Velocidade da esteira, em pixels por segundo. O movimento agora é do scroll da
// própria trilha (e não de uma animação CSS), para conviver com as setas, o swipe
// e a roda do mouse sem brigar por controle do mesmo eixo.
const SPEED = 40;

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
  // A lista é duplicada para o loop ficar contínuo: ao passar da metade, o scroll
  // volta uma metade para trás e o visitante não vê emenda.
  const loop = [...procedures, ...procedures];

  const track = useRef<HTMLUListElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let previous: number | null = null;

    const tick = (now: number) => {
      if (previous !== null) el.scrollLeft += (SPEED * (now - previous)) / 1000;
      previous = now;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [paused]);

  // O rebobinar vale para o autoplay e para as setas, por isso mora no onScroll.
  function handleScroll() {
    const el = track.current;
    if (!el) return;
    const half = el.scrollWidth / 2;
    if (el.scrollLeft >= half) el.scrollLeft -= half;
    else if (el.scrollLeft <= 0) el.scrollLeft += half;
  }

  function move(step: 1 | -1) {
    const el = track.current;
    if (!el) return;
    // Um card por clique, medido no próprio DOM para acompanhar o breakpoint.
    const card = el.firstElementChild?.clientWidth ?? 280;
    el.scrollBy({ left: step * card, behavior: "smooth" });
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
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onPointerDown={() => setPaused(true)}
          onPointerUp={() => setPaused(false)}
        >
          <ul
            ref={track}
            onScroll={handleScroll}
            className="flex overflow-x-auto overflow-y-hidden rounded-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
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
                  tabIndex={index >= procedures.length ? -1 : 0}
                  className="group block overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
                >
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={procedure.image}
                      alt={procedure.title}
                      fill
                      sizes="288px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="p-3 text-center text-sm font-semibold text-navy">{procedure.title}</p>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-center gap-4">
            <Arrow direction="prev" onClick={() => move(-1)} />
            <Arrow direction="next" onClick={() => move(1)} />
          </div>
        </div>
      </div>
    </section>
  );
}
