import Link from "next/link";
import { whatsappLink } from "@/data/content";

type CtaButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
  message?: string;
  className?: string;
};

const sizeClasses: Record<NonNullable<CtaButtonProps["size"]>, string> = {
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const variantClasses: Record<NonNullable<CtaButtonProps["variant"]>, string> = {
  primary: "bg-teal text-white hover:bg-navy-light",
  secondary: "bg-white text-navy border-2 border-navy hover:bg-cyan-tint",
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
      className={`touch-manipulation inline-flex min-h-[48px] items-center justify-center rounded-full font-semibold shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
