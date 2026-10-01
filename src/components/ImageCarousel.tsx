"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { FacilityImage } from "@/data/content";

type ImageCarouselProps = {
  images: FacilityImage[];
  /** Intervalo entre as fotos, em ms. */
  intervalMs?: number;
  sizes?: string;
  className?: string;
};

const ChevronIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export function ImageCarousel({
  images,
  intervalMs = 3000,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  className = "",
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  // O autoplay para no hover e no foco: quem está olhando uma foto específica
  // (ou navegando pelos pontos no teclado) não deve perdê-la no meio do caminho.
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((current) => (current + 1) % images.length), intervalMs);
    return () => clearInterval(id);
  }, [paused, images.length, intervalMs]);

  // Wrap nas duas pontas para o carrossel nunca chegar a um fim morto.
  const step = (delta: number) =>
    setIndex((current) => (current + delta + images.length) % images.length);

  // As setas ocupam a altura inteira da foto e escurecem só a ponta: o degradê
  // vai do preto na borda ao transparente no miolo, sem tapar o centro da imagem.
  const arrowBase =
    "absolute inset-y-0 z-10 flex w-1/5 min-w-14 items-center text-white transition-opacity duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white";

  return (
    <div
      className={`group relative overflow-hidden ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Crossfade: todas as fotos ficam empilhadas e só a ativa tem opacidade 1,
          o que evita o "pulo" de altura que um slide por vez causaria. */}
      {images.map((image, position) => (
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={position === 0}
          className={`object-cover transition-opacity duration-700 ease-in-out ${
            position === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Foto anterior"
            onClick={() => step(-1)}
            className={`${arrowBase} left-0 justify-start bg-gradient-to-r from-black/60 via-black/25 to-transparent pl-3 opacity-70 hover:opacity-100 sm:pl-4`}
          >
            <ChevronIcon className="h-7 w-7 drop-shadow-md sm:h-8 sm:w-8" />
          </button>

          <button
            type="button"
            aria-label="Próxima foto"
            onClick={() => step(1)}
            className={`${arrowBase} right-0 justify-end bg-gradient-to-l from-black/60 via-black/25 to-transparent pr-3 opacity-70 hover:opacity-100 sm:pr-4`}
          >
            <ChevronIcon className="h-7 w-7 rotate-180 drop-shadow-md sm:h-8 sm:w-8" />
          </button>
        </>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center gap-2 bg-gradient-to-t from-black/50 to-transparent p-4">
        {images.map((image, position) => (
          <button
            key={image.src}
            type="button"
            aria-label={image.alt}
            aria-current={position === index}
            onClick={() => setIndex(position)}
            className={`pointer-events-auto h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 ${
              position === index ? "w-6 bg-white" : "w-2.5 bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
