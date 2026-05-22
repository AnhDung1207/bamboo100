"use client"

import Link from "next/link"

const CATEGORY_COLORS: Record<string, string> = {
  "vang": "#EF9F27",
  "dau-tho": "#E24B4A",
  "ca-phe": "#BA7517",
  "dong": "#D85A30",
  "lua-mi": "#639922",
  "bac": "#888780",
  "khi-tu-nhien": "#378ADD",
}

export default function ArticleGrid({ articles }: { articles: any[] }) {
  if (!articles || articles.length === 0) {
    return (
      <div style={{
        textAlign: "center", padding: "80px 20px",
        background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0",
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

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "20px",
    }}>
      {articles.map((article: any) => (
        <Link key={article.id} href={`/phan-tich/${article.slug}`} style={{ textDecoration: "none" }}>
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              overflow: "hidden",
              transition: "border-color 0.15s, transform 0.15s, box-shadow 0.15s",
              cursor: "pointer",
            }}
            onMouseOver={(e) => {
              const el = e.currentTarget
              el.style.borderColor = "#00C389"
              el.style.transform = "translateY(-3px)"
              el.style.boxShadow = "0 8px 24px rgba(0,195,137,0.1)"
            }}
            onMouseOut={(e) => {
              const el = e.currentTarget
              el.style.borderColor = "#e2e8f0"
              el.style.transform = "translateY(0)"
              el.style.boxShadow = "none"
            }}
          >
            {/* Thumbnail */}
            <div style={{
              height: "140px",
              background: article.thumbnail_url
                ? `url(${article.thumbnail_url}) center/cover`
                : "#0A1628",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
            }}>
              {!article.thumbnail_url && (
                <span style={{ fontSize: "40px" }}>📊</span>
              )}
              {article.is_premium && (
                <div style={{
                  position: "absolute", top: "10px", right: "10px",
                  background: "#EF9F27", color: "#fff",
                  fontSize: "9px", fontWeight: 700,
                  padding: "3px 8px", borderRadius: "4px",
                  letterSpacing: "0.05em",
                }}>PREMIUM</div>
              )}
            </div>

            {/* Body */}
            <div style={{ padding: "16px" }}>
              {article.categories && (
                <div style={{
                  fontSize: "10px", fontWeight: 600,
                  color: CATEGORY_COLORS[article.categories.slug] || "#00C389",
                  textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px",
                }}>{article.categories.name}</div>
              )}
              <h3 style={{
                fontSize: "14px", fontWeight: 600, color: "#0A1628",
                lineHeight: 1.5, marginBottom: "8px",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              } as any}>{article.title}</h3>
              {article.excerpt && (
                <p style={{
                  fontSize: "12px", color: "#64748b", lineHeight: 1.6,
                  marginBottom: "12px",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                } as any}>{article.excerpt}</p>
              )}
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "10px", borderTop: "1px solid #f1f5f9",
                fontSize: "11px", color: "#94a3b8",
              }}>
                <span>{article.profiles?.full_name || "BAMBOO100"}</span>
                <div style={{ display: "flex", gap: "10px" }}>
                  {article.read_time && <span>⏱ {article.read_time} phút</span>}
                  <span>👁 {article.view_count}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
