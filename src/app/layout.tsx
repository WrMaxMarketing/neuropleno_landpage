import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clínica Neuropleno | Neurologia e Neurocirurgia em Teresina",
  description:
    "Referência nacional em neurologia e neurocirurgia. Diagnóstico preciso e tratamento humanizado das principais condições neurológicas em Teresina - PI.",
  openGraph: {
    title: "Clínica Neuropleno | Neurologia e Neurocirurgia em Teresina",
    description:
      "Referência nacional em neurologia e neurocirurgia. Diagnóstico preciso e tratamento humanizado em Teresina - PI.",
    locale: "pt_BR",
    type: "website",
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
