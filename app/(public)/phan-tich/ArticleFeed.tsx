"use client"

import { useState } from "react"
import Link from "next/link"

const CATEGORY_COLORS: Record<string, string> = {
  "vang": "#EF9F27",
  "bac": "#888780",
  "dong": "#D85A30",
  "bach-kim": "#6B7280",
  "quang-sat": "#8B4513",
  "dau-tho-wti": "#E24B4A",
  "dau-tho-brent": "#CC3333",
  "dau-wti-mini": "#E24B4A",
  "khi-tu-nhien": "#378ADD",
  "xang-rbob": "#FF6B35",
  "dau-it-luu-huynh": "#DD4444",
  "ca-phe-arabica": "#BA7517",
  "ca-phe-robusta": "#6B3A2A",
  "cacao": "#7B3F00",
  "cao-su-tsr20": "#4A5240",
  "cao-su-rss3": "#5A6240",
  "bong-soi": "#E8E8D0",
  "duong": "#F5DEB3",
  "ngo": "#FFD700",
  "lua-mi": "#639922",
  "dau-tuong": "#B8860B",
  "dau-dau-tuong": "#C8860A",
  "kho-dau-tuong": "#D4A017",
  "gao": "#F5E6C8",
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
  "vang": "🥇",
  "bac": "🥈",
  "dong": "🔶",
  "bach-kim": "💎",
  "quang-sat": "⛏️",
  "dau-tho-wti": "🛢️",
  "dau-tho-brent": "🛢️",
  "dau-wti-mini": "🛢️",
  "dau-it-luu-huynh": "🛢️",
  "khi-tu-nhien": "💨",
  "xang-rbob": "⛽",
  "ca-phe-arabica": "☕",
  "ca-phe-robusta": "☕",
  "cacao": "🍫",
  "cao-su-tsr20": "🌿",
  "cao-su-rss3": "🌿",
  "bong-soi": "🌱",
  "duong": "🍬",
  "ngo": "🌽",
  "lua-mi": "🌾",
  "dau-tuong": "🫘",
  "dau-dau-tuong": "🫘",
  "kho-dau-tuong": "🫘",
  "gao": "🌾",
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) return "Hôm nay"
  if (date.toDateString() === yesterday.toDateString()) return "Hôm qua"
  return date.toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" })
}

function groupByDate(articles: any[]) {
  const groups: Record<string, any[]> = {}
  articles.forEach((a) => {
    const dateKey = a.published_at ? formatDate(a.published_at) : "Hôm nay"
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(a)
  })
  return groups
}

