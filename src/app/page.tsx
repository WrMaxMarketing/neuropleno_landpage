import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MediaBar } from "@/components/MediaBar";
import { Stats } from "@/components/Stats";
import { Symptoms } from "@/components/Symptoms";
import { Procedures } from "@/components/Procedures";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { Team } from "@/components/Team";
import { Facility } from "@/components/Facility";
import { Payment } from "@/components/Payment";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <MediaBar />
        <Stats />
        <Symptoms />
        <Procedures />
        <HowItWorks />
        <Features />
        <Team />
        <Facility />
        <Payment />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
