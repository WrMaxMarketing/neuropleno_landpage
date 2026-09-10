import { doctors, faq, procedures, site, symptoms } from "@/data/content";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

export function GET() {
  const lines: string[] = [];

  lines.push(`# ${site.name}`);
  lines.push("");
  lines.push(
    `> ${site.tagline}, em ${site.city}. Diagnóstico e tratamento clínico e cirúrgico das principais condições neurológicas, com equipe médica especializada.`
  );
  lines.push("");

  lines.push("## Sobre");
  lines.push(`- Endereço: ${site.address}`);
  lines.push(`- Horário de atendimento: ${site.hours}`);
  lines.push(`- WhatsApp: ${site.whatsappDisplay}`);
  lines.push(`- Instagram: ${site.instagram}`);
  lines.push(`- Site: ${siteUrl}`);
  lines.push("");

  lines.push("## Equipe médica");
  for (const doctor of doctors) {
    lines.push(`- **${doctor.name}** (${doctor.credentials}) — ${doctor.specialty}`);
  }
  lines.push("");

  lines.push("## Sintomas que indicam avaliação neurológica");
  for (const symptom of symptoms) {
    lines.push(`- ${symptom}`);
  }
  lines.push("");

  lines.push("## Procedimentos e condições atendidas");
  for (const procedure of procedures) {
    lines.push(`- ${procedure.title}`);
  }
  lines.push("");

  lines.push("## Perguntas frequentes");
  for (const item of faq) {
    lines.push(`### ${item.question}`);
    lines.push(item.answer);
    lines.push("");
  }

  lines.push("## Páginas");
  lines.push(`- [Site oficial](${siteUrl})`);
  lines.push(`- [Agendar consulta pelo WhatsApp](https://wa.me/${site.whatsapp})`);

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
