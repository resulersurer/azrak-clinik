import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost } from "@/lib/blog";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    inLanguage: "tr-TR",
    author: {
      "@type": "Organization",
      name: "Azrak Hair Transplant",
    },
    publisher: {
      "@type": "Organization",
      name: "Azrak Hair Transplant",
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <article>
        <header className="bg-[#294b58] px-6 py-20 text-white sm:px-10 lg:px-16">
          <div className="mx-auto max-w-4xl">
            <Link href="/blog" className="text-sm font-semibold text-[#8fdded] hover:underline">
              ← Bloga dön
            </Link>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-[#8fdded]">
              {post.category} · {post.readTime}
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              {post.title}
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-[#d5eef4]">
              {post.description}
            </p>
            <figure className="mt-10 overflow-hidden rounded-3xl">
              <Image
                src={post.image}
                alt={post.imageAlt}
                width={1600}
                height={1067}
                className="aspect-[16/8] w-full object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 900px"
              />
              <figcaption className="mt-3 text-xs text-[#bce7f0]">Temsili görsel</figcaption>
            </figure>
          </div>
        </header>
        <div className="mx-auto max-w-3xl px-6 py-16 sm:px-10">
          <p className="border-b border-[#d3e7ec] pb-8 text-sm text-[#54727d]">
            Son güncelleme:{" "}
            {new Intl.DateTimeFormat("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date(post.publishedAt))}
          </p>
          <div className="mt-12 space-y-12">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-3xl font-semibold tracking-tight">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-5 text-lg leading-8 text-[#52727d]">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
          <aside className="mt-14 rounded-3xl bg-[#eaf8fc] p-8">
            <h2 className="text-2xl font-semibold">Ön görüşme talebi oluşturun</h2>
            <p className="mt-3 leading-7 text-[#52727d]">
              Saç ekimi yaklaşımının sizin için uygunluğu, yalnızca kişisel
              değerlendirme sonrasında belirlenebilir.
            </p>
            <Link
              href="/iletisim"
              className="mt-6 inline-flex rounded-full bg-[#0097be] px-6 py-3 font-semibold text-white transition hover:bg-[#00add6]"
            >
              İletişime geçin
            </Link>
          </aside>
        </div>
      </article>
    </main>
  );
}
