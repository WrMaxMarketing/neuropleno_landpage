"use client";
import Script from "next/script";
import { useEffect } from "react";

const GOOGLE_TAG_ID = "GT-MBGGSSV5";
const CONVERSAO_WHATSAPP = "AW-17031845086/GBgICKnh68AaEN6ptbk_";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export default function GoogleTag() {
  // Registra conversão no Google Ads em todo clique em link de WhatsApp
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a");
      if (link && link.href.includes("wa.me")) {
        window.gtag?.("event", "conversion", { send_to: CONVERSAO_WHATSAPP });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${GOOGLE_TAG_ID}');
        gtag('config', 'AW-17031845086');
      `}</Script>
    </>
  );
}
