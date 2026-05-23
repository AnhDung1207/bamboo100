import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import UserActions from "./UserActions"

export default async function AdminNguoiDungPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; search?: string }>
}) {
  const supabase = await createClient()
  const adminClient = createAdminClient()
  const { role, search } = await searchParams

  // Lấy danh sách profiles
  let query = supabase.from("profiles").select("*").order("created_at", { ascending: false })
  if (role && role !== "all") query = query.eq("role", role)
  if (search) query = query.ilike("full_name", `%${search}%`)
  const { data: profiles } = await query

  // Lấy email từ auth.users bằng admin client
  const { data: { users: authUsers } } = await adminClient.auth.admin.listUsers()
  const emailMap: Record<string, string> = {}
  authUsers?.forEach((u) => { if (u.id) emailMap[u.id] = u.email || "" })

  // Merge email vào profiles
  const users = (profiles || []).map((p) => ({
    ...p,
    email: emailMap[p.id] || p.email || "",
  }))

  const { count: totalCount }  = await supabase.from("profiles").select("*", { count: "exact", head: true })
  const { count: adminCount }  = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "admin")
  const { count: editorCount } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "editor")
  const { count: memberCount } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "member")

  const filters = [
    { label: "Tất cả", value: "all",    count: totalCount  || 0 },
    { label: "Admin",  value: "admin",  count: adminCount  || 0 },
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
      <style>{`
        @media (max-width: 767px) {
          .nd-topbar    { padding: 12px 16px !important; flex-wrap: wrap !important; gap: 10px !important; }
          .nd-search    { width: 100% !important; }
          .nd-search input { width: 100% !important; }
          .nd-content   { padding: 16px !important; }
          .nd-stats     { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
          .nd-filters   { flex-wrap: nowrap !important; overflow-x: auto !important; padding-bottom: 4px !important; }
          .nd-table-header { display: none !important; }
          .nd-table-row {
            display: flex !important;
            flex-direction: column !important;
            gap: 8px !important;
            padding: 14px 16px !important;
          }
          .nd-col-email,
          .nd-col-phone,
          .nd-col-role,
          .nd-col-date  { display: none !important; }
          .nd-card-meta { display: flex !important; }
        }
        .nd-card-meta { display: none; gap: 8px; align-items: center; flex-wrap: wrap; margin-top: 4px; }
      `}</style>

      {/* TOPBAR */}
      <div className="nd-topbar" style={{
        background: "#fff", borderBottom: "0.5px solid #e2e8f0",
        padding: "14px 28px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 40,
      }}>
        <div>
          <h1 style={{ fontSize: "16px", fontWeight: 600, color: "#0A1628" }}>Người dùng</h1>
          <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>Quản lý tài khoản &amp; phân quyền</p>
        </div>
        <form method="GET" className="nd-search" style={{ display: "flex", alignItems: "center" }}>
          {role && <input type="hidden" name="role" value={role} />}
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            border: "0.5px solid #e2e8f0", borderRadius: "8px",
            padding: "7px 12px", background: "#f8fafc", width: "100%",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input name="search" defaultValue={search || ""} placeholder="Tìm theo tên..."
              style={{ border: "none", outline: "none", fontSize: "13px", background: "transparent", width: "180px", color: "#0A1628" }} />
          </div>
        </form>
      </div>

      <div className="nd-content" style={{ padding: "24px 28px" }}>

        {/* STATS */}
        <div className="nd-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "20px" }}>
          {filters.map((f) => (
            <div key={f.value} style={{ background: "#fff", borderRadius: "12px", border: "0.5px solid #e2e8f0", padding: "16px 20px" }}>
              <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>{f.label}</div>
              <div style={{ fontSize: "28px", fontWeight: 700, color: "#0A1628" }}>{f.count}</div>
            </div>
          ))}
        </div>

        {/* FILTERS */}
        <div className="nd-filters" style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          {filters.map((f) => {
            const isActive = (!role && f.value === "all") || role === f.value
            return (
              <a key={f.value} href={f.value === "all" ? "/admin/nguoi-dung" : `/admin/nguoi-dung?role=${f.value}`}
                style={{ textDecoration: "none", flexShrink: 0 }}>
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
              </a>
            )
          })}
        </div>

        {/* TABLE */}
        <div style={{ background: "#fff", borderRadius: "12px", border: "0.5px solid #e2e8f0", overflow: "hidden" }}>
          <div className="nd-table-header" style={{
            display: "grid",
            gridTemplateColumns: "1fr 200px 140px 100px 130px 150px",
            padding: "10px 20px", borderBottom: "0.5px solid #e2e8f0", background: "#f8fafc",
          }}>
            {["Người dùng", "Email", "SĐT", "Quyền", "Ngày tạo", "Thao tác"].map((h) => (
              <div key={h} style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</div>
            ))}
          </div>

          {users.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>👥</div>
              <p style={{ fontSize: "14px", color: "#64748b" }}>Chưa có người dùng nào</p>
            </div>
          ) : (
            users.map((user: any, i: number) => {
              const roleSt = ROLE_STYLES[user.role] || ROLE_STYLES.member
              return (
                <div key={user.id} className="nd-table-row" style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 200px 140px 100px 130px 150px",
                  padding: "14px 20px",
                  borderBottom: i < users.length - 1 ? "0.5px solid #f1f5f9" : "none",
                  alignItems: "center",
                }}>
                  {/* User */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0,
                      background: roleSt.bg, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "13px", fontWeight: 600, color: roleSt.color,
                    }}>
                      {user.full_name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "13px", fontWeight: 500, color: "#0A1628" }}>
                        {user.full_name || "Chưa cập nhật"}
                      </div>
                      <div style={{ fontSize: "11px", color: "#94a3b8", fontFamily: "monospace" }}>
                        {user.id.substring(0, 16)}...
                      </div>
                      {/* Meta mobile */}
                      <div className="nd-card-meta">
                        <span style={{ fontSize: "11px", fontWeight: 500, padding: "2px 8px", borderRadius: "20px", background: roleSt.bg, color: roleSt.color, border: `0.5px solid ${roleSt.border}` }}>
                          {roleSt.label}
                        </span>
                        {user.email && <span style={{ fontSize: "11px", color: "#64748b" }}>{user.email}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="nd-col-email" style={{ fontSize: "12px", color: "#334155", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.email || "—"}
                  </div>

                  {/* SĐT */}
                  <div className="nd-col-phone" style={{ fontSize: "13px", color: "#334155" }}>
                    {user.phone || "—"}
                  </div>

                  {/* Role */}
                  <div className="nd-col-role">
                    <span style={{ fontSize: "11px", fontWeight: 500, padding: "3px 10px", borderRadius: "20px", background: roleSt.bg, color: roleSt.color, border: `0.5px solid ${roleSt.border}` }}>
                      {roleSt.label}
                    </span>
                  </div>

                  {/* Ngày tạo */}
                  <div className="nd-col-date" style={{ fontSize: "12px", color: "#64748b" }}>
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
