import {
  getFaqJsonLd,
  getMedicalClinicJsonLd,
  toJsonLdScript,
} from "@/lib/structured-data";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { Authority } from "@/components/Authority";
import { SpecialtyAreas } from "@/components/SpecialtyAreas";
import { Symptoms } from "@/components/Symptoms";
import { Team } from "@/components/Team";
import { Procedures } from "@/components/Procedures";
import { Facility } from "@/components/Facility";
import { MediaBar } from "@/components/MediaBar";
import { VideoShowcase } from "@/components/VideoShowcase";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { Payment } from "@/components/Payment";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLdScript(getMedicalClinicJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLdScript(getFaqJsonLd()) }}
      />
      <Header />
      <main id="main-content">
        <Hero />
        <Stats />
        <Authority />
        <SpecialtyAreas />
        <Symptoms />
        <Team />
        <Procedures />
        <Facility />
        <MediaBar />
        <VideoShowcase />
        <HowItWorks />
        <Features />
        <Payment />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
