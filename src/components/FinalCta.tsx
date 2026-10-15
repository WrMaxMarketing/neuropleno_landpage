import { CtaButton } from "./CtaButton";

export function FinalCta() {
  return (
    // Degradê do navy para o teal escuro: o texto branco passa de 4,5:1 em todo o
    // fundo (no #219ebc chapado o parágrafo ficava abaixo disso).
    <section className="relative overflow-hidden bg-[linear-gradient(120deg,var(--color-navy)_0%,var(--color-teal-text)_100%)] py-16 sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_85%_20%,color-mix(in_srgb,var(--color-cyan)_30%,transparent),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
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
