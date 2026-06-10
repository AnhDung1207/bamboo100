"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { User, Bookmark, LogOut, ChevronDown, LayoutDashboard } from "lucide-react"

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
  const router = useRouter()
  const pathname = usePathname()
  const isDarkHero = pathname === "/" || pathname.startsWith("/phan-tich/") || pathname.startsWith("/hoc-vien/nen-tang-kien-thuc/") || pathname === "/gioi-thieu"
  const isHiddenRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/admin")
  const supabase = createClient()

  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<{ full_name: string | null; role: string | null } | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const [megaOpen, setMegaOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [hocVienOpen, setHocVienOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    const initAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data } = await supabase.from("profiles").select("full_name, role").eq("id", user.id).single()
        setProfile(data)
      }
    }
    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        supabase.from("profiles").select("full_name, role").eq("id", session.user.id).single()
          .then(({ data }) => setProfile(data))
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      subscription.unsubscribe()
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const lock = drawerOpen ? "hidden" : ""
    document.body.style.overflow = lock
    document.documentElement.style.overflow = lock
    return () => {
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
    }
  }, [drawerOpen])

  if (isHiddenRoute) return null

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setUserMenuOpen(false)
    router.push("/")
    router.refresh()
  }

  const close = () => setDrawerOpen(false)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setMegaOpen(true)
  }
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setMegaOpen(false), 150)
  }

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Tài khoản"
  const avatarLetter = displayName[0].toUpperCase()
  const isAdminOrEditor = profile?.role === "admin" || profile?.role === "editor"

  // ── MÀU SẮC NAVBAR ──
  // FIX 1: Giảm threshold từ 300 → 180 để transition nhanh hơn như XTB
  const SCROLL_THRESHOLD = 80
  const rawRatio = Math.min(scrollY / SCROLL_THRESHOLD, 1)
