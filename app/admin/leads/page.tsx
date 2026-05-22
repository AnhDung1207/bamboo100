import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import LeadActions from "./LeadActions"

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const supabase = await createClient()
  const { status } = await searchParams

  let query = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  const { data: leads } = await query

  const { count: totalCount } = await supabase.from("leads").select("*", { count: "exact", head: true })
  const { count: newCount } = await supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "new")
  const { count: processingCount } = await supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "processing")
  const { count: convertedCount } = await supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "converted")

  const filters = [
    { label: "Tất cả", value: "all", count: totalCount || 0 },
    { label: "Mới", value: "new", count: newCount || 0 },
    { label: "Đang xử lý", value: "processing", count: processingCount || 0 },
    { label: "Đã chốt", value: "converted", count: convertedCount || 0 },
  ]

  const STATUS_STYLES: Record<string, { label: string; bg: string; color: string; border: string }> = {
    new:        { label: "Mới",          bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" },
    processing: { label: "Đang xử lý",  bg: "#FFFBEB", color: "#B45309", border: "#FDE68A" },
    converted:  { label: "Đã chốt",     bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
    closed:     { label: "Đóng",        bg: "#F9FAFB", color: "#6B7280", border: "#E5E7EB" },
  }

  const SOURCE_LABELS: Record<string, string> = {
    homepage: "Trang chủ",
    contact:  "Liên hệ",
    article:  "Bài viết",
    ebook:    "Ebook",
    course:   "Khóa học",
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
          <h1 style={{ fontSize: "16px", fontWeight: 600, color: "#0A1628" }}>Quản lý Lead</h1>
          <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
            Danh sách khách hàng tiềm năng
          </p>
        </div>
        <a
          href={`data:text/csv;charset=utf-8,${encodeURIComponent(
            ["Họ tên,Email,SĐT,Nguồn,Trạng thái,Ngày tạo"]
              .concat((leads || []).map((l: any) =>
                `"${l.full_name}","${l.email || ""}","${l.phone || ""}","${SOURCE_LABELS[l.source] || l.source}","${STATUS_STYLES[l.status]?.label || l.status}","${new Date(l.created_at).toLocaleDateString("vi-VN")}"`
              ))
              .join("\n")
          )}`}
          download="leads-bamboo100.csv"
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "#f8fafc", color: "#64748b",
            fontSize: "13px", fontWeight: 500,
            padding: "8px 16px", borderRadius: "8px", textDecoration: "none",
            border: "0.5px solid #e2e8f0",
          }}
        >
          <i className="ti ti-download" style={{ fontSize: "14px" }} aria-hidden="true"></i>
          Xuất CSV
        </a>
      </div>

      <div style={{ padding: "24px 28px" }}>
        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "20px" }}>
          {filters.map((f) => (
            <div key={f.value} style={{
              background: "#fff", borderRadius: "12px",
              border: "0.5px solid #e2e8f0", padding: "16px 20px",
            }}>
              <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>{f.label}</div>
              <div style={{ fontSize: "28px", fontWeight: 700, color: "#0A1628" }}>{f.count}</div>
            </div>
          ))}
        </div>

        {/* FILTERS */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          {filters.map((f) => {
            const isActive = (!status && f.value === "all") || status === f.value
            return (
              <Link key={f.value} href={f.value === "all" ? "/admin/leads" : `/admin/leads?status=${f.value}`} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 500,
                  background: isActive ? "#0A1628" : "#fff",
                  color: isActive ? "#fff" : "#64748b",
                  border: `0.5px solid ${isActive ? "#0A1628" : "#e2e8f0"}`,
                  cursor: "pointer",
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
        <div style={{
          background: "#fff", borderRadius: "12px",
          border: "0.5px solid #e2e8f0", overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 140px 130px 100px 120px 130px 120px",
            padding: "10px 20px",
            borderBottom: "0.5px solid #e2e8f0",
            background: "#f8fafc",
          }}>
            {["Khách hàng", "SĐT", "Email", "Nguồn", "Trạng thái", "Ngày tạo", "Thao tác"].map((h) => (
              <div key={h} style={{
                fontSize: "11px", fontWeight: 600, color: "#64748b",
                textTransform: "uppercase", letterSpacing: "0.05em",
              }}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          {!leads || leads.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📋</div>
              <p style={{ fontSize: "14px", color: "#64748b" }}>Chưa có lead nào</p>
            </div>
          ) : (
            leads.map((lead: any, i: number) => {
              const st = STATUS_STYLES[lead.status] || STATUS_STYLES.new
              return (
                <div key={lead.id} style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 140px 130px 100px 120px 130px 120px",
                  padding: "14px 20px",
                  borderBottom: i < leads.length - 1 ? "0.5px solid #f1f5f9" : "none",
                  alignItems: "center",
                }}>
                  {/* Khách hàng */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "50%",
                      background: "#EFF6FF", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: "12px", fontWeight: 600,
                      color: "#1D4ED8", flexShrink: 0,
                    }}>
                      {lead.full_name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 500, color: "#0A1628" }}>
                        {lead.full_name}
                      </div>
                      {lead.message && (
                        <div style={{
                          fontSize: "11px", color: "#94a3b8",
                          whiteSpace: "nowrap", overflow: "hidden",
                          textOverflow: "ellipsis", maxWidth: "200px",
                        }}>{lead.message}</div>
                      )}
                    </div>
                  </div>

                  {/* SĐT */}
                  <div style={{ fontSize: "13px", color: "#334155" }}>
                    {lead.phone || "—"}
                  </div>

                  {/* Email */}
                  <div style={{
                    fontSize: "12px", color: "#64748b",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {lead.email || "—"}
                  </div>

                  {/* Nguồn */}
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    {SOURCE_LABELS[lead.source] || lead.source}
                  </div>

                  {/* Trạng thái */}
                  <div>
                    <span style={{
                      fontSize: "11px", fontWeight: 500, padding: "3px 10px",
                      borderRadius: "20px", background: st.bg,
                      color: st.color, border: `0.5px solid ${st.border}`,
                    }}>{st.label}</span>
                  </div>

                  {/* Ngày tạo */}
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    {new Date(lead.created_at).toLocaleDateString("vi-VN")}
                  </div>

                  {/* Thao tác */}
                  <LeadActions leadId={lead.id} currentStatus={lead.status} />
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
