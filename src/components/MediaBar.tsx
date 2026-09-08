import Image from "next/image";
import { mediaLogos } from "@/data/content";

export function MediaBar() {
  return (
    <section className="border-y border-slate-100 bg-white py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="mb-6 text-center text-sm font-medium uppercase tracking-wide text-slate-400">
          Já falamos sobre saúde neurológica em
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 grayscale">
          {mediaLogos.map((logo) => (
            <Image
              key={logo.name}
              src={logo.image}
              alt={logo.name}
              width={100}
              height={40}
              className="h-6 w-auto object-contain sm:h-8"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
