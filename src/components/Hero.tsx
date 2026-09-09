import Image from "next/image";
import { hero, site } from "@/data/content";
import { CtaButton } from "./CtaButton";

export function Hero() {
  return (
    <section id="home" className="scroll-mt-20 bg-cyan-tint">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
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
              Agendar Avaliação
            </CtaButton>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <Image
            src={hero.image}
            alt="Clínica Neuropleno"
            width={1400}
            height={1158}
            className="h-auto w-full rounded-2xl object-cover shadow-xl"
            priority
          />
        </div>
      </div>
    </section>
  );
}
