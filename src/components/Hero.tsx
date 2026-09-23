import { hero, site } from "@/data/content";
import { CtaButton } from "./CtaButton";
import { HeroVideo } from "./HeroVideo";

export function Hero() {
  return (
    <section id="home" className="scroll-mt-20 bg-cyan-tint">
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-6 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-8">
        <div>
          <h1 className="max-w-xl text-balance text-3xl font-bold leading-tight text-navy sm:text-4xl lg:text-5xl">
            {hero.headline}
          </h1>

          <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
            {hero.subheadline}
          </p>

          <p className="mt-5 text-sm font-medium text-slate-500">{hero.specialties}</p>

          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-teal shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M9.69 18.933A1.1 1.1 0 0 0 10 19a1.1 1.1 0 0 0 .31-.067c.155-.055.374-.14.633-.26.518-.24 1.208-.605 1.9-1.112C14.22 16.535 15.75 14.833 15.75 12.5a5.75 5.75 0 0 0-11.5 0c0 2.333 1.53 4.035 2.907 5.06a11.4 11.4 0 0 0 1.9 1.113c.26.12.478.204.633.26ZM10 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
                clipRule="evenodd"
              />
            </svg>
            {site.cityShort}
          </p>

          <div className="cta-enter mt-6 flex flex-col gap-3 sm:flex-row">
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
