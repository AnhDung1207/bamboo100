import Link from "next/link"
import { IconClockBolt, IconArrowsExchange, IconReceiptOff, IconShieldCheck } from "@tabler/icons-react"

const ADVANTAGES = [
  {
    title: "Thị trường T+0",
    desc: "Mua và bán trong cùng một phiên giao dịch — không cần chờ T+2 hay T+3 như chứng khoán thông thường.",
    gradient: "linear-gradient(135deg, #00C389 0%, #00a872 100%)",
    icon: <IconClockBolt size={24} stroke={1.8} color="white" />,
  },
  {
    title: "Giao dịch 2 chiều",
    desc: "Kiếm lợi nhuận cả khi thị trường tăng lẫn giảm — không bị giới hạn bởi xu hướng một chiều.",
    gradient: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    icon: <IconArrowsExchange size={24} stroke={1.8} color="white" />,
  },
  {
    title: "Không thuế TNCN",
    desc: "Lợi nhuận từ phái sinh hàng hóa hiện không chịu thuế thu nhập cá nhân theo quy định hiện hành.",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    icon: <IconReceiptOff size={24} stroke={1.8} color="white" />,
  },
  {
    title: "Giao dịch hợp pháp",
    desc: "Được cấp phép và vận hành dưới sự giám sát của cơ quan nhà nước — minh bạch và an toàn tuyệt đối.",
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
    icon: <IconShieldCheck size={24} stroke={1.8} color="white" />,
  },
]

export default function AdvantagesSection() {
  return (
    <div className="adv-section" style={{ background: "#fff", padding: "72px 0" }}>

      <style>{`
        .adv-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .adv-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
        }
        @media (max-width: 1024px) {
          .adv-section { padding: 48px 0 !important; }
          .adv-inner { padding: 0 40px !important; }
          .adv-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .adv-section { padding: 40px 0 !important; }
          .adv-inner { padding: 0 20px !important; }
          .adv-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .adv-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
        }
      `}</style>

      <div className="adv-inner">
        <p style={{
          fontSize: "11px", fontWeight: 600,
          textTransform: "uppercase", letterSpacing: "0.1em",
          color: "#00C389", marginBottom: "10px",
        }}>
          Lợi thế
        </p>

        <div className="adv-header" style={{
          display: "flex", alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "52px", gap: "16px", flexWrap: "wrap",
        }}>
          <h2 style={{
            fontSize: "34px",
            fontWeight: 800, lineHeight: 1.2,
            color: "#0A1628", letterSpacing: "-0.02em",
            margin: 0, maxWidth: "480px",
          }}>
            Đầu tư thông minh hơn
          </h2>
          <Link
            href="/lien-he"
            style={{
              fontSize: "14px", fontWeight: 500,
              color: "#00C389", textDecoration: "none",
              display: "flex", alignItems: "center", gap: "5px",
              whiteSpace: "nowrap", paddingBottom: "4px",
              borderBottom: "1px solid transparent",
              transition: "border-color 0.15s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderBottomColor = "#00C389")}
            onMouseOut={(e) => (e.currentTarget.style.borderBottomColor = "transparent")}
          >
            Tìm hiểu thêm →
          </Link>
        </div>

        <div className="adv-grid">
          {ADVANTAGES.map((item) => (
            <div key={item.title}>
              <div style={{
                width: "48px", height: "48px",
                borderRadius: "10px",
                background: item.gradient,
border: "none",
boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "20px",
              }}>
                {item.icon}
              </div>

              <h3 style={{
                fontSize: "20px", fontWeight: 700,
                color: "#0A1628", lineHeight: 1.3,
                marginBottom: "10px", letterSpacing: "-0.01em",
              }}>
                {item.title}
              </h3>

              <p style={{
                fontSize: "14px", color: "#64748b",
                lineHeight: 1.7, margin: 0,
              }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
