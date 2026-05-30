"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

const BENEFITS = [
  "Cập nhật xu hướng vĩ mô hàng tuần",
  "Phân tích cung-cầu các mặt hàng chính",
  "Kịch bản giao dịch tham khảo",
]

const FIELDS = [
  { key: "name",  label: "Họ và tên",     placeholder: "Nguyễn Văn A",      type: "text"  },
  { key: "email", label: "Email",          placeholder: "email@example.com",  type: "email" },
  { key: "phone", label: "Số điện thoại", placeholder: "0912 345 678",       type: "tel"   },
]

export default function CTASection() {
  const [form, setForm]           = useState({ name: "", email: "", phone: "" })
  const [loading, setLoading]     = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError]         = useState("")

  const handleSubmit = async () => {
    if (!form.name || !form.phone) return
    setLoading(true)
    setError("")

    const supabase = createClient()
    const { error: err } = await supabase.from("leads").insert({
      full_name: form.name,
      email:     form.email || null,
      phone:     form.phone,
      source:    "homepage",
      status:    "new",
    })

    setLoading(false)

    if (err) {
      setError(
        err.code === "23505"
          ? "Thông tin này đã được đăng ký trước đó!"
          : "Có lỗi xảy ra, vui lòng thử lại!"
      )
      return
    }

    setSubmitted(true)
    setForm({ name: "", email: "", phone: "" })
  }

  return (
    <div className="cta-section" style={{ padding: "72px 0" }}>

      <style>{`
        .cta-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .cta-card {
          background: #0A1628;
          border-radius: 24px;
          padding: 60px 64px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        @media (max-width: 1024px) {
          .cta-section { padding: 48px 0 !important; }
          .cta-card { padding: 48px 40px !important; }
        }
        @media (max-width: 768px) {
          .cta-section { padding: 40px 0 !important; }
          .cta-inner { padding: 0 20px !important; }
          .cta-card {
            grid-template-columns: 1fr !important;
            padding: 36px 24px !important;
            gap: 32px !important;
            border-radius: 16px !important;
          }
        }
      `}</style>

      <div className="cta-inner">
        <div className="cta-card">

          {/* Left — copy */}
          <div>
            <h2 style={{ color: "#fff", fontSize: 36, fontWeight: 700, lineHeight: 1.3, marginBottom: 14, letterSpacing: "-0.02em" }}>
              Sẵn sàng giao dịch thông minh hơn?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
              Nhận báo cáo thị trường hàng tuần và phân tích kịch bản giao dịch miễn phí qua email.
            </p>
            {BENEFITS.map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 18, height: 18, background: "rgba(0,195,137,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "#00C389", fontSize: 10 }}>✓</span>
                </div>
                <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Right — form */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 28 }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 14 }}>🎉</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0A1628", marginBottom: 8 }}>Đăng ký thành công!</h3>
                <p style={{ fontSize: 13, color: "#64748b" }}>Chúng tôi sẽ gửi báo cáo đầu tiên cho bạn sớm nhất có thể.</p>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0A1628", marginBottom: 20 }}>Nhận báo cáo miễn phí</h3>

                {FIELDS.map((f) => (
                  <div key={f.key} style={{ marginBottom: 14 }}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={form[f.key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                ))}

                {error && (
                  <p style={{ fontSize: 12, color: "#dc2626", marginBottom: 8, background: "#fef2f2", padding: "8px 12px", borderRadius: 6, border: "1px solid #fecaca" }}>
                    ⚠️ {error}
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{ width: "100%", background: "#00C389", color: "#fff", fontSize: 14, fontWeight: 600, padding: 12, borderRadius: 8, border: "none", cursor: "pointer", marginTop: 6 }}
                >
                  {loading ? "Đang gửi..." : "Nhận báo cáo ngay →"}
                </button>

                <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", marginTop: 10 }}>
                  🔒 Thông tin của bạn được bảo mật tuyệt đối
                </p>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
