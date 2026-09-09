import { CtaButton } from "./CtaButton";

export function FinalCta() {
  return (
    <section className="bg-teal py-16">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-balance text-3xl font-bold text-white sm:text-4xl">
          Não deixe sua saúde neurológica para depois
        </h2>
        <p className="mt-4 text-lg text-white/90">
          Agende sua avaliação com a equipe da Neuropleno e tenha o diagnóstico certo para o
          tratamento certo.
        </p>
        <div className="mt-8">
          <CtaButton size="lg" variant="secondary">
            Agendar Avaliação
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
