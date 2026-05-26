import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
  title: "Về chúng tôi",
  description: "BAMBOO100 là nền tảng phân tích phái sinh hàng hóa hàng đầu Việt Nam, cung cấp thông tin thị trường chuyên sâu và tư vấn chiến lược cho nhà đầu tư cá nhân và doanh nghiệp.",
  openGraph: {
    title: "Về chúng tôi | BAMBOO100",
    description: "BAMBOO100 là nền tảng phân tích phái sinh hàng hóa hàng đầu Việt Nam, cung cấp thông tin thị trường chuyên sâu và tư vấn chiến lược cho nhà đầu tư cá nhân và doanh nghiệp.",
    url: "https://bamboo100.vn/ve-chung-toi",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Về chúng tôi | BAMBOO100" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Về chúng tôi | BAMBOO100",
    description: "BAMBOO100 là nền tảng phân tích phái sinh hàng hóa hàng đầu Việt Nam.",
    images: ["/og-default.jpg"],
  },
  alternates: {
    canonical: "https://bamboo100.vn/ve-chung-toi",
  },
}

export default function VeChungToiPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", background: "#fff", minHeight: "100vh" }}>

      <style>{`
        /* ── Navbar ── */
        .nav-links  { display: flex !important; }
        .nav-login  { display: inline-flex !important; }
        .hamburger  { display: none !important; }

        /* ── Stats ── */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        .stats-item-border { border-right: 1px solid #e8ecef; }

        /* ── Mission ── */
        .mission-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
        }

        /* ── Values ── */
        .values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        /* ── Team ── */
        .team-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }

        /* ── CTA buttons ── */
        .cta-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* ── Hero ── */
        .hero-section {
          padding: 100px 40px 72px;
          text-align: center;
        }
        .hero-title { font-size: 40px; }

        @media (max-width: 768px) {
          /* Navbar */
          .nav-links  { display: none !important; }
          .nav-login  { display: none !important; }
          .hamburger  { display: flex !important; }

          /* Hero */
          .hero-section { padding: 90px 20px 40px !important; }
          .hero-title   { font-size: 26px !important; }

          /* Stats */
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            padding: 24px 20px !important;
            gap: 0 !important;
          }
          .stats-item-border {
            border-right: none !important;
            border-bottom: 1px solid #e8ecef;
          }
          .stats-item-border:nth-child(odd)  { border-right: 1px solid #e8ecef !important; }
          .stats-item-border:nth-child(3)    { border-bottom: none !important; }
          .stats-item-last                   { border-bottom: none !important; }

          /* Mission */
          .mission-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
            padding: 48px 20px !important;
          }

          /* Values */
          .values-grid {
            grid-template-columns: 1fr !important;
          }
          .values-section { padding: 48px 20px !important; }

          /* Team */
          .team-grid {
            grid-template-columns: 1fr !important;
          }
          .team-section { padding: 48px 20px !important; }

          /* CTA */
          .cta-section  { padding: 56px 20px !important; }
          .cta-buttons  { flex-direction: column; align-items: center; }
          .cta-buttons a { width: 100%; max-width: 320px; text-align: center; }
        }
      `}</style>

      {/* NAVBAR — dùng component dùng chung */}
      <Navbar />

      {/* HERO */}
      <div className="hero-section" style={{
        background: "linear-gradient(135deg, #0A1628 0%, #0D2040 100%)",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(0,195,137,0.12)", border: "1px solid rgba(0,195,137,0.25)",
          borderRadius: "20px", padding: "5px 14px", marginBottom: "20px",
        }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#00C389", letterSpacing: "0.08em" }}>
            VỀ CHÚNG TÔI
          </span>
        </div>
        <h1 className="hero-title" style={{
          fontWeight: 800, color: "#fff", lineHeight: 1.25, marginBottom: "16px",
        }}>
          Đồng hành cùng nhà đầu tư<br />
          <span style={{ color: "#00C389" }}>trên thị trường hàng hóa</span>
        </h1>
        <p style={{
          fontSize: "16px", color: "rgba(255,255,255,0.55)",
          maxWidth: "560px", margin: "0 auto", lineHeight: 1.7,
        }}>
          BAMBOO100 được thành lập với sứ mệnh mang đến thông tin phân tích chuyên sâu,
          minh bạch và thực tế cho cộng đồng đầu tư hàng hóa Việt Nam.
        </p>
      </div>

      {/* STATS */}
      <div style={{ background: "#f8fafc", borderBottom: "1px solid #e8ecef" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 40px" }}>
          <div className="stats-grid">
            {[
              { value: "5+",    label: "Năm kinh nghiệm",      last: false },
              { value: "500+",  label: "Khách hàng tin dùng",  last: false },
              { value: "1,200+",label: "Bài phân tích đã đăng",last: false },
              { value: "98%",   label: "Tỷ lệ hài lòng",       last: true  },
            ].map((s) => (
              <div
                key={s.label}
                className={s.last ? "stats-item-last" : "stats-item-border"}
                style={{ textAlign: "center", padding: "12px 20px" }}
              >
                <div style={{ fontSize: "32px", fontWeight: 800, color: "#00C389", marginBottom: "4px" }}>
                  {s.value}
                </div>
                <div style={{ fontSize: "13px", color: "#64748b" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SỨ MỆNH & TẦM NHÌN */}
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div className="mission-grid" style={{ padding: "72px 40px" }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "rgba(0,195,137,0.08)", borderRadius: "6px",
              padding: "4px 10px", marginBottom: "16px",
            }}>
              <i className="ti ti-target" style={{ fontSize: "14px", color: "#00C389" }} />
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#00C389", letterSpacing: "0.06em" }}>SỨ MỆNH</span>
            </div>
            <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#0A1628", lineHeight: 1.35, marginBottom: "16px" }}>
              Minh bạch hóa thông tin thị trường hàng hóa
            </h2>
            <p style={{ fontSize: "15px", color: "#64748b", lineHeight: 1.8, marginBottom: "16px" }}>
              Chúng tôi tin rằng mọi nhà đầu tư đều xứng đáng được tiếp cận thông tin
              phân tích chất lượng cao — không chỉ dành riêng cho tổ chức lớn.
            </p>
            <p style={{ fontSize: "15px", color: "#64748b", lineHeight: 1.8 }}>
              BAMBOO100 cung cấp phân tích cung-cầu thực tế, kịch bản thị trường rõ ràng
              và tư vấn chiến lược 1-1, giúp nhà đầu tư đưa ra quyết định tự tin hơn.
            </p>
          </div>
          <div style={{
            background: "linear-gradient(135deg, #0A1628, #0D2040)",
            borderRadius: "20px", padding: "40px",
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "rgba(0,195,137,0.12)", borderRadius: "6px",
              padding: "4px 10px", marginBottom: "20px",
            }}>
              <i className="ti ti-eye" style={{ fontSize: "14px", color: "#00C389" }} />
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#00C389", letterSpacing: "0.06em" }}>TẦM NHÌN</span>
            </div>
            <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", lineHeight: 1.4, marginBottom: "16px" }}>
              Trở thành nền tảng phân tích hàng hóa số 1 Đông Nam Á vào 2030
            </h3>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.8 }}>
              Xây dựng cộng đồng nhà đầu tư hàng hóa chuyên nghiệp, am hiểu thị trường
              và có khả năng tự đưa ra quyết định đầu tư hiệu quả.
            </p>
          </div>
        </div>
      </div>

      {/* GIÁ TRỊ CỐT LÕI */}
      <div className="values-section" style={{ background: "#f8fafc", padding: "72px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#0A1628", marginBottom: "12px" }}>
              Giá trị cốt lõi
            </h2>
            <p style={{ fontSize: "15px", color: "#64748b" }}>
              Những nguyên tắc định hướng mọi hoạt động của BAMBOO100
            </p>
          </div>
          <div className="values-grid">
            {[
              { icon: "ti-shield-check", title: "Minh bạch",
                desc: "Mọi phân tích đều có dữ liệu nguồn rõ ràng. Chúng tôi không hứa hẹn lợi nhuận và luôn nêu rõ rủi ro." },
              { icon: "ti-chart-dots", title: "Chuyên sâu",
                desc: "Phân tích dựa trên dữ liệu cung-cầu thực tế, báo cáo COT, macro kinh tế — không phải cảm tính." },
              { icon: "ti-users", title: "Tận tâm",
                desc: "Mỗi khách hàng là một đối tác. Chúng tôi đặt lợi ích dài hạn của khách hàng lên hàng đầu." },
              { icon: "ti-refresh", title: "Cập nhật liên tục",
                desc: "Thị trường hàng hóa biến động 24/7. Chúng tôi theo dõi và cập nhật thông tin nhanh nhất có thể." },
              { icon: "ti-school", title: "Giáo dục",
                desc: "Chúng tôi không chỉ cho bạn cá — chúng tôi dạy bạn cách câu cá trên thị trường hàng hóa toàn cầu." },
              { icon: "ti-award", title: "Chất lượng",
                desc: "Thà ít mà chất lượng. Mỗi bài phân tích được kiểm duyệt kỹ trước khi đến tay nhà đầu tư." },
            ].map((item) => (
              <div key={item.title} style={{
                background: "#fff", borderRadius: "14px",
                border: "1px solid #e2e8f0", padding: "28px",
              }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "12px",
                  background: "#0A1628", display: "flex",
                  alignItems: "center", justifyContent: "center", marginBottom: "16px",
                }}>
                  <i className={`ti ${item.icon}`} style={{ fontSize: "22px", color: "#00C389" }} />
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

      {/* ĐỘI NGŨ */}
      <div className="team-section" style={{ maxWidth: "1100px", margin: "0 auto", padding: "72px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#0A1628", marginBottom: "12px" }}>
            Đội ngũ sáng lập
          </h2>
          <p style={{ fontSize: "15px", color: "#64748b" }}>
            Những chuyên gia có kinh nghiệm thực chiến trên thị trường hàng hóa quốc tế
          </p>
        </div>
        <div className="team-grid">
          {[
            { name: "Nguyễn Anh Dũng", role: "CEO & Founder",
              desc: "10+ năm kinh nghiệm giao dịch phái sinh hàng hóa tại các sàn quốc tế CME, ICE.", icon: "ti-user-circle" },
            { name: "Trần Thị Lan Anh", role: "Head of Research",
              desc: "Chuyên gia phân tích vĩ mô và cung-cầu hàng hóa.", icon: "ti-user-circle" },
            { name: "Lê Hoàng Nam", role: "Head of Education",
              desc: "Đào tạo hơn 2,000 nhà đầu tư về giao dịch phái sinh hàng hóa trong 5 năm qua.", icon: "ti-user-circle" },
          ].map((member) => (
            <div key={member.name} style={{
              background: "#fff", borderRadius: "16px",
              border: "1px solid #e2e8f0", padding: "28px", textAlign: "center",
            }}>
              <div style={{
                width: "72px", height: "72px", borderRadius: "50%",
                background: "linear-gradient(135deg, #0A1628, #0D2040)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px",
              }}>
                <i className={`ti ${member.icon}`} style={{ fontSize: "32px", color: "#00C389" }} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0A1628", marginBottom: "4px" }}>
                {member.name}
              </h3>
              <div style={{
                fontSize: "12px", fontWeight: 600, color: "#00C389",
                marginBottom: "12px", letterSpacing: "0.04em",
              }}>
                {member.role}
              </div>
              <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.7 }}>{member.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="cta-section" style={{
        background: "linear-gradient(135deg, #0A1628, #0D2040)",
        padding: "72px 40px", textAlign: "center",
      }}>
        <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#fff", marginBottom: "12px" }}>
          Sẵn sàng bắt đầu cùng BAMBOO100?
        </h2>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", marginBottom: "28px" }}>
          Tham gia cùng hàng trăm nhà đầu tư đang giao dịch tự tin hơn mỗi ngày
        </p>
        <div className="cta-buttons">
          <Link href="/lien-he" style={{
            background: "#00C389", color: "#fff", fontSize: "14px", fontWeight: 700,
            padding: "13px 32px", borderRadius: "8px", textDecoration: "none",
          }}>
            Tư vấn miễn phí →
          </Link>
          <Link href="/phan-tich" style={{
            background: "rgba(255,255,255,0.07)", color: "#fff", fontSize: "14px",
            padding: "13px 32px", borderRadius: "8px", textDecoration: "none",
            border: "1px solid rgba(255,255,255,0.15)",
          }}>
            Xem phân tích mẫu
          </Link>
        </div>
      </div>

    </div>
  )
}
