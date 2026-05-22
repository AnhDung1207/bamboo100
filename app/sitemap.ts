import { createClient } from "@/lib/supabase/server"
import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const baseUrl = "https://bamboo100.vn"

  const { data: articles } = await supabase
    .from("articles")
    .select("slug, published_at, updated_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })

  const { data: categories } = await supabase
    .from("categories")
    .select("slug")

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/phan-tich`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/dich-vu`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/hoc-vien`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/lien-he`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/ve-chung-toi`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ]

  const articlePages: MetadataRoute.Sitemap = (articles || []).map((a) => ({
    url: `${baseUrl}/phan-tich/${a.slug}`,
    lastModified: new Date(a.updated_at || a.published_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const categoryPages: MetadataRoute.Sitemap = (categories || []).map((c) => ({
    url: `${baseUrl}/phan-tich?category=${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }))

  return [...staticPages, ...articlePages, ...categoryPages]
}