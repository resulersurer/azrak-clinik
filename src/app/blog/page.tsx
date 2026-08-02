import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Saç Ekimi Blogu",
  description:
    "Saç ekimi, FUE, DHI, işlem öncesi hazırlık ve bakım süreci hakkında Türkçe bilgilendirici içerikler.",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default function BlogPage() {
  const [featuredPost, ...otherPosts] = blogPosts;

  return (
    <main>
      <section className="bg-[#294b58] px-6 py-20 text-white sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8fdded]">
            Azrak Hair Transplant blog
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Saç ekimi hakkında güvenilir ve anlaşılır bilgiler.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#d5eef4]">
            Sürece hazırlanırken, yöntemleri değerlendirirken ve bakım aşamasını
            öğrenirken kullanabileceğiniz genel bilgilendirme içerikleri.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#008daf]">
            Öne çıkan rehber
          </p>
          <article className="mt-5 grid overflow-hidden rounded-3xl border border-[#cbe7ed] bg-[#eaf8fc] lg:grid-cols-[.8fr_1.2fr]">
            <div className="min-h-56 bg-[linear-gradient(145deg,#8cdeed,#0097be_48%,#294b58)]" />
            <div className="p-8 sm:p-12">
              <div className="flex flex-wrap gap-3 text-sm font-semibold text-[#28718a]">
                <span>{featuredPost.category}</span>
                <span>{formatDate(featuredPost.publishedAt)}</span>
                <span>{featuredPost.readTime}</span>
              </div>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                {featuredPost.title}
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#52727d]">
                {featuredPost.description}
              </p>
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="mt-7 inline-flex rounded-full bg-[#0097be] px-6 py-3 font-semibold text-white transition hover:bg-[#00add6]"
              >
                Rehberi okuyun
              </Link>
            </div>
          </article>

          <div className="mt-16 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#008daf]">
                Tüm içerikler
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Saç ekimi rehberleri
              </h2>
            </div>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {otherPosts.map((post, index) => (
              <article
                key={post.slug}
                className="flex flex-col rounded-3xl border border-[#d3e7ec] bg-white p-7 shadow-sm"
              >
                <div
                  className={`h-2 w-16 rounded-full ${
                    index % 2 === 0 ? "bg-[#0097be]" : "bg-[#79cfe0]"
                  }`}
                />
                <p className="mt-7 text-sm font-semibold text-[#008daf]">
                  {post.category}
                </p>
                <h3 className="mt-3 text-2xl font-semibold leading-tight">{post.title}</h3>
                <p className="mt-4 flex-1 leading-7 text-[#597681]">{post.description}</p>
                <div className="mt-6 flex items-center justify-between text-sm text-[#54727d]">
                  <span>{post.readTime}</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-semibold text-[#008daf] hover:underline"
                  >
                    Okuyun →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
