import Image from "next/image";
import Link from "next/link";
import { procedures, whatsappLink } from "@/data/content";
import { SectionHeading } from "./SectionHeading";

export function Procedures() {
  // A lista é duplicada para o loop da animação CSS ficar contínuo.
  const loop = [...procedures, ...procedures];

  return (
    <section id="procedimentos" className="scroll-mt-20 bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="O que tratamos"
          title="Exames, consultas, procedimentos e tratamentos"
          description="Diagnóstico e tratamento clínico e cirúrgico das principais condições neurológicas, com equipe especializada em cada área."
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="marquee-pause overflow-hidden rounded-2xl">
        <ul className="marquee-track flex w-max">
          {loop.map((procedure, index) => (
            <li key={`${procedure.title}-${index}`} className="w-52 shrink-0 pr-4 sm:w-64 lg:w-72" aria-hidden={index >= procedures.length}>
              <Link
                href={whatsappLink(
                  `Olá! Vim pelo site e gostaria de saber mais sobre o tratamento de ${procedure.title}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={index >= procedures.length ? -1 : 0}
                className="group block overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={procedure.image}
                    alt={procedure.title}
                    fill
                    sizes="288px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="p-3 text-center text-sm font-semibold text-navy">{procedure.title}</p>
              </Link>
            </li>
          ))}
        </ul>
        </div>
      </div>
    </section>
  );
}
