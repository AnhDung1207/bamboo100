"use client"

import { useState } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"

const EBOOKS = [
  {
    id: 1,
    tag: "Hàng hóa nông sản",
    title: "Hướng dẫn giao dịch Cà phê",
    subtitle: "Cung-cầu Arabica & Robusta toàn cầu",
    desc: "Tải ebook miễn phí và nắm vững:",
    points: [
      "Sự khác biệt giữa Arabica và Robusta trên thị trường phái sinh",
      "Mùa vụ Brazil & Việt Nam tác động thế nào đến giá",
      "Cách doanh nghiệp xuất nhập khẩu dùng hợp đồng tương lai để phòng hộ rủi ro",
      "Các chỉ số cung-cầu quan trọng cần theo dõi mỗi tuần",
    ],
    access: "Tài khoản DEMO",
    cta: "Tải ngay",
    ctaStyle: "primary",
    bgFrom: "#1a0a00",
    bgTo: "#3d1f00",
    orb1: "#f97316",
    orb2: "#fb923c",
    accent: "#f97316",
    // plant / leaf icon
    iconD: "M12 3C8.5 3 6 6 6 9.5c0 2 .8 3.8 2 5l1 4h6l1-4c1.2-1.2 2-3 2-5C18 6 15.5 3 12 3zm0 2c2.5 0 4 2 4 4.5 0 1.4-.6 2.7-1.5 3.6L13.3 16h-2.6l-1.2-2.9C8.6 12.2 8 10.9 8 9.5 8 7 9.5 5 12 5z M11 8h2v5h-2z M10 14h4v1h-4z",
  },
  {
    id: 4,
    tag: "Thị trường hàng hóa",
    title: "Hướng dẫn hàng hóa cơ bản",
    subtitle: "Sẵn sàng trước khi giao dịch hàng hóa",
    desc: "Tải ebook miễn phí và học:",
    points: [
      "Tại sao hàng hóa là tài sản thú vị",
      "Các cách đầu tư vào hàng hóa khác nhau",
      "Rủi ro và cơ hội trên thị trường này",
      "Xu hướng lớn tiếp theo của thị trường hàng hóa",
    ],
    access: "Tài khoản DEMO",
    cta: "Tải ngay",
    ctaStyle: "primary",
    bgFrom: "#1e1b4b",
    bgTo: "#0f0b33",
    orb1: "#a855f7",
    orb2: "#7c3aed",
    accent: "#a855f7",
    // packages / boxes icon
    iconD: "M4 7l8-4 8 4v10l-8 4-8-4V7zm8-2L5.5 8 12 11l6.5-3L12 5zm-7 4v7l6 3v-7L5 9zm14 0l-6 3v7l6-3V9z",
  },
  {
    id: 5,
    tag: "Phân tích kỹ thuật",
    title: "Phân tích kỹ thuật",
    subtitle: "Cẩm nang giao dịch",
    desc: "Tìm hiểu tất cả về phân tích kỹ thuật, bao gồm:",
    points: [
      "Mô hình giá (Price patterns)",
      "Mô hình nến Nhật (Candlestick patterns)",
      "Chỉ báo và dao động (Indicators & oscillators)",
    ],
    access: "Khách hàng thực",
    cta: "Mở tài khoản",
    ctaStyle: "outline",
    bgFrom: "#0c1a2e",
    bgTo: "#1a2840",
    orb1: "#0ea5e9",
    orb2: "#38bdf8",
    accent: "#0ea5e9",
    // candlestick chart icon
    iconD: "M3 3v18h18 M8 17V9m0 0V7m0 2h4m-4 6h4m0 2v-2m0-6V7m0 4h4M16 17v-4m0-2V7",
  },
  {
    id: 6,
    tag: "Chiến lược",
    title: "Chiến lược Overbalance",
    subtitle: "Học giao dịch theo xu hướng",
    desc: "Trong ebook này, bạn sẽ tìm thấy câu trả lời cho:",
    points: [
      "Khi nào có thể sử dụng chiến lược này?",
      "Tìm kiếm setup như thế nào?",
      "Điều gì được xem là tín hiệu giao dịch?",
      "Quản lý rủi ro và đặt TP/SL ở đâu?",
    ],
    access: "Khách hàng thực",
    cta: "Mở tài khoản",
    ctaStyle: "outline",
    bgFrom: "#0c4a6e",
    bgTo: "#0a2d47",
    orb1: "#00C389",
    orb2: "#10b981",
    accent: "#00C389",
    // trending up icon
    iconD: "M3 17l5-5 4 4 8-9 M14 7h5v5",
  },
  {
    id: 7,
    tag: "Chiến lược",
    title: "Chiến lược Fibonacci",
    subtitle: "Dùng retracement tìm mức giao dịch",
    desc: "Học cách áp dụng nguyên lý Fibonacci vào giao dịch, bao gồm:",
    points: [
      "Những setup nào cần chú ý",
      "Cách quản lý vị thế",
      "Ví dụ thực tế từ thị trường",
    ],
    access: "Khách hàng thực",
    cta: "Mở tài khoản",
    ctaStyle: "outline",
    bgFrom: "#14532d",
    bgTo: "#0a2e18",
    orb1: "#22c55e",
    orb2: "#4ade80",
    accent: "#22c55e",
    // wave / sine icon
    iconD: "M2 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0",
  },
]

