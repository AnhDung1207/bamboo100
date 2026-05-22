import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import type { Metadata } from "next"
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
  title: "Dịch vụ",
  description: "Giải pháp toàn diện cho nhà đầu tư hàng hóa — tư vấn chiến lược, quản lý danh mục, phân tích thị trường và đào tạo chuyên sâu từ BAMBOO100.",
  openGraph: {
    title: "Dịch vụ | BAMBOO100",
    description: "Giải pháp toàn diện cho nhà đầu tư hàng hóa — tư vấn chiến lược, quản lý danh mục, phân tích thị trường và đào tạo chuyên sâu từ BAMBOO100.",
    url: "https://bamboo100.vn/dich-vu",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Dịch vụ BAMBOO100" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dịch vụ | BAMBOO100",
    description: "Giải pháp toàn diện cho nhà đầu tư hàng hóa — tư vấn chiến lược, quản lý danh mục, phân tích thị trường và đào tạo chuyên sâu từ BAMBOO100.",
    images: ["/og-default.jpg"],
  },
  alternates: {
    canonical: "https://bamboo100.vn/dich-vu",
  },
}

const FALLBACK_SERVICES = [
  {
    id: 1, title: "Tư vấn chiến lược giao dịch", slug: "tu-van",
    description: "Chuyên gia đồng hành cùng bạn xây dựng chiến lược giao dịch phù hợp với khẩu vị rủi ro và mục tiêu tài chính.",
    icon: "ti-chart-line",
  },
  {
    id: 2, title: "Quản lý danh mục hàng hóa", slug: "quan-ly",
    description: "Dịch vụ quản lý và tối ưu danh mục đầu tư hàng hóa phái sinh cho cá nhân và doanh nghiệp.",
    icon: "ti-briefcase",
  },
  {
    id: 3, title: "Phân tích thị trường chuyên sâu", slug: "phan-tich",
    description: "Báo cáo phân tích cung-cầu chuyên sâu về vàng, dầu thô, cà phê, đồng và các hàng hóa phái sinh.",
    icon: "ti-file-analytics",
  },
  {
    id: 4, title: "Đào tạo & Học viện", slug: "dao-tao",
    description: "Chương trình đào tạo từ cơ bản đến nâng cao về giao dịch phái sinh hàng hóa trên thị trường quốc tế.",
    icon: "ti-school",
  },
]

const ICON_MAP: Record<string, string> = {
  "ti-chart-bar": "ti-chart-bar",
  "ti-chart-line": "ti-chart-line",
  "ti-briefcase": "ti-briefcase",
  "ti-file-analytics": "ti-file-analytics",
  "ti-school": "ti-school",
  "ti-users": "ti-users",
  "ti-bolt": "ti-bolt",
  "ti-crown": "ti-crown",
}

