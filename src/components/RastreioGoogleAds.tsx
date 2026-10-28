"use client";
import { useEffect } from "react";

const CHAVE = "origem_google_ads";
const VALIDADE_MS = 30 * 24 * 60 * 60 * 1000;

// Acrescenta "(Cód. GP-XX)" / "(Cód. GD-XX)" nas mensagens de WhatsApp de quem veio do Google Ads
export default function RastreioGoogleAds({ site }: { site: string }) {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.has("gclid") || params.get("utm_source") === "google") {
        const rede = params.get("rede") === "d" ? "D" : "P";
        localStorage.setItem(CHAVE, JSON.stringify({ rede, ts: Date.now() }));
      }
    } catch {}

    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a");
      if (!link || !link.href.includes("wa.me")) return;
      let origem: { rede: string; ts: number } | null = null;
      try {
        origem = JSON.parse(localStorage.getItem(CHAVE) ?? "null");
      } catch {}
      if (!origem || Date.now() - origem.ts > VALIDADE_MS) return;

      const codigo = `(Cód. G${origem.rede}-${site})`;
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
