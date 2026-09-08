import { symptoms } from "@/data/content";
import { SectionHeading } from "./SectionHeading";
import { CtaButton } from "./CtaButton";

export function Symptoms() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Fique atento"
          title="Sinais que merecem uma avaliação neurológica"
          description="Se você reconhece algum destes sinais em você ou em alguém próximo, o ideal é buscar uma avaliação especializada."
        />

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {symptoms.map((symptom) => (
            <li
              key={symptom}
              className="flex items-start gap-3 rounded-xl border border-slate-100 bg-cyan-tint p-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 shrink-0 text-teal"
              >
                <path
                  fillRule="evenodd"
                  d="M8.485 3.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 3.495ZM10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 6Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-slate-700">{symptom}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <CtaButton size="lg">Agendar Avaliação</CtaButton>
        </div>
      </div>
    </section>
  );
}
