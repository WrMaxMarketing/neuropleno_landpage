import { googleBusiness, testimonials } from "@/data/content";
import { SectionHeading } from "./SectionHeading";

// Só marcamos a seção como vinda do Google quando todos os depoimentos têm o link
// da avaliação real. Enquanto isso, eles aparecem como depoimentos sem atribuição.
const fromGoogle = testimonials.length > 0 && testimonials.every((item) => item.googleUrl);

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Nota ${rating} de 5`}>
      {Array.from({ length: 5 }, (_, position) => (
        <svg
          key={position}
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={`h-4 w-4 ${position < rating ? "text-amber-400" : "text-slate-300"}`}
          fill="currentColor"
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section id="avaliacoes" className="scroll-mt-20 bg-cyan-tint py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Depoimentos"
          title="O que dizem os pacientes"
          description={fromGoogle ? "Avaliações publicadas no Google." : undefined}
        />

        {fromGoogle && (
          <a
            href={googleBusiness.reviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto -mt-6 mb-10 flex w-fit items-center gap-3 rounded-full bg-white px-5 py-2.5 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
          >
            <span className="text-lg font-bold text-navy">
              {googleBusiness.rating.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}
            </span>
            <Stars rating={Math.round(googleBusiness.rating)} />
            <span className="text-sm text-slate-600">
              {googleBusiness.reviewCount} avaliações no Google
            </span>
          </a>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="flex flex-col rounded-2xl bg-white p-6 shadow-sm"
            >
              <Stars rating={testimonial.rating ?? 5} />

              <blockquote className="mt-4 flex-1 text-slate-700">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <figcaption className="mt-4 text-sm font-semibold text-navy">
                {testimonial.name}
                {testimonial.googleUrl && (
                  <a
                    href={testimonial.googleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 rounded-sm font-normal text-slate-500 underline hover:text-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
                  >
                    Avaliação no Google
                  </a>
                )}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-white p-8 text-center shadow-sm">
          <h3 className="text-balance text-xl font-bold text-navy sm:text-2xl">
            Deixe aqui a sua avaliação
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
            Já foi atendido na Neuropleno? Conte como foi a sua experiência no nosso perfil do
            Google. Leva menos de um minuto e ajuda outros pacientes a decidirem.
          </p>
          <a
            href={googleBusiness.writeReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-teal px-8 py-3 font-semibold text-white shadow-md transition-colors hover:bg-navy-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
          >
            Avaliar no Google
          </a>
        </div>
      </div>
    </section>
  );
}
