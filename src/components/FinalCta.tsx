import { CtaButton } from "./CtaButton";

export function FinalCta() {
  return (
    <section className="bg-teal py-16">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-balance text-3xl font-bold text-white sm:text-4xl">
          Seus sintomas merecem uma avaliação especializada
        </h2>
        <p className="mt-4 text-pretty text-lg text-white/90">
          Na Neuropleno, você encontra uma equipe preparada para investigar, diagnosticar e indicar
          o cuidado mais adequado para cada caso.
        </p>
        <div className="mt-8">
          <CtaButton size="lg" variant="secondary">
            Quero agendar uma avaliação
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
