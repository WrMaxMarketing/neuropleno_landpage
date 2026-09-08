import Link from "next/link";
import { whatsappLink } from "@/data/content";

export function WhatsAppFloat() {
  return (
    <Link
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Agendar avaliação pelo WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="white"
        aria-hidden="true"
        className="h-7 w-7"
      >
        <path d="M16.004 3C9.376 3 4 8.373 4 15c0 2.386.7 4.61 1.906 6.484L4 29l7.72-1.867A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.6c-1.955 0-3.775-.57-5.31-1.552l-.38-.24-4.582 1.108 1.13-4.463-.25-.397A9.55 9.55 0 0 1 5.4 15c0-5.85 4.755-10.6 10.604-10.6 5.85 0 10.596 4.75 10.596 10.6 0 5.85-4.746 10.6-10.596 10.6Zm5.79-7.94c-.317-.16-1.874-.925-2.164-1.03-.29-.106-.502-.16-.713.16-.21.318-.817 1.03-1.002 1.24-.184.213-.37.24-.686.08-.317-.16-1.34-.494-2.552-1.573-.943-.84-1.58-1.878-1.765-2.196-.184-.318-.02-.49.14-.65.143-.142.317-.37.475-.556.16-.185.212-.318.317-.53.106-.213.053-.398-.026-.558-.08-.16-.713-1.72-.977-2.355-.257-.618-.518-.534-.713-.544-.184-.008-.396-.01-.607-.01-.212 0-.554.08-.845.398-.29.318-1.107 1.08-1.107 2.638 0 1.558 1.133 3.062 1.29 3.275.16.212 2.23 3.407 5.404 4.777.755.326 1.344.52 1.804.665.758.24 1.448.207 1.993.126.608-.09 1.874-.766 2.14-1.505.264-.74.264-1.373.184-1.505-.08-.132-.29-.212-.607-.37Z" />
      </svg>
    </Link>
  );
}
