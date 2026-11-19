"use client";
import { useEffect } from "react";

const CHAVE = "origem_meta_ads";
const CHAVE_GOOGLE = "origem_google_ads";
const VALIDADE_MS = 30 * 24 * 60 * 60 * 1000;
const FONTES_META = ["meta", "facebook", "fb", "instagram", "ig"];

// Nome do conjunto (utm_content) -> código curto: "Remarketing | Lista de leads" -> "remarketing-lista-de-leads"
function paraCodigo(valor: string) {
  return valor
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

// Acrescenta "(Cód. M-XX-conjunto)" nas mensagens de WhatsApp de quem veio de anúncio da Meta
export default function RastreioMetaAds({ site }: { site: string }) {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const fonte = (params.get("utm_source") ?? "").toLowerCase();
      if (FONTES_META.includes(fonte) || params.has("fbclid")) {
        const conjunto = paraCodigo(params.get("utm_content") ?? "");
        localStorage.setItem(CHAVE, JSON.stringify({ conjunto, ts: Date.now() }));
        // vale o último anúncio clicado
        localStorage.removeItem(CHAVE_GOOGLE);
      }
    } catch {}

    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a");
      if (!link || !link.href.includes("wa.me")) return;
      let origem: { conjunto: string; ts: number } | null = null;
      try {
        origem = JSON.parse(localStorage.getItem(CHAVE) ?? "null");
      } catch {}
      if (!origem || Date.now() - origem.ts > VALIDADE_MS) return;

      const codigo = origem.conjunto
        ? `(Cód. M-${site}-${origem.conjunto})`
        : `(Cód. M-${site})`;
      const url = new URL(link.href);
      const texto = url.searchParams.get("text") ?? "";
      if (texto.includes(codigo)) return;
      url.searchParams.set("text", texto ? `${texto} ${codigo}` : codigo);
      link.href = url.toString();
    };
    // captura: troca o href antes da navegação
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [site]);

  return null;
}
