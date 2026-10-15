"use client";

import { useId, useState } from "react";
import { faq } from "@/data/content";
import { SectionHeading } from "./SectionHeading";

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();

  // Lista com divisórias em vez de blocos coloridos: seis faixas ciano cheias pareciam
  // seis botões gritando ao mesmo tempo. A cor fica para o sinal de abrir/fechar.
  return (
    <div className="border-b border-slate-200">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="group flex min-h-16 w-full items-center justify-between gap-4 rounded-md py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-text focus-visible:ring-offset-2"
      >
        <span
          className={`text-base font-semibold transition-colors sm:text-lg ${
            isOpen ? "text-teal-text" : "text-navy group-hover:text-teal-text"
          }`}
        >
          {question}
        </span>
        <span
          aria-hidden="true"
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-[transform,background-color,border-color,color] duration-[400ms] ${
            isOpen
              ? "rotate-45 border-teal-text bg-teal-text text-white"
              : "border-slate-300 text-navy group-hover:border-teal-text group-hover:text-teal-text"
          }`}
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
            <path strokeLinecap="round" d="M10 4v12M4 10h12" />
          </svg>
        </span>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-[400ms] ease-in-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p id={panelId} className="pb-6 pr-12 text-slate-600">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading eyebrow="Dúvidas" title="Perguntas frequentes" />

        <div className="border-t border-slate-200">
          {faq.map((item, index) => (
            <FaqItem
              key={item.question}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