const ratio = Math.pow(rawRatio, 0.6)
  const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t)

  const navBg = isDarkHero
    ? `rgba(255,255,255,${ratio})`
    : "rgba(255,255,255,0.97)"

  const borderColor = isDarkHero
    ? `rgba(0,0,0,${0.08 * ratio})`
    : `rgba(0,0,0,${0.05 + 0.08 * ratio})`

  const boxShadow = isDarkHero
    ? (ratio > 0.05 ? `0 2px 20px rgba(0,0,0,${0.08 * ratio})` : "none")
    : (ratio > 0.05 ? `0 1px 10px rgba(0,0,0,${0.05 * ratio})` : "none")

  const accentScaleX = isDarkHero ? 0 : ratio

  // FIX 2: Opacity chữ trắng = 1 (thay vì 0.65) khi ở đầu trang — giống XTB
  const linkColor = isDarkHero
    ? `rgba(${lerp(255, 15, ratio)},${lerp(255, 25, ratio)},${lerp(255, 50, ratio)},1)`
    : "rgba(15,25,50,1)"

  const logoColor = isDarkHero
    ? `rgb(${lerp(255, 10, ratio)},${lerp(255, 22, ratio)},${lerp(255, 40, ratio)})`
    : "rgb(10,22,40)"

  // FIX 3: loginColor opacity = 1 thay vì 0.75
  const loginColor = isDarkHero
    ? `rgba(${lerp(255, 10, ratio)},${lerp(255, 22, ratio)},${lerp(255, 40, ratio)},1)`
    : "rgba(10,22,40,1)"

  // FIX 4: loginBorder rõ hơn ở đầu trang (opacity 0.5 → đủ thấy trên hero tối)
  const loginBorder = isDarkHero
    ? `1px solid rgba(${lerp(255, 10, ratio)},${lerp(255, 22, ratio)},${lerp(255, 40, ratio)},${(0.5 - 0.35 * ratio).toFixed(2)})`
    : "1px solid rgba(10,22,40,0.25)"

  const hamColor = isDarkHero
    ? `rgb(${lerp(255, 10, ratio)},${lerp(255, 22, ratio)},${lerp(255, 40, ratio)})`
    : "rgb(10,22,40)"

  const userBtnBg = isDarkHero
    ? `rgba(0,195,137,${(lerp(8, 12, ratio) / 100).toFixed(2)})`
    : "rgba(0,195,137,0.10)"

  const userBtnBorder = isDarkHero
    ? `1px solid rgba(0,195,137,${(lerp(20, 45, ratio) / 100).toFixed(2)})`
    : "1px solid rgba(0,195,137,0.35)"

  const userNameColor = isDarkHero
    ? `rgba(${lerp(255, 10, ratio)},${lerp(255, 22, ratio)},${lerp(255, 40, ratio)},1)`
    : "rgba(10,22,40,1)"

  const chevronColor = isDarkHero
    ? `rgba(${lerp(255, 10, ratio)},${lerp(255, 22, ratio)},${lerp(255, 40, ratio)},${(0.6 - 0.2 * ratio).toFixed(2)})`
    : "rgba(10,22,40,1)"

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
        .user-menu {
          position: absolute; top: calc(100% + 10px); right: 0;
          background: #fff; border: 0.5px solid #e2e8f0;
          border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.10);
          padding: 6px; min-width: 210px; z-index: 200;
          animation: fadeDown2 0.15s ease;
        }
        @keyframes fadeDown2 {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .user-menu-item {
          display: flex; align-items: center; gap: 9px;
          padding: 10px 14px; border-radius: 8px;
          font-size: 13px; text-decoration: none; color: #475569;
          transition: background 0.12s, color 0.12s; cursor: pointer;
          font-family: 'DM Sans', sans-serif; border: none; background: transparent;
          width: 100%; text-align: left;
        }
        .user-menu-item:hover { background: #f8fafc; color: #0A1628; }
        .user-menu-item.danger:hover { background: rgba(239,68,68,0.06); color: #ef4444; }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @media (max-width: 767px) {
          .nb-desktop   { display: none !important; }
          .nb-hamburger { display: flex !important; }
          .nb-nav { padding: 0 16px !important; }
        }
      `}</style>

      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100 }}>
        <nav className="nb-nav" style={{
          background: navBg,
          boxShadow,
          // FIX 5: Thêm border-color vào transition để không bị flash
          transition: "background 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
          display: "flex", alignItems: "center",
          justifyContent: "flex-start", gap: "8px", padding: "0 40px", height: "60px",
          borderBottom: `1px solid ${borderColor}`,
          position: "relative", zIndex: 100,
        }}>
          {/* Accent line — chỉ hiện trên trang trắng khi scroll */}
          {!isDarkHero && (
            <div style={{
              position: "absolute", bottom: 0, left: 0,
              width: "100%", height: "2px",
              background: "#00C389",
              transform: `scaleX(${accentScaleX})`,
              transformOrigin: "left",
              transition: "transform 0.25s ease",
              pointerEvents: "none",
            }} />
          )}

          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            <img src="/o.png" alt="BAMBOO100" style={{ width: "34px", height: "34px", borderRadius: "8px" }} />
            <span style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "0.04em", color: logoColor, transition: "color 0.3s ease" }}>
              BAMBOO<span style={{ color: "#00C389" }}>100</span>
            </span>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <div className="nb-desktop" style={{ position: "relative", marginLeft: "24px" }}>
            {NAV_LINKS.map((item) => (
              <Link key={item.label} href={item.href} style={{
                color: linkColor, fontSize: "13px", fontWeight: 600,
                padding: "6px 12px", borderRadius: "6px", textDecoration: "none",
                transition: "color 0.3s ease",
              }}>{item.label}</Link>
            ))}

            {/* Học viện mega menu */}
            <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ position: "relative" }}>
              <span style={{
                color: linkColor, fontSize: "13px", fontWeight: 600,
                padding: "6px 12px", borderRadius: "6px",
                display: "flex", alignItems: "center", transition: "color 0.3s ease",
                cursor: "default",
              }}>Học viện</span>

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
                color: linkColor, fontSize: "13px", fontWeight: 600,
                padding: "6px 12px", borderRadius: "6px", textDecoration: "none",
                transition: "color 0.3s ease",
              }}>{item.label}</Link>
            ))}
          </div>

          {/* ── RIGHT SIDE ── */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexShrink: 0, marginLeft: "auto" }}>
            {user ? (
              <div ref={userMenuRef} style={{ position: "relative" }} className="nb-desktop">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    background: userBtnBg, border: userBtnBorder,
                    borderRadius: "8px", padding: "6px 12px 6px 6px",
                    cursor: "pointer", transition: "background 0.3s ease, border-color 0.3s ease",
                  }}
                  onMouseOver={e => (e.currentTarget.style.borderColor = "rgba(0,195,137,0.6)")}
                  onMouseOut={e => (e.currentTarget.style.borderColor = "")}
                >
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #00C389, #00966B)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "12px", fontWeight: 700, color: "#fff", flexShrink: 0,
                  }}>
                    {avatarLetter}
                  </div>
                  <span style={{ color: userNameColor, fontSize: "13px", fontWeight: 600, maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", transition: "color 0.3s ease" }}>
                    {displayName}
                  </span>
                  <ChevronDown
                    size={13}
                    color={chevronColor}
                    style={{ flexShrink: 0, transform: userMenuOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s, color 0.3s ease" }}
                  />
                </button>

                {userMenuOpen && (
                  <div className="user-menu">
                    <div style={{ padding: "10px 14px 8px", borderBottom: "0.5px solid #f1f5f9", marginBottom: "4px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#0A1628" }}>{displayName}</div>
                      <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>{user.email}</div>
                    </div>

                    {isAdminOrEditor && (
                      <>
                        <Link href="/admin" className="user-menu-item" onClick={() => setUserMenuOpen(false)} style={{ color: "#00C389" }}>
                          <LayoutDashboard size={14} />
                          Admin Panel
                        </Link>
                        <div style={{ borderTop: "0.5px solid #f1f5f9", margin: "4px 0" }} />
                      </>
                    )}
                    <Link href="/dashboard" className="user-menu-item" onClick={() => setUserMenuOpen(false)}>
                      <User size={14} />
                      Trang cá nhân
                    </Link>
                    <Link href="/dashboard" className="user-menu-item" onClick={() => setUserMenuOpen(false)}>
                      <Bookmark size={14} />
                      Bài đã lưu
                    </Link>

                    <div style={{ borderTop: "0.5px solid #f1f5f9", marginTop: "4px", paddingTop: "4px" }} />

                    <button className="user-menu-item danger" onClick={handleLogout}>
                      <LogOut size={14} />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/dang-nhap" className="nb-desktop" style={{
                  color: loginColor, fontSize: "13px", fontWeight: 600, padding: "7px 16px",
                  border: loginBorder, borderRadius: "7px", textDecoration: "none",
                  transition: "color 0.3s ease, border-color 0.3s ease",
                }}>Đăng nhập</Link>
                <Link href="/lien-he#dat-lich" className="nb-desktop" style={{
                  background: "#00C389", color: "#fff", fontSize: "13px",
                  padding: "8px 16px", borderRadius: "7px", textDecoration: "none", fontWeight: 600,
                }}>Tư vấn miễn phí</Link>
              </>
            )}

            {/* Hamburger */}
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
                <span key={i} style={{
                  display: "block", width: "22px", height: "2px",
                  background: hamColor, borderRadius: "2px",
                  transition: "background 0.3s ease",
                }} />
              ))}
            </button>
          </div>
        </nav>
      </div>

      {/* ── MOBILE DRAWER ── */}
      {mounted && drawerOpen && createPortal(
        <div style={{
          position: "fixed", inset: 0, background: "#fff", zIndex: 9999,
          display: "flex", flexDirection: "column",
          animation: "slideInRight 0.28s ease", overflowY: "auto",
        }}>
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
              color: "#64748b", lineHeight: 1, padding: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 2l14 14M16 2L2 16" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {user && (
            <div style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "16px 24px", background: "#f8fafc",
              borderBottom: "1px solid #f1f5f9",
            }}>
              <div style={{
                width: "38px", height: "38px", borderRadius: "50%",
                background: "linear-gradient(135deg, #00C389, #00966B)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", fontWeight: 700, color: "#fff", flexShrink: 0,
              }}>
                {avatarLetter}
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#0A1628" }}>{displayName}</div>
                <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "1px" }}>{user.email}</div>
              </div>
            </div>
          )}

          <div style={{ flex: 1, padding: "8px 0" }}>
            {NAV_LINKS.map((item) => (
              <Link key={item.label} href={item.href} onClick={close} style={{
                display: "block", padding: "16px 24px",
                color: "#0A1628", fontSize: "15px", fontWeight: 600,
                textDecoration: "none", borderBottom: "1px solid #f1f5f9",
              }}>{item.label}</Link>
            ))}

            <button
              onClick={() => setHocVienOpen(!hocVienOpen)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 24px", background: "transparent", border: "none", cursor: "pointer",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <span style={{ color: "#0A1628", fontSize: "15px", fontWeight: 600 }}>Học viện</span>
              <ChevronDown
                size={16}
                color="#94a3b8"
                style={{ transform: hocVienOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
              />
            </button>

            {hocVienOpen && HOC_VIEN_MENU.map((item) => (
              <Link key={item.href} href={item.href} onClick={close} style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "13px 24px 13px 32px",
                color: "#374151", fontSize: "14px", fontWeight: 600,
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
                color: "#0A1628", fontSize: "15px", fontWeight: 600,
                textDecoration: "none", borderBottom: "1px solid #f1f5f9",
              }}>{item.label}</Link>
            ))}

            {user ? (
              <>
                {isAdminOrEditor && (
                  <Link href="/admin" onClick={close} style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "16px 24px", color: "#00C389", fontSize: "15px", fontWeight: 600,
                    textDecoration: "none", borderBottom: "1px solid #f1f5f9",
                    background: "rgba(0,195,137,0.04)",
                  }}>
                    <LayoutDashboard size={17} color="#00C389" />
                    Admin Panel
                  </Link>
                )}
                <Link href="/dashboard" onClick={close} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "16px 24px", color: "#0A1628", fontSize: "15px", fontWeight: 600,
                  textDecoration: "none", borderBottom: "1px solid #f1f5f9",
                }}>
                  <User size={17} color="#64748b" />
                  Trang cá nhân
                </Link>
                <button onClick={() => { handleLogout(); close() }} style={{
                  width: "100%", textAlign: "left",
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "16px 24px", color: "#ef4444", fontSize: "15px", fontWeight: 600,
                  background: "transparent", border: "none", borderBottom: "1px solid #f1f5f9",
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                }}>
                  <LogOut size={17} color="#ef4444" />
                  Đăng xuất
                </button>
              </>
            ) : (
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9" }}>
                <Link href="/dang-nhap" onClick={close} style={{
                  display: "block", textAlign: "center",
                  padding: "12px", borderRadius: "10px",
                  color: "#0A1628", fontSize: "15px", fontWeight: 600,
                  textDecoration: "none", border: "1.5px solid #e2e8f0",
                }}>Đăng nhập</Link>
              </div>
            )}
          </div>

          {!user && (
            <div style={{ padding: "20px 24px", flexShrink: 0 }}>
              <Link href="/lien-he#dat-lich" onClick={close} style={{
                display: "block", textAlign: "center",
                background: "#00C389", color: "#fff",
                padding: "14px", borderRadius: "10px",
                fontSize: "15px", fontWeight: 700, textDecoration: "none",
              }}>Tư vấn miễn phí →</Link>
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  )
}
