import Image from "next/image";
import Link from "next/link";
import { procedures, whatsappLink } from "@/data/content";
import { SectionHeading } from "./SectionHeading";

export function Procedures() {
  return (
    <section id="procedimentos" className="scroll-mt-20 bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="O que tratamos"
          title="Condições e procedimentos neurológicos"
          description="Diagnóstico e tratamento clínico e cirúrgico das principais condições neurológicas, com equipe especializada em cada área."
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {procedures.map((procedure) => (
            <Link
              key={procedure.title}
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
            >
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src={procedure.image}
                  alt={procedure.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <p className="p-3 text-center text-sm font-semibold text-navy">
                {procedure.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