function FeaturedCard({ article }: { article: any }) {
  const catSlug = article.categories?.slug || ""
  const catColor = CATEGORY_COLORS[catSlug] || "#00C389"
  const groupSlug = article.product_groups?.slug || ""
const thumbnail = CATEGORY_THUMBNAILS[catSlug] || CATEGORY_THUMBNAILS[groupSlug]
  const hasBgImage = !!article.thumbnail_url

  // Map slug sản phẩm → nhóm ngành
  const GROUP_MAP: Record<string, string> = {
    "vang": "Kim Loại", "bac": "Kim Loại", "dong": "Kim Loại",
    "bach-kim": "Kim Loại", "quang-sat": "Kim Loại",
    "dau-tho-wti": "Năng Lượng", "dau-tho-brent": "Năng Lượng",
    "dau-wti-mini": "Năng Lượng", "khi-tu-nhien": "Năng Lượng",
    "xang-rbob": "Năng Lượng", "dau-it-luu-huynh": "Năng Lượng",
    "ca-phe-arabica": "Nguyên Liệu Công Nghiệp",
    "ca-phe-robusta": "Nguyên Liệu Công Nghiệp",
    "cacao": "Nguyên Liệu Công Nghiệp",
    "cao-su-tsr20": "Nguyên Liệu Công Nghiệp",
    "cao-su-rss3": "Nguyên Liệu Công Nghiệp",
    "bong-soi": "Nguyên Liệu Công Nghiệp",
    "duong": "Nguyên Liệu Công Nghiệp",
    "ngo": "Nông sản", "lua-mi": "Nông sản", "dau-tuong": "Nông sản",
    "dau-dau-tuong": "Nông sản", "kho-dau-tuong": "Nông sản", "gao": "Nông sản",
  }
  const groupName = GROUP_MAP[catSlug] || "Hàng Hóa"

  return (
    <Link href={`/phan-tich/${article.slug}`} style={{ textDecoration: "none", display: "block" }}>
      <div style={{
        borderRadius: "12px", overflow: "hidden", position: "relative",
        minHeight: "220px", cursor: "pointer",
        background: hasBgImage ? `url(${article.thumbnail_url}) center/cover` : "#0A1628",
      }}>
        {/* Overlay tối sâu nửa trái */}
        <div style={{
          position: "absolute", inset: 0,
          background: hasBgImage
            ? "linear-gradient(to right, rgba(10,22,40,1) 0%, rgba(10,22,40,0.98) 38%, rgba(10,22,40,0.65) 58%, rgba(10,22,40,0.05) 100%)"
            : "linear-gradient(to right, rgba(10,22,40,1) 0%, rgba(10,22,40,0.98) 40%, rgba(10,22,40,0.3) 75%, rgba(10,22,40,0.05) 100%)",
        }} />

        {/* Nền màu category bên phải khi không có ảnh */}
        {!hasBgImage && (
          <div style={{
            position: "absolute", right: 0, top: 0,
            width: "50%", height: "100%",
            background: `${catColor}22`,
          }} />
        )}

        {/* Nội dung căn giữa dọc */}
        <div style={{
          position: "relative", zIndex: 2,
          width: "62%", height: "100%", minHeight: "220px",
          padding: "0 28px",
          display: "flex", flexDirection: "column",
          justifyContent: "center", gap: "12px",
        }}>
          {/* Dòng 1: thumbnail icon + tên sản phẩm */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "6px",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden", flexShrink: 0,
            }}>
              {thumbnail
                ? <img src={thumbnail} alt="" style={{ width: "22px", height: "22px", objectFit: "contain" }} />
                : <span style={{ fontSize: "14px" }}>📊</span>
              }
            </div>
            <span style={{ fontSize: "12px", fontWeight: 400, color: "rgba(255,255,255,0.8)" }}>
              {article.categories?.name || "Hàng Hóa"}
            </span>
          </div>

          {/* Dòng 2: Tiêu đề */}
          <h2 style={{
            color: "#fff", fontSize: "18px", fontWeight: 700,
            lineHeight: 1.45, margin: 0,
          }}>{article.title}</h2>

          {/* Dòng 3: Nhóm ngành · Tên SP · Giờ · Hot · Premium */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
            <span>{groupName}</span>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>·</span>
            <span>{article.categories?.name || "Hàng Hóa"}</span>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>·</span>
            <span>{article.published_at ? formatTime(article.published_at) : ""}</span>
            {article.is_hot && (
              <>
                <span style={{ color: "rgba(255,255,255,0.25)" }}>·</span>
                <span style={{ background: "rgba(226,75,74,0.25)", color: "#E24B4A", padding: "1px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: 600 }}>🔥 Hot</span>
              </>
            )}
            {article.is_premium && (
              <>
                <span style={{ color: "rgba(255,255,255,0.25)" }}>·</span>
                <span style={{ background: "rgba(239,159,39,0.2)", color: "#EF9F27", padding: "1px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: 600 }}>Premium</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

function SmallCard({ article }: { article: any }) {
  const catSlug = article.categories?.slug || ""
  const catIcon = CATEGORY_ICONS[catSlug] || "📊"
  const groupSlug = article.product_groups?.slug || ""
const thumbnail = CATEGORY_THUMBNAILS[catSlug] || CATEGORY_THUMBNAILS[groupSlug]

  const GROUP_MAP: Record<string, string> = {
    "vang": "Kim Loại", "bac": "Kim Loại", "dong": "Kim Loại",
    "bach-kim": "Kim Loại", "quang-sat": "Kim Loại",
    "dau-tho-wti": "Năng Lượng", "dau-tho-brent": "Năng Lượng",
    "dau-wti-mini": "Năng Lượng", "khi-tu-nhien": "Năng Lượng",
    "xang-rbob": "Năng Lượng", "dau-it-luu-huynh": "Năng Lượng",
    "ca-phe-arabica": "Nguyên Liệu Công Nghiệp",
    "ca-phe-robusta": "Nguyên Liệu Công Nghiệp",
    "cacao": "Nguyên Liệu Công Nghiệp",
    "cao-su-tsr20": "Nguyên Liệu Công Nghiệp",
    "cao-su-rss3": "Nguyên Liệu Công Nghiệp",
    "bong-soi": "Nguyên Liệu Công Nghiệp",
    "duong": "Nguyên Liệu Công Nghiệp",
    "ngo": "Nông sản", "lua-mi": "Nông sản", "dau-tuong": "Nông sản",
    "dau-dau-tuong": "Nông sản", "kho-dau-tuong": "Nông sản", "gao": "Nông sản",
  }
  const groupName = GROUP_MAP[catSlug] || "Hàng Hóa"

  return (
    <Link href={`/phan-tich/${article.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <div
        style={{
          background: "#fff", border: "1px solid #e8ecef",
          borderRadius: "10px", padding: "14px",
          cursor: "pointer", height: "100%",
        }}
        onMouseOver={(e) => (e.currentTarget.style.borderColor = "#00C389")}
        onMouseOut={(e) => (e.currentTarget.style.borderColor = "#e8ecef")}
      >
        {/* Dòng 1: thumbnail nhỏ + tên sản phẩm */}
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
          <span style={{ fontSize: "11px", fontWeight: 400, color: "#64748b" }}>
            {article.categories?.name || "Hàng Hóa"}
          </span>
        </div>

        {/* Dòng 2: Tiêu đề đậm, nổi bật */}
        <h3 style={{
          fontSize: "13px", fontWeight: 600, color: "#0A1628",
          lineHeight: 1.5, marginBottom: "10px",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        } as any}>{article.title}</h3>

        {/* Dòng 3: Nhóm ngành · Tên SP · Giờ · Badge */}
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

export default function ArticleFeed({ articles }: { articles: any[] }) {
  const [visibleDays, setVisibleDays] = useState(3) // ← thêm state

  if (!articles || articles.length === 0) {
    return (
      <div style={{
        textAlign: "center", padding: "80px 20px",
        background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
        <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#0A1628", marginBottom: "8px" }}>
          Chưa có bài phân tích nào
        </h3>
        <p style={{ fontSize: "13px", color: "#64748b" }}>
          Bài phân tích sẽ được cập nhật sớm. Hãy quay lại sau!
        </p>
      </div>
    )
  }

  const grouped = groupByDate(articles)
  const allEntries = Object.entries(grouped)
  const visibleEntries = allEntries.slice(0, visibleDays) // ← chỉ lấy số ngày cần hiện
  const hasMore = allEntries.length > visibleDays // ← còn ngày chưa hiện không

  return (
    <div>
      {visibleEntries.map(([dateLabel, dayArticles]) => {
        const featured = dayArticles[0]
        const rest = dayArticles.slice(1)
        const firstRow = rest.slice(0, 3)
        const remaining = rest.slice(3)

        return (
          <div key={dateLabel} style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 400, color: "#0A1628", marginBottom: "16px" }}>{dateLabel}</h2>
            <div style={{ marginBottom: "16px" }}>
              <FeaturedCard article={featured} />
            </div>
            {firstRow.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${firstRow.length}, 1fr)`, gap: "20px", marginBottom: "8px" }}>
                {firstRow.map((article) => <SmallCard key={article.id} article={article} />)}
              </div>
            )}
            {remaining.length > 0 && (
              <>
                <div style={{ marginBottom: "16px", marginTop: "16px" }}>
                  <FeaturedCard article={remaining[0]} />
                </div>
                {remaining.slice(1).length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(remaining.slice(1).length, 3)}, 1fr)`, gap: "20px" }}>
                    {remaining.slice(1, 4).map((article) => <SmallCard key={article.id} article={article} />)}
                  </div>
                )}
              </>
            )}
          </div>
        )
      })}

      {/* Load more */}
      <div style={{ textAlign: "center", paddingTop: "16px" }}>
        {hasMore ? (
          <button
            onClick={() => setVisibleDays((prev) => prev + 3)} // ← hiện thêm 3 ngày
            style={{ background: "#fff", color: "#0A1628", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "10px 28px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
            Các tin tức khác →
          </button>
        ) : (
          <p style={{ fontSize: "12px", color: "#94a3b8" }}>Đã hiển thị tất cả bài viết</p>
        )}
      </div>
    </div>
  )
}