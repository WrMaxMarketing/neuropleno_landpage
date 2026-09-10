import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "Clínica Neuropleno | Neurologia e Neurocirurgia em Teresina";
const description =
  "Referência nacional em neurologia e neurocirurgia. Diagnóstico preciso e tratamento humanizado das principais condições neurológicas em Teresina - PI.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "neurologista Teresina",
    "neurocirurgião Teresina",
    "clínica de neurologia Piauí",
    "eletroneuromiografia Teresina",
    "tratamento de AVC",
    "cefaleia e enxaqueca",
    "epilepsia",
    "Doença de Parkinson",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "Clínica Neuropleno",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/images/facility-1.jpg",
        width: 1920,
        height: 1280,
        alt: "Clínica Neuropleno",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/facility-1.jpg"],
  },
};

export const viewport = {
  themeColor: "#023047",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
        >
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
