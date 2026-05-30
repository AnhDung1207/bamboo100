"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

type Article = {
  id: string
  slug: string
  title: string
  published_at: string | null
  is_hot: boolean
  is_premium: boolean
  categories: { name: string; slug: string } | null
  product_groups: { slug: string } | null
}

const CATEGORY_THUMBNAILS: Record<string, string> = {
  "vang": "/thumbnails/vang.png",
  "bac": "/thumbnails/bac.png",
  "dong": "/thumbnails/dong.png",
  "bach-kim": "/thumbnails/bach-kim.png",
  "dau-tho-wti": "/thumbnails/dau-tho.png",
  "dau-tho-brent": "/thumbnails/dau-tho.png",
  "dau-wti-mini": "/thumbnails/dau-tho.png",
  "dau-it-luu-huynh": "/thumbnails/dau-tho.png",
  "khi-tu-nhien": "/thumbnails/khi-tu-nhien.png",
  "xang-rbob": "/thumbnails/xang.png",
  "ca-phe-arabica": "/thumbnails/ca-phe.png",
  "ca-phe-robusta": "/thumbnails/ca-phe.png",
  "cacao": "/thumbnails/ca-cao.png",
  "cao-su-tsr20": "/thumbnails/cao-su.png",
  "cao-su-rss3": "/thumbnails/cao-su.png",
  "bong-soi": "/thumbnails/bong-soi.png",
  "duong": "/thumbnails/duong.png",
  "ngo": "/thumbnails/ngo.png",
  "lua-mi": "/thumbnails/lua-mi.png",
  "dau-tuong": "/thumbnails/dau-tuong.png",
  "dau-dau-tuong": "/thumbnails/dau-dau-tuong.png",
  "kho-dau-tuong": "/thumbnails/kho-dau-tuong.png",
  "gao": "/thumbnails/gao-tho.png",
  "hot-news": "/thumbnails/hot-news.png",
  "phan-tich-ky-thuat": "/thumbnails/phan-tich-ky-thuat.png",
  "bao-cao-kinh-te": "/thumbnails/bao-cao-kinh-te.png",
}

const CATEGORY_ICONS: Record<string, string> = {
  "vang": "🥇", "bac": "🥈", "dong": "🔶", "bach-kim": "💎",
  "dau-tho-wti": "🛢️", "dau-tho-brent": "🛢️", "dau-wti-mini": "🛢️",
  "dau-it-luu-huynh": "🛢️", "khi-tu-nhien": "💨", "xang-rbob": "⛽",
  "ca-phe-arabica": "☕", "ca-phe-robusta": "☕", "cacao": "🍫",
  "cao-su-tsr20": "🌿", "cao-su-rss3": "🌿", "bong-soi": "🌱",
  "duong": "🍬", "ngo": "🌽", "lua-mi": "🌾",
  "dau-tuong": "🫘", "dau-dau-tuong": "🫘", "kho-dau-tuong": "🫘", "gao": "🌾",
}

const GROUP_MAP: Record<string, string> = {
  "vang": "Kim Loại", "bac": "Kim Loại", "dong": "Kim Loại",
  "bach-kim": "Kim Loại", "quang-sat": "Kim Loại",
  "dau-tho-wti": "Năng Lượng", "dau-tho-brent": "Năng Lượng",
  "dau-wti-mini": "Năng Lượng", "khi-tu-nhien": "Năng Lượng",
  "xang-rbob": "Năng Lượng", "dau-it-luu-huynh": "Năng Lượng",
  "ca-phe-arabica": "Nguyên Liệu CN", "ca-phe-robusta": "Nguyên Liệu CN",
  "cacao": "Nguyên Liệu CN", "cao-su-tsr20": "Nguyên Liệu CN",
  "cao-su-rss3": "Nguyên Liệu CN", "bong-soi": "Nguyên Liệu CN",
  "duong": "Nguyên Liệu CN", "ngo": "Nông sản", "lua-mi": "Nông sản",
  "dau-tuong": "Nông sản", "dau-dau-tuong": "Nông sản",
  "kho-dau-tuong": "Nông sản", "gao": "Nông sản",
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr)
  const time = date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
  const day = date.getDate()
  const month = date.getMonth() + 1
  return `lúc ${time} ${day} tháng ${month}`
}

