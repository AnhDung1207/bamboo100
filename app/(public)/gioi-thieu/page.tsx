"use client"

import Link from "next/link"
import Navbar from "@/components/Navbar"
import { useEffect, useRef, useState } from "react"

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const duration = 1500
        const steps = 60
        const increment = target / steps
        let current = 0
        const timer = setInterval(() => {
          current += increment
          if (current >= target) {
            setCount(target)
            clearInterval(timer)
          } else {
            setCount(Math.floor(current))
          }
        }, duration / steps)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return <div ref={ref}>{count}{suffix}</div>
}

const VALUES = [
  { icon: "ti-shield-check", title: "Minh bạch", accent: "#00C389", bg: "rgba(0,195,137,0.08)", border: "rgba(0,195,137,0.2)",
    desc: "Mọi phân tích đều có dữ liệu nguồn rõ ràng. Chúng tôi không hứa hẹn lợi nhuận và luôn nêu rõ rủi ro." },
  { icon: "ti-chart-dots", title: "Chuyên sâu", accent: "#0ea5e9", bg: "rgba(14,165,233,0.08)", border: "rgba(14,165,233,0.2)",
    desc: "Phân tích dựa trên dữ liệu cung-cầu thực tế, báo cáo COT, macro kinh tế — không phải cảm tính." },
  { icon: "ti-users", title: "Tận tâm", accent: "#f97316", bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.2)",
    desc: "Mỗi khách hàng là một đối tác. Chúng tôi đặt lợi ích dài hạn của khách hàng lên hàng đầu." },
  { icon: "ti-refresh", title: "Cập nhật liên tục", accent: "#8b5cf6", bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.2)",
    desc: "Thị trường hàng hóa biến động 24/7. Chúng tôi theo dõi và cập nhật thông tin nhanh nhất có thể." },
  { icon: "ti-school", title: "Giáo dục", accent: "#ec4899", bg: "rgba(236,72,153,0.08)", border: "rgba(236,72,153,0.2)",
    desc: "Chúng tôi không chỉ cho bạn cá — chúng tôi dạy bạn cách câu cá trên thị trường hàng hóa toàn cầu." },
  { icon: "ti-award", title: "Chất lượng", accent: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)",
    desc: "Thà ít mà chất lượng. Mỗi bài phân tích được kiểm duyệt kỹ trước khi đến tay nhà đầu tư." },
]

const TEAM = [
  { name: "Nguyễn Anh Dũng", role: "Giám đốc điều hành", color: "#00C389",
    desc: "10+ năm kinh nghiệm trong lĩnh vực tài chính và đầu tư.",
    initials: "AD" },
  { name: "Nguyễn Thành Nam", role: "Giám đốc Khối Đầu Tư", color: "#0ea5e9",
    desc: "Chuyên gia quản trị danh mục đầu tư thị trường Hàng hóa, Chứng khoán.", initials: "LA" },
  { name: "Trần Lan Anh", role: "Giám đốc Kinh Doanh", color: "#f97316",
    desc: "Nhiều năm kinh nghiệm trong lĩnh vực tài chính, giữ vai trò then chốt trong việc xây dựng chiến lược phát triển thị trường và mở rộng hệ thống khách hàng.",
    initials: "HN" },
]

const TIMELINE = [
  {
    year: "2024",
    title: "Thành lập",
    desc: "BAMBOO100 được thành lập với định hướng cung cấp dịch vụ phân tích thị trường chuyên sâu cho nhà đầu tư cá nhân và tổ chức — nơi mỗi quyết định đầu tư được xây dựng trên nền tảng dữ liệu và phân tích có hệ thống.",
  },
  {
    year: "2025",
    title: "Tăng trưởng",
    desc: "Hiệu suất được kiểm chứng qua thực tiễn. BAMBOO100 mở rộng năng lực phân tích, củng cố quy trình quản trị rủi ro và từng bước xây dựng uy tín trong cộng đồng đầu tư chuyên nghiệp.",
  },
  {
    year: "2026",
    title: "Hiện tại",
    desc: "Hoạt động với tiêu chí minh bạch và hiệu quả là ưu tiên hàng đầu. BAMBOO100 tiếp tục cung cấp báo cáo phân tích và tư vấn đầu tư — giúp khách hàng đưa ra quyết định có căn cứ trong mọi điều kiện thị trường.",
  },
]

