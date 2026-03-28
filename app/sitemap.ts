import type { MetadataRoute } from "next";
import { getAllPublicSlugs } from "@/lib/supabase";

const BASE_URL = "https://gitglossary.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/standards`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/conventional-commits`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/angular-commit-style`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/git-commit-best-practices`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  let slugRoutes: MetadataRoute.Sitemap = [];
  try {
    const slugs = await getAllPublicSlugs();
    slugRoutes = slugs.map((slug) => ({
      url: `${BASE_URL}/standards/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    // Supabase not configured
  }

  return [...staticRoutes, ...slugRoutes];
}
