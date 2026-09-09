import Image from "next/image";
import { facilityImages, facilityText, site } from "@/data/content";
import { SectionHeading } from "./SectionHeading";

export function Facility() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={`Estrutura em ${site.city}`}
          title="Estrutura de ponta para o seu diagnóstico"
          description={facilityText}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {facilityImages.map((image) => (
            <div key={image} className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src={image}
                alt="Estrutura da Clínica Neuropleno"
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
