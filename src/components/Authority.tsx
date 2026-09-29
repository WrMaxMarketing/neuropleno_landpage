import { CtaButton } from "./CtaButton";
import { SectionHeading } from "./SectionHeading";

const areas = [
  {
    title: "Neurologia",
    highlight: "Entenda o que está acontecendo com seu corpo e volte a viver com mais segurança.",
    description:
      "Investigação e tratamento de dores de cabeça, enxaqueca, Parkinson, Alzheimer, epilepsia, AVC e outros sintomas neurológicos, com avaliação individualizada e acompanhamento especializado.",
    position: "sm:col-start-1 sm:row-start-1",
  },
  {
    title: "Neurocirurgia",
    highlight: "Quando a cirurgia é necessária, precisão e experiência fazem diferença.",
    description:
      "Tratamento especializado de tumores cerebrais, doenças da coluna, compressões nervosas e outras condições neurocirúrgicas, sempre buscando a melhor estratégia para cada paciente.",
    position: "sm:col-start-2 sm:row-start-1",
  },
  {
    title: "Neurorradiologia",
    highlight: "Tratamentos modernos por cateter, com alta precisão e menor invasividade.",
    description:
      "Abordagem de aneurismas cerebrais, doenças vasculares, angioplastia de carótida, angiografia e outros procedimentos realizados pelos vasos sanguíneos.",
    position: "sm:col-start-1 sm:row-start-2",
  },
  {
    title: "Neurointervenção",
    highlight: "Tratamento por dentro do vaso, sem cortes e com recuperação mais rápida.",
    description:
      "Procedimentos endovasculares guiados por imagem para AVC, aneurismas cerebrais e doenças dos vasos do cérebro e do pescoço, conduzidos por equipe com formação em neurorradiologia intervencionista.",
    position: "sm:col-start-2 sm:row-start-2",
  },
];

function Brain() {
  return (
    <svg
      viewBox="0 0 120 100"
      aria-hidden="true"
      className="h-full w-full text-teal"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        className="fill-cyan-tint"
        d="M60 12c-8-8-24-6-28 6-10 0-18 9-15 19-7 6-7 18 1 23-2 10 6 19 16 18 5 8 20 8 26 0 6 8 21 8 26 0 10 1 18-8 16-18 8-5 8-17 1-23 3-10-5-19-15-19-4-12-20-14-28-6Z"
      />
      <path d="M60 12v70M38 32c6 2 10 8 8 14M82 32c-6 2-10 8-8 14M34 62c8-2 14 2 16 8M86 62c-8-2-14 2-16 8" />
    </svg>
  );
}

export function Authority() {
  return (
    <section id="especialidades" className="scroll-mt-20 bg-white py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Especialidades"
          title="Cuidado neurológico completo, do diagnóstico ao tratamento"
        />

        <div className="relative grid gap-4 sm:grid-cols-2 sm:gap-x-40 sm:gap-y-6">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-teal/30 bg-white p-4 shadow-md sm:block"
          >
            <Brain />
          </div>

          <div className="mx-auto h-28 w-28 sm:hidden">
            <Brain />
          </div>

          {areas.map((area) => (
            <div
              key={area.title}
              className={`flex flex-col items-start rounded-2xl border border-teal/30 bg-white p-6 shadow-sm ${area.position}`}
            >
              <h3 className="text-balance text-xl font-bold text-navy">{area.title}</h3>
              <p className="mt-2 text-balance text-sm font-semibold text-teal">{area.highlight}</p>
              <p className="mt-2 mb-4 text-sm text-slate-600">{area.description}</p>
              <CtaButton
                size="md"
                message={`Olá! Gostaria de saber mais sobre ${area.title} na Clínica Neuropleno.`}
                className="mt-auto !min-h-10 !px-5 !py-2 text-sm"
              >
                Saiba mais
              </CtaButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
