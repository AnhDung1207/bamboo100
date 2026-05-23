"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import { createClient } from "@/lib/supabase/client"

const WHY = [
  { icon: "📊", title: "Dữ liệu cung-cầu thực", desc: "Phân tích từ báo cáo tồn kho, sản lượng và dòng tiền thực tế — không phỏng đoán." },
  { icon: "🛡️", title: "Quản trị rủi ro", desc: "Mỗi chiến lược đi kèm tỷ lệ Risk/Reward và mức dừng lỗ cụ thể." },
  { icon: "🎯", title: "Kịch bản hành động", desc: "Bull/Bear/Base scenario giúp chuẩn bị mọi tình huống thị trường." },
  { icon: "⚡", title: "Cập nhật liên tục", desc: "Theo dõi EIA, FOMC và các sự kiện vĩ mô ảnh hưởng đến giá hàng hóa." },
]

const SERVICES = [
  { num: "01", title: "Phân tích thị trường", desc: "Báo cáo định kỳ theo ngành hàng: Năng lượng, Kim loại, Nông sản.", cta: "Xem báo cáo mẫu", href: "/phan-tich" },
  { num: "02", title: "Tư vấn chiến lược 1-1", desc: "Cùng chuyên gia xây dựng danh mục và kế hoạch giao dịch cá nhân hóa.", cta: "Đặt lịch tư vấn", href: "/lien-he#dat-lich" },
  { num: "03", title: "Đào tạo & học viện", desc: "Khóa học từ cơ bản đến nâng cao về phái sinh hàng hóa.", cta: "Khám phá khóa học", href: "/hoc-vien" },
]

type Article = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  thumbnail_url: string | null
  read_time: number | null
  published_at: string | null
  category_id: string | null
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  return `${d.getDate()} tháng ${d.getMonth() + 1}, ${d.getFullYear()}`
}

