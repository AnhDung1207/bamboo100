import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: totalLeads },
    { count: newLeads },
    { count: totalArticles },
    { count: totalUsers },
    { data: recentLeads },
    { data: recentArticles },
  ] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("articles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("id, full_name, phone, source, status, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("articles").select("id, title, slug, status, read_time, published_at, categories(name, slug)").order("created_at", { ascending: false }).limit(5),
  ])

  const stats = [
    { label: "Tổng lead", value: totalLeads || 0, sub: "Tất cả thời gian", color: "#00C389" },
    { label: "Lead mới", value: newLeads || 0, sub: "Chưa xử lý", color: "#EF9F27" },
    { label: "Bài đã đăng", value: totalArticles || 0, sub: "Tất cả bài viết", color: "#378ADD" },
    { label: "Người dùng", value: totalUsers || 0, sub: "Đã đăng ký", color: "#8B5CF6" },
  ]

  const STATUS_LABELS: Record<string, { label: string; bg: string; color: string }> = {
    new: { label: "Mới", bg: "#EFF6FF", color: "#1D4ED8" },
    processing: { label: "Đang xử lý", bg: "#FFFBEB", color: "#B45309" },
    converted: { label: "Đã chốt", bg: "#F0FDF4", color: "#15803D" },
    closed: { label: "Đóng", bg: "#F9FAFB", color: "#6B7280" },
  }

  const SOURCE_LABELS: Record<string, string> = {
    homepage: "Trang chủ",
    contact: "Liên hệ",
    article: "Bài viết",
    ebook: "Ebook",
    course: "Khóa học",
  }

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      {/* TOPBAR */}
      <div style={{
        background: "#fff", borderBottom: "0.5px solid #e2e8f0",
        padding: "14px 28px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 40,
      }}>
        <div>
          <h1 style={{ fontSize: "16px", fontWeight: 600, color: "#0A1628" }}>Dashboard</h1>
          <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
            {new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <Link href="/admin/bai-viet/tao-moi" style={{
          display: "flex", alignItems: "center", gap: "6px",
          background: "#00C389", color: "#fff",
          fontSize: "13px", fontWeight: 500,
          padding: "8px 16px", borderRadius: "8px", textDecoration: "none",
        }}>
          <i className="ti ti-plus" style={{ fontSize: "14px" }} aria-hidden="true"></i>
          Viết bài mới
        </Link>
      </div>

      <div style={{ padding: "24px 28px" }}>
        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
          {stats.map((s) => (
            <div key={s.label} style={{
              background: "#fff", borderRadius: "12px",
              border: "0.5px solid #e2e8f0", padding: "16px 20px",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ fontSize: "12px", color: "#64748b" }}>{s.label}</span>
                <div style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: s.color,
                }} />
              </div>
              <div style={{ fontSize: "28px", fontWeight: 700, color: "#0A1628" }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* 2 COLUMNS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

          {/* LEADS */}
          <div style={{ background: "#fff", borderRadius: "12px", border: "0.5px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{
              padding: "14px 20px", borderBottom: "0.5px solid #e2e8f0",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <i className="ti ti-users" style={{ fontSize: "15px", color: "#64748b" }} aria-hidden="true"></i>
                <span style={{ fontSize: "14px", fontWeight: 500, color: "#0A1628" }}>Lead mới nhất</span>
              </div>
              <Link href="/admin/leads" style={{ fontSize: "12px", color: "#00C389", textDecoration: "none" }}>
                Xem tất cả →
              </Link>
            </div>

            {!recentLeads || recentLeads.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
                Chưa có lead nào
              </div>
            ) : (
              recentLeads.map((lead: any) => {
                const st = STATUS_LABELS[lead.status] || STATUS_LABELS.new
                return (
                  <div key={lead.id} style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "12px 20px", borderBottom: "0.5px solid #f1f5f9",
                  }}>
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "50%",
                      background: "#EFF6FF", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: "12px", fontWeight: 600,
                      color: "#1D4ED8", flexShrink: 0,
                    }}>
                      {lead.full_name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "13px", fontWeight: 500, color: "#0A1628" }}>{lead.full_name}</div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                        {lead.phone} · {SOURCE_LABELS[lead.source] || lead.source}
                      </div>
                    </div>
                    <span style={{
                      fontSize: "10px", fontWeight: 500, padding: "3px 8px",
                      borderRadius: "20px", background: st.bg, color: st.color,
                      whiteSpace: "nowrap",
                    }}>{st.label}</span>
                  </div>
                )
              })
            )}
          </div>

          {/* ARTICLES */}
          <div style={{ background: "#fff", borderRadius: "12px", border: "0.5px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{
              padding: "14px 20px", borderBottom: "0.5px solid #e2e8f0",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <i className="ti ti-file-text" style={{ fontSize: "15px", color: "#64748b" }} aria-hidden="true"></i>
                <span style={{ fontSize: "14px", fontWeight: 500, color: "#0A1628" }}>Bài viết gần đây</span>
              </div>
              <Link href="/admin/bai-viet" style={{ fontSize: "12px", color: "#00C389", textDecoration: "none" }}>
                Quản lý →
              </Link>
            </div>

            {!recentArticles || recentArticles.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
                Chưa có bài viết nào
              </div>
            ) : (
              recentArticles.map((article: any) => (
                <div key={article.id} style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "12px 20px", borderBottom: "0.5px solid #f1f5f9",
                }}>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "6px",
                    background: "#0A1628", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "14px", flexShrink: 0,
                  }}>
                    {(article.categories as any)?.slug === "vang" ? "🥇" :
                     (article.categories as any)?.slug === "dau-tho" ? "⛽" :
                     (article.categories as any)?.slug === "ca-phe" ? "☕" : "📊"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: "13px", fontWeight: 500, color: "#0A1628",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>{article.title}</div>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                      {(article.categories as any)?.name} · {article.read_time} phút đọc
                    </div>
                  </div>
                  <span style={{
                    fontSize: "10px", fontWeight: 500, padding: "3px 8px",
                    borderRadius: "20px", whiteSpace: "nowrap",
                    background: article.status === "published" ? "#F0FDF4" : "#F8FAFC",
                    color: article.status === "published" ? "#15803D" : "#64748b",
                    border: `0.5px solid ${article.status === "published" ? "#BBF7D0" : "#e2e8f0"}`,
                  }}>
                    {article.status === "published" ? "Đã đăng" : "Nháp"}
                  </span>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <Link href={`/admin/bai-viet/${article.id}`} style={{
                      width: "26px", height: "26px", borderRadius: "5px",
                      background: "#f8fafc", border: "0.5px solid #e2e8f0",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#64748b", textDecoration: "none", fontSize: "12px",
                    }}>
                      <i className="ti ti-edit" aria-hidden="true"></i>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
