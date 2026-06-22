"use client"

import Link from "next/link"
import Navbar from "@/components/Navbar"

const SERVICES = [
  {
    href: "/dich-vu/hieu-suat",
    icon: "📊",
    title: "Dashboard Hiệu suất đầu tư",
    desc: "Thống kê hiệu suất giao dịch thực tế của BAMBOO100 — minh bạch, rõ ràng, có kiểm chứng.",
    color: "#00A67E",
    bg: "rgba(0,166,126,0.06)",
    border: "rgba(0,166,126,0.2)",
    tag: "Live Trading",
  },
  {
    href: "/dich-vu/bao-cao-cot",
    icon: "📋",
    title: "Báo cáo COT",
    desc: "Dữ liệu Commitments of Traders từ CFTC — vị thế quỹ đầu cơ lớn trên toàn bộ thị trường hàng hoá.",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.06)",
    border: "rgba(59,130,246,0.2)",
    tag: "Cập nhật hàng tuần",
  },
]

export default function DichVuPage() {
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <Navbar />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "120px 24px 80px" }}>
        <div style={{ marginBottom: "48px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(0,166,126,0.08)", border: "1px solid rgba(0,166,126,0.2)", borderRadius: "20px", padding: "4px 14px", marginBottom: "16px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00A67E", display: "inline-block" }} />
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#00A67E", letterSpacing: "0.08em" }}>DỊCH VỤ</span>
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 }}>
            Công cụ & Dịch vụ
          </h1>
          <p style={{ fontSize: "15px", color: "#64748b", margin: 0 }}>
            Dữ liệu thực tế và phân tích chuyên sâu cho nhà đầu tư hàng hoá.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {SERVICES.map((s) => (
            <Link key={s.href} href={s.href} style={{ textDecoration: "none", display: "block", background: "#fff", border: "1px solid #e8ecf0", borderRadius: "16px", padding: "28px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", transition: "box-shadow 0.2s, transform 0.2s" }}
              onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)" }}
              onMouseOut={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)" }}
            >
              <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: s.bg, border: `1px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", marginBottom: "16px" }}>
                {s.icon}
              </div>
              <div style={{ display: "inline-block", fontSize: "10px", fontWeight: 600, color: s.color, background: s.bg, border: `1px solid ${s.border}`, borderRadius: "20px", padding: "2px 10px", marginBottom: "10px", letterSpacing: "0.04em" }}>
                {s.tag}
              </div>
              <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>{s.title}</h2>
              <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px", lineHeight: 1.6 }}>{s.desc}</p>
              <div style={{ fontSize: "13px", fontWeight: 600, color: s.color }}>Xem ngay →</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
