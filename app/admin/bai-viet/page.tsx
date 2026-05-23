import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import ArticleActions from "./ArticleActions"

export default async function AdminBaiVietPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const supabase = await createClient()
  const { status } = await searchParams

  let query = supabase
    .from("articles")
    .select(`
      id, title, slug, status, is_premium,
      view_count, read_time, published_at, created_at,
      categories(name, slug),
      profiles(full_name)
    `)
    .order("published_at", { ascending: false })

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  const { data: articles } = await query

  const { count: totalCount } = await supabase.from("articles").select("*", { count: "exact", head: true })
  const { count: publishedCount } = await supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "published")
  const { count: draftCount } = await supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "draft")

  const CATEGORY_COLORS: Record<string, string> = {
    "vang": "#EF9F27", "dau-tho": "#E24B4A", "ca-phe": "#BA7517",
    "dong": "#D85A30", "lua-mi": "#639922", "bac": "#888780", "khi-tu-nhien": "#378ADD",
  }

  const filters = [
    { label: "Tất cả", value: "all", count: totalCount || 0 },
    { label: "Đã đăng", value: "published", count: publishedCount || 0 },
    { label: "Nháp", value: "draft", count: draftCount || 0 },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <style>{`
        @media (max-width: 767px) {
          .bv-topbar   { padding: 12px 16px !important; }
          .bv-content  { padding: 16px !important; }
          .bv-btn-text { display: none !important; }

          /* Ẩn table header, hiện card */
          .bv-table-header { display: none !important; }
          .bv-table-row {
            display: flex !important;
            flex-direction: column !important;
            gap: 8px !important;
            padding: 14px 16px !important;
          }
          .bv-col-category,
          .bv-col-views,
          .bv-col-readtime { display: none !important; }
          .bv-col-title { max-width: 100% !important; }
          .bv-col-actions { justify-content: flex-start !important; }
          .bv-row-meta {
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
          }
        }
      `}</style>

      {/* TOPBAR */}
      <div className="bv-topbar" style={{
        background: "#fff", borderBottom: "0.5px solid #e2e8f0",
        padding: "14px 28px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 40,
      }}>
        <div>
          <h1 style={{ fontSize: "16px", fontWeight: 600, color: "#0A1628" }}>Bài phân tích</h1>
          <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>Quản lý toàn bộ bài viết</p>
        </div>
        <Link href="/admin/bai-viet/tao-moi" style={{
          display: "flex", alignItems: "center", gap: "6px",
          background: "#00C389", color: "#fff",
          fontSize: "13px", fontWeight: 500,
          padding: "8px 16px", borderRadius: "8px", textDecoration: "none",
        }}>
          <i className="ti ti-plus" style={{ fontSize: "14px" }} />
          <span className="bv-btn-text">Viết bài mới</span>
        </Link>
      </div>

      <div className="bv-content" style={{ padding: "24px 28px" }}>
        {/* FILTERS */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
          {filters.map((f) => {
            const isActive = (!status && f.value === "all") || status === f.value
            return (
              <Link key={f.value} href={f.value === "all" ? "/admin/bai-viet" : `/admin/bai-viet?status=${f.value}`} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 500,
                  background: isActive ? "#0A1628" : "#fff",
                  color: isActive ? "#fff" : "#64748b",
                  border: `0.5px solid ${isActive ? "#0A1628" : "#e2e8f0"}`,
                }}>
                  {f.label}
                  <span style={{
                    fontSize: "10px", fontWeight: 600,
                    background: isActive ? "rgba(255,255,255,0.2)" : "#f1f5f9",
                    color: isActive ? "#fff" : "#64748b",
                    padding: "1px 6px", borderRadius: "10px",
                  }}>{f.count}</span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* TABLE */}
        <div style={{ background: "#fff", borderRadius: "12px", border: "0.5px solid #e2e8f0", overflow: "hidden" }}>
          {/* Header — ẩn trên mobile */}
          <div className="bv-table-header" style={{
            display: "grid",
            gridTemplateColumns: "1fr 120px 100px 80px 80px 130px",
            padding: "10px 16px",
            background: "#f8fafc",
            borderBottom: "0.5px solid #e2e8f0",
          }}>
            {["Tiêu đề", "Danh mục", "Trạng thái", "Lượt xem", "Đọc", "Thao tác"].map((h) => (
              <div key={h} style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</div>
            ))}
          </div>

          {!articles || articles.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📝</div>
              <p style={{ fontSize: "14px", color: "#64748b" }}>Chưa có bài viết nào</p>
              <Link href="/admin/bai-viet/tao-moi" style={{
                display: "inline-block", marginTop: "12px",
                background: "#00C389", color: "#fff",
                fontSize: "13px", padding: "8px 16px",
                borderRadius: "8px", textDecoration: "none",
              }}>Viết bài đầu tiên →</Link>
            </div>
          ) : (
            articles.map((article: any, i: number) => (
              <div key={article.id} className="bv-table-row" style={{
                display: "grid",
                gridTemplateColumns: "1fr 120px 100px 80px 80px 130px",
                padding: "12px 16px",
                borderBottom: i < articles.length - 1 ? "0.5px solid #f1f5f9" : "none",
                alignItems: "center",
              }}>
                {/* Title */}
                <div className="bv-col-title">
                  <div style={{
                    fontSize: "13px", fontWeight: 500, color: "#0A1628",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    maxWidth: "320px",
                  }}>{article.title}</div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                    {article.profiles?.full_name || "BAMBOO100"} · {
                      article.published_at
                        ? new Date(article.published_at).toLocaleDateString("vi-VN")
                        : new Date(article.created_at).toLocaleDateString("vi-VN")
                    }
                    {article.is_premium && (
                      <span style={{
                        marginLeft: "6px", background: "#FEF3C7", color: "#92400E",
                        fontSize: "9px", fontWeight: 600, padding: "1px 5px", borderRadius: "3px",
                      }}>PREMIUM</span>
                    )}
                  </div>
                  {/* Meta chỉ hiện trên mobile */}
                  <div className="bv-row-meta" style={{ display: "none", marginTop: "6px" }}>
                    {article.categories && (
                      <span style={{
                        fontSize: "11px", fontWeight: 500,
                        color: CATEGORY_COLORS[article.categories.slug] || "#64748b",
                      }}>{article.categories.name}</span>
                    )}
                    <span style={{
                      fontSize: "11px", fontWeight: 500, padding: "2px 8px",
                      borderRadius: "20px",
                      background: article.status === "published" ? "#F0FDF4" : "#F8FAFC",
                      color: article.status === "published" ? "#15803D" : "#64748b",
                      border: `0.5px solid ${article.status === "published" ? "#BBF7D0" : "#e2e8f0"}`,
                    }}>
                      {article.status === "published" ? "Đã đăng" : "Nháp"}
                    </span>
                  </div>
                </div>

                {/* Category — ẩn mobile */}
                <div className="bv-col-category">
                  {article.categories && (
                    <span style={{ fontSize: "11px", fontWeight: 500, color: CATEGORY_COLORS[article.categories.slug] || "#64748b" }}>
                      {article.categories.name}
                    </span>
                  )}
                </div>

                {/* Status — ẩn mobile */}
                <div className="bv-col-category">
                  <span style={{
                    fontSize: "11px", fontWeight: 500, padding: "3px 10px", borderRadius: "20px",
                    background: article.status === "published" ? "#F0FDF4" : "#F8FAFC",
                    color: article.status === "published" ? "#15803D" : "#64748b",
                    border: `0.5px solid ${article.status === "published" ? "#BBF7D0" : "#e2e8f0"}`,
                  }}>
                    {article.status === "published" ? "Đã đăng" : "Nháp"}
                  </span>
                </div>

                {/* Views — ẩn mobile */}
                <div className="bv-col-views" style={{ fontSize: "13px", color: "#64748b" }}>
                  {article.view_count || 0}
                </div>

                {/* Read time — ẩn mobile */}
                <div className="bv-col-readtime" style={{ fontSize: "13px", color: "#64748b" }}>
                  {article.read_time ? `${article.read_time} phút` : "—"}
                </div>

                {/* Actions */}
                <div className="bv-col-actions">
                  <ArticleActions articleId={article.id} articleSlug={article.slug} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
