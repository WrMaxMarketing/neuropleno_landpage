import Link from "next/link";
import { whatsappLink } from "@/data/content";
import { WhatsAppIcon } from "./SocialIcons";

export function WhatsAppFloat() {
  return (
    <Link
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Agendar consulta pelo WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </Link>
  );
}
