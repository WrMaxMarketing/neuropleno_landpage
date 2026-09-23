import { site, whatsappLink } from "@/data/content";
import { SectionHeading } from "./SectionHeading";

export function Location() {
  const query = encodeURIComponent(`${site.name}, ${site.address}`);

  return (
    <section id="localizacao" className="scroll-mt-20 bg-cyan-tint py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Localização e contato" title="Onde nos encontrar" />

        <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_1.5fr]">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <ul className="space-y-5 border-l-2 border-teal/40 pl-5 text-slate-700">
              <li>
                <p className="text-sm font-semibold text-navy">Endereço</p>
                <p className="text-sm">{site.address}</p>
              </li>
              <li>
                <p className="text-sm font-semibold text-navy">Horário de atendimento</p>
                {site.hoursLines.map((line) => (
                  <p key={line} className="text-sm">
                    {line}
                  </p>
                ))}
              </li>
              <li>
                <p className="text-sm font-semibold text-navy">Agende pelo WhatsApp</p>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm text-sm font-semibold text-teal hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
                >
                  {site.whatsappDisplay}
                </a>
              </li>
            </ul>
          </div>

          <div className="min-h-72 overflow-hidden rounded-2xl shadow-sm">
            <iframe
              title={`Mapa: ${site.name}`}
              src={`https://www.google.com/maps?q=${query}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-72 w-full border-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
