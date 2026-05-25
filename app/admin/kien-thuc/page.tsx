"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function KienThucPage() {
  const supabase = createClient()
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"all" | "published" | "draft">("all")
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [canDelete, setCanDelete] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single()
        setCanDelete(data?.role === "admin")
      }
      const { data: arts } = await supabase
        .from("knowledge_articles")
        .select("*, knowledge_categories(name, slug)")
        .order("created_at", { ascending: false })
      if (arts) setArticles(arts)
      setLoading(false)
    }
    init()
  }, [])

  const filtered = articles.filter((a) => {
    if (tab === "published") return a.status === "published"
    if (tab === "draft") return a.status === "draft"
    return true
  })

  const counts = {
    all: articles.length,
    published: articles.filter((a) => a.status === "published").length,
    draft: articles.filter((a) => a.status === "draft").length,
  }

  const handleDelete = async (id: string) => {
    setDeleting(true)
    await supabase.from("knowledge_articles").delete().eq("id", id)
    setArticles((prev) => prev.filter((a) => a.id !== id))
    setDeleting(false)
    setConfirmId(null)
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("vi-VN", { day: "numeric", month: "numeric", year: "numeric" })
  }

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", minHeight: "100vh", background: "#f8fafc" }}>
      <style>{`
        @media (max-width: 767px) {
          .kt-topbar  { padding: 12px 16px !important; }
          .kt-content { padding: 16px !important; }
          .kt-col-category, .kt-col-readtime { display: none !important; }
        }
      `}</style>

      {/* TOPBAR */}
      <div className="kt-topbar" style={{
        background: "#fff", borderBottom: "0.5px solid #e2e8f0",
        padding: "14px 28px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 40,
      }}>
        <div>
          <h1 style={{ fontSize: "16px", fontWeight: 600, color: "#0A1628" }}>Kiến thức nền tảng</h1>
          <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>Quản lý toàn bộ bài kiến thức</p>
        </div>
        <Link href="/admin/bai-viet/tao-moi" style={{
          display: "flex", alignItems: "center", gap: "6px",
          background: "#00C389", color: "#fff", fontSize: "13px", fontWeight: 500,
          padding: "8px 16px", borderRadius: "8px", textDecoration: "none",
        }}>
          <i className="ti ti-plus" style={{ fontSize: "14px" }} />
          Viết bài mới
        </Link>
      </div>

      <div className="kt-content" style={{ padding: "24px 28px" }}>
        {/* TABS */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          {([
            { key: "all", label: "Tất cả" },
            { key: "published", label: "Đã đăng" },
            { key: "draft", label: "Nháp" },
          ] as const).map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 500,
              cursor: "pointer", fontFamily: "inherit",
              background: tab === t.key ? "#0A1628" : "#fff",
              color: tab === t.key ? "#fff" : "#64748b",
              border: `0.5px solid ${tab === t.key ? "#0A1628" : "#e2e8f0"}`,
            }}>
              {t.label}
              <span style={{
                fontSize: "10px", fontWeight: 600,
                background: tab === t.key ? "rgba(255,255,255,0.2)" : "#f1f5f9",
                color: tab === t.key ? "#fff" : "#64748b",
                padding: "1px 6px", borderRadius: "10px",
              }}>{counts[t.key]}</span>
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div style={{ background: "#fff", borderRadius: "12px", border: "0.5px solid #e2e8f0", overflow: "hidden" }}>
          {/* Header */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 140px 110px 90px 140px",
            padding: "10px 16px", background: "#f8fafc", borderBottom: "0.5px solid #e2e8f0",
          }}>
            {["Tiêu đề", "Chủ đề", "Trạng thái", "Đọc", "Thao tác"].map((h) => (
              <div key={h} style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</div>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: "60px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>Đang tải...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📚</div>
              <p style={{ fontSize: "14px", color: "#64748b" }}>Chưa có bài kiến thức nào</p>
              <Link href="/admin/bai-viet/tao-moi" style={{ color: "#00C389", fontSize: "13px", fontWeight: 600 }}>
                Viết bài đầu tiên →
              </Link>
            </div>
          ) : (
            filtered.map((article, i) => (
              <div key={article.id} style={{
                display: "grid", gridTemplateColumns: "1fr 140px 110px 90px 140px",
                padding: "12px 16px", alignItems: "center",
                borderBottom: i < filtered.length - 1 ? "0.5px solid #f1f5f9" : "none",
                background: "transparent",
                transition: "background 0.1s",
              }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#fafafa")}
                onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {/* Title */}
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "#0A1628", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "320px" }}>
                    {article.title}
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                    {article.created_at ? formatDate(article.created_at) : ""}
                  </div>
                </div>

                {/* Chủ đề */}
                <div className="kt-col-category">
                  <span style={{ fontSize: "11px", fontWeight: 500, color: "#00C389" }}>
                    {article.knowledge_categories?.name || "—"}
                  </span>
                </div>

                {/* Trạng thái */}
                <div>
                  <span style={{
                    fontSize: "11px", fontWeight: 500, padding: "3px 10px", borderRadius: "20px",
                    background: article.status === "published" ? "#F0FDF4" : "#F8FAFC",
                    color: article.status === "published" ? "#15803D" : "#64748b",
                    border: `0.5px solid ${article.status === "published" ? "#BBF7D0" : "#e2e8f0"}`,
                  }}>
                    {article.status === "published" ? "Đã đăng" : "Nháp"}
                  </span>
                </div>

                {/* Thời gian đọc */}
                <div className="kt-col-readtime" style={{ fontSize: "13px", color: "#64748b" }}>
                  {article.read_time ? `${article.read_time} phút` : "—"}
                </div>

                {/* Thao tác */}
                <div>
                  {confirmId === article.id ? (
                    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                      <button onClick={() => handleDelete(article.id)} disabled={deleting} style={{
                        padding: "4px 8px", borderRadius: "5px",
                        background: "#DC2626", border: "none",
                        color: "#fff", fontSize: "11px", cursor: "pointer", fontFamily: "inherit",
                      }}>
                        {deleting ? "..." : "Xóa"}
                      </button>
                      <button onClick={() => setConfirmId(null)} style={{
                        padding: "4px 8px", borderRadius: "5px",
                        background: "#f1f5f9", border: "0.5px solid #e2e8f0",
                        color: "#64748b", fontSize: "11px", cursor: "pointer", fontFamily: "inherit",
                      }}>
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: "6px" }}>
                      <Link href={`/admin/bai-viet/${article.id}`} style={{
                        display: "flex", alignItems: "center", gap: "4px",
                        padding: "5px 10px", borderRadius: "6px",
                        background: "#f8fafc", border: "0.5px solid #e2e8f0",
                        color: "#64748b", textDecoration: "none", fontSize: "11px", fontWeight: 500,
                      }}>
                        <i className="ti ti-edit" style={{ fontSize: "12px" }} aria-hidden="true" /> Sửa
                      </Link>
                      {canDelete && (
                        <button onClick={() => setConfirmId(article.id)} style={{
                          display: "flex", alignItems: "center",
                          padding: "5px 8px", borderRadius: "6px",
                          background: "#FEF2F2", border: "0.5px solid #FECACA",
                          color: "#DC2626", cursor: "pointer", fontFamily: "inherit",
                        }}>
                          <i className="ti ti-trash" style={{ fontSize: "12px" }} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
