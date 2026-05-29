"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import AdvantagesSection from "@/components/AdvantagesSection"
import ServicesCarousel from "@/components/ServicesCarousel"
import FAQSection from "@/components/FAQSection"
import { createClient } from "@/lib/supabase/client"

const WHY = [
  { icon: "📊", title: "Dữ liệu cung-cầu thực", desc: "Phân tích từ báo cáo tồn kho, sản lượng và dòng tiền thực tế — không phỏng đoán." },
  { icon: "🛡️", title: "Quản trị rủi ro", desc: "Mỗi chiến lược đi kèm tỷ lệ Risk/Reward và mức dừng lỗ cụ thể." },
  { icon: "🎯", title: "Kịch bản hành động", desc: "Bull/Bear/Base scenario giúp chuẩn bị mọi tình huống thị trường." },
  { icon: "⚡", title: "Cập nhật liên tục", desc: "Theo dõi EIA, FOMC và các sự kiện vĩ mô ảnh hưởng đến giá hàng hóa." },
]

const PRODUCTS = [
  {
    key: "nonsan",
    title: "Nông sản",
    desc: "Đậu tương, Ngô, Lúa Mỳ và các hợp đồng nông sản quốc tế từ sàn CBOT.",
    href: "/san-pham/nong-san",
    thumbs: [
      { src: "/products/nonsan/dautuong.png", alt: "Đậu tương" },
      { src: "/products/nonsan/luami.png", alt: "Lúa Mỳ" },
      { src: "/products/nonsan/ngo1.png", alt: "Ngô" },
    ],
  },
  {
    key: "nangluong",
    title: "Năng lượng",
    desc: "Dầu WTI, Dầu Brent, Khí tự nhiên và xăng pha chế từ NYMEX và ICE EU.",
    href: "/san-pham/nang-luong",
    thumbs: [
      { src: "/products/nangluong/dau-tho.png", alt: "Dầu thô" },
      { src: "/products/nangluong/khi-tu-nhien.png", alt: "Khí tự nhiên" },
      { src: "/products/nangluong/xang.png", alt: "Xăng" },
    ],
  },
  {
    key: "kimloai",
    title: "Kim loại",
    desc: "Bạc, Đồng, Bạch kim và Quặng sắt từ các sàn COMEX, NYMEX và SGX.",
    href: "/san-pham/kim-loai",
    thumbs: [
      { src: "/products/kimloai/bac.png", alt: "Bạc" },
      { src: "/products/kimloai/bachkim.png", alt: "Bạch kim" },
      { src: "/products/kimloai/dong.png", alt: "Đồng" },
    ],
  },
  {
    key: "nguyenlieu",
    title: "Nguyên liệu CN",
    desc: "Cà phê, Cao su, Cacao, Bông sợi và Đường từ sàn ICE US và ICE EU.",
    href: "/san-pham/nguyen-lieu-cong-nghiep",
    thumbs: [
      { src: "/products/nguyenlieu/ca-cao.png", alt: "Cacao" },
      { src: "/products/nguyenlieu/caosu.png", alt: "Cao su" },
      { src: "/products/nguyenlieu/ca-phe.png", alt: "Cà phê" },
    ],
  },
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

const containerStyle: React.CSSProperties = {
  maxWidth: "1280px",
  margin: "0 auto",
  padding: "0 40px",
}

// ─── Price Chart Card ───
function HeroPriceCard() {
  const [activeRange, setActiveRange] = useState("3T")
  const ranges = ["1N", "1T", "3T", "6T", "1Y"]

  const mockData: Record<string, number[]> = {
    "1N": [29.10, 29.45, 29.20, 29.68, 29.80, 29.55, 29.92],
    "1T": [28.30, 28.75, 29.10, 28.90, 29.30, 29.60, 29.92],
    "3T": [26.50, 27.20, 27.90, 28.50, 29.00, 29.60, 29.92],
    "6T": [24.80, 25.60, 26.50, 27.40, 28.30, 29.20, 29.92],
    "1Y": [22.10, 23.50, 25.00, 26.50, 27.80, 29.00, 29.92],
  }

  const data = mockData[activeRange]
  const min = Math.min(...data)
  const max = Math.max(...data)
  const w = 480, h = 140, pad = 10

  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2)
    const y = h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2)
    return `${x},${y}`
  }).join(" ")

  const areaPoints = `${pad},${h - pad} ${points} ${w - pad},${h - pad}`
  const price = data[data.length - 1]
  const change = data[data.length - 1] - data[data.length - 2]
  const now = new Date()
  const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")} ICT`

  return (
    <div style={{
      background: "#0D1F38",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "16px",
      padding: "24px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", fontWeight: 500 }}>
          Bạc (XAG/USD)
        </span>
        <div style={{
          background: "rgba(0,195,137,0.15)", border: "1px solid rgba(0,195,137,0.3)",
          borderRadius: "20px", padding: "3px 10px",
          fontSize: "12px", fontWeight: 600, color: "#00C389",
        }}>
          ▲ +{((change / (price - change)) * 100).toFixed(2)}% hôm nay
        </div>
      </div>

      <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block", marginBottom: "16px" }}>
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00C389" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00C389" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill="url(#chartGrad)" />
        <polyline points={points} fill="none" stroke="#00C389" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "16px" }}>
        <div>
          <div style={{ color: "#fff", fontSize: "32px", fontWeight: 800, letterSpacing: "-0.02em" }}>
            ${price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div style={{ color: "#00C389", fontSize: "13px", marginTop: "2px" }}>
            ▲ +{change.toFixed(2)} hôm nay
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>
          Cập nhật lúc<br />{timeStr}
        </div>
      </div>

      <div style={{ display: "flex", gap: "6px" }}>
        {ranges.map((r) => (
          <button
            key={r}
            onClick={() => setActiveRange(r)}
            style={{
              padding: "5px 12px", borderRadius: "6px", fontSize: "12px",
              fontWeight: 600, border: "none", cursor: "pointer",
              background: activeRange === r ? "#00C389" : "rgba(255,255,255,0.07)",
              color: activeRange === r ? "#fff" : "rgba(255,255,255,0.45)",
              transition: "all 0.15s",
            }}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  )
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

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-chart { display: none !important; }
          .hero-h1 { font-size: 36px !important; }
          .hero-inner { padding: 40px 20px 40px !important; max-width: 100% !important; }
          .hero-stats { gap: 24px !important; }
          .products-section { padding: 40px 0 !important; }
          .products-inner { padding: 0 20px !important; }
          .products-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .products-col { padding: 0 !important; border-right: none !important; overflow: hidden !important; }
          .why-section { padding: 40px 0 !important; }
          .why-inner { padding: 0 20px !important; }
          .why-grid { grid-template-columns: 1fr 1fr !important; }
          .articles-section { padding: 40px 0 !important; }
          .articles-inner { padding: 0 20px !important; }
          .articles-header { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
          .articles-grid { grid-template-columns: 1fr !important; }
          .lead-section { padding: 40px 0 !important; }
          .lead-inner { grid-template-columns: 1fr !important; padding: 0 20px !important; gap: 32px !important; }
        }
      `}</style>

      {/* ─── HERO ─── */}
      <div style={{
        background: "#0A1628",
        paddingTop: "80px",
        paddingBottom: "0",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Dot grid texture */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          pointerEvents: "none",
        }} />

        <div className="hero-inner" style={{ position: "relative", zIndex: 2, padding: "60px 80px 60px" }}>

          {/* 2-col grid */}
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>

            {/* LEFT */}
            <div>
              <h1 className="hero-h1" style={{
                color: "#fff", fontSize: "52px", fontWeight: 800,
                lineHeight: 1.08, letterSpacing: "-0.03em",
                margin: "0 0 20px",
              }}>
                Giao dịch phái sinh<br />
                hàng hóa <span style={{ color: "#00C389" }}>dựa trên dữ liệu</span>
              </h1>

              <p style={{
                color: "rgba(255,255,255,0.5)", fontSize: "15px",
                lineHeight: 1.75, margin: "0 0 36px", maxWidth: "420px",
              }}>
                Phân tích cung-cầu thực tế, kịch bản thị trường và tư vấn chiến lược
                1-1 dành cho nhà đầu tư cá nhân và doanh nghiệp.
              </p>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link href="/lien-he#dat-lich" style={{
                  display: "inline-block",
                  background: "#00C389", color: "#fff",
                  fontSize: "14px", fontWeight: 700,
                  padding: "13px 28px", borderRadius: "8px",
                  textDecoration: "none",
                }}>
                  Nhận tư vấn miễn phí →
                </Link>
                <Link href="/phan-tich" style={{
                  display: "inline-block",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                  fontSize: "14px", fontWeight: 600,
                  padding: "13px 28px", borderRadius: "8px",
                  textDecoration: "none",
                }}>
                  Xem phân tích mẫu
                </Link>
              </div>

              {/* Stats */}
              <div className="hero-stats" style={{
                display: "flex", gap: "40px", marginTop: "48px",
                paddingTop: "32px", borderTop: "1px solid rgba(255,255,255,0.08)",
              }}>
                {[
                  { num: "500+", label: "Khách hàng" },
                  { num: "8+", label: "Năm kinh nghiệm" },
                  { num: "1,200+", label: "Bài phân tích" },
                ].map((s) => (
                  <div key={s.label}>
                    <div style={{ fontSize: "28px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                      {s.num}
                    </div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginTop: "2px" }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Chart */}
            <div className="hero-chart">
              <HeroPriceCard />
            </div>
          </div>
        </div>
      </div>

      {/* ─── PRODUCTS ─── */}
      <div className="products-section" style={{ background: "#fff", padding: "72px 0" }}>
        <div className="products-inner" style={containerStyle}>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#00C389", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>
            Sản phẩm
          </p>
          <h2 style={{ fontSize: "34px", fontWeight: 800, color: "#0A1628", letterSpacing: "-0.03em", margin: "0 0 40px", lineHeight: 1.1 }}>
            Giao dịch theo cách của bạn
          </h2>

          <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            {PRODUCTS.map((p, i) => (
              <div key={p.key} className="products-col" style={{
                paddingLeft: i === 0 ? 0 : "32px",
                paddingRight: i === PRODUCTS.length - 1 ? 0 : "32px",
              }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", justifyContent: "flex-start", marginBottom: "20px", overflow: "hidden" }}>
                  {p.thumbs.map((t, idx) => {
                    const isLow = i % 2 === 0 ? idx !== 1 : idx === 1
                    return (
                      <div key={idx} style={{
                        width: "72px", height: "72px",
                        borderRadius: "16px", overflow: "hidden",
                        border: "1px solid #e2e8f0", flexShrink: 0,
                        position: "relative",
                        marginTop: isLow ? "40px" : "0px",
                        background: "#f1f5f9",
                      }}>
                        <Image src={t.src} alt={t.alt} fill sizes="72px" style={{ objectFit: "cover" }} />
                      </div>
                    )
                  })}
                </div>
                <h3 style={{ fontSize: "25px", fontWeight: 700, color: "#0A1628", margin: "0 0 8px" }}>{p.title}</h3>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.65, margin: "0 0 16px" }}>{p.desc}</p>
                <Link href={p.href} style={{ fontSize: "13px", fontWeight: 600, color: "#00C389", textDecoration: "none" }}>
                  Xem thêm →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AdvantagesSection />

      {/* ─── WHY US ─── */}
      <div className="why-section" style={{ background: "#fff", padding: "72px 0" }}>
        <div className="why-inner" style={containerStyle}>
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
      </div>

      <ServicesCarousel />

      {/* ─── ARTICLES ─── */}
      <div className="articles-section" style={{ background: "#fff", padding: "72px 0" }}>
        <div className="articles-inner" style={containerStyle}>
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
                  <div
                    style={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", cursor: "pointer", transition: "border-color 0.15s, transform 0.15s", height: "100%" }}
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
      </div>

      <FAQSection />

      {/* ─── LEAD FORM ─── */}
      <div className="lead-section" style={{ background: "linear-gradient(135deg, #0A1628 0%, #0D1F38 100%)", padding: "72px 0" }}>
        <div className="lead-inner" style={{ ...containerStyle, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
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
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={form[f.key as keyof typeof form]}
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

    </div>
  )
}
