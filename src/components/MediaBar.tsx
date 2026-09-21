import Image from "next/image";
import Link from "next/link";
import { mediaLogos } from "@/data/content";

export function MediaBar() {
  return (
    <section className="border-y border-slate-100 bg-white py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="mb-6 text-center text-sm font-medium uppercase tracking-wide text-slate-400">
          Já falamos sobre saúde neurológica em
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {mediaLogos.map((logo) => {
            const logoImage = (
              <Image
                src={logo.image}
                alt={logo.name}
                width={130}
                height={52}
                className="h-8 w-auto object-contain grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:scale-110 sm:h-10"
              />
            );

            if (!logo.url) {
              return <div key={logo.name}>{logoImage}</div>;
            }

            return (
              <Link
                key={logo.name}
                href={logo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
              >
                {logoImage}
                {(logo.headline || logo.topic) && (
                  <span className="max-w-[160px] text-center text-xs text-slate-500">
                    {logo.headline}
                    {logo.topic && <span className="block text-slate-400">{logo.topic}</span>}
                    <span className="mt-0.5 block font-semibold text-teal">Ler reportagem</span>
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
