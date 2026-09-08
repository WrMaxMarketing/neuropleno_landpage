import Image from "next/image";
import { steps } from "@/data/content";
import { SectionHeading } from "./SectionHeading";

export function HowItWorks() {
  return (
    <section id="comofunciona" className="scroll-mt-20 bg-cyan-tint py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Como funciona" title="Do agendamento à recuperação" />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="relative text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
                <Image src={step.icon} alt="" width={32} height={32} className="h-8 w-8" />
              </div>
              <p className="mb-1 text-sm font-semibold text-teal">Passo {index + 1}</p>
              <h3 className="mb-2 text-lg font-bold text-navy">{step.title}</h3>
              <p className="text-sm text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
