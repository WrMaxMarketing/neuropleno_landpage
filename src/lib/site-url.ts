// Falls back to a placeholder until NEXT_PUBLIC_SITE_URL is set to the real production domain.
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.example.com";