function SmallCard({ article }: { article: Article }) {
  const catSlug = article.categories?.slug || ""
  const groupSlug = article.product_groups?.slug || ""
  const catIcon = CATEGORY_ICONS[catSlug] || "📊"
  const thumbnail = CATEGORY_THUMBNAILS[catSlug] || CATEGORY_THUMBNAILS[groupSlug]
  const groupName = GROUP_MAP[catSlug] || "Hàng Hóa"

  return (
    <Link href={`/phan-tich/${article.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <div
        style={{
  padding: "14px 0",
  cursor: "pointer", height: "100%",
}}
        onMouseOver={(e) => (e.currentTarget.style.borderColor = "#00C389")}
        onMouseOut={(e) => (e.currentTarget.style.borderColor = "#e8ecef")}
      >
        {/* Thumbnail + tên sản phẩm */}
        <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "9px" }}>
          <div style={{
            width: "26px", height: "26px", borderRadius: "6px",
            background: "#f8fafc", border: "1px solid #e8ecef",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, overflow: "hidden",
          }}>
            {thumbnail
              ? <img src={thumbnail} alt="" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
              : <span style={{ fontSize: "13px" }}>{catIcon}</span>
            }
          </div>
          <span style={{ fontSize: "11px", color: "#64748b" }}>
            {article.categories?.name || "Hàng Hóa"}
          </span>
        </div>

        {/* Tiêu đề */}
        <h3 style={{
          fontSize: "13px", fontWeight: 600, color: "#0A1628",
          lineHeight: 1.5, marginBottom: "10px",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        } as React.CSSProperties}>{article.title}</h3>

        {/* Meta */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap", fontSize: "11px", color: "#94a3b8" }}>
          <span>{groupName}</span>
          <span style={{ color: "#cbd5e1" }}>·</span>
          <span>{article.categories?.name || "Hàng Hóa"}</span>
          <span style={{ color: "#cbd5e1" }}>·</span>
          <span>{article.published_at ? formatTime(article.published_at) : ""}</span>
          {article.is_hot && (
            <>
              <span style={{ color: "#cbd5e1" }}>·</span>
              <span style={{ background: "#FEE2E2", color: "#B91C1C", padding: "1px 6px", borderRadius: "3px", fontSize: "9px", fontWeight: 600 }}>🔥 Hot</span>
            </>
          )}
          {article.is_premium && (
            <>
              <span style={{ color: "#cbd5e1" }}>·</span>
              <span style={{ background: "#FEF3C7", color: "#92400E", padding: "1px 6px", borderRadius: "3px", fontSize: "9px", fontWeight: 600 }}>Premium</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function NewsSection() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("articles")
        .select("id, slug, title, published_at, is_hot, is_premium, categories(name, slug), product_groups(slug)")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(3)
      if (data) setArticles(data as Article[])
      setLoading(false)
    }
    fetchArticles()
  }, [])

  return (
    <section style={{ background: "#fff", padding: "72px 0" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 40px" }}>

        {/* Badge */}
        <p style={{
          fontSize: "11px", fontWeight: 600, color: "#00C389",
          textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px",
        }}>
          Tin tức
        </p>

        {/* Title */}
        <h2 style={{
          fontSize: "34px", fontWeight: 800, color: "#0A1628",
          letterSpacing: "-0.03em", lineHeight: 1.1, margin: "0 0 16px",
        }}>
          Bám sát thị trường với<br />tin tức mới nhất
        </h2>

        {/* CTA */}
        <Link href="/phan-tich" style={{
          display: "inline-flex", alignItems: "center", gap: "5px",
          fontSize: "13px", fontWeight: 600, color: "#00C389",
          textDecoration: "none", marginBottom: "40px",
        }}>
          Đọc tin tức thị trường →
        </Link>

        {/* Cards */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ border: "1px solid #e8ecef", borderRadius: "10px", padding: "14px" }}>
                <div style={{ height: "26px", width: "40%", background: "#f1f5f9", borderRadius: "4px", marginBottom: "9px" }} />
                <div style={{ height: "13px", background: "#f1f5f9", borderRadius: "4px", marginBottom: "6px" }} />
                <div style={{ height: "13px", background: "#f1f5f9", borderRadius: "4px", width: "70%", marginBottom: "6px" }} />
                <div style={{ height: "11px", width: "60%", background: "#f1f5f9", borderRadius: "4px", marginTop: "10px" }} />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="news-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}
          >
            {articles.map((a) => <SmallCard key={a.id} article={a} />)}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .news-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </section>
  )
}
