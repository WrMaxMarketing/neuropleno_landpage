import Image from "next/image";
import { doctors, teamImage } from "@/data/content";
import { SectionHeading } from "./SectionHeading";

export function Team() {
  return (
    <section id="equipe" className="scroll-mt-20 bg-cyan-tint py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 grid items-center gap-8 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Nossa equipe"
            title="Médicos especialistas em neurologia e neurocirurgia"
            align="left"
          />
          <div className="relative mx-auto aspect-[7/6] w-full max-w-sm">
            <Image
              src={teamImage}
              alt="Equipe médica da Clínica Neuropleno"
              fill
              sizes="(max-width: 1024px) 100vw, 400px"
              className="object-contain"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((doctor) => (
            <div key={doctor.name} className="text-center">
              <div className="relative mx-auto mb-4 aspect-square w-40 overflow-hidden rounded-2xl shadow-md">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  sizes="160px"
                  className="object-cover object-top"
                />
              </div>
              <h3 className="text-lg font-bold text-navy">{doctor.name}</h3>
              <p className="mt-1 text-sm font-medium text-teal">{doctor.credentials}</p>
              <p className="mt-2 text-sm text-slate-600">{doctor.specialty}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
