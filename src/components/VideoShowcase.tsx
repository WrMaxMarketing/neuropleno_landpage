"use client";

import Image from "next/image";
import { useState } from "react";
import { behindTheScenesVideo } from "@/data/content";
import { SectionHeading } from "./SectionHeading";

export function VideoShowcase() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="bg-white py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={behindTheScenesVideo.eyebrow}
          title={behindTheScenesVideo.title}
          description={behindTheScenesVideo.description}
        />

        <div className="relative mx-auto aspect-[9/16] w-full max-w-xs overflow-hidden rounded-2xl bg-navy shadow-xl sm:max-w-sm">
          {playing ? (
            <video
              className="h-full w-full object-cover"
              poster={behindTheScenesVideo.poster}
              controls
              autoPlay
              muted
              playsInline
            >
              <source src={behindTheScenesVideo.video} type="video/mp4" />
            </video>
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group relative block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
              aria-label="Reproduzir vídeo do exame de eletroneuromiografia"
            >
              <Image
                src={behindTheScenesVideo.poster}
                alt="Exame de eletroneuromiografia sendo realizado na Clínica Neuropleno"
                fill
                sizes="384px"
                className="object-cover"
              />
              <span className="absolute inset-0 bg-navy/25 transition group-hover:bg-navy/35" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition group-hover:scale-110">
                  <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 text-navy" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
