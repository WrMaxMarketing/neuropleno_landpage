import { hero } from "@/data/content";
import { CtaButton } from "./CtaButton";
import { HeroVideo } from "./HeroVideo";

export function Hero() {
  return (
    <section id="home" className="scroll-mt-20 bg-cyan-tint">
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-6 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-8">
        <div>
          {/* H1 mantém as palavras-chave da clínica, mas em corpo de apoio: o texto
              principal do hero é a subheadline logo abaixo. */}
          <h1 className="text-balance text-lg font-semibold leading-snug text-teal sm:text-xl">
            {hero.headline}
          </h1>

          <p className="mt-3 max-w-xl text-balance text-2xl font-bold leading-snug text-navy sm:text-3xl">
            {hero.subheadline}
          </p>

          <p className="mt-5 text-sm font-medium text-slate-500">{hero.specialties}</p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <CtaButton size="lg" className="w-full sm:w-auto">
              Agendar Consulta
            </CtaButton>
          </div>
        </div>

        <HeroVideo />
      </div>
    </section>
  );
}
