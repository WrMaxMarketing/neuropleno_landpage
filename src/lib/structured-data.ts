import { doctors, faq, site } from "@/data/content";
import { siteUrl } from "@/lib/site-url";

export function toJsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function getMedicalClinicJsonLd() {
  const [locality, region] = site.city.split(" - ");

  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: site.name,
    url: siteUrl,
    image: `${siteUrl}/images/facility-1.jpg`,
    logo: `${siteUrl}/images/logo-principal.png`,
    telephone: `+${site.whatsapp}`,
    priceRange: "$$",
    medicalSpecialty: ["Neurology", "Neurosurgery"],
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
      addressLocality: locality,
      addressRegion: region,
      addressCountry: "BR",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
    sameAs: [site.instagram],
    employee: doctors.map((doctor) => ({
      "@type": "Physician",
      name: doctor.name,
      description: doctor.specialty,
    })),
  };
}

export function getFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
