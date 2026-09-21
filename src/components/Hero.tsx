import { hero, site } from "@/data/content";
import { CtaButton } from "./CtaButton";
import { HeroVideo } from "./HeroVideo";

export function Hero() {
  return (
    <section id="home" className="scroll-mt-20 bg-cyan-tint">
      <div className="mx-auto grid max-w-6xl items-start gap-10 py-5 px-4 sm:px-6 sm:py-5 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-teal">
            {site.tagline} · {site.city}
          </p>
          <h1 className="text-balance text-4xl font-bold leading-tight text-navy sm:text-5xl">
            {hero.headline}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-600">{hero.subheadline}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CtaButton size="lg" className="w-full sm:w-auto">
              Agendar Consulta
            </CtaButton>
            <CtaButton
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto"
              message="Olá! Gostaria de falar com a equipe da Clínica Neuropleno."
            >
              Falar com nossa equipe
            </CtaButton>
          </div>

          <p className="mt-6 text-sm font-medium text-slate-500">{hero.specialties}</p>
        </div>

        <HeroVideo />
      </div>
    </section>
  );
}
