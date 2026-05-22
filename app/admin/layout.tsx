"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const NAV = [
  {
    section: "Tổng quan",
    items: [
      { label: "Dashboard", href: "/admin", icon: "ti-layout-dashboard" },
    ],
  },
  {
    section: "Nội dung",
    items: [
      { label: "Bài phân tích", href: "/admin/bai-viet", icon: "ti-file-text", badge: null },
      { label: "Khóa học", href: "/admin/khoa-hoc", icon: "ti-school" },
      { label: "Ebook", href: "/admin/ebook", icon: "ti-book" },
      { label: "Sự kiện", href: "/admin/su-kien", icon: "ti-calendar-event" },
    ],
  },
  {
    section: "Kinh doanh",
    items: [
      { label: "Lead", href: "/admin/leads", icon: "ti-users" },
      { label: "Tư vấn", href: "/admin/tu-van", icon: "ti-calendar-check" },
    ],
  },
  {
    section: "Hệ thống",
    items: [
      { label: "Người dùng", href: "/admin/nguoi-dung", icon: "ti-user-circle" },
      { label: "Cài đặt", href: "/admin/cai-dat", icon: "ti-settings" },
    ],
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/dang-nhap")
    router.refresh()
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', 'Inter', sans-serif" }}>

      {/* SIDEBAR */}
      <div style={{
        width: "220px", background: "#0A1628",
        display: "flex", flexDirection: "column",
        flexShrink: 0, position: "fixed",
        top: 0, left: 0, bottom: 0, zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{
          padding: "16px", display: "flex", alignItems: "center", gap: "10px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{
            width: "30px", height: "30px", background: "#00C389",
            borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <img src="/o.png" alt="" style={{ width: "30px", height: "30px", borderRadius: "7px" }} />
          </div>
          <div>
            <div style={{ color: "#fff", fontSize: "13px", fontWeight: 600, letterSpacing: "0.04em" }}>
              BAMBOO<span style={{ color: "#00C389" }}>100</span>
            </div>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px" }}>Admin Panel</div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {NAV.map((group) => (
            <div key={group.section}>
              <p style={{
                padding: "12px 16px 4px",
                fontSize: "10px", fontWeight: 500,
                color: "rgba(255,255,255,0.3)",
                textTransform: "uppercase", letterSpacing: "0.08em",
              }}>{group.section}</p>
              {group.items.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href))
                return (
                  <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      padding: "8px 12px", margin: "1px 8px",
                      borderRadius: "6px", cursor: "pointer",
                      background: isActive ? "rgba(0,195,137,0.15)" : "transparent",
                      color: isActive ? "#00C389" : "rgba(255,255,255,0.55)",
                      fontSize: "12px", fontWeight: isActive ? 500 : 400,
                      transition: "all 0.15s",
                    }}>
                      <i className={`ti ${item.icon}`} style={{ fontSize: "15px" }} aria-hidden="true"></i>
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

          {/* Về trang chủ */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "8px 12px", borderRadius: "6px",
              color: "rgba(255,255,255,0.4)", fontSize: "12px",
              cursor: "pointer",
            }}>
              <i className="ti ti-arrow-left" style={{ fontSize: "14px" }} aria-hidden="true"></i>
              Về trang chủ
            </div>
          </Link>

          {/* Đăng xuất */}
          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "8px 12px", borderRadius: "6px",
              color: "#E24B4A", fontSize: "12px",
              cursor: "pointer", background: "transparent",
              border: "none", width: "100%", textAlign: "left",
              fontFamily: "inherit",
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "rgba(226,75,74,0.1)"}
            onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
          >
            <i className="ti ti-logout" style={{ fontSize: "14px" }} aria-hidden="true"></i>
            Đăng xuất
          </button>

        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, marginLeft: "220px", background: "#f8fafc", minHeight: "100vh" }}>
        {children}
      </div>
    </div>
  )
}
