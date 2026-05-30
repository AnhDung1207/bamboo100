"use client"
import Link from "next/link"
const ITEMS = [
  {
    key: "du-lieu",
    title: "Dữ liệu cung-cầu thực",
    desc: "Phân tích từ báo cáo tồn kho, sản lượng và dòng tiền thực tế — không phỏng đoán.",
    imgSrc: "/why-choose/du-lieu.png",
    imgAlt: "Dữ liệu cung-cầu thực",
  },
  {
    key: "rui-ro",
    title: "Quản trị rủi ro",
    desc: "Mỗi chiến lược đi kèm tỷ lệ Risk/Reward và mức dừng lỗ cụ thể.",
    imgSrc: "/why-choose/rui-ro.png",
    imgAlt: "Quản trị rủi ro",
  },
  {
    key: "kich-ban",
    title: "Kịch bản hành động",
    desc: "Bull/Bear/Base scenario giúp chuẩn bị mọi tình huống thị trường.",
    imgSrc: "/why-choose/kich-ban.png",
    imgAlt: "Kịch bản hành động",
  },
  {
    key: "cap-nhat",
    title: "Cập nhật liên tục",
    desc: "Theo dõi EIA, FOMC và các sự kiện vĩ mô ảnh hưởng đến giá hàng hóa.",
    imgSrc: "/why-choose/cap-nhat.png",
    imgAlt: "Cập nhật liên tục",
  },
]

export default function WhyChooseBamboo() {
  return (
    <section style={{ background: "#fff", padding: "72px 0" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 40px" }}>

        {/* Badge */}
        <p style={{
          fontSize: "11px",
          fontWeight: 600,
          color: "#00C389",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: "10px",
        }}>
          Tại sao chọn Bamboo100
        </p>

        {/* Title */}
        <h2 style={{
          fontSize: "34px",
          fontWeight: 800,
          color: "#0A1628",
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          margin: "0 0 12px",
        }}>
          Phân tích khác biệt, quyết định tốt hơn
        </h2>

        <Link href="/ve-chung-toi" style={{
  display: "inline-flex",
  alignItems: "center",
  gap: "5px",
  fontSize: "13px",
  fontWeight: 600,
  color: "#00C389",
  textDecoration: "none",
  marginBottom: "48px",
}}>
  Tìm hiểu thêm →
</Link>

        {/* Grid */}
        <div
          className="why-choose-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "40px",
          }}
        >
          {ITEMS.map((item) => (
            <div key={item.key}>
              {/* Icon image */}
              <img
                src={item.imgSrc}
                alt={item.imgAlt}
                width={100}
                height={100}
                style={{
                  objectFit: "contain",
                  marginBottom: "20px",
                  display: "block",
                }}
              />

              {/* Title */}
              <h3 style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#0A1628",
                margin: "0 0 8px",
                letterSpacing: "-0.01em",
                lineHeight: 1.3,
              }}>
                {item.title}
              </h3>

              {/* Desc */}
              <p style={{
                fontSize: "13px",
                color: "#64748b",
                lineHeight: 1.7,
                margin: 0,
              }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .why-choose-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 600px) {
          .why-choose-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  )
}
