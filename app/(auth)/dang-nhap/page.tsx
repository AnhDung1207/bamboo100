"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function DangNhapPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError("Vui lòng nhập đầy đủ thông tin")
      return
    }
    setLoading(true)
    setError("")

    const supabase = createClient()

    // Bước 1: Đăng nhập
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (authError) {
      setError("Email hoặc mật khẩu không đúng")
      setLoading(false)
      return
    }

    // Bước 2: Kiểm tra role trong bảng profiles
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .single()

    // Bước 3: Quay lại trang người dùng đang xem, nếu có.
    const requestedRedirect = new URLSearchParams(window.location.search).get("redirect")
    const safeRedirect = requestedRedirect?.startsWith("/") && !requestedRedirect.startsWith("//")
      ? requestedRedirect
      : null

    if (safeRedirect) {
      router.push(safeRedirect)
    } else if (profile?.role === "admin") {
      router.push("/admin")
    } else {
      router.push("/dashboard")
    }

    router.refresh()
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
            Đăng nhập để tiếp tục
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "32px",
        }}>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#0A1628", marginBottom: "24px" }}>
            Đăng nhập
          </h1>

          {/* Error */}
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

          {/* Email */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{
              display: "block",
              fontSize: "11px",
              fontWeight: 600,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "6px",
            }}>Email</label>
            <input
              type="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={{
                width: "100%",
                padding: "11px 14px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => e.target.style.borderColor = "#00C389"}
              onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "8px" }}>
            <label style={{
              display: "block",
              fontSize: "11px",
              fontWeight: 600,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "6px",
            }}>Mật khẩu</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
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

          {/* Forgot password */}
          <div style={{ textAlign: "right", marginBottom: "20px" }}>
            <Link href="/quen-mat-khau" style={{ fontSize: "12px", color: "#00C389", textDecoration: "none" }}>
              Quên mật khẩu?
            </Link>
          </div>

          {/* Submit */}
          <button
            onClick={handleLogin}
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
              transition: "background 0.15s",
            }}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập →"}
          </button>

          {/* Divider */}
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

          {/* Register link */}
          <p style={{ textAlign: "center", fontSize: "13px", color: "#64748b" }}>
            Chưa có tài khoản?{" "}
            <Link href="/dang-ky" style={{ color: "#00C389", fontWeight: 600, textDecoration: "none" }}>
              Đăng ký miễn phí
            </Link>
          </p>
        </div>

        {/* Back home */}
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          <Link href="/" style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>
            ← Về trang chủ
          </Link>
        </p>
      </div>
    </div>
  )
}
