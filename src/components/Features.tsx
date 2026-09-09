import { features } from "@/data/content";
import { SectionHeading } from "./SectionHeading";

const accent = {
  ring: "ring-teal/20",
  bg: "bg-teal/10",
  icon: "text-teal",
  bar: "bg-teal",
};

const icons = [
  // Diagnóstico preciso e rápido — lupa
  <svg key="search" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" className="h-7 w-7">
    <circle cx="11" cy="11" r="6.5" />
    <path strokeLinecap="round" d="M20 20l-4.35-4.35" />
  </svg>,
  // Tratamentos modernos — sparkles
  <svg key="sparkles" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" className="h-7 w-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" />
  </svg>,
  // Equipe referência — pessoas
  <svg key="users" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" className="h-7 w-7">
    <circle cx="9" cy="8" r="3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 19c.6-2.8 2.8-4.5 5.5-4.5s4.9 1.7 5.5 4.5M16 8.5a2.5 2.5 0 1 0 0-5M18 14.2c1.9.5 3.2 1.9 3.6 4.3" />
  </svg>,
];

export function Features() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Por que a Neuropleno" title="Cuidado neurológico completo" />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {features.map((feature, index) => {
            return (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <span className={`absolute inset-x-0 top-0 h-1.5 ${accent.bar}`} aria-hidden="true" />
                <div
                  className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ring-4 ${accent.bg} ${accent.ring} ${accent.icon}`}
                >
                  {icons[index % icons.length]}
                </div>
                <h3 className="mb-2 text-lg font-bold text-navy">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
