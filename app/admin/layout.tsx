"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"

// adminOnly: true → chỉ admin thấy | false → cả admin lẫn editor thấy
const NAV = [
  {
    section: "Tổng quan",
    items: [
      { label: "Dashboard",    href: "/admin",           icon: "ti-layout-dashboard", adminOnly: false },
    ],
  },
  {
    section: "Nội dung",
    items: [
      { label: "Bài phân tích", href: "/admin/bai-viet", icon: "ti-file-text",       adminOnly: false },
      { label: "Khóa học",      href: "/admin/khoa-hoc", icon: "ti-school",           adminOnly: false },
      { label: "Ebook",         href: "/admin/ebook",    icon: "ti-book",             adminOnly: false },
      { label: "Sự kiện",       href: "/admin/su-kien",  icon: "ti-calendar-event",   adminOnly: false },
    ],
  },
  {
    section: "Kinh doanh",
    items: [
      { label: "Lead",   href: "/admin/leads",  icon: "ti-users",          adminOnly: true },
      { label: "Tư vấn", href: "/admin/tu-van", icon: "ti-calendar-check", adminOnly: true },
    ],
  },
  {
    section: "Hệ thống",
    items: [
      { label: "Người dùng", href: "/admin/nguoi-dung", icon: "ti-user-circle", adminOnly: true },
      { label: "Cài đặt",    href: "/admin/cai-dat",    icon: "ti-settings",    adminOnly: true },
    ],
  },
]

