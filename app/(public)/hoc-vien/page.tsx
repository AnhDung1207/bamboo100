import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import type { Metadata } from "next"
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
  title: "Học viện",
  description: "Khóa học từ cơ bản đến nâng cao, ebook chuyên sâu và webinar trực tiếp về giao dịch phái sinh hàng hóa từ các chuyên gia BAMBOO100.",
  openGraph: {
    title: "Học viện | BAMBOO100",
    description: "Khóa học từ cơ bản đến nâng cao, ebook chuyên sâu và webinar trực tiếp về giao dịch phái sinh hàng hóa từ các chuyên gia BAMBOO100.",
    url: "https://bamboo100.vn/hoc-vien",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Học viện BAMBOO100" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Học viện | BAMBOO100",
    description: "Khóa học từ cơ bản đến nâng cao, ebook chuyên sâu và webinar trực tiếp về giao dịch phái sinh hàng hóa từ các chuyên gia BAMBOO100.",
    images: ["/og-default.jpg"],
  },
  alternates: {
    canonical: "https://bamboo100.vn/hoc-vien",
  },
}

export default async function HocVienPage() {
  const supabase = await createClient()

  const [{ data: courses }, { data: ebooks }, { data: events }] = await Promise.all([
    supabase.from("courses").select("*").eq("status", "published").order("order_index"),
    supabase.from("ebooks").select("*").order("created_at", { ascending: false }),
    supabase.from("events").select("*").eq("is_public", true)
      .gte("start_at", new Date().toISOString()).order("start_at").limit(5),
  ])

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* ── MOBILE CSS ── */}
      <style>{`
        @media (max-width: 768px) {
          /* Navbar — handled by shared Navbar component */
          .nav-links { display: none !important; }
          .nav-login { display: none !important; }
          .hamburger { display: flex !important; }

          /* Hero */
          .hero-section { padding: 48px 20px 40px !important; }
          .hero-h1 { font-size: 28px !important; }

          /* Tabs */
          .tabs-nav { padding: 0 16px !important; overflow-x: auto !important; }
          .tabs-nav a { padding: 12px 14px !important; font-size: 12px !important; }

          /* Main content */
          .main-content { padding: 40px 16px !important; }

          /* Courses grid */
          .courses-grid { grid-template-columns: 1fr !important; gap: 16px !important; }

          /* Ebook grid */
          .ebook-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 14px !important; }

          /* Event row */
          .event-row { flex-wrap: wrap !important; gap: 12px !important; }
          .event-date-box { width: 52px !important; height: 52px !important; }
          .event-register { width: 100% !important; text-align: center !important; }

          /* CTA bottom */
          .cta-bottom { padding: 48px 20px !important; }
          .cta-bottom h2 { font-size: 22px !important; }
          .cta-btns {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 10px !important;
          }
          .cta-btns a { text-align: center !important; }

          /* Section headers */
          .section-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
          }
        }
      `}</style>

      {/* ── NAVBAR (dùng chung) ── */}
      <Navbar />

      {/* HERO */}
      <div className="hero-section" style={{
        background: "linear-gradient(135deg, #0A1628 0%, #0D2040 100%)",
        padding: "72px 40px 64px", textAlign: "center",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(0,195,137,0.12)", border: "1px solid rgba(0,195,137,0.25)",
          borderRadius: "20px", padding: "5px 14px", marginBottom: "20px",
        }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#00C389", letterSpacing: "0.08em" }}>
            HỌC VIỆN BAMBOO100
          </span>
        </div>
        <h1 className="hero-h1" style={{
          fontSize: "40px", fontWeight: 800, color: "#fff", lineHeight: 1.25, marginBottom: "16px",
        }}>
          Nâng cao kiến thức<br />
          <span style={{ color: "#00C389" }}>giao dịch hàng hóa</span>
        </h1>
        <p style={{
          fontSize: "16px", color: "rgba(255,255,255,0.55)",
          maxWidth: "520px", margin: "0 auto", lineHeight: 1.7,
        }}>
          Khóa học từ cơ bản đến nâng cao, ebook chuyên sâu và webinar
          trực tiếp từ các chuyên gia thị trường hàng hóa.
        </p>
      </div>

      {/* TABS NAV */}
      <div className="tabs-nav" style={{
        borderBottom: "1px solid #e8ecef", background: "#fff", padding: "0 40px",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex" }}>
          {[
            { label: "Khóa học", icon: "ti-school", anchor: "#khoa-hoc" },
            { label: "Thư viện Ebook", icon: "ti-book", anchor: "#ebook" },
            { label: "Sự kiện & Webinar", icon: "ti-calendar-event", anchor: "#su-kien" },
          ].map((tab, i) => (
            <a key={tab.label} href={tab.anchor} style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "14px 20px", fontSize: "13px", fontWeight: i === 0 ? 600 : 400,
              color: i === 0 ? "#0A1628" : "#64748b",
              borderBottom: i === 0 ? "2px solid #00C389" : "2px solid transparent",
              textDecoration: "none", whiteSpace: "nowrap",
            }}>
              <i className={`ti ${tab.icon}`} style={{ fontSize: "15px" }} />
              {tab.label}
            </a>
          ))}
        </div>
      </div>

      <div className="main-content" style={{ maxWidth: "1100px", margin: "0 auto", padding: "56px 40px" }}>

        {/* KHÓA HỌC */}
        <section id="khoa-hoc" style={{ marginBottom: "64px" }}>
          <div className="section-header" style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-end", marginBottom: "32px",
          }}>
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0A1628", marginBottom: "6px" }}>
                <i className="ti ti-school" style={{ color: "#00C389", marginRight: "8px" }} />
                Khóa học
              </h2>
              <p style={{ fontSize: "14px", color: "#64748b" }}>
                Chương trình học bài bản từ nền tảng đến chuyên sâu
              </p>
            </div>
          </div>

          {(!courses || courses.length === 0) ? (
            <div style={{
              textAlign: "center", padding: "60px 20px",
              background: "#f8fafc", borderRadius: "14px", border: "1px solid #e2e8f0",
            }}>
              <i className="ti ti-school" style={{ fontSize: "40px", color: "#cbd5e1", display: "block", marginBottom: "12px" }} />
              <p style={{ fontSize: "14px", color: "#94a3b8" }}>Khóa học sẽ được cập nhật sớm!</p>
            </div>
          ) : (
            <div className="courses-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
              {courses.map((course: any) => (
                <div key={course.id} style={{
                  background: "#fff", borderRadius: "14px",
                  border: "1px solid #e2e8f0", overflow: "hidden",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}>
                  <div style={{
                    height: "140px",
                    background: course.thumbnail_url
                      ? `url(${course.thumbnail_url}) center/cover` : "linear-gradient(135deg, #0A1628, #0D2040)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative",
                  }}>
                    {!course.thumbnail_url && (
                      <i className="ti ti-school" style={{ fontSize: "40px", color: "rgba(0,195,137,0.5)" }} />
                    )}
                    {course.is_premium && (
                      <div style={{
                        position: "absolute", top: "10px", right: "10px",
                        background: "#EF9F27", color: "#fff",
                        fontSize: "9px", fontWeight: 700,
                        padding: "3px 8px", borderRadius: "4px",
                      }}>PREMIUM</div>
                    )}
                  </div>
                  <div style={{ padding: "20px" }}>
                    <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0A1628", marginBottom: "8px", lineHeight: 1.4 }}>
                      {course.title}
                    </h3>
                    {course.description && (
                      <p style={{
                        fontSize: "13px", color: "#64748b", lineHeight: 1.6, marginBottom: "16px",
                        display: "-webkit-box", WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical", overflow: "hidden",
                      } as any}>
                        {course.description}
                      </p>
                    )}
                    <div style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      paddingTop: "12px", borderTop: "1px solid #f1f5f9",
                    }}>
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                        {course.lesson_count || "—"} bài học
                      </span>
                      <Link href={`/hoc-vien/${course.slug}`} style={{
                        background: "#00C389", color: "#fff",
                        fontSize: "12px", fontWeight: 600,
                        padding: "6px 14px", borderRadius: "6px", textDecoration: "none",
                      }}>
                        Xem khóa học
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* EBOOK */}
        <section id="ebook" style={{ marginBottom: "64px" }}>
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0A1628", marginBottom: "6px" }}>
              <i className="ti ti-book" style={{ color: "#00C389", marginRight: "8px" }} />
              Thư viện Ebook
            </h2>
            <p style={{ fontSize: "14px", color: "#64748b" }}>
              Tài liệu PDF miễn phí từ đội ngũ chuyên gia BAMBOO100
            </p>
          </div>

          {(!ebooks || ebooks.length === 0) ? (
            <div style={{
              textAlign: "center", padding: "60px 20px",
              background: "#f8fafc", borderRadius: "14px", border: "1px solid #e2e8f0",
            }}>
              <i className="ti ti-book" style={{ fontSize: "40px", color: "#cbd5e1", display: "block", marginBottom: "12px" }} />
              <p style={{ fontSize: "14px", color: "#94a3b8" }}>Ebook sẽ được cập nhật sớm!</p>
            </div>
          ) : (
            <div className="ebook-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
              {ebooks.map((ebook: any) => (
                <div key={ebook.id} style={{
                  background: "#fff", borderRadius: "12px",
                  border: "1px solid #e2e8f0", padding: "20px",
                }}>
                  <div style={{
                    height: "100px", background: "linear-gradient(135deg, #0A1628, #0D2040)",
                    borderRadius: "8px", display: "flex", alignItems: "center",
                    justifyContent: "center", marginBottom: "14px",
                  }}>
                    <i className="ti ti-file-text" style={{ fontSize: "32px", color: "#00C389" }} />
                  </div>
                  <h3 style={{
                    fontSize: "13px", fontWeight: 600, color: "#0A1628",
                    lineHeight: 1.5, marginBottom: "12px",
                    display: "-webkit-box", WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical", overflow: "hidden",
                  } as any}>
                    {ebook.title}
                  </h3>
                  <a href={ebook.file_url || "#"} target="_blank" rel="noopener noreferrer" style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
                    background: "rgba(0,195,137,0.08)", color: "#00C389",
                    fontSize: "12px", fontWeight: 600, padding: "8px",
                    borderRadius: "7px", textDecoration: "none",
                    border: "1px solid rgba(0,195,137,0.2)",
                  }}>
                    <i className="ti ti-download" style={{ fontSize: "14px" }} />
                    Tải miễn phí
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SỰ KIỆN */}
        <section id="su-kien">
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0A1628", marginBottom: "6px" }}>
              <i className="ti ti-calendar-event" style={{ color: "#00C389", marginRight: "8px" }} />
              Sự kiện & Webinar
            </h2>
            <p style={{ fontSize: "14px", color: "#64748b" }}>
              Webinar trực tiếp và sự kiện sắp diễn ra
            </p>
          </div>

          {(!events || events.length === 0) ? (
            <div style={{
              textAlign: "center", padding: "60px 20px",
              background: "#f8fafc", borderRadius: "14px", border: "1px solid #e2e8f0",
            }}>
              <i className="ti ti-calendar-event" style={{ fontSize: "40px", color: "#cbd5e1", display: "block", marginBottom: "12px" }} />
              <p style={{ fontSize: "14px", color: "#94a3b8" }}>Chưa có sự kiện sắp tới. Hãy quay lại sau!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {events.map((event: any) => {
                const date = new Date(event.start_at)
                return (
                  <div key={event.id} className="event-row" style={{
                    display: "flex", gap: "20px", alignItems: "center",
                    background: "#fff", border: "1px solid #e2e8f0",
                    borderRadius: "12px", padding: "20px",
                  }}>
                    <div className="event-date-box" style={{
                      width: "64px", height: "64px", borderRadius: "12px",
                      background: "linear-gradient(135deg, #0A1628, #0D2040)",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <span style={{ fontSize: "20px", fontWeight: 800, color: "#00C389", lineHeight: 1 }}>
                        {date.getDate()}
                      </span>
                      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>
                        {date.toLocaleDateString("vi-VN", { month: "short" })}
                      </span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0A1628", marginBottom: "4px" }}>
                        {event.title}
                      </h3>
                      <div style={{ fontSize: "12px", color: "#94a3b8", display: "flex", gap: "12px" }}>
                        <span>
                          <i className="ti ti-clock" style={{ marginRight: "4px" }} />
                          {date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {event.location && (
                          <span>
                            <i className="ti ti-map-pin" style={{ marginRight: "4px" }} />
                            {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <Link href="/lien-he" className="event-register" style={{
                      background: "#00C389", color: "#fff",
                      fontSize: "12px", fontWeight: 600,
                      padding: "8px 16px", borderRadius: "7px",
                      textDecoration: "none", whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}>
                      Đăng ký
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>

      {/* CTA BOTTOM */}
      <div className="cta-bottom" style={{
        background: "linear-gradient(135deg, #0A1628, #0D2040)",
        padding: "64px 40px", textAlign: "center",
      }}>
        <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#fff", marginBottom: "12px" }}>
          Bắt đầu học ngay hôm nay
        </h2>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", marginBottom: "28px" }}>
          Đăng ký tài khoản miễn phí để truy cập tài liệu và khóa học cơ bản
        </p>
        <div className="cta-btns" style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link href="/dang-ky" style={{
            background: "#00C389", color: "#fff", fontSize: "14px", fontWeight: 700,
            padding: "13px 32px", borderRadius: "8px", textDecoration: "none",
          }}>
            Đăng ký miễn phí →
          </Link>
          <Link href="/lien-he" style={{
            background: "rgba(255,255,255,0.07)", color: "#fff", fontSize: "14px",
            padding: "13px 32px", borderRadius: "8px", textDecoration: "none",
            border: "1px solid rgba(255,255,255,0.15)",
          }}>
            Tư vấn khóa học
          </Link>
        </div>
      </div>

    </div>
  )
}
