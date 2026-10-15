import Link from "next/link";
import { whatsappLink } from "@/data/content";

type CtaButtonProps = {
  children: React.ReactNode;
  /** primary: fundo claro · secondary: faixa colorida · accent: fundo escuro (navy). */
  variant?: "primary" | "secondary" | "accent";
  size?: "md" | "lg";
  message?: string;
  className?: string;
};

const sizeClasses: Record<NonNullable<CtaButtonProps["size"]>, string> = {
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

// O primary usa o teal escuro (--color-teal-text): branco sobre o #219ebc da marca
// fica em 3,26:1, abaixo dos 4,5:1 da WCAG AA para texto de botão.
const variantClasses: Record<NonNullable<CtaButtonProps["variant"]>, string> = {
  primary: "bg-teal-text text-white hover:bg-navy",
  secondary: "bg-white text-navy hover:bg-cyan-tint",
  accent: "bg-cyan text-navy hover:bg-cyan-tint focus-visible:ring-offset-navy",
};

export function CtaButton({
  children,
  variant = "primary",
  size = "md",
  message,
  className = "",
}: CtaButtonProps) {
  return (
    <Link
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`touch-manipulation inline-flex min-h-12 items-center justify-center rounded-full font-semibold shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
