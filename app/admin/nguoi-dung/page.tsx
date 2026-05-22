import { createClient } from "@/lib/supabase/server"
import UserActions from "./UserActions"

export default async function AdminNguoiDungPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; search?: string }>
}) {
  const supabase = await createClient()
  const { role, search } = await searchParams

  let query = supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })

  if (role && role !== "all") {
    query = query.eq("role", role)
  }

  if (search) {
    query = query.ilike("full_name", `%${search}%`)
  }

  const { data: users } = await query

  const { count: totalCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })
  const { count: adminCount } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "admin")
  const { count: editorCount } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "editor")
  const { count: memberCount } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "member")

  const filters = [
    { label: "Tất cả", value: "all", count: totalCount || 0 },
    { label: "Admin", value: "admin", count: adminCount || 0 },
    { label: "Editor", value: "editor", count: editorCount || 0 },
    { label: "Member", value: "member", count: memberCount || 0 },
  ]

  const ROLE_STYLES: Record<string, { label: string; bg: string; color: string; border: string }> = {
    admin:  { label: "Admin",  bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
    editor: { label: "Editor", bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" },
    member: { label: "Member", bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
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
          <h1 style={{ fontSize: "16px", fontWeight: 600, color: "#0A1628" }}>Người dùng</h1>
          <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
            Quản lý tài khoản &amp; phân quyền
          </p>
        </div>
        {/* Search */}
        <form method="GET" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {role && <input type="hidden" name="role" value={role} />}
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            border: "0.5px solid #e2e8f0", borderRadius: "8px",
            padding: "7px 12px", background: "#f8fafc",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              name="search"
              defaultValue={search || ""}
              placeholder="Tìm theo tên..."
              style={{ border: "none", outline: "none", fontSize: "13px", background: "transparent", width: "180px", color: "#0A1628" }}
            />
          </div>
        </form>
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
            const isActive = (!role && f.value === "all") || role === f.value
            return (
              <a key={f.value} href={f.value === "all" ? "/admin/nguoi-dung" : `/admin/nguoi-dung?role=${f.value}`} style={{ textDecoration: "none" }}>
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
              </a>
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
            gridTemplateColumns: "1fr 180px 160px 100px 130px 150px",
            padding: "10px 20px",
            borderBottom: "0.5px solid #e2e8f0",
            background: "#f8fafc",
          }}>
            {["Người dùng", "Email", "SĐT", "Quyền", "Ngày tạo", "Thao tác"].map((h) => (
              <div key={h} style={{
                fontSize: "11px", fontWeight: 600, color: "#64748b",
                textTransform: "uppercase", letterSpacing: "0.05em",
              }}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          {!users || users.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>👥</div>
              <p style={{ fontSize: "14px", color: "#64748b" }}>Chưa có người dùng nào</p>
            </div>
          ) : (
            users.map((user: any, i: number) => {
              const roleSt = ROLE_STYLES[user.role] || ROLE_STYLES.member
              return (
                <div key={user.id} style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 180px 160px 100px 130px 150px",
                  padding: "14px 20px",
                  borderBottom: i < users.length - 1 ? "0.5px solid #f1f5f9" : "none",
                  alignItems: "center",
                }}>
                  {/* User */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "34px", height: "34px", borderRadius: "50%",
                      background: user.role === "admin" ? "#FEF2F2" : user.role === "editor" ? "#EFF6FF" : "#F0FDF4",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "13px", fontWeight: 600,
                      color: user.role === "admin" ? "#DC2626" : user.role === "editor" ? "#1D4ED8" : "#15803D",
                      flexShrink: 0,
                    }}>
                      {user.full_name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 500, color: "#0A1628" }}>
                        {user.full_name || "Chưa cập nhật"}
                      </div>
                      <div style={{ fontSize: "11px", color: "#94a3b8", fontFamily: "monospace" }}>
                        {user.id.substring(0, 16)}...
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div style={{ fontSize: "12px", color: "#334155", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.email || "—"}
                  </div>

                  {/* SĐT */}
                  <div style={{ fontSize: "13px", color: "#334155" }}>
                    {user.phone || "—"}
                  </div>

                  {/* Role */}
                  <div>
                    <span style={{
                      fontSize: "11px", fontWeight: 500, padding: "3px 10px",
                      borderRadius: "20px", background: roleSt.bg,
                      color: roleSt.color, border: `0.5px solid ${roleSt.border}`,
                    }}>{roleSt.label}</span>
                  </div>

                  {/* Ngày tạo */}
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    {new Date(user.created_at).toLocaleDateString("vi-VN")}
                  </div>

                  {/* Thao tác */}
                  <UserActions userId={user.id} currentRole={user.role} />
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
