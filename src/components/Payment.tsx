import { paymentText } from "@/data/content";
import { CtaButton } from "./CtaButton";

export function Payment() {
  return (
    <section className="bg-cyan-tint py-16">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-teal">
          Formas de pagamento
        </p>
        <h2 className="text-3xl font-bold text-navy sm:text-4xl">
          Tratamento acessível, sem abrir mão do cuidado
        </h2>
        <p className="mt-4 text-lg text-slate-600">{paymentText}</p>
        <div className="mt-8">
          <CtaButton size="lg">Tirar Dúvidas no WhatsApp</CtaButton>
        </div>
      </div>
    </section>
  );
}
