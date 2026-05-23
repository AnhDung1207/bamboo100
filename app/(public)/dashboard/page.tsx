"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import { createClient } from "@/lib/supabase/client"
import {
  LayoutDashboard, Bookmark, User, LogOut,
  Diamond, Phone, BarChart2, GraduationCap,
  FileText, Calendar, ShieldCheck,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  role: string | null
  created_at: string
}

interface Bookmark {
  id: string
  created_at: string
  articles: {
    id: string
    title: string
    slug: string
    thumbnail_url: string | null
    excerpt: string | null
    read_time: number | null
    categories: { name: string; slug: string; color: string } | null
  } | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  if (!iso) return ""
  const d = new Date(iso)
  return `${d.getDate()} tháng ${d.getMonth() + 1}, ${d.getFullYear()}`
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "bookmarks" | "account">("overview")

  const [form, setForm] = useState({ fullName: "", phone: "" })
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle")
  const [pwForm, setPwForm] = useState({ next: "", confirm: "" })
  const [pwStatus, setPwStatus] = useState<"idle" | "saving" | "success" | "error">("idle")

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/dang-nhap"); return }
      setUser(user)

      const { data: profileData } = await supabase
        .from("profiles").select("*").eq("id", user.id).single()
      setProfile(profileData)
      setForm({ fullName: profileData?.full_name || "", phone: profileData?.phone || "" })

