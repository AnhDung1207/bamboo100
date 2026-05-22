"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function DangKyPage() {
  const router = useRouter()
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirm: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleRegister = async () => {
    if (!form.fullName || !form.email || !form.password) {
      setError("Vui lòng nhập đầy đủ thông tin")
      return
    }
    if (form.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự")
      return
    }
    if (form.password !== form.confirm) {
      setError("Mật khẩu xác nhận không khớp")
      return
    }

    setLoading(true)
    setError("")

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.fullName },
      },
    })

    if (error) {
      setError(error.message === "User already registered"
        ? "Email này đã được đăng ký"
        : "Đã có lỗi xảy ra, vui lòng thử lại"
      )
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0A1628 0%, #0D1F38 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', 'Inter', sans-serif",
        padding: "20px",
      }}>
        <div style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "40px 32px",
          maxWidth: "420px",
          width: "100%",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📧</div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#0A1628", marginBottom: "10px" }}>
            Kiểm tra email của bạn!
          </h2>
          <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6, marginBottom: "24px" }}>
            Tớ đã gửi link xác nhận đến <strong>{form.email}</strong>. Vui lòng kiểm tra hộp thư và click vào link để kích hoạt tài khoản.
          </p>
          <Link href="/dang-nhap" style={{
            display: "inline-block",
            background: "#00C389",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 600,
            padding: "11px 24px",
            borderRadius: "8px",
            textDecoration: "none",
          }}>
            Về trang đăng nhập
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0A1628 0%, #0D1F38 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', 'Inter', sans-serif",
      padding: "20px",
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "10px" }}>
            <img src="/o.png" alt="BAMBOO100" style={{ width: "40px", height: "40px", borderRadius: "10px" }} />
            <span style={{ color: "#fff", fontSize: "18px", fontWeight: 700, letterSpacing: "0.04em" }}>
              BAMBOO<span style={{ color: "#00C389" }}>100</span>
            </span>
          </Link>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginTop: "8px" }}>
            Tạo tài khoản miễn phí
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "32px",
        }}>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#0A1628", marginBottom: "24px" }}>
            Đăng ký
          </h1>

          {error && (
            <div style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: "8px",
              padding: "10px 14px",
              marginBottom: "16px",
              fontSize: "13px",
              color: "#DC2626",
            }}>
              ⚠️ {error}
            </div>
          )}

          {[
            { label: "Họ và tên", key: "fullName", placeholder: "Nguyễn Văn A", type: "text" },
            { label: "Email", key: "email", placeholder: "email@example.com", type: "email" },
            { label: "Mật khẩu", key: "password", placeholder: "Tối thiểu 6 ký tự", type: "password" },
            { label: "Xác nhận mật khẩu", key: "confirm", placeholder: "Nhập lại mật khẩu", type: "password" },
          ].map((f) => (
            <div key={f.key} style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 600,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "6px",
              }}>{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={form[f.key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => e.target.style.borderColor = "#00C389"}
                onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>
          ))}

          <button
            onClick={handleRegister}
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "#94a3b8" : "#00C389",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 600,
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "4px",
            }}
          >
            {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản →"}
          </button>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            margin: "20px 0",
          }}>
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>hoặc</span>
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
          </div>

          <p style={{ textAlign: "center", fontSize: "13px", color: "#64748b" }}>
            Đã có tài khoản?{" "}
            <Link href="/dang-nhap" style={{ color: "#00C389", fontWeight: 600, textDecoration: "none" }}>
              Đăng nhập
            </Link>
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: "20px" }}>
          <Link href="/" style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>
            ← Về trang chủ
          </Link>
        </p>
      </div>
    </div>
  )
}