export default function VeChungToiPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", background: "#fff", minHeight: "100vh" }}>

      <style>{`
        .nav-links  { display: flex !important; }
        .nav-login  { display: inline-flex !important; }
        .hamburger  { display: none !important; }

        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); }
        .stats-item-border { border-right: 1px solid #e8ecef; }
        .mission-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
        .values-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
        .hero-section { padding: 100px 40px 72px; text-align: center; }
        .hero-title { font-size: 40px; }

        .value-card { transition: transform 0.2s, box-shadow 0.2s; }
        .value-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
        .team-card { transition: transform 0.2s, box-shadow 0.2s; }
        .team-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }

        @media (max-width: 768px) {
          .nav-links  { display: none !important; }
          .nav-login  { display: none !important; }
          .hamburger  { display: flex !important; }
          .hero-section { padding: 90px 20px 40px !important; }
          .hero-title { font-size: 26px !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; padding: 24px 20px !important; }
          .stats-item-border { border-right: none !important; border-bottom: 1px solid #e8ecef; }
          .stats-item-border:nth-child(odd) { border-right: 1px solid #e8ecef !important; }
          .mission-grid { grid-template-columns: 1fr !important; gap: 24px !important; padding: 48px 20px !important; }
          .values-grid { grid-template-columns: 1fr !important; }
          .values-section { padding: 48px 20px !important; }
          .team-grid { grid-template-columns: 1fr !important; }
          .team-section { padding: 48px 20px !important; }
          .timeline-section { padding: 48px 20px !important; }
        }
      `}</style>

      <Navbar />

      {/* HERO */}
      <div className="hero-section" style={{
        background: "linear-gradient(rgba(10,22,40,0.72), rgba(13,32,64,0.80)), url('/ve-chung-toi-hero.jpg') center bottom/cover no-repeat",
        position: "relative", overflow: "hidden",
        paddingTop: "120px",
      }}>
        {/* decorative blobs */}
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(0,195,137,0.06)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(0,195,137,0.04)", filter: "blur(40px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 className="hero-title" style={{ fontWeight: 800, color: "#fff", lineHeight: 1.25, marginBottom: "16px" }}>
            Đồng hành cùng nhà đầu tư<br />
            <span style={{ color: "#00C389" }}>trên thị trường hàng hóa</span>
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.55)", maxWidth: "560px", margin: "0 auto 40px", lineHeight: 1.7 }}>
            BAMBOO100 được thành lập với sứ mệnh mang đến thông tin phân tích chuyên sâu,
            minh bạch và thực tế cho cộng đồng đầu tư hàng hóa Việt Nam.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/lien-he" style={{ background: "#00C389", color: "#fff", fontSize: "14px", fontWeight: 700, padding: "13px 28px", borderRadius: "8px", textDecoration: "none" }}>
              Tư vấn miễn phí →
            </Link>
            <Link href="/phan-tich" style={{ background: "rgba(255,255,255,0.07)", color: "#fff", fontSize: "14px", padding: "13px 28px", borderRadius: "8px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.15)" }}>
              Xem phân tích mẫu
            </Link>
          </div>
        </div>
      </div>

      {/* STATS — với icon và animated counter */}
      <div style={{ background: "#f8fafc", borderBottom: "1px solid #e8ecef" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 40px" }}>
          <div className="stats-grid">
            {[
              { icon: "ti-calendar", value: 5, suffix: "+", label: "Năm kinh nghiệm", last: false },
              { icon: "ti-users", value: 500, suffix: "+", label: "Khách hàng tin dùng", last: false },
              { icon: "ti-file-text", value: 1200, suffix: "+", label: "Bài phân tích đã đăng", last: false },
              { icon: "ti-heart", value: 98, suffix: "%", label: "Tỷ lệ hài lòng", last: true },
            ].map((s) => (
              <div key={s.label} className={s.last ? "" : "stats-item-border"} style={{ textAlign: "center", padding: "16px 24px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(0,195,137,0.1)", border: "1px solid rgba(0,195,137,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <i className={`ti ${s.icon}`} style={{ fontSize: "18px", color: "#00C389" }} />
                </div>
                <div style={{ fontSize: "32px", fontWeight: 800, color: "#00C389", marginBottom: "4px" }}>
                  <CountUp target={s.value} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: "13px", color: "#64748b" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SỨ MỆNH & TIMELINE */}
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div className="mission-grid" style={{ padding: "72px 40px" }}>
          {/* Trái: Sứ mệnh + Tầm nhìn */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(0,195,137,0.08)", borderRadius: "6px", padding: "4px 10px", marginBottom: "16px" }}>
              <i className="ti ti-target" style={{ fontSize: "14px", color: "#00C389" }} />
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#00C389", letterSpacing: "0.06em" }}>SỨ MỆNH</span>
            </div>
            <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#0A1628", lineHeight: 1.35, marginBottom: "16px" }}>
              Minh bạch hóa thông tin thị trường hàng hóa
            </h2>
            <p style={{ fontSize: "15px", color: "#64748b", lineHeight: 1.8, marginBottom: "16px" }}>
              Chúng tôi tin rằng mọi nhà đầu tư đều xứng đáng được tiếp cận thông tin phân tích chất lượng cao — không chỉ dành riêng cho tổ chức lớn.
            </p>
            <p style={{ fontSize: "15px", color: "#64748b", lineHeight: 1.8, marginBottom: "32px" }}>
              BAMBOO100 cung cấp phân tích cung - cầu thực tế, kịch bản thị trường rõ ràng và tư vấn chiến lược 1-1, giúp nhà đầu tư đưa ra quyết định tự tin hơn.
            </p>
            <div style={{ borderLeft: "4px solid #00C389", paddingLeft: "20px" }}>
  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(0,195,137,0.08)", borderRadius: "6px", padding: "4px 10px", marginBottom: "14px" }}>
    <i className="ti ti-eye" style={{ fontSize: "14px", color: "#00C389" }} />
    <span style={{ fontSize: "11px", fontWeight: 600, color: "#00C389", letterSpacing: "0.06em" }}>TẦM NHÌN</span>
  </div>
  <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0A1628", lineHeight: 1.4, marginBottom: "10px" }}>
    Trở thành nền tảng phân tích hàng hóa số 1 Đông Nam Á vào 2030
  </h3>
  <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.8 }}>
    Xây dựng cộng đồng nhà đầu tư hàng hóa chuyên nghiệp, am hiểu thị trường và có khả năng tự đưa ra quyết định đầu tư hiệu quả.
  </p>
</div>
          </div>

          {/* Phải: Timeline */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(0,195,137,0.08)", borderRadius: "6px", padding: "4px 10px", marginBottom: "28px" }}>
              <i className="ti ti-history" style={{ fontSize: "14px", color: "#00C389" }} />
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#00C389", letterSpacing: "0.06em" }}>HÀNH TRÌNH</span>
            </div>
            <div style={{ position: "relative" }}>
              {/* vertical line */}
              <div style={{ position: "absolute", left: "19px", top: "8px", bottom: "8px", width: "2px", background: "linear-gradient(to bottom, #00C389, rgba(0,195,137,0.1))" }} />
              {TIMELINE.map((item, i) => (
                <div key={item.year} style={{ display: "flex", gap: "20px", marginBottom: i < TIMELINE.length - 1 ? "32px" : "0", position: "relative" }}>
                  {/* dot */}
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: i === TIMELINE.length - 1 ? "#00C389" : "#fff", border: "2px solid #00C389", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: i === TIMELINE.length - 1 ? "#fff" : "#00C389" }}>{item.year.slice(2)}</span>
                  </div>
                  <div style={{ paddingTop: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#00C389" }}>{item.year}</span>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "#0A1628" }}>{item.title}</span>
                    </div>
                    <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* GIÁ TRỊ CỐT LÕI — mỗi card màu riêng */}
      <div className="values-section" style={{ background: "#f8fafc", padding: "72px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "#00C389", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>Giá trị</p>
            <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#0A1628", marginBottom: "12px", letterSpacing: "-0.02em" }}>Giá trị cốt lõi</h2>
            <p style={{ fontSize: "15px", color: "#64748b" }}>Những nguyên tắc định hướng mọi hoạt động của BAMBOO100</p>
          </div>
          <div className="values-grid">
            {VALUES.map((item) => (
              <div key={item.title} className="value-card" style={{ background: "#fff", borderRadius: "14px", border: `1px solid ${item.border}`, padding: "28px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: item.bg, border: `1px solid ${item.border}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                  <i className={`ti ${item.icon}`} style={{ fontSize: "22px", color: item.accent }} />
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0A1628", marginBottom: "8px" }}>{item.title}</h3>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ĐỘI NGŨ — layout mới với initials avatar */}
      <div className="team-section" style={{ maxWidth: "1100px", margin: "0 auto", padding: "72px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#00C389", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>Con người</p>
          <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#0A1628", marginBottom: "12px", letterSpacing: "-0.02em" }}>Đội ngũ sáng lập</h2>
          <p style={{ fontSize: "15px", color: "#64748b" }}>Những chuyên gia có kinh nghiệm thực chiến trên thị trường hàng hóa quốc tế</p>
        </div>
        <div className="team-grid">
          {TEAM.map((member) => (
            <div key={member.name} className="team-card" style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "32px 28px", textAlign: "center" }}>
              {/* Avatar với initials */}
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: `linear-gradient(135deg, ${member.color}22, ${member.color}44)`, border: `2px solid ${member.color}44`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <span style={{ fontSize: "24px", fontWeight: 800, color: member.color }}>{member.initials}</span>
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0A1628", marginBottom: "4px" }}>{member.name}</h3>
              <div style={{ fontSize: "12px", fontWeight: 600, color: member.color, marginBottom: "14px", letterSpacing: "0.04em" }}>{member.role}</div>
              <div style={{ width: "32px", height: "2px", background: member.color, margin: "0 auto 14px", borderRadius: "2px" }} />
              <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.7, margin: 0 }}>{member.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