      const { data: bookmarkData } = await supabase
        .from("bookmarks")
        .select(`id, created_at, articles(id, title, slug, thumbnail_url, excerpt, read_time, categories(name, slug, color))`)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
      setBookmarks((bookmarkData as any[]) || [])
      setLoading(false)
    }
    init()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const handleUpdateProfile = async () => {
    if (!user) return
    setSaveStatus("saving")
    const { error } = await supabase
      .from("profiles").update({ full_name: form.fullName, phone: form.phone }).eq("id", user.id)
    setSaveStatus(error ? "error" : "success")
    if (!error) setProfile(p => p ? { ...p, full_name: form.fullName, phone: form.phone } : p)
    setTimeout(() => setSaveStatus("idle"), 3000)
  }

  const handleChangePassword = async () => {
    if (pwForm.next !== pwForm.confirm) { setPwStatus("error"); return }
    setPwStatus("saving")
    const { error } = await supabase.auth.updateUser({ password: pwForm.next })
    setPwStatus(error ? "error" : "success")
    if (!error) setPwForm({ next: "", confirm: "" })
    setTimeout(() => setPwStatus("idle"), 3000)
  }

  const handleRemoveBookmark = async (bookmarkId: string) => {
    await supabase.from("bookmarks").delete().eq("id", bookmarkId)
    setBookmarks(prev => prev.filter(b => b.id !== bookmarkId))
  }

  if (loading) {
    return (
      <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", minHeight: "100vh", background: "#F5F7FA" }}>
        <Navbar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "36px", height: "36px",
              border: "3px solid rgba(0,195,137,0.2)", borderTop: "3px solid #00C389",
              borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 14px",
            }} />
            <p style={{ color: "#94A3B8", fontSize: "13px" }}>Đang tải...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: "overview" as const, icon: <LayoutDashboard size={20} />, label: "Tổng quan" },
    { id: "bookmarks" as const, icon: <Bookmark size={20} />, label: `Đã lưu${bookmarks.length > 0 ? ` (${bookmarks.length})` : ""}` },
    { id: "account" as const, icon: <User size={20} />, label: "Tài khoản" },
  ]

  const stats = [
    { icon: <Bookmark size={18} color="#00C389" />, label: "Bài đã lưu", value: bookmarks.length },
    { icon: <Calendar size={18} color="#00C389" />, label: "Ngày tham gia", value: formatDate(user?.created_at || "") },
    { icon: <ShieldCheck size={18} color="#00C389" />, label: "Loại tài khoản", value: profile?.role === "admin" ? "Admin" : "Thành viên" },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", minHeight: "100vh", background: "#F5F7FA" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        .db-bottom-nav { display: none !important; }
        .db-header-tabs { display: flex; }
        .db-mobile-cta { display: none !important; }

        @media (max-width: 768px) {
          .db-page-wrap { padding-bottom: 72px !important; }
          .db-grid { grid-template-columns: 1fr !important; padding: 16px !important; gap: 16px !important; }
          .db-sidebar { display: none !important; }
          .db-header { padding: 20px 16px 0 !important; }
          .db-header-greeting { margin-bottom: 20px !important; }
          .db-header-name { font-size: 16px !important; }
          .db-avatar { width: 42px !important; height: 42px !important; font-size: 16px !important; }
          .db-logout-btn { padding: 6px 10px !important; font-size: 12px !important; }
          .db-header-tabs { display: none !important; }
          .db-bottom-nav { display: flex !important; }
          .db-stats { grid-template-columns: 1fr !important; gap: 10px !important; }
          .db-stat-card { padding: 14px 16px !important; }
          .db-bm-card { flex-direction: column !important; }
          .db-bm-thumb { width: 100% !important; height: 160px !important; }
          .db-bm-content { padding: 12px 14px !important; }
          .db-profile-grid { grid-template-columns: 1fr !important; }
          .db-panel { padding: 16px !important; border-radius: 12px !important; }
          .db-mobile-cta { display: flex !important; }
          .db-danger { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .db-danger-btn { width: 100% !important; text-align: center !important; }
          .db-empty { padding: 32px 16px !important; }
        }
      `}</style>

      <Navbar />

      {/* ── HEADER ── */}
      <div className="db-header" style={{
        background: "#FFFFFF", borderBottom: "1px solid #E8EDF3",
        padding: "36px 40px 0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          <div className="db-header-greeting" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div className="db-avatar" style={{
                width: "52px", height: "52px", borderRadius: "50%",
                background: "linear-gradient(135deg, #00C389, #00966B)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px", fontWeight: 700, color: "#fff", flexShrink: 0,
                boxShadow: "0 0 0 3px rgba(0,195,137,0.15)",
              }}>
                {(profile?.full_name || user?.email || "U")[0].toUpperCase()}
              </div>
              <div>
                <h1 className="db-header-name" style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#0A1628" }}>
                  Xin chào, {profile?.full_name || user?.email?.split("@")[0]} 👋
                </h1>
                <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#94A3B8" }}>
                  Thành viên từ {formatDate(user?.created_at || "")}
                  {profile?.role === "admin" && (
                    <span style={{ marginLeft: "8px", fontSize: "10px", fontWeight: 600, color: "#00C389", background: "rgba(0,195,137,0.1)", padding: "2px 8px", borderRadius: "20px" }}>ADMIN</span>
                  )}
                </p>
              </div>
            </div>

            <button
              className="db-logout-btn"
              onClick={handleLogout}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                color: "#64748B", fontSize: "13px", padding: "8px 14px",
                border: "1px solid #CBD5E1", borderRadius: "7px",
                background: "transparent", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s", flexShrink: 0,
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "#94A3B8"; e.currentTarget.style.color = "#0A1628"; e.currentTarget.style.background = "#F8FAFC" }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "#CBD5E1"; e.currentTarget.style.color = "#64748B"; e.currentTarget.style.background = "transparent" }}
            >
              <LogOut size={14} />
              Đăng xuất
            </button>
          </div>

          {/* Desktop tabs */}
          <div className="db-header-tabs" style={{ gap: "2px" }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex", alignItems: "center", gap: "7px",
                  padding: "12px 18px", border: "none", background: "transparent",
                  fontSize: "13px", fontWeight: activeTab === tab.id ? 600 : 400,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  color: activeTab === tab.id ? "#00C389" : "#94A3B8",
                  borderBottom: `2px solid ${activeTab === tab.id ? "#00C389" : "transparent"}`,
                  transition: "all 0.15s", marginBottom: "-1px",
                }}
              >
                {tab.icon}
                {tab.id === "bookmarks"
                  ? `Bài đã lưu${bookmarks.length > 0 ? ` (${bookmarks.length})` : ""}`
                  : tab.id === "overview" ? "Tổng quan" : "Tài khoản"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div className="db-page-wrap" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="db-grid" style={{
          padding: "32px 40px", display: "grid",
          gridTemplateColumns: "1fr 260px", gap: "32px", alignItems: "start",
        }}>

          <div>
            {/* === TỔNG QUAN === */}
            {activeTab === "overview" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#0A1628" }}>Tổng quan</h2>

                <div className="db-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
                  {stats.map(s => (
                    <div key={s.label} className="db-stat-card" style={{
                      background: "#FFFFFF", border: "1px solid #E8EDF3",
                      borderRadius: "12px", padding: "20px",
                      display: "flex", alignItems: "center", gap: "14px",
                      transition: "border-color 0.15s, box-shadow 0.15s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}
                      onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(0,195,137,0.4)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,195,137,0.08)" }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = "#E8EDF3"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)" }}
                    >
                      <div style={{
                        width: "42px", height: "42px", borderRadius: "10px",
                        background: "rgba(0,195,137,0.1)", display: "flex",
                        alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>{s.icon}</div>
                      <div>
                        <div style={{ fontSize: "18px", fontWeight: 700, color: "#0A1628", lineHeight: 1 }}>{s.value}</div>
                        <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px" }}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                    <h3 style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Bài lưu gần đây
                    </h3>
                    {bookmarks.length > 3 && (
                      <button onClick={() => setActiveTab("bookmarks")} style={{ background: "none", border: "none", color: "#00C389", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", padding: 0 }}>
                        Xem tất cả →
                      </button>
                    )}
                  </div>
                  {bookmarks.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {bookmarks.slice(0, 3).map(b => (
                        <BookmarkCard key={b.id} bookmark={b} onRemove={handleRemoveBookmark} />
                      ))}
                    </div>
                  ) : <EmptyBookmarks />}
                </div>

                {/* Mobile CTA */}
                <div className="db-mobile-cta" style={{ flexDirection: "column", gap: "10px" }}>
                  <div style={{
                    background: "linear-gradient(135deg, #F0FDF9, #E6FAF4)",
                    border: "1px solid rgba(0,195,137,0.25)", borderRadius: "14px", padding: "18px",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px",
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: "4px" }}><Diamond size={18} color="#00C389" /></div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#0A1628", marginBottom: "2px" }}>Gói Premium</div>
                      <div style={{ fontSize: "11px", color: "#64748B" }}>Truy cập không giới hạn phân tích chuyên sâu</div>
                    </div>
                    <Link href="/dich-vu" style={{
                      padding: "8px 16px", background: "#00C389", color: "#fff",
                      borderRadius: "8px", fontSize: "12px", fontWeight: 600,
                      textDecoration: "none", flexShrink: 0, whiteSpace: "nowrap",
                    }}>Xem ngay</Link>
                  </div>

                  <div style={{
                    background: "#FFFFFF", border: "1px solid #E8EDF3",
                    borderRadius: "14px", padding: "18px",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: "4px" }}><Phone size={18} color="#00C389" /></div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#0A1628", marginBottom: "2px" }}>Tư vấn miễn phí</div>
                      <div style={{ fontSize: "11px", color: "#64748B" }}>Chuyên gia sẵn sàng hỗ trợ bạn</div>
                    </div>
                    <Link href="/lien-he#dat-lich" style={{
                      padding: "8px 16px", background: "transparent",
                      border: "1px solid rgba(0,195,137,0.4)", color: "#00C389",
                      borderRadius: "8px", fontSize: "12px", fontWeight: 600,
                      textDecoration: "none", flexShrink: 0, whiteSpace: "nowrap",
                    }}>Đặt lịch</Link>
                  </div>
                </div>
              </div>
            )}

            {/* === BÀI ĐÃ LƯU === */}
            {activeTab === "bookmarks" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#0A1628" }}>
                  Bài đã lưu <span style={{ fontSize: "13px", fontWeight: 400, color: "#94A3B8" }}>({bookmarks.length})</span>
                </h2>
                {bookmarks.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {bookmarks.map(b => <BookmarkCard key={b.id} bookmark={b} onRemove={handleRemoveBookmark} />)}
                  </div>
                ) : <EmptyBookmarks />}
              </div>
            )}

            {/* === TÀI KHOẢN === */}
            {activeTab === "account" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#0A1628" }}>Tài khoản</h2>

                <div className="db-panel" style={{ background: "#FFFFFF", border: "1px solid #E8EDF3", borderRadius: "14px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                  <h3 style={{ margin: "0 0 20px", fontSize: "13px", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Thông tin cá nhân</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div>
                      <label style={labelStyle}>Email</label>
                      <input value={user?.email || ""} readOnly style={{ ...inputStyle, opacity: 0.6, cursor: "not-allowed" }} />
                    </div>
                    <div className="db-profile-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                      <div>
                        <label style={labelStyle}>Họ và tên</label>
                        <input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="Nguyễn Văn A" style={inputStyle} onFocus={e => (e.currentTarget.style.borderColor = "#00C389")} onBlur={e => (e.currentTarget.style.borderColor = "#CBD5E1")} />
                      </div>
                      <div>
                        <label style={labelStyle}>Số điện thoại</label>
                        <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="0912 345 678" style={inputStyle} onFocus={e => (e.currentTarget.style.borderColor = "#00C389")} onBlur={e => (e.currentTarget.style.borderColor = "#CBD5E1")} />
                      </div>
                    </div>
                    <button onClick={handleUpdateProfile} disabled={saveStatus === "saving"} style={{ padding: "10px 22px", background: "#00C389", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: saveStatus === "saving" ? "not-allowed" : "pointer", opacity: saveStatus === "saving" ? 0.7 : 1, fontFamily: "'DM Sans', sans-serif", width: "100%" }}>
                      {saveStatus === "saving" ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                    {saveStatus === "success" && <span style={{ fontSize: "12px", color: "#00C389" }}>✓ Đã lưu thành công</span>}
                    {saveStatus === "error" && <span style={{ fontSize: "12px", color: "#ef4444" }}>✕ Có lỗi xảy ra</span>}
                  </div>
                </div>

                <div className="db-panel" style={{ background: "#FFFFFF", border: "1px solid #E8EDF3", borderRadius: "14px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                  <h3 style={{ margin: "0 0 20px", fontSize: "13px", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Đổi mật khẩu</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div>
                      <label style={labelStyle}>Mật khẩu mới</label>
                      <input type="password" value={pwForm.next} onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))} placeholder="Tối thiểu 6 ký tự" style={inputStyle} onFocus={e => (e.currentTarget.style.borderColor = "#00C389")} onBlur={e => (e.currentTarget.style.borderColor = "#CBD5E1")} />
                    </div>
                    <div>
                      <label style={labelStyle}>Xác nhận mật khẩu</label>
                      <input type="password" value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} placeholder="Nhập lại mật khẩu mới" style={inputStyle} onFocus={e => (e.currentTarget.style.borderColor = "#00C389")} onBlur={e => (e.currentTarget.style.borderColor = "#CBD5E1")} />
                      {pwForm.confirm && pwForm.confirm !== pwForm.next && <p style={{ margin: "6px 0 0", fontSize: "11px", color: "#ef4444" }}>Mật khẩu không khớp</p>}
                    </div>
                    <button onClick={handleChangePassword} disabled={pwStatus === "saving" || !pwForm.next || pwForm.next !== pwForm.confirm} style={{ padding: "10px 22px", width: "100%", background: pwForm.next && pwForm.next === pwForm.confirm ? "#00C389" : "#E2E8F0", color: pwForm.next && pwForm.next === pwForm.confirm ? "#fff" : "#94A3B8", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: pwStatus === "saving" ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}>
                      {pwStatus === "saving" ? "Đang cập nhật..." : "Đổi mật khẩu"}
                    </button>
                    {pwStatus === "success" && <span style={{ fontSize: "12px", color: "#00C389" }}>✓ Cập nhật thành công</span>}
                    {pwStatus === "error" && <span style={{ fontSize: "12px", color: "#ef4444" }}>✕ Mật khẩu không hợp lệ</span>}
                  </div>
                </div>

                <div className="db-danger db-panel" style={{ background: "#FFF8F8", border: "1px solid #FED7D7", borderRadius: "14px", padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
                  <div>
                    <h3 style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: 600, color: "#64748B" }}>Đăng xuất khỏi tài khoản</h3>
                    <p style={{ margin: 0, fontSize: "12px", color: "#94A3B8" }}>Bạn sẽ được chuyển về trang chủ</p>
                  </div>
                  <button className="db-danger-btn" onClick={handleLogout} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "9px 18px", background: "transparent", border: "1px solid #FCA5A5", borderRadius: "8px", color: "#ef4444", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", flexShrink: 0, transition: "all 0.15s" }}
                    onMouseOver={e => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.borderColor = "#ef4444" }}
                    onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#FCA5A5" }}
                  >
                    <LogOut size={14} />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── SIDEBAR (desktop) ── */}
          <aside className="db-sidebar" style={{ position: "sticky", top: "88px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ background: "linear-gradient(135deg, #F0FDF9, #E6FAF4)", border: "1px solid rgba(0,195,137,0.25)", borderRadius: "14px", padding: "22px" }}>
              <Diamond size={20} color="#00C389" style={{ marginBottom: "10px" }} />
              <h3 style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 700, color: "#0A1628" }}>Gói Premium</h3>
              <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#64748B", lineHeight: 1.6 }}>Truy cập không giới hạn phân tích chuyên sâu, tín hiệu giao dịch và hỗ trợ 1:1.</p>
              <Link href="/dich-vu" style={{ display: "block", textAlign: "center", padding: "9px", background: "#00C389", color: "#fff", borderRadius: "8px", fontSize: "12px", fontWeight: 600, textDecoration: "none" }}>
                Xem gói dịch vụ
              </Link>
            </div>

            <div style={{ background: "#FFFFFF", border: "1px solid #E8EDF3", borderRadius: "14px", padding: "22px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <Phone size={20} color="#00C389" style={{ marginBottom: "10px" }} />
              <h3 style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 700, color: "#0A1628" }}>Tư vấn miễn phí</h3>
              <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#64748B", lineHeight: 1.6 }}>Đội ngũ chuyên gia sẵn sàng xây dựng chiến lược giao dịch cho bạn.</p>
              <Link href="/lien-he#dat-lich" style={{ display: "block", textAlign: "center", padding: "9px", background: "transparent", border: "1px solid rgba(0,195,137,0.4)", color: "#00C389", borderRadius: "8px", fontSize: "12px", fontWeight: 600, textDecoration: "none", transition: "background 0.15s" }}
                onMouseOver={e => (e.currentTarget.style.background = "rgba(0,195,137,0.06)")}
                onMouseOut={e => (e.currentTarget.style.background = "transparent")}
              >
                Đặt lịch tư vấn
              </Link>
            </div>

            <div style={{ background: "#FFFFFF", border: "1px solid #E8EDF3", borderRadius: "14px", padding: "18px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <h3 style={{ margin: "0 0 12px", fontSize: "11px", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Khám phá</h3>
              {[
                { icon: <BarChart2 size={15} />, label: "Phân tích thị trường", href: "/phan-tich" },
                { icon: <GraduationCap size={15} />, label: "Học viện", href: "/hoc-vien" },
                { icon: <FileText size={15} />, label: "Ebook miễn phí", href: "/hoc-vien/ebook-dau-tu" },
              ].map(item => (
                <Link key={item.href} href={item.href} style={{ display: "flex", alignItems: "center", gap: "9px", padding: "10px 0", fontSize: "13px", color: "#64748B", textDecoration: "none", borderBottom: "1px solid #F1F5F9", transition: "color 0.15s" }}
                  onMouseOver={e => (e.currentTarget.style.color = "#00C389")}
                  onMouseOut={e => (e.currentTarget.style.color = "#64748B")}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>

      {/* ── BOTTOM NAV (mobile) ── */}
      <nav className="db-bottom-nav" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
        background: "#FFFFFF", borderTop: "1px solid #E8EDF3",
        boxShadow: "0 -4px 16px rgba(0,0,0,0.08)",
        display: "flex", alignItems: "stretch",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: "3px", padding: "10px 4px",
              border: "none", background: "transparent", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              borderTop: `2px solid ${activeTab === tab.id ? "#00C389" : "transparent"}`,
              transition: "all 0.15s",
              color: activeTab === tab.id ? "#00C389" : "#94A3B8",
            }}
          >
            {tab.icon}
            <span style={{ fontSize: "10px", fontWeight: activeTab === tab.id ? 600 : 400 }}>
              {tab.id === "bookmarks"
                ? `Đã lưu${bookmarks.length > 0 ? ` (${bookmarks.length})` : ""}`
                : tab.id === "overview" ? "Tổng quan" : "Tài khoản"}
            </span>
          </button>
        ))}
      </nav>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function BookmarkCard({ bookmark, onRemove }: { bookmark: Bookmark; onRemove: (id: string) => void }) {
  const art = bookmark.articles
  if (!art) return null
  return (
    <div className="db-bm-card" style={{ background: "#FFFFFF", border: "1px solid #E8EDF3", borderRadius: "12px", overflow: "hidden", display: "flex", transition: "border-color 0.15s, box-shadow 0.15s", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
      onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(0,195,137,0.35)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,195,137,0.08)" }}
      onMouseOut={e => { e.currentTarget.style.borderColor = "#E8EDF3"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)" }}
    >
      {art.thumbnail_url ? (
        <img className="db-bm-thumb" src={art.thumbnail_url} alt={art.title} style={{ width: "130px", flexShrink: 0, objectFit: "cover" }} />
      ) : (
        <div className="db-bm-thumb" style={{ width: "130px", flexShrink: 0, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BarChart2 size={28} color="#CBD5E1" />
        </div>
      )}
      <div className="db-bm-content" style={{ flex: 1, padding: "16px 18px", display: "flex", flexDirection: "column", gap: "6px" }}>
        {art.categories && (
          <span style={{ display: "inline-block", fontSize: "10px", fontWeight: 600, color: art.categories.color || "#00C389", background: `${art.categories.color || "#00C389"}18`, padding: "2px 8px", borderRadius: "20px", width: "fit-content", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {art.categories.name}
          </span>
        )}
        <Link href={`/phan-tich/${art.slug}`} style={{ textDecoration: "none" }}>
          <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#0A1628", lineHeight: 1.45, cursor: "pointer" }}
            onMouseOver={e => (e.currentTarget.style.color = "#00C389")}
            onMouseOut={e => (e.currentTarget.style.color = "#0A1628")}
          >{art.title}</h3>
        </Link>
        {art.excerpt && (
          <p style={{ margin: 0, fontSize: "12px", color: "#64748B", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {art.excerpt}
          </p>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
          <span style={{ fontSize: "11px", color: "#94A3B8" }}>
            Lưu {new Date(bookmark.created_at).toLocaleDateString("vi-VN")}
            {art.read_time ? ` · ${art.read_time} phút đọc` : ""}
          </span>
          <button onClick={() => onRemove(bookmark.id)} style={{ background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: "6px", color: "#ef4444", fontSize: "11px", padding: "4px 10px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}
            onMouseOver={e => { e.currentTarget.style.background = "#FEE2E2"; e.currentTarget.style.borderColor = "#FCA5A5" }}
            onMouseOut={e => { e.currentTarget.style.background = "#FFF5F5"; e.currentTarget.style.borderColor = "#FED7D7" }}
          >Xóa</button>
        </div>
      </div>
    </div>
  )
}

function EmptyBookmarks() {
  return (
    <div className="db-empty" style={{ padding: "48px", textAlign: "center", background: "#FFFFFF", borderRadius: "12px", border: "1px dashed #CBD5E1", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
        <Bookmark size={40} color="#CBD5E1" />
      </div>
      <h3 style={{ margin: "0 0 8px", color: "#0A1628", fontSize: "15px", fontWeight: 600 }}>Chưa có bài lưu</h3>
      <p style={{ margin: "0 0 18px", color: "#94A3B8", fontSize: "13px" }}>Nhấn icon bookmark trên bài viết để lưu lại đọc sau.</p>
      <Link href="/phan-tich" style={{ display: "inline-block", padding: "9px 20px", background: "#00C389", color: "#fff", borderRadius: "8px", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
        Xem phân tích thị trường
      </Link>
    </div>
  )
}

// ─── Shared styles ─────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: "block", marginBottom: "6px",
  fontSize: "11px", fontWeight: 600,
  color: "#64748B", letterSpacing: "0.04em", textTransform: "uppercase",
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px",
  background: "#F8FAFC", border: "1px solid #CBD5E1",
  borderRadius: "8px", color: "#0A1628", fontSize: "13px", outline: "none",
  fontFamily: "'DM Sans', 'Inter', sans-serif",
  transition: "border-color 0.15s", boxSizing: "border-box",
}
