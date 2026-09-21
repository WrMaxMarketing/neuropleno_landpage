import Image from "next/image";
import { site } from "@/data/content";
import { SectionHeading } from "./SectionHeading";

type InstagramPost = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
};

// Lê os posts mais recentes pela Instagram API (token de longa duração em INSTAGRAM_ACCESS_TOKEN).
// Sem token, ou se a API falhar, a seção mostra apenas o convite para seguir o perfil.
async function getPosts(): Promise<InstagramPost[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return [];

  try {
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&limit=6&access_token=${token}`,
      { next: { revalidate: 3600 } },
    );
    if (!response.ok) return [];
    const data: { data?: InstagramPost[] } = await response.json();
    return (data.data ?? []).filter((post) => post.media_url || post.thumbnail_url);
  } catch {
    return [];
  }
}

export async function InstagramFeed() {
  const posts = await getPosts();

  return (
    <section id="instagram" className="scroll-mt-20 bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Instagram"
          title="Acompanhe a Neuropleno no dia a dia"
          description="Conteúdo sobre saúde neurológica e bastidores da clínica."
        />

        {posts.length > 0 && (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {posts.map((post) => (
              <li key={post.id}>
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-square overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
                >
                  <Image
                    src={(post.media_type === "VIDEO" ? post.thumbnail_url : post.media_url) ?? ""}
                    alt={post.caption?.slice(0, 120) ?? "Publicação da Clínica Neuropleno no Instagram"}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 text-center">
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-teal px-8 py-3 font-semibold text-white shadow-md transition-colors hover:bg-navy-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
          >
            Seguir @neuroplenoclinica
          </a>
        </div>
      </div>
    </section>
  );
}
