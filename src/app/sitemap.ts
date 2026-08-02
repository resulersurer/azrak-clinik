import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    {
      url: "https://azrak-clinik.vercel.app",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...["sac-ekimi", "fue-sac-ekimi", "dhi-sac-ekimi", "hakkimizda", "iletisim", "blog"].map(
      (path) => ({
        url: `https://azrak-clinik.vercel.app/${path}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: path === "blog" ? 0.9 : 0.8,
      }),
    ),
    ...blogPosts.map((post) => ({
      url: `https://azrak-clinik.vercel.app/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  return pages;
}
