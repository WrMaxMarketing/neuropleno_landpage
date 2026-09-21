import Image from "next/image";
import Link from "next/link";
import { procedures, specialtyAreas } from "@/data/content";
import { SectionHeading } from "./SectionHeading";

export function SpecialtyAreas() {
  return (
    <section className="bg-cyan-tint py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Áreas de atuação" title="Conheça as três áreas de atuação" />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {specialtyAreas.map((area) => {
            const conditions = procedures
              .filter((procedure) => procedure.category === area.key)
              .slice(0, 4)
              .map((procedure) => procedure.title);

            return (
              <Link
                key={area.key}
                href="#procedimentos"
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={area.image}
                    alt={area.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="mb-2 text-xl font-bold text-navy">{area.title}</h3>
                  <p className="mb-4 text-sm text-slate-600">{area.description}</p>
                  <ul className="mt-auto space-y-1.5 text-sm text-slate-500">
                    {conditions.map((condition) => (
                      <li key={condition} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal" aria-hidden="true" />
                        {condition}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
