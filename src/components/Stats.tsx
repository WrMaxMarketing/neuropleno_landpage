"use client";

import { useEffect, useRef, useState } from "react";
import { stats } from "@/data/content";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;

          const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
          ).matches;
          if (prefersReducedMotion) {
            setDisplay(value);
            return;
          }

          const duration = 1500;
          const start = performance.now();

          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            setDisplay(Math.floor(progress * value));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {display.toLocaleString("pt-BR")}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    // Três colunas também no celular: empilhados, os números ocupavam quase uma tela
    // inteira entre o vídeo e as especialidades.
    <section className="border-b border-white/10 bg-navy py-10 sm:py-14">
      <div className="mx-auto grid max-w-6xl grid-cols-3 gap-3 px-4 text-center sm:gap-8 sm:px-6">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="text-2xl font-bold tabular-nums text-white sm:text-5xl">
              <Counter value={stat.value} suffix={stat.suffix} />
            </div>
            <p className="mt-2 text-[11px] font-medium uppercase leading-tight tracking-wide text-cyan sm:text-sm">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
