import Link from "next/link"

const ADVANTAGES = [
  {
    title: "Thị trường T+0",
    desc: "Mua và bán trong cùng một phiên giao dịch — không cần chờ T+2 hay T+3 như chứng khoán thông thường.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00C389" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 15 15" />
        <path d="M17 3.5A9 9 0 0 1 21 12" />
        <polyline points="21 3 21 7 17 7" />
      </svg>
    ),
  },
  {
    title: "Giao dịch 2 chiều",
    desc: "Kiếm lợi nhuận cả khi thị trường tăng lẫn giảm — không bị giới hạn bởi xu hướng một chiều.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00C389" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 8 7 4 11 8" />
        <line x1="7" y1="4" x2="7" y2="14" />
        <polyline points="13 16 17 20 21 16" />
        <line x1="17" y1="20" x2="17" y2="10" />
      </svg>
    ),
  },
  {
    title: "Không thuế TNCN",
    desc: "Lợi nhuận từ phái sinh hàng hóa hiện không chịu thuế thu nhập cá nhân theo quy định hiện hành.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="18" rx="2" stroke="#00C389" />
        <line x1="8" y1="8" x2="16" y2="8" stroke="#00C389" />
        <line x1="8" y1="12" x2="16" y2="12" stroke="#00C389" />
        <line x1="8" y1="16" x2="12" y2="16" stroke="#00C389" />
        <line x1="3" y1="3" x2="21" y2="21" stroke="#4ade80" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Giao dịch hợp pháp",
    desc: "Được cấp phép và vận hành dưới sự giám sát của cơ quan nhà nước — minh bạch và an toàn tuyệt đối.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00C389" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l8 4v5c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V7z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
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
            fontSize: "32px",
            fontWeight: 700, lineHeight: 1.2,
            color: "#0A1628", letterSpacing: "-0.02em",
            margin: 0, maxWidth: "480px",
          }}>
            Giao dịch thông minh hơn,<br /> lợi nhuận tối ưu hơn
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
                background: "rgba(0,195,137,0.08)",
                border: "1px solid rgba(0,195,137,0.15)",
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
