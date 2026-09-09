import Image from "next/image";
import { mediaLogos } from "@/data/content";

export function MediaBar() {
  return (
    <section className="border-y border-slate-100 bg-white py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="mb-6 text-center text-sm font-medium uppercase tracking-wide text-slate-400">
          Já falamos sobre saúde neurológica em
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {mediaLogos.map((logo) => (
            <Image
              key={logo.name}
              src={logo.image}
              alt={logo.name}
              width={130}
              height={52}
              className="h-8 w-auto object-contain grayscale transition-all duration-300 hover:grayscale-0 hover:scale-110 sm:h-10"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