export default async function DichVuPage() {
  const supabase = await createClient()
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("order_index")

  const displayServices = (services && services.length > 0) ? services : FALLBACK_SERVICES

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
          .hero-section {
            padding: 48px 20px 40px !important;
          }
          .hero-h1 { font-size: 28px !important; }
          .hero-btns {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 10px !important;
          }
          .hero-btns a { text-align: center !important; }

          /* Stats */
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            padding: 24px 20px !important;
            gap: 16px !important;
          }
          .stats-grid > div {
            border-right: none !important;
            border-bottom: 1px solid #e8ecef !important;
            padding-bottom: 16px !important;
          }
          .stats-grid > div:nth-child(3),
          .stats-grid > div:nth-child(4) {
            border-bottom: none !important;
          }

          /* Services grid */
          .services-section { padding: 48px 20px !important; }
          .services-grid { grid-template-columns: 1fr !important; gap: 16px !important; }

          /* Why us */
          .why-section { padding: 48px 20px !important; }
          .why-grid { grid-template-columns: 1fr !important; gap: 16px !important; }

          /* CTA bottom */
          .cta-bottom { padding: 48px 20px !important; }
          .cta-bottom h2 { font-size: 22px !important; }
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
            DỊCH VỤ CHUYÊN NGHIỆP
          </span>
        </div>
        <h1 className="hero-h1" style={{
          fontSize: "40px", fontWeight: 800, color: "#fff",
          lineHeight: 1.25, marginBottom: "16px",
        }}>
          Giải pháp toàn diện cho<br />
          <span style={{ color: "#00C389" }}>nhà đầu tư hàng hóa</span>
        </h1>
        <p style={{
          fontSize: "16px", color: "rgba(255,255,255,0.55)",
          maxWidth: "540px", margin: "0 auto 32px", lineHeight: 1.7,
        }}>
          Từ tư vấn chiến lược, quản lý danh mục đến đào tạo chuyên sâu —
          BAMBOO100 đồng hành cùng bạn trên từng bước đầu tư.
        </p>
        <div className="hero-btns" style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link href="/lien-he" style={{
            background: "#00C389", color: "#fff", fontSize: "14px", fontWeight: 600,
            padding: "12px 28px", borderRadius: "8px", textDecoration: "none",
          }}>
            Nhận tư vấn miễn phí →
          </Link>
          <Link href="/phan-tich" style={{
            background: "rgba(255,255,255,0.07)", color: "#fff", fontSize: "14px",
            padding: "12px 28px", borderRadius: "8px", textDecoration: "none",
            border: "1px solid rgba(255,255,255,0.15)",
          }}>
            Xem phân tích mẫu
          </Link>
        </div>
      </div>

      {/* STATS */}
      <div style={{ background: "#f8fafc", borderBottom: "1px solid #e8ecef" }}>
        <div className="stats-grid" style={{
          maxWidth: "1100px", margin: "0 auto", padding: "32px 40px",
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        }}>
          {[
            { value: "5+", label: "Năm kinh nghiệm" },
            { value: "500+", label: "Khách hàng tin dùng" },
            { value: "12+", label: "Hàng hóa phân tích" },
            { value: "98%", label: "Tỷ lệ hài lòng" },
          ].map((s, i) => (
            <div key={s.label} style={{
              textAlign: "center", padding: "8px 20px",
              borderRight: i < 3 ? "1px solid #e8ecef" : "none",
            }}>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "#00C389", marginBottom: "4px" }}>
                {s.value}
              </div>
              <div style={{ fontSize: "13px", color: "#64748b" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES GRID */}
      <div className="services-section" style={{ maxWidth: "1100px", margin: "0 auto", padding: "64px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "30px", fontWeight: 800, color: "#0A1628", marginBottom: "12px" }}>
            Dịch vụ của chúng tôi
          </h2>
          <p style={{ fontSize: "15px", color: "#64748b", maxWidth: "480px", margin: "0 auto" }}>
            Mỗi dịch vụ được thiết kế riêng để đáp ứng nhu cầu đầu tư đa dạng
          </p>
        </div>
        <div className="services-grid" style={{
          display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px",
        }}>
          {displayServices.map((service: any) => (
            <div key={service.id} style={{
              background: "#fff", borderRadius: "16px",
              border: "1px solid #e2e8f0", padding: "32px",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "12px",
                background: "rgba(0,195,137,0.08)", border: "1px solid rgba(0,195,137,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "20px",
              }}>
                <i className={`ti ${ICON_MAP[service.icon] || "ti-chart-bar"}`}
                  style={{ fontSize: "24px", color: "#00C389" }} />
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#0A1628", marginBottom: "10px" }}>
                {service.title}
              </h3>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.7, marginBottom: "20px" }}>
                {service.description}
              </p>
              <Link href="/lien-he" style={{
                fontSize: "13px", fontWeight: 600, color: "#00C389",
                textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px",
              }}>
                Tìm hiểu thêm <i className="ti ti-arrow-right" style={{ fontSize: "14px" }} />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* WHY US */}
      <div className="why-section" style={{ background: "#f8fafc", padding: "64px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#0A1628", marginBottom: "12px" }}>
              Tại sao chọn BAMBOO100?
            </h2>
          </div>
          <div className="why-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {[
              {
                icon: "ti-shield-check",
                title: "Minh bạch & Uy tín",
                desc: "Mọi phân tích đều có dữ liệu nguồn rõ ràng, không hứa hẹn lợi nhuận phi thực tế.",
              },
              {
                icon: "ti-users",
                title: "Chuyên gia giàu kinh nghiệm",
                desc: "Đội ngũ có hơn 5 năm kinh nghiệm giao dịch thực tế trên sàn quốc tế.",
              },
              {
                icon: "ti-headset",
                title: "Hỗ trợ 1-1 tận tâm",
                desc: "Mỗi khách hàng được phân công chuyên gia riêng, hỗ trợ liên tục trong giờ giao dịch.",
              },
            ].map((item) => (
              <div key={item.title} style={{
                background: "#fff", borderRadius: "14px",
                border: "1px solid #e2e8f0", padding: "28px", textAlign: "center",
              }}>
                <div style={{
                  width: "56px", height: "56px", borderRadius: "14px",
                  background: "#0A1628", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px",
                }}>
                  <i className={`ti ${item.icon}`} style={{ fontSize: "24px", color: "#00C389" }} />
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0A1628", marginBottom: "8px" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA BOTTOM */}
      <div className="cta-bottom" style={{
        background: "linear-gradient(135deg, #0A1628, #0D2040)",
        padding: "64px 40px", textAlign: "center",
      }}>
        <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#fff", marginBottom: "12px" }}>
          Sẵn sàng bắt đầu hành trình đầu tư?
        </h2>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", marginBottom: "28px" }}>
          Đặt lịch tư vấn miễn phí — chuyên gia sẽ liên hệ trong vòng 24 giờ
        </p>
        <Link href="/lien-he" style={{
          background: "#00C389", color: "#fff", fontSize: "15px", fontWeight: 700,
          padding: "14px 36px", borderRadius: "10px", textDecoration: "none",
        }}>
          Đặt lịch tư vấn miễn phí →
        </Link>
      </div>

    </div>
  )
}