const BOTTOM_NAV_ADMIN  = [
  { label: "Dashboard", href: "/admin",           icon: "ti-layout-dashboard" },
  { label: "Bài viết",  href: "/admin/bai-viet",  icon: "ti-file-text" },
  { label: "Lead",      href: "/admin/leads",      icon: "ti-users" },
]
const BOTTOM_NAV_EDITOR = [
  { label: "Dashboard", href: "/admin",           icon: "ti-layout-dashboard" },
  { label: "Bài viết",  href: "/admin/bai-viet",  icon: "ti-file-text" },
  { label: "Ebook",     href: "/admin/ebook",      icon: "ti-book" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()

  const [role,       setRole]       = useState<string | null>(null)
  const [roleLoaded, setRoleLoaded] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mounted,    setMounted]    = useState(false)

  useEffect(() => {
    setMounted(true)
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from("profiles").select("role").eq("id", user.id).single()
      setRole(data?.role ?? null)
      setRoleLoaded(true)
    }
    init()
  }, [])

  useEffect(() => {
    const lock = drawerOpen ? "hidden" : ""
    document.body.style.overflow = lock
    return () => { document.body.style.overflow = "" }
  }, [drawerOpen])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/dang-nhap")
    router.refresh()
  }

  const isAdmin  = role === "admin"
  const isEditor = role === "editor"

  const filteredNav = NAV.map(group => ({
    ...group,
    items: group.items.filter(item => !item.adminOnly || isAdmin),
  })).filter(group => group.items.length > 0)

  const bottomNav = isEditor ? BOTTOM_NAV_EDITOR : BOTTOM_NAV_ADMIN

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }

        .admin-sidebar    { display: flex !important; }
        .admin-main       { margin-left: 220px !important; padding-bottom: 0 !important; }
        .admin-bottom-nav { display: none !important; }

        @media (max-width: 767px) {
          .admin-sidebar    { display: none !important; }
          .admin-main       { margin-left: 0 !important; padding-bottom: 72px !important; }
          .admin-bottom-nav { display: flex !important; }
          .admin-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .admin-two-col    { grid-template-columns: 1fr !important; }
          .admin-topbar     { padding: 12px 16px !important; }
          .admin-content    { padding: 16px !important; }
        }
      `}</style>

      {/* ── SIDEBAR ── */}
      <div className="admin-sidebar" style={{
        width: "220px", background: "#0A1628", flexDirection: "column",
        flexShrink: 0, position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
      }}>
        {/* Logo + editor badge */}
        <div style={{
          padding: "16px", display: "flex", alignItems: "center", gap: "10px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <img src="/o.png" alt="" style={{ width: "30px", height: "30px", borderRadius: "7px" }} />
          <div>
            <div style={{ color: "#fff", fontSize: "13px", fontWeight: 600, letterSpacing: "0.04em" }}>
              BAMBOO<span style={{ color: "#00C389" }}>100</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "2px" }}>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px" }}>Admin Panel</div>
              {roleLoaded && isEditor && (
                <span style={{
                  fontSize: "9px", fontWeight: 600, color: "#EF9F27",
                  background: "rgba(239,159,39,0.15)", padding: "1px 6px",
                  borderRadius: "20px", letterSpacing: "0.04em",
                }}>EDITOR</span>
              )}
            </div>
          </div>
        </div>

        {/* Nav — filtered theo role */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {filteredNav.map((group) => (
            <div key={group.section}>
              <p style={{
                padding: "12px 16px 4px", fontSize: "10px", fontWeight: 500,
                color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em",
              }}>{group.section}</p>
              {group.items.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href))
                return (
                  <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      padding: "8px 12px", margin: "1px 8px", borderRadius: "6px",
                      background: isActive ? "rgba(0,195,137,0.15)" : "transparent",
                      color: isActive ? "#00C389" : "rgba(255,255,255,0.55)",
                      fontSize: "12px", fontWeight: isActive ? 500 : 400,
                    }}>
                      <i className={`ti ${item.icon}`} style={{ fontSize: "15px" }} />
                      <span style={{ flex: 1 }}>{item.label}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          ))}
        </div>

        {/* Bottom actions */}
        <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: "4px" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "8px 12px", borderRadius: "6px",
              color: "rgba(255,255,255,0.4)", fontSize: "12px", cursor: "pointer",
            }}>
              <i className="ti ti-arrow-left" style={{ fontSize: "14px" }} />
              Về trang chủ
            </div>
          </Link>
          <button onClick={handleLogout} style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "8px 12px", borderRadius: "6px",
            color: "#E24B4A", fontSize: "12px", cursor: "pointer",
            background: "transparent", border: "none", width: "100%",
            textAlign: "left", fontFamily: "inherit",
          }}>
            <i className="ti ti-logout" style={{ fontSize: "14px" }} />
            Đăng xuất
          </button>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div className="admin-main" style={{ flex: 1, background: "#f8fafc", minHeight: "100vh" }}>
        {children}
      </div>

      {/* ── BOTTOM NAV (mobile) ── */}
      <div className="admin-bottom-nav" style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        height: "64px", background: "#0A1628",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        zIndex: 50, alignItems: "center", justifyContent: "around",
        padding: "0 8px",
      }}>
        {bottomNav.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href} style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: "3px",
              textDecoration: "none", padding: "8px 4px",
              color: isActive ? "#00C389" : "rgba(255,255,255,0.4)",
            }}>
              <i className={`ti ${item.icon}`} style={{ fontSize: "20px" }} />
              <span style={{ fontSize: "10px", fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
            </Link>
          )
        })}

        <button onClick={() => setDrawerOpen(true)} style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: "3px",
          background: "transparent", border: "none", cursor: "pointer",
          color: drawerOpen ? "#00C389" : "rgba(255,255,255,0.4)",
          padding: "8px 4px", fontFamily: "inherit",
        }}>
          <i className="ti ti-menu-2" style={{ fontSize: "20px" }} />
          <span style={{ fontSize: "10px" }}>Thêm</span>
        </button>
      </div>

      {/* ── DRAWER mobile ── */}
      {mounted && drawerOpen && createPortal(
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
        }}>
          <div onClick={() => setDrawerOpen(false)} style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)",
          }} />
          <div style={{
            position: "relative", background: "#0A1628",
            borderRadius: "16px 16px 0 0",
            padding: "16px 0 80px",
            animation: "slideUp 0.25s ease",
          }}>
            <button onClick={() => setDrawerOpen(false)} style={{
              position: "sticky", top: "12px",
              float: "right", marginRight: "16px", marginBottom: "-44px",
              background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer",
              width: "32px", height: "32px", borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "rgba(255,255,255,0.8)", fontSize: "16px", fontFamily: "inherit",
              zIndex: 2, flexShrink: 0,
            }}>✕</button>

            {filteredNav.slice(1).map((group) => (
              <div key={group.section}>
                <p style={{
                  padding: "10px 20px 4px", fontSize: "10px", fontWeight: 500,
                  color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em",
                }}>{group.section}</p>
                {group.items.map((item) => {
                  const isActive = pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href))
                  return (
                    <Link key={item.href} href={item.href}
                      onClick={() => setDrawerOpen(false)}
                      style={{ textDecoration: "none" }}>
                      <div style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        padding: "12px 20px",
                        color: isActive ? "#00C389" : "rgba(255,255,255,0.7)",
                        fontSize: "14px", fontWeight: isActive ? 600 : 400,
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}>
                        <i className={`ti ${item.icon}`} style={{ fontSize: "18px" }} />
                        {item.label}
                      </div>
                    </Link>
                  )
                })}
              </div>
            ))}

            <div style={{ padding: "12px 20px 0", display: "flex", flexDirection: "column", gap: "4px" }}>
              <Link href="/" onClick={() => setDrawerOpen(false)} style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 0", color: "rgba(255,255,255,0.4)",
                fontSize: "14px", textDecoration: "none",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}>
                <i className="ti ti-arrow-left" style={{ fontSize: "18px" }} />
                Về trang chủ
              </Link>
              <button onClick={handleLogout} style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 0", color: "#E24B4A", fontSize: "14px",
                background: "transparent", border: "none", cursor: "pointer",
                fontFamily: "inherit", width: "100%", textAlign: "left",
              }}>
                <i className="ti ti-logout" style={{ fontSize: "18px" }} />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
