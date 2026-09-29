import {
  getFaqJsonLd,
  getMedicalClinicJsonLd,
  toJsonLdScript,
} from "@/lib/structured-data";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { Authority } from "@/components/Authority";
import { About } from "@/components/About";
import { Team } from "@/components/Team";
import { Procedures } from "@/components/Procedures";
import { Facility } from "@/components/Facility";
import { Testimonials } from "@/components/Testimonials";
import { InstagramFeed } from "@/components/InstagramFeed";
import { Location } from "@/components/Location";
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
        <About />
        <Team />
        <Procedures />
        <Facility />
        <Testimonials />
        <InstagramFeed />
        <Location />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
