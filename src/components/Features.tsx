import { features } from "@/data/content";
import { SectionHeading } from "./SectionHeading";

export function Features() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Por que a Neuropleno" title="Cuidado neurológico completo" />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-slate-100 p-6 text-center">
              <h3 className="mb-2 text-lg font-bold text-navy">{feature.title}</h3>
              <p className="text-sm text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
