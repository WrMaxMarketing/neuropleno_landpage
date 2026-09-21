import { authorityPoints } from "@/data/content";
import { SectionHeading } from "./SectionHeading";

export function Authority() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Prova de autoridade"
          title="Por que a Neuropleno se tornou referência"
        />

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {authorityPoints.map((point) => (
            <li
              key={point}
              className="flex items-start gap-3 rounded-xl border border-slate-100 bg-cyan-tint p-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 shrink-0 text-teal"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-slate-700">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