export default function HomePage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" })
  const [submitted, setSubmitted] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [articles, setArticles] = useState<Article[]>([])
  const [articlesLoading, setArticlesLoading] = useState(true)
  const [articlesError, setArticlesError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("articles")
          .select("id, slug, title, excerpt, thumbnail_url, read_time, published_at, category_id")
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(3)
        if (error) setArticlesError(error.message)
        else if (data) setArticles(data as Article[])
      } catch (e: any) {
        setArticlesError(e?.message || "Lỗi không xác định")
      } finally {
        setArticlesLoading(false)
      }
    }

    const timeout = setTimeout(() => {
      setArticlesError("Timeout sau 8 giây")
      setArticlesLoading(false)
    }, 8000)

    fetchArticles().then(() => clearTimeout(timeout))
    return () => clearTimeout(timeout)
  }, [])

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone) return
    setSubmitLoading(true)
    setSubmitError("")
    const supabase = createClient()
    const { error } = await supabase.from("leads").insert({
      full_name: form.name,
      email: form.email || null,
      phone: form.phone,
      message: null,
      source: "homepage",
      status: "new",
    })
    setSubmitLoading(false)
    if (error) {
      if (error.code === "23505") {
        if (error.message.includes("email")) {
          setSubmitError("Email này đã được đăng ký trước đó!")
        } else if (error.message.includes("phone")) {
          setSubmitError("Số điện thoại này đã được đăng ký trước đó!")
        } else {
          setSubmitError("Thông tin này đã tồn tại trong hệ thống!")
        }
      } else {
        setSubmitError("Có lỗi xảy ra, vui lòng thử lại!")
      }
      return
    }
    setSubmitted(true)
    setForm({ name: "", email: "", phone: "" })
  }

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", background: "#fff" }}>
      <Navbar />

      {/* HERO */}
      <div className="home-hero" style={{ background: "linear-gradient(135deg, #0A1628 0%, #0D1F38 60%, #0A1628 100%)", padding: "72px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "rgba(0,195,137,0.12)", color: "#00C389", fontSize: "11px", fontWeight: 500, padding: "5px 12px", borderRadius: "20px", marginBottom: "20px", border: "1px solid rgba(0,195,137,0.25)", letterSpacing: "0.04em" }}>
            ⚡ Nền tảng phân tích chuyên sâu
          </div>
          <h1 className="hero-h1" style={{ color: "#fff", fontSize: "44px", fontWeight: 700, lineHeight: 1.2, marginBottom: "16px", letterSpacing: "-0.02em" }}>
            Giao dịch phái sinh<br />hàng hóa{" "}
            <span style={{ color: "#00C389" }}>dựa trên dữ liệu</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "15px", lineHeight: 1.7, marginBottom: "28px", maxWidth: "460px" }}>
            Phân tích cung-cầu thực tế, kịch bản thị trường và tư vấn chiến lược 1-1 dành cho nhà đầu tư cá nhân và doanh nghiệp.
          </p>
          <div className="hero-btns" style={{ display: "flex", gap: "12px", marginBottom: "36px" }}>
            <Link href="/lien-he#dat-lich" style={{ background: "#00C389", color: "#fff", fontSize: "14px", fontWeight: 600, padding: "12px 24px", borderRadius: "8px", textDecoration: "none" }}>Nhận tư vấn miễn phí →</Link>
            <Link href="/phan-tich" style={{ background: "rgba(255,255,255,0.07)", color: "#fff", fontSize: "14px", padding: "12px 24px", borderRadius: "8px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.15)" }}>Xem phân tích mẫu</Link>
          </div>
          <div className="hero-stats" style={{ display: "flex", gap: "32px", paddingTop: "28px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            {[["500+", "Khách hàng"], ["8+", "Năm kinh nghiệm"], ["1,200+", "Bài phân tích"]].map(([val, lbl]) => (
              <div key={lbl}>
                <div style={{ color: "#fff", fontSize: "26px", fontWeight: 700 }}>{val}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", marginTop: "3px" }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="chart-card" style={{ background: "#0D1F38", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <span style={{ color: "#fff", fontSize: "14px", fontWeight: 600 }}>Vàng (XAU/USD)</span>
            <span style={{ background: "rgba(0,195,137,0.15)", color: "#00C389", fontSize: "10px", padding: "3px 10px", borderRadius: "20px", border: "1px solid rgba(0,195,137,0.2)" }}>▲ +0.84% hôm nay</span>
          </div>
          <svg viewBox="0 0 340 100" style={{ width: "100%", height: "100px" }}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00C389" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#00C389" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polyline points="0,72 34,62 68,66 102,48 136,54 170,38 204,33 238,42 272,26 306,21 340,16" fill="none" stroke="#00C389" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="0,72 34,62 68,66 102,48 136,54 170,38 204,33 238,42 272,26 306,21 340,16 340,100 0,100" fill="url(#grad)" />
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
            <div>
              <div style={{ color: "#fff", fontSize: "20px", fontWeight: 700 }}>$2,342.50</div>
              <div style={{ color: "#00C389", fontSize: "11px", marginTop: "2px" }}>▲ +19.50 hôm nay</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px" }}>Cập nhật lúc</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }}>14:32 ICT</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "6px", marginTop: "14px" }}>
            {["1N", "1T", "3T", "6T", "1Y"].map((t) => (
              <div key={t} style={{ fontSize: "10px", padding: "4px 10px", borderRadius: "5px", background: t === "3T" ? "rgba(0,195,137,0.18)" : "rgba(255,255,255,0.05)", color: t === "3T" ? "#00C389" : "rgba(255,255,255,0.35)", border: `1px solid ${t === "3T" ? "rgba(0,195,137,0.3)" : "rgba(255,255,255,0.07)"}`, cursor: "pointer" }}>{t}</div>
            ))}
          </div>
        </div>
      </div>

      {/* WHY US */}
      <div className="why-section" style={{ background: "#fff", padding: "72px 80px" }}>
        <p style={{ fontSize: "11px", fontWeight: 600, color: "#00C389", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Tại sao chọn Bamboo100</p>
        <h2 style={{ fontSize: "32px", fontWeight: 700, color: "#0A1628", marginBottom: "8px", letterSpacing: "-0.02em" }}>Phân tích khác biệt, quyết định tốt hơn</h2>
        <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "40px" }}>Không dự báo mù — chỉ dữ liệu cung-cầu thực tế và kịch bản hành động rõ ràng.</p>
        <div className="why-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          {WHY.map((w) => (
            <div key={w.title} style={{ background: "#f8fafc", borderRadius: "12px", padding: "20px", border: "1px solid #e2e8f0" }}>
              <div style={{ width: "40px", height: "40px", background: "rgba(0,195,137,0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", marginBottom: "14px", border: "1px solid rgba(0,195,137,0.2)" }}>{w.icon}</div>
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0A1628", marginBottom: "6px" }}>{w.title}</h3>
              <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6 }}>{w.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <div className="services-section" style={{ background: "#f8fafc", padding: "72px 80px" }}>
        <p style={{ fontSize: "11px", fontWeight: 600, color: "#00C389", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Giải pháp của chúng tôi</p>
        <h2 style={{ fontSize: "32px", fontWeight: 700, color: "#0A1628", marginBottom: "40px", letterSpacing: "-0.02em" }}>Dịch vụ dành cho mọi cấp độ</h2>
        <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {SERVICES.map((s) => (
            <div key={s.num} style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px", cursor: "pointer", transition: "border-color 0.15s, box-shadow 0.15s" }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = "#00C389"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,195,137,0.1)" }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none" }}
            >
              <div style={{ fontSize: "11px", color: "#00C389", fontWeight: 600, marginBottom: "12px", fontFamily: "monospace" }}>{s.num}</div>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#0A1628", marginBottom: "8px" }}>{s.title}</h3>
              <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6, marginBottom: "16px" }}>{s.desc}</p>
              <Link href={s.href} style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: "#00C389", fontSize: "13px", fontWeight: 500, textDecoration: "none" }}>{s.cta} →</Link>
            </div>
          ))}
        </div>
      </div>

      {/* ARTICLES */}
      <div className="articles-section" style={{ background: "#fff", padding: "72px 80px" }}>
        <div className="articles-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
          <div>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "#00C389", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Phân tích nổi bật</p>
            <h2 style={{ fontSize: "32px", fontWeight: 700, color: "#0A1628", letterSpacing: "-0.02em" }}>Góc nhìn chuyên gia mới nhất</h2>
          </div>
          <Link href="/phan-tich" style={{ color: "#00C389", fontSize: "13px", fontWeight: 500, textDecoration: "none" }}>Xem tất cả →</Link>
        </div>

        {articlesLoading ? (
          <div className="articles-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ height: "160px", background: "#f1f5f9" }} />
                <div style={{ padding: "16px" }}>
                  <div style={{ height: "10px", background: "#f1f5f9", borderRadius: "4px", width: "40%", marginBottom: "10px" }} />
                  <div style={{ height: "14px", background: "#f1f5f9", borderRadius: "4px", marginBottom: "6px" }} />
                  <div style={{ height: "14px", background: "#f1f5f9", borderRadius: "4px", width: "70%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : articlesError ? (
          <div style={{ padding: "20px", background: "#fef2f2", borderRadius: "8px", border: "1px solid #fecaca" }}>
            <p style={{ fontSize: "13px", color: "#dc2626", fontWeight: 600 }}>Lỗi tải bài viết:</p>
            <p style={{ fontSize: "12px", color: "#dc2626", marginTop: "4px" }}>{articlesError}</p>
          </div>
        ) : articles.length === 0 ? (
          <div style={{ padding: "20px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <p style={{ fontSize: "13px", color: "#64748b" }}>Không có bài viết nào.</p>
          </div>
        ) : (
          <div className="articles-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {articles.map((a) => (
              <Link key={a.id} href={`/phan-tich/${a.slug}`} style={{ textDecoration: "none", display: "block" }}>
                <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", cursor: "pointer", transition: "border-color 0.15s, transform 0.15s", height: "100%" }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = "#00C389"; e.currentTarget.style.transform = "translateY(-2px)" }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.transform = "translateY(0)" }}
                >
                  {a.thumbnail_url ? (
                    <img src={a.thumbnail_url} alt={a.title} style={{ width: "100%", height: "160px", objectFit: "cover", display: "block" }} />
                  ) : (
                    <div style={{ height: "160px", background: "#0D1F38", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px" }}>📊</div>
                  )}
                  <div style={{ padding: "16px" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0A1628", lineHeight: 1.5, marginBottom: "10px" }}>{a.title}</h3>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8" }}>
                      <span>{formatDate(a.published_at)}</span>
                      {a.read_time && <span>{a.read_time} phút đọc</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* LEAD FORM */}
      <div className="lead-section" style={{ background: "linear-gradient(135deg, #0A1628 0%, #0D1F38 100%)", padding: "72px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
        <div>
          <h2 style={{ color: "#fff", fontSize: "36px", fontWeight: 700, lineHeight: 1.3, marginBottom: "14px", letterSpacing: "-0.02em" }}>Sẵn sàng giao dịch thông minh hơn?</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", lineHeight: 1.7, marginBottom: "24px" }}>Nhận báo cáo thị trường hàng tuần và phân tích kịch bản giao dịch miễn phí qua email.</p>
          {["Cập nhật xu hướng vĩ mô hàng tuần", "Phân tích cung-cầu các mặt hàng chính", "Kịch bản giao dịch tham khảo"].map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <div style={{ width: "18px", height: "18px", background: "rgba(0,195,137,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#00C389", fontSize: "10px" }}>✓</span>
              </div>
              <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "13px" }}>{item}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "28px" }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: "40px", marginBottom: "14px" }}>🎉</div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0A1628", marginBottom: "8px" }}>Đăng ký thành công!</h3>
              <p style={{ fontSize: "13px", color: "#64748b" }}>Chúng tôi sẽ gửi báo cáo đầu tiên cho bạn sớm nhất có thể.</p>
            </div>
          ) : (
            <>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0A1628", marginBottom: "20px" }}>Nhận báo cáo miễn phí</h3>
              {[
                { label: "Họ và tên", key: "name", placeholder: "Nguyễn Văn A", type: "text" },
                { label: "Email", key: "email", placeholder: "email@example.com", type: "email" },
                { label: "Số điện thoại", key: "phone", placeholder: "0912 345 678", type: "tel" },
              ].map((f) => (
                <div key={f.key} style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#64748b", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              ))}
              {submitError && (
                <p style={{ fontSize: "12px", color: "#dc2626", marginBottom: "8px", background: "#fef2f2", padding: "8px 12px", borderRadius: "6px", border: "1px solid #fecaca" }}>
                  ⚠️ {submitError}
                </p>
              )}
              <button onClick={handleSubmit} disabled={submitLoading} style={{ width: "100%", background: "#00C389", color: "#fff", fontSize: "14px", fontWeight: 600, padding: "12px", borderRadius: "8px", border: "none", cursor: "pointer", marginTop: "6px" }}>
                {submitLoading ? "Đang gửi..." : "Nhận báo cáo ngay →"}
              </button>
              <p style={{ fontSize: "11px", color: "#94a3b8", textAlign: "center", marginTop: "10px" }}>🔒 Thông tin của bạn được bảo mật tuyệt đối</p>
            </>
          )}
        </div>
      </div>

    </div>
  )
}