type Ebook = (typeof EBOOKS)[0]

function GlassBookCover({ ebook }: { ebook: Ebook }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "220px",
        height: "280px",
        borderRadius: "20px",
        background: `linear-gradient(135deg, ${ebook.bgFrom} 0%, ${ebook.bgTo} 100%)`,
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        cursor: "pointer",
        transform: hovered ? "translateY(-8px) rotate(-1deg) scale(1.03)" : "rotate(-1deg)",
        transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
        boxShadow: hovered
          ? `0 28px 60px rgba(0,0,0,0.45), 0 0 0 1px ${ebook.accent}33`
          : `0 16px 40px rgba(0,0,0,0.3), 0 0 0 1px ${ebook.accent}18`,
      }}
    >
      {/* orb blurs */}
      <div style={{
        position: "absolute", width: "160px", height: "160px", borderRadius: "50%",
        background: ebook.orb1, opacity: 0.18,
        top: "-50px", right: "-40px",
        filter: "blur(40px)",
        transition: "opacity 0.35s",
      }} />
      <div style={{
        position: "absolute", width: "100px", height: "100px", borderRadius: "50%",
        background: ebook.orb2, opacity: hovered ? 0.22 : 0.12,
        bottom: "10px", left: "-20px",
        filter: "blur(30px)",
        transition: "opacity 0.35s",
      }} />

      {/* glass inner card */}
      <div style={{
        position: "absolute", inset: "14px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.06)",
        border: `0.5px solid rgba(255,255,255,${hovered ? "0.2" : "0.1"})`,
        backdropFilter: "blur(8px)",
        display: "flex", flexDirection: "column",
        padding: "18px 16px",
        justifyContent: "space-between",
        transition: "border-color 0.35s",
      }}>
        {/* top: tag */}
        <div style={{
          fontSize: "9px", fontWeight: 700, letterSpacing: "2.5px",
          textTransform: "uppercase", color: ebook.accent,
        }}>
          {ebook.tag}
        </div>

        {/* middle: icon circle */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "50%",
            background: `${ebook.accent}18`,
            border: `1px solid ${ebook.accent}35`,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform 0.35s",
            transform: hovered ? "scale(1.1)" : "scale(1)",
          }}>
            <svg
              width="28" height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke={ebook.accent}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={ebook.iconD} />
            </svg>
          </div>
        </div>

        {/* bottom: title + subtitle */}
        <div>
          <div style={{
            fontSize: "14px", fontWeight: 700, color: "#ffffff",
            lineHeight: 1.3, marginBottom: "6px",
          }}>
            {ebook.title}
          </div>
          <div style={{
            fontSize: "10px", color: "rgba(255,255,255,0.45)",
            lineHeight: 1.45,
          }}>
            {ebook.subtitle}
          </div>

          {/* download badge */}
          <div style={{
            marginTop: "12px",
            display: "inline-flex", alignItems: "center", gap: "5px",
            background: `${ebook.accent}18`,
            border: `0.5px solid ${ebook.accent}35`,
            borderRadius: "20px", padding: "4px 10px",
            fontSize: "9px", fontWeight: 700,
            letterSpacing: "1px", textTransform: "uppercase",
            color: ebook.accent,
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={ebook.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
            {ebook.ctaStyle === "primary" ? "Tải miễn phí" : "Tài khoản thực"}
          </div>
        </div>
      </div>
    </div>
  )
}

function CTAButton({ ebook }: { ebook: Ebook }) {
  const [hovered, setHovered] = useState(false)
  if (ebook.ctaStyle === "primary") {
    return (
      <Link href="/lien-he" style={{
        display: "inline-block",
        background: hovered ? "#00a872" : "#00C389",
        color: "#fff", fontSize: "12px", fontWeight: 700,
        letterSpacing: "1px", textTransform: "uppercase",
        padding: "13px 26px", borderRadius: "8px",
        textDecoration: "none",
        boxShadow: hovered ? "0 6px 24px rgba(0,195,137,0.4)" : "0 4px 18px rgba(0,195,137,0.28)",
        transform: hovered ? "translateY(-2px)" : "none",
        transition: "all 0.15s",
      }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {ebook.cta}
      </Link>
    )
  }
  return (
    <Link href="/lien-he" style={{
      display: "inline-block",
      background: hovered ? "#0A1628" : "transparent",
      color: hovered ? "#fff" : "#0A1628",
      fontSize: "12px", fontWeight: 700,
      letterSpacing: "1px", textTransform: "uppercase",
      padding: "12px 26px", borderRadius: "8px",
      textDecoration: "none",
      border: "1.5px solid #0A1628",
      transition: "all 0.15s",
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {ebook.cta}
    </Link>
  )
}

function EbookRow({ ebook, reverse }: { ebook: Ebook; reverse: boolean }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "60px",
      alignItems: "center",
      padding: "64px 0",
    }}>
      {reverse ? (
        <>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <GlassBookCover ebook={ebook} />
          </div>
          <EbookText ebook={ebook} />
        </>
      ) : (
        <>
          <EbookText ebook={ebook} />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <GlassBookCover ebook={ebook} />
          </div>
        </>
      )}
    </div>
  )
}

function EbookText({ ebook }: { ebook: Ebook }) {
  return (
    <div>
      <span style={{
        fontSize: "10px", fontWeight: 700, letterSpacing: "2.5px",
        textTransform: "uppercase", color: "#00C389",
        marginBottom: "12px", display: "block",
      }}>
        {ebook.tag}
      </span>
      <h2 style={{
        fontSize: "26px", fontWeight: 700, color: "#0A1628",
        lineHeight: 1.25, letterSpacing: "-0.5px", marginBottom: "6px",
      }}>
        {ebook.title}
      </h2>
      <p style={{ fontSize: "17px", fontWeight: 400, color: "#64748b", marginBottom: "18px", lineHeight: 1.35 }}>
        {ebook.subtitle}
      </p>
      {ebook.desc && (
        <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.65, marginBottom: ebook.points.length ? "14px" : "22px" }}>
          {ebook.desc}
        </p>
      )}
      {ebook.points.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px 0" }}>
          {ebook.points.map((p) => (
            <li key={p} style={{ fontSize: "13px", color: "#374151", padding: "5px 0 5px 20px", position: "relative", lineHeight: 1.55 }}>
              <span style={{ position: "absolute", left: 0, top: "10px", width: "6px", height: "6px", borderRadius: "50%", background: "#00C389", display: "block" }} />
              {p}
            </li>
          ))}
        </ul>
      )}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        fontSize: "10px", fontWeight: 700, textTransform: "uppercase",
        letterSpacing: "1.5px", color: "#64748b",
        background: "#f1f5f9", padding: "6px 12px", borderRadius: "4px",
        marginBottom: "22px",
      }}>
        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00C389", flexShrink: 0, display: "inline-block" }} />
        Cấp độ: {ebook.access}
      </div>
      <div>
        <CTAButton ebook={ebook} />
      </div>
    </div>
  )
}

