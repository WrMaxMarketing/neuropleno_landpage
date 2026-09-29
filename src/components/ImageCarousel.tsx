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

      <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-gradient-to-t from-black/50 to-transparent p-4">
        {images.map((image, position) => (
          <button
            key={image.src}
            type="button"
            aria-label={image.alt}
            aria-current={position === index}
            onClick={() => setIndex(position)}
            className={`h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 ${
              position === index ? "w-6 bg-white" : "w-2.5 bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
