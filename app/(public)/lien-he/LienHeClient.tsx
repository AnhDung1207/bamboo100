"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import Navbar from "@/components/Navbar"

export default function LienHeClient() {
  const supabase = createClient()
  const [form, setForm] = useState({
    name: "", email: "", phone: "", need: "", message: "",
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"" | "success" | "error">("")
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async () => {
    if (!form.name || !form.phone) {
      setStatus("error")
      setErrorMsg("Vui lòng điền đầy đủ họ tên và số điện thoại.")
      return
    }
    setLoading(true)
    const { error } = await supabase.from("leads").insert({
      full_name: form.name,
      email: form.email || null,
      phone: form.phone,
      message: `[Nhu cầu: ${form.need}] ${form.message}`,
      source: "contact",
      status: "new",
    })
    setLoading(false)
    if (error) {
      console.error("Insert lead failed:", error)
      setStatus("error")
      setErrorMsg("Có lỗi xảy ra, vui lòng thử lại sau hoặc liên hệ hotline.")
      return
    }
    setStatus("success")
    setForm({ name: "", email: "", phone: "", need: "", message: "" })
  }

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", background: "#fff", minHeight: "100vh" }}>

      <style>{`
        @media (max-width: 768px) {
          .hero-section { padding: 90px 20px !important; }
          .hero-section h1 { font-size: 26px !important; }
          .main-grid {
            grid-template-columns: 1fr !important;
            padding: 32px 20px !important;
            gap: 32px !important;
          }
          .form-card {
            position: static !important;
            top: unset !important;
          }
        }
      `}</style>

      <Navbar />

      {/* HERO */}
      <div className="hero-section" style={{
        background: "linear-gradient(135deg, #0A1628 0%, #0D2040 100%)",
        padding: "100px 40px 56px",
        textAlign: "center",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(0,195,137,0.12)", border: "1px solid rgba(0,195,137,0.25)",
          borderRadius: "20px", padding: "5px 14px", marginBottom: "20px",
        }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#00C389", letterSpacing: "0.08em" }}>
            TƯ VẤN MIỄN PHÍ
          </span>
        </div>
        <h1 style={{
          fontSize: "38px", fontWeight: 800, color: "#fff",
          lineHeight: 1.25, marginBottom: "16px",
        }}>
          Kết nối với chuyên gia<br />
          <span style={{ color: "#00C389" }}>BAMBOO100</span>
        </h1>
        <p style={{
          fontSize: "16px", color: "rgba(255,255,255,0.55)",
          maxWidth: "520px", margin: "0 auto", lineHeight: 1.7,
        }}>
          Đội ngũ chuyên gia sẵn sàng tư vấn chiến lược giao dịch phái sinh hàng hóa
          phù hợp với mục tiêu tài chính của bạn.
        </p>
      </div>

      {/* MAIN */}
      <div className="main-grid" style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "56px 40px",
        display: "grid", gridTemplateColumns: "1fr 420px", gap: "56px",
      }}>

        {/* LEFT — Thông tin liên hệ */}
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#0A1628", marginBottom: "32px" }}>
            Thông tin liên hệ
          </h2>

          {[
            {
              icon: "ti-map-pin", label: "Địa chỉ",
              value: "Tầng 7, số 5B ngõ 55 Huỳnh Thúc Kháng, Đống Đa, Hà Nội",
            },
            { icon: "ti-phone", label: "Hotline", value: "0378 219 712" },
            { icon: "ti-mail", label: "Email", value: "daucohanghoa@gmail.com" },
            {
              icon: "ti-clock", label: "Giờ làm việc",
              value: "Thứ 2 – Thứ 6: 8:00 – 18:00 | Thứ 7: 8:00 – 12:00",
            },
          ].map((item) => (
            <div key={item.label} style={{
              display: "flex", gap: "16px", marginBottom: "28px", alignItems: "flex-start",
            }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "10px",
                background: "rgba(0,195,137,0.08)", border: "1px solid rgba(0,195,137,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <i className={`ti ${item.icon}`} style={{ fontSize: "20px", color: "#00C389" }} />
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500, marginBottom: "4px" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: "14px", color: "#0A1628", fontWeight: 500, lineHeight: 1.6 }}>
                  {item.value}
                </div>
              </div>
            </div>
          ))}

          {/* Zalo CTA */}
          <a
            href="https://zalo.me/0378219712"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              background: "#0068FF", color: "#fff",
              padding: "12px 24px", borderRadius: "10px",
              textDecoration: "none", fontSize: "14px", fontWeight: 600,
              marginTop: "8px",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.04 2 11c0 2.7 1.24 5.12 3.2 6.8L4 22l4.36-1.38C9.4 21.18 10.67 21.5 12 21.5c5.52 0 10-4.04 10-9s-4.48-9-10-9z" />
            </svg>
            Nhắn Zalo ngay
          </a>

          {/* Map placeholder */}
          <div style={{
            marginTop: "40px", borderRadius: "14px", overflow: "hidden",
            border: "1px solid #e2e8f0", height: "220px",
            background: "linear-gradient(135deg, #f8fafc, #e8ecef)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: "8px",
          }}>
            <i className="ti ti-map-2" style={{ fontSize: "36px", color: "#cbd5e1" }} />
            <span style={{ fontSize: "13px", color: "#94a3b8" }}>Bản đồ sẽ hiển thị ở đây</span>
          </div>
        </div>

        {/* RIGHT — Form (id để scroll tới khi bấm CTA) */}
        <div id="dat-lich" className="form-card" style={{
          background: "#fff", borderRadius: "16px",
          border: "1px solid #e2e8f0",
          padding: "32px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          alignSelf: "start",
          position: "sticky", top: "76px",
        }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0A1628", marginBottom: "4px" }}>
            Đặt lịch tư vấn
          </h2>
          <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "24px" }}>
            Chuyên gia sẽ liên hệ lại trong vòng 24 giờ
          </p>

          {status === "success" ? (
            <div style={{
              textAlign: "center", padding: "40px 20px",
              background: "rgba(0,195,137,0.06)", borderRadius: "12px",
              border: "1px solid rgba(0,195,137,0.2)",
            }}>
              <div style={{
  width: "56px", height: "56px", borderRadius: "50%",
  background: "rgba(0,195,137,0.12)",
  display: "flex", alignItems: "center", justifyContent: "center",
  margin: "0 auto 16px",
}}>
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path
      d="M20 6L9 17l-5-5"
      stroke="#00C389"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0A1628", marginBottom: "8px" }}>
                Gửi thành công!
              </h3>
              <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6 }}>
                Chúng tôi đã nhận được yêu cầu của bạn.<br />
                Chuyên gia sẽ liên hệ lại sớm nhất!
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Họ và tên <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: "8px",
                    border: "1px solid #e2e8f0", fontSize: "14px", color: "#0A1628",
                    outline: "none", boxSizing: "border-box",
                    background: status === "error" && !form.name ? "#fef2f2" : "#fff",
                    borderColor: status === "error" && !form.name ? "#fca5a5" : "#e2e8f0",
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Số điện thoại <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="0901 234 567"
                  type="tel"
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: "8px",
                    border: "1px solid #e2e8f0", fontSize: "14px", color: "#0A1628",
                    outline: "none", boxSizing: "border-box",
                    background: status === "error" && !form.phone ? "#fef2f2" : "#fff",
                    borderColor: status === "error" && !form.phone ? "#fca5a5" : "#e2e8f0",
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Email
                </label>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@example.com"
                  type="email"
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: "8px",
                    border: "1px solid #e2e8f0", fontSize: "14px", color: "#0A1628",
                    outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Nhu cầu của bạn
                </label>
                <select
                  value={form.need}
                  onChange={(e) => setForm({ ...form, need: e.target.value })}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: "8px",
                    border: "1px solid #e2e8f0", fontSize: "14px", color: "#0A1628",
                    outline: "none", background: "#fff", boxSizing: "border-box",
                  }}
                >
                  <option value="">-- Chọn nhu cầu --</option>
                  <option value="Tư vấn giao dịch hàng hóa">Tư vấn giao dịch hàng hóa</option>
                  <option value="Mở tài khoản đầu tư">Mở tài khoản đầu tư</option>
                  <option value="Khóa học & đào tạo">Khóa học & đào tạo</option>
                  <option value="Phân tích thị trường">Phân tích thị trường</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Nội dung cần tư vấn
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Mô tả ngắn gọn vấn đề bạn muốn được tư vấn..."
                  rows={3}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: "8px",
                    border: "1px solid #e2e8f0", fontSize: "14px", color: "#0A1628",
                    outline: "none", resize: "none", fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {status === "error" && (
                <p style={{ fontSize: "12px", color: "#dc2626" }}>
                  {errorMsg}
                </p>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  background: loading ? "#94a3b8" : "#00C389",
                  color: "#fff", border: "none", borderRadius: "8px",
                  padding: "13px", fontSize: "14px", fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  width: "100%", marginTop: "4px",
                }}
              >
                {loading ? "Đang gửi..." : "Gửi yêu cầu tư vấn →"}
              </button>

              <p style={{ fontSize: "11px", color: "#94a3b8", textAlign: "center" }}>
                Thông tin của bạn được bảo mật tuyệt đối
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
