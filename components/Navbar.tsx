"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"

const NAV_LINKS = [
  { label: "Phân tích", href: "/phan-tich" },
  { label: "Dịch vụ", href: "/dich-vu" },
]

const NAV_LINKS_RIGHT = [
  { label: "Về chúng tôi", href: "/gioi-thieu" },
]

const HOC_VIEN_MENU = [
  {
    icon: "ti-book",
    label: "Nền tảng kiến thức",
    desc: "Kiến thức cơ bản đến nâng cao về hàng hóa",
    href: "/hoc-vien/nen-tang-kien-thuc",
    color: "#6D28D9",
  },
  {
    icon: "ti-school",
    label: "Khóa học",
    desc: "Chương trình học bài bản từ chuyên gia",
    href: "/hoc-vien/khoa-hoc",
    color: "#00C389",
  },
  {
    icon: "ti-file-download",
    label: "Ebook đầu tư miễn phí",
    desc: "Tài liệu PDF chuyên sâu, tải về miễn phí",
    href: "/hoc-vien/ebook-dau-tu",
    color: "#E24B4A",
  },
]

export default function Navbar() {
  // Desktop mega menu
  const [megaOpen, setMegaOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setMegaOpen(true)
  }
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setMegaOpen(false), 150)
  }

  // Mobile drawer
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [hocVienOpen, setHocVienOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const lock = drawerOpen ? "hidden" : ""
    document.body.style.overflow = lock
    document.documentElement.style.overflow = lock
    return () => {
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
    }
  }, [drawerOpen])

  const close = () => setDrawerOpen(false)

  return (
    <>
      <style>{`
        .nb-desktop { display: flex !important; gap: 4px; align-items: center; }
        .nb-hamburger { display: none !important; }
        .mega-menu {
          position: absolute; top: calc(100% + 8px); left: 50%; transform: translateX(-50%);
          background: #fff; border-radius: 14px; border: 0.5px solid #e2e8f0;
          box-shadow: 0 12px 40px rgba(0,0,0,0.12);
          padding: 8px; min-width: 320px; z-index: 200;
          animation: fadeDown 0.15s ease;
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .mega-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 12px 14px; border-radius: 10px; text-decoration: none;
          transition: background 0.12s;
        }
        .mega-item:hover { background: #f8fafc; }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @media (max-width: 767px) {
          .nb-desktop   { display: none !important; }
          .nb-hamburger { display: flex !important; }
        }
      `}</style>

      <div style={{ position: "sticky", top: 0, zIndex: 100 }}>
        <nav style={{
          background: "#0A1628", display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "0 40px", height: "60px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          position: "relative", zIndex: 100,
        }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            <img src="/o.png" alt="BAMBOO100" style={{ width: "34px", height: "34px", borderRadius: "8px" }} />
            <span style={{ color: "#fff", fontSize: "15px", fontWeight: 600, letterSpacing: "0.04em" }}>
              BAMBOO<span style={{ color: "#00C389" }}>100</span>
            </span>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <div className="nb-desktop" style={{ position: "relative" }}>
            {NAV_LINKS.map((item) => (
              <Link key={item.label} href={item.href} style={{
                color: "rgba(255,255,255,0.65)", fontSize: "13px",
                padding: "6px 12px", borderRadius: "6px", textDecoration: "none",
              }}>{item.label}</Link>
            ))}

            {/* Học viện mega menu */}
            <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ position: "relative" }}>
              <Link href="/hoc-vien" style={{
                color: "rgba(255,255,255,0.65)", fontSize: "13px",
                padding: "6px 12px", borderRadius: "6px", textDecoration: "none",
                display: "flex", alignItems: "center",
              }}>Học viện</Link>

              {megaOpen && (
                <div className="mega-menu" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  {HOC_VIEN_MENU.map((item) => (
                    <Link key={item.href} href={item.href} className="mega-item">
                      <div style={{
                        width: "38px", height: "38px", borderRadius: "10px", flexShrink: 0,
                        background: item.color + "15",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <i className={`ti ${item.icon}`} style={{ fontSize: "18px", color: item.color }} />
                      </div>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#0A1628", marginBottom: "3px" }}>{item.label}</div>
                        <div style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.5 }}>{item.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {NAV_LINKS_RIGHT.map((item) => (
              <Link key={item.label} href={item.href} style={{
                color: "rgba(255,255,255,0.65)", fontSize: "13px",
                padding: "6px 12px", borderRadius: "6px", textDecoration: "none",
              }}>{item.label}</Link>
            ))}
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexShrink: 0 }}>
            <Link href="/dang-nhap" className="nb-desktop" style={{
              color: "rgba(255,255,255,0.75)", fontSize: "13px", padding: "7px 16px",
              border: "1px solid rgba(255,255,255,0.2)", borderRadius: "7px", textDecoration: "none",
            }}>Đăng nhập</Link>
            <Link href="/lien-he#dat-lich" className="nb-desktop" style={{
              background: "#00C389", color: "#fff", fontSize: "13px",
              padding: "8px 16px", borderRadius: "7px", textDecoration: "none", fontWeight: 500,
            }}>Tư vấn miễn phí</Link>

            {/* ── HAMBURGER BUTTON (mobile only) ── */}
            <button
              className="nb-hamburger"
              onClick={() => setDrawerOpen(true)}
              aria-label="Mở menu"
              style={{
                flexDirection: "column", gap: "5px", alignItems: "center", justifyContent: "center",
                background: "transparent", border: "none", cursor: "pointer",
                padding: "10px", minWidth: "44px", minHeight: "44px",
              }}
            >
              {[0, 1, 2].map(i => (
                <span key={i} style={{ display: "block", width: "22px", height: "2px", background: "#fff", borderRadius: "2px" }} />
              ))}
            </button>
          </div>
        </nav>
      </div>

      {/* ── MOBILE DRAWER (portal ra body) ── */}
      {mounted && drawerOpen && createPortal(
        <div style={{
          position: "fixed", inset: 0,
          background: "#fff",
          zIndex: 9999,
          display: "flex", flexDirection: "column",
          animation: "slideInRight 0.28s ease",
          overflowY: "auto",
        }}>
          {/* Header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 20px", height: "60px",
            borderBottom: "1px solid #f1f5f9", flexShrink: 0,
          }}>
            <Link href="/" onClick={close} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
              <img src="/o.png" alt="BAMBOO100" style={{ width: "28px", height: "28px", borderRadius: "6px" }} />
              <span style={{ color: "#0A1628", fontSize: "14px", fontWeight: 700, letterSpacing: "0.04em" }}>
                BAMBOO<span style={{ color: "#00C389" }}>100</span>
              </span>
            </Link>
            <button onClick={close} style={{
              background: "transparent", border: "none", cursor: "pointer",
              fontSize: "22px", color: "#64748b", lineHeight: 1, padding: "8px",
            }}>✕</button>
          </div>

          {/* Nav links */}
          <div style={{ flex: 1, padding: "8px 0" }}>
            {NAV_LINKS.map((item) => (
              <Link key={item.label} href={item.href} onClick={close} style={{
                display: "block", padding: "16px 24px",
                color: "#0A1628", fontSize: "15px", fontWeight: 500,
                textDecoration: "none", borderBottom: "1px solid #f1f5f9",
              }}>{item.label}</Link>
            ))}

            {/* Học viện — accordion */}
            <button
              onClick={() => setHocVienOpen(!hocVienOpen)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 24px", background: "transparent", border: "none", cursor: "pointer",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <span style={{ color: "#0A1628", fontSize: "15px", fontWeight: 500 }}>Học viện</span>
              <span style={{
                fontSize: "12px", color: "#94a3b8",
                transform: hocVienOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
                display: "inline-block",
              }}>▼</span>
            </button>

            {hocVienOpen && HOC_VIEN_MENU.map((item) => (
              <Link key={item.href} href={item.href} onClick={close} style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "13px 24px 13px 32px",
                color: "#374151", fontSize: "14px",
                textDecoration: "none", borderBottom: "1px solid #f1f5f9",
                background: "#fafafa",
              }}>
                <div style={{
                  width: "30px", height: "30px", borderRadius: "8px", flexShrink: 0,
                  background: item.color + "15",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <i className={`ti ${item.icon}`} style={{ fontSize: "15px", color: item.color }} />
                </div>
                {item.label}
              </Link>
            ))}

            {NAV_LINKS_RIGHT.map((item) => (
              <Link key={item.label} href={item.href} onClick={close} style={{
                display: "block", padding: "16px 24px",
                color: "#0A1628", fontSize: "15px", fontWeight: 500,
                textDecoration: "none", borderBottom: "1px solid #f1f5f9",
              }}>{item.label}</Link>
            ))}

            <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9" }}>
              <Link href="/dang-nhap" onClick={close} style={{
                display: "block", textAlign: "center",
                padding: "12px", borderRadius: "10px",
                color: "#0A1628", fontSize: "15px", fontWeight: 600,
                textDecoration: "none",
                border: "1.5px solid #e2e8f0",
              }}>Đăng nhập</Link>
            </div>
          </div>

          {/* CTA bottom */}
          <div style={{ padding: "20px 24px", flexShrink: 0 }}>
            <Link href="/lien-he#dat-lich" onClick={close} style={{
              display: "block", textAlign: "center",
              background: "#00C389", color: "#fff",
              padding: "14px", borderRadius: "10px",
              fontSize: "15px", fontWeight: 700, textDecoration: "none",
            }}>Tư vấn miễn phí →</Link>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
