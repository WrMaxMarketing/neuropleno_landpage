import { aboutImages, facilityText, site } from "@/data/content";
import { CtaButton } from "./CtaButton";
import { ImageCarousel } from "./ImageCarousel";

const highlights = [
  "Consultas com o tempo necessário para ouvir o paciente e traçar a melhor estratégia de tratamento.",
  "Exames de alta complexidade e tecnologia de ponta reunidos em um só lugar.",
  `Atendimento em ${site.cityShort}. ${site.hours}.`,
];

export function About() {
  return (
    <section id="sobre" className="scroll-mt-20 bg-cyan-tint py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <ImageCarousel
          images={aboutImages}
          intervalMs={2600}
          className="aspect-[4/3] w-full rounded-2xl shadow-md"
        />

        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-teal">
            Sobre a clínica
          </p>
          <h2 className="text-balance text-3xl font-bold text-navy sm:text-4xl">
            Acolhimento e tecnologia para o seu diagnóstico
          </h2>
          <p className="mt-4 text-slate-600">{facilityText}</p>

          <ul className="mt-6 space-y-4 border-l-2 border-teal/40 pl-5">
            {highlights.map((item) => (
              <li key={item} className="text-sm text-slate-700">
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <CtaButton size="lg">Entrar em contato</CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}
