import { testimonials } from "@/data/content";

export function Testimonials() {
  return (
    <section className="bg-navy py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-cyan">
            Depoimentos
          </p>
          <h2 className="text-balance text-3xl font-bold text-white sm:text-4xl">
            Quem confiou na Neuropleno
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="rounded-2xl bg-navy-light p-6 shadow-lg"
            >
              <blockquote className="text-slate-100">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-cyan">
                {testimonial.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
