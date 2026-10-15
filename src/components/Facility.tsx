"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { facilityDescription, facilityImages, site, type FacilityImage } from "@/data/content";
import { SectionHeading } from "./SectionHeading";

/**
 * Mosaico: a 1ª foto (fachada) ocupa um bloco grande e a 4ª uma faixa larga; as outras
 * são blocos simples. Com 8 fotos o desenho fecha sem buracos tanto em 4 colunas
 * (desktop) quanto em 2 (celular); o grid-flow-dense tapa a sobra se a lista mudar.
 */
function tileLayout(index: number) {
  if (index === 0) return { span: "col-span-2 row-span-2", sizes: "(max-width: 1024px) 100vw, 50vw" };
  if (index === 3) return { span: "col-span-2", sizes: "(max-width: 1024px) 100vw, 50vw" };
  return { span: "", sizes: "(max-width: 1024px) 50vw, 25vw" };
}

function Chevron({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-6 w-6"
    >
      <path d={direction === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

/**
 * Foto ampliada. É um <dialog> modal: o navegador cuida do foco preso, do Esc e de
 * deixar a página de trás inerte. As fotos ficam numa fita com scroll-snap — no
 * celular o arraste entre elas é a rolagem nativa, sem JS no meio do gesto.
 */
function Lightbox({
  images,
  start,
  onClose,
}: {
  images: FacilityImage[];
  start: number;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [current, setCurrent] = useState(start);

  useEffect(() => {
    const node = dialog.current;
    const list = track.current;
    if (!node || !list) return;
    node.showModal();
    // Abre já na foto clicada, sem animar o caminho até ela.
    list.scrollLeft = start * list.clientWidth;
    // A página de trás não rola enquanto a galeria está aberta.
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [start]);

  function go(index: number) {
    const list = track.current;
    if (!list) return;
    const target = (index + images.length) % images.length;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({ left: target * list.clientWidth, behavior: reduced ? "auto" : "smooth" });
  }

  function handleScroll() {
    const list = track.current;
    if (!list) return;
    setCurrent(Math.round(list.scrollLeft / list.clientWidth));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(current + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(current - 1);
    }
  }

  const arrow =
    "absolute top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan sm:flex";

  return (
    <dialog
      ref={dialog}
      aria-label="Fotos da estrutura da Clínica Neuropleno"
      onClose={onClose}
      onKeyDown={handleKeyDown}
      // Tela cheia com fundo próprio: o ::backdrop não herda as variáveis de cor do
      // tema em todos os navegadores, então quem escurece a página é o próprio dialog.
      className="lightbox-enter fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden border-0 bg-navy/95 p-0 text-white backdrop-blur-sm"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <p className="text-sm font-medium text-cyan-tint/85" aria-live="polite">
            <span className="tabular-nums">
              {current + 1} de {images.length}
            </span>
            {images[current]?.label ? ` · ${images[current].label}` : null}
          </p>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label="Fechar galeria"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className="h-5 w-5">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="relative min-h-0 flex-1">
          <button type="button" onClick={() => go(current - 1)} aria-label="Foto anterior" className={`${arrow} left-4`}>
            <Chevron direction="prev" />
          </button>
          <button type="button" onClick={() => go(current + 1)} aria-label="Próxima foto" className={`${arrow} right-4`}>
            <Chevron direction="next" />
          </button>

          <ul
            ref={track}
            onScroll={handleScroll}
            className="flex h-full snap-x snap-mandatory overflow-x-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {images.map((image) => (
              <li
                key={image.src}
                // Toque na margem em volta da foto fecha, como em qualquer galeria.
                onClick={(event) => {
                  if (event.target === event.currentTarget) dialog.current?.close();
                }}
                className="h-full w-full shrink-0 snap-center px-4 pb-6 sm:px-20 sm:pb-10"
              >
                <div className="relative h-full w-full">
                  <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-contain" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </dialog>
  );
}

export function Facility() {
  const [open, setOpen] = useState<number | null>(null);
  const tiles = useRef<(HTMLButtonElement | null)[]>([]);

  function close() {
    const index = open;
    setOpen(null);
    // O foco volta para a foto que abriu a galeria, depois que o dialog sai da tela.
    if (index !== null) requestAnimationFrame(() => tiles.current[index]?.focus());
  }

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={`Estrutura em ${site.city}`}
          title="Estrutura de ponta para o seu diagnóstico"
          description={facilityDescription}
        />

        <ul className="grid grid-flow-dense auto-rows-[120px] grid-cols-2 gap-3 sm:auto-rows-[170px] sm:gap-4 lg:auto-rows-[190px] lg:grid-cols-4">
          {facilityImages.map((image, index) => {
            const { span, sizes } = tileLayout(index);

            return (
              <li key={image.src} className={span}>
                <button
                  ref={(el) => {
                    tiles.current[index] = el;
                  }}
                  type="button"
                  onClick={() => setOpen(index)}
                  aria-label={`Ampliar foto: ${image.alt}`}
                  className="group relative block h-full w-full overflow-hidden rounded-xl bg-cyan-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-text focus-visible:ring-offset-2"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes={sizes}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {image.label ? (
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-3 pb-2.5 pt-10 text-left text-xs font-semibold text-white sm:px-4 sm:pb-3 sm:text-sm">
                      {image.label}
                    </span>
                  ) : null}
                  {/* Ícone de ampliar: sempre visível no toque (não há hover para
                      revelar), e só no hover/foco com mouse. */}
                  <span
                    aria-hidden="true"
                    className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-navy shadow-sm transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {open !== null ? <Lightbox images={facilityImages} start={open} onClose={close} /> : null}
    </section>
  );
}
