"use client"

import { useState } from "react"
import Link from "next/link"

const FAQS = [
  {
    q: "Phái sinh hàng hóa là gì?",
    a: "Phái sinh hàng hóa là các công cụ tài chính có giá trị dựa trên tài sản cơ sở là hàng hóa thực (vàng, dầu thô, cà phê, đồng...). Thay vì mua hàng hóa thật, nhà đầu tư giao dịch hợp đồng tương lai hoặc quyền chọn để hưởng lợi từ biến động giá — với đòn bẩy và chi phí thấp hơn nhiều so với việc nắm giữ hàng hóa vật chất.",
  },
  {
    q: "Tôi cần bao nhiêu vốn để bắt đầu?",
    a: "Bạn có thể bắt đầu với số vốn tương đối nhỏ nhờ cơ chế ký quỹ (margin). Tuy nhiên, Bamboo100 khuyến nghị nhà đầu tư mới nên bắt đầu với tài khoản DEMO để làm quen với thị trường trước, sau đó mở tài khoản thực với mức vốn phù hợp với khả năng chịu rủi ro cá nhân.",
  },
  {
    q: "Giao dịch T+0 hoạt động như thế nào?",
    a: "T+0 có nghĩa là bạn có thể mua và bán trong cùng một phiên giao dịch mà không cần chờ thanh toán. Khác với chứng khoán cơ sở (T+2 hoặc T+3), phái sinh hàng hóa cho phép bạn đóng vị thế ngay trong ngày — giúp tối ưu dòng tiền và phản ứng linh hoạt trước biến động thị trường.",
  },
  {
    q: "Làm sao để mở tài khoản?",
    a: "Quy trình mở tài khoản tại Bamboo100 gồm 3 bước: (1) Điền thông tin cá nhân qua form đăng ký online, (2) Xác minh danh tính bằng CCCD/Hộ chiếu, (3) Nạp ký quỹ và bắt đầu giao dịch. Toàn bộ quá trình hoàn tất trong vòng 24 giờ làm việc.",
  },
  {
    q: "Rủi ro của giao dịch 2 chiều là gì?",
    a: "Giao dịch 2 chiều (Long & Short) cho phép kiếm lợi nhuận cả khi thị trường tăng lẫn giảm, nhưng đồng thời cũng nhân đôi rủi ro nếu không có chiến lược rõ ràng. Bamboo100 luôn tư vấn nhà đầu tư đặt lệnh Stop Loss, kiểm soát tỷ lệ Risk/Reward và không dùng toàn bộ vốn cho một vị thế.",
  },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="faq-section" style={{ background: "#fff", padding: "72px 0" }}>
      <style>{`
        .faq-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .faq-layout {
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: 80px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .faq-section { padding: 48px 0 !important; }
          .faq-inner { padding: 0 20px !important; }
          .faq-layout { grid-template-columns: 1fr !important; gap: 36px !important; }
        }
        .faq-item {
          border-bottom: 1px solid #e2e8f0;
        }
        .faq-item:first-of-type { border-top: 1px solid #e2e8f0; }
        .faq-btn {
          width: 100%; background: none; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; padding: 18px 0; text-align: left;
        }
        .faq-q {
          font-size: 15px; font-weight: 500; color: #0A1628;
          line-height: 1.4; transition: color 0.15s;
          font-family: 'DM Sans', 'Inter', sans-serif;
        }
        .faq-btn:hover .faq-q { color: #00C389; }
        .faq-chevron {
          flex-shrink: 0;
          transition: transform 0.3s;
          color: #94a3b8;
        }
        .faq-chevron.open { transform: rotate(180deg); color: #00C389; }
        .faq-answer {
          font-size: 13.5px; color: #64748b; line-height: 1.75;
          padding: 0 24px 18px 0;
          font-family: 'DM Sans', 'Inter', sans-serif;
        }
      `}</style>

      <div className="faq-inner">
        <div className="faq-layout">
          {/* Left — tiêu đề */}
          <div style={{ position: "sticky", top: "80px" }}>
            <p style={{
              fontSize: "11px", fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "0.1em",
              color: "#00C389", marginBottom: "10px",
            }}>
              FAQ
            </p>
            <h2 style={{
              fontSize: "32px", fontWeight: 700,
              color: "#0A1628", letterSpacing: "-0.02em",
              lineHeight: 1.2, marginBottom: "14px",
            }}>
              Bạn còn thắc mắc gì không?
            </h2>
            <p style={{
              fontSize: "14px", color: "#64748b",
              lineHeight: 1.7, marginBottom: "28px",
            }}>
              Giải đáp những câu hỏi phổ biến nhất về giao dịch phái sinh hàng hóa.
            </p>
            <Link href="/lien-he#dat-lich" style={{
              fontSize: "14px", fontWeight: 500,
              color: "#00C389", textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: "5px",
            }}>
              Đặt lịch tư vấn →
            </Link>
          </div>

          {/* Right — accordion */}
          <div>
            {FAQS.map((faq, i) => {
              const isOpen = open === i
              return (
                <div key={i} className="faq-item">
                  <button
                    className="faq-btn"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-q">{faq.q}</span>
                    <svg
                      className={`faq-chevron${isOpen ? " open" : ""}`}
                      width="18" height="18" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <div style={{
                    maxHeight: isOpen ? "400px" : "0",
                    opacity: isOpen ? 1 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.35s ease, opacity 0.25s ease",
                  }}>
                    <p className="faq-answer">{faq.a}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

    </div>
  )
}