export default function EbookDauTuPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", background: "#fff" }}>
      <Navbar />

      <style>{`
        @media (max-width: 768px) {
          .ebook-row { grid-template-columns: 1fr !important; gap: 32px !important; padding: 40px 0 !important; }
          .ebook-hero { padding: 48px 20px 40px !important; }
          .ebook-section { padding: 20px 20px 60px !important; }
          .ebook-cta-section { padding: 48px 20px !important; }
        }
      `}</style>

      {/* HERO */}
      <div className="ebook-hero" style={{
        background: "linear-gradient(180deg, #f0fdf8 0%, #fff 100%)",
        borderBottom: "1px solid #e2e8f0",
        padding: "72px 80px 56px",
        textAlign: "center",
      }}>
        <div style={{
          display: "inline-block", fontSize: "10px", fontWeight: 700,
          letterSpacing: "2.5px", textTransform: "uppercase",
          color: "#00C389", background: "rgba(0,195,137,0.08)",
          padding: "6px 16px", borderRadius: "20px",
          marginBottom: "20px", border: "1px solid rgba(0,195,137,0.2)",
        }}>
        </div>
        <h1 style={{
          fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700,
          color: "#0A1628", lineHeight: 1.15, letterSpacing: "-1.5px",
          marginBottom: "16px",
        }}>
          Học giao dịch cùng{" "}
          <span style={{ color: "#00C389" }}>Bamboo100</span>
        </h1>
        <p style={{
          fontSize: "16px", color: "#64748b", maxWidth: "520px",
          margin: "0 auto", lineHeight: 1.7, fontWeight: 400,
        }}>
          Khám phá bộ sưu tập ebook và hướng dẫn được thiết kế giúp bạn bắt đầu hành trình giao dịch phái sinh hàng hóa một cách tự tin.
        </p>
      </div>

      {/* EBOOK LIST */}
      <div className="ebook-section" style={{ maxWidth: "1080px", margin: "0 auto", padding: "20px 40px 80px" }}>
        {EBOOKS.map((ebook, i) => (
          <div key={ebook.id} style={{ borderBottom: i < EBOOKS.length - 1 ? "1px solid #e2e8f0" : "none" }}>
            <div className="ebook-row" style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "60px",
              alignItems: "center",
              padding: "64px 0",
            }}>
              {i % 2 === 0 ? (
                <>
                  <EbookText ebook={ebook} />
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <GlassBookCover ebook={ebook} />
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <GlassBookCover ebook={ebook} />
                  </div>
                  <EbookText ebook={ebook} />
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CTA BOTTOM */}
      <div className="ebook-cta-section" style={{
        background: "linear-gradient(135deg, #0A1628 0%, #0D1F38 100%)",
        padding: "64px 80px",
        textAlign: "center",
      }}>
        <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#00C389", marginBottom: "16px" }}>
          Bắt đầu ngay hôm nay
        </p>
        <h2 style={{ fontSize: "34px", fontWeight: 700, color: "#fff", lineHeight: 1.25, letterSpacing: "-0.5px", marginBottom: "14px" }}>
          Sẵn sàng nâng cao kiến thức?
        </h2>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", maxWidth: "460px", margin: "0 auto 32px", lineHeight: 1.7 }}>
          Mở tài khoản để truy cập toàn bộ thư viện ebook và nhận tư vấn chiến lược 1-1 từ chuyên gia Bamboo100.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/lien-he#dat-lich" style={{
            background: "#00C389", color: "#fff",
            fontSize: "13px", fontWeight: 700,
            padding: "14px 28px", borderRadius: "8px",
            textDecoration: "none", letterSpacing: "0.5px",
            boxShadow: "0 4px 20px rgba(0,195,137,0.35)",
          }}>
            Mở tài khoản miễn phí →
          </Link>
          <Link href="/hoc-vien/khoa-hoc" style={{
            background: "rgba(255,255,255,0.07)", color: "#fff",
            fontSize: "13px", fontWeight: 500,
            padding: "14px 28px", borderRadius: "8px",
            textDecoration: "none",
            border: "1px solid rgba(255,255,255,0.15)",
          }}>
            Xem khóa học
          </Link>
        </div>
      </div>

    </div>
  )
}
