"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import AdvantagesSection from "@/components/AdvantagesSection"
import ServicesCarousel from "@/components/ServicesCarousel"
import FAQSection from "@/components/FAQSection"
import HeroSection from "@/components/HeroSection"
import WhyChooseBamboo from "@/components/WhyChooseBamboo"
import NewsSection from "@/components/NewsSection"
import CTASection from "@/components/CTASection"
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
      { src: "/products/nangluong/dautho.png", alt: "Dầu thô" },
      { src: "/products/nangluong/khitunhien.png", alt: "Khí tự nhiên" },
      { src: "/products/nangluong/xang1.png", alt: "Xăng" },
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

      {/* HERO */}
      <HeroSection />

      {/* PRODUCTS */}
      <div className="products-section" style={{ background: "#fff", padding: "72px 0" }}>
        <div className="products-inner" style={containerStyle}>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#00C389", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>
            Sản phẩm
          </p>
          <h2 style={{ fontSize: "34px", fontWeight: 800, color: "#0A1628", letterSpacing: "-0.03em", margin: "0 0 40px", lineHeight: 1.1 }}>
            Đa dạng sản phẩm đầu tư
          </h2>
          <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            {PRODUCTS.map((p, i) => (
              <div key={p.key} className="products-col" style={{
                paddingLeft: i === 0 ? 0 : "32px",
                paddingRight: i === PRODUCTS.length - 1 ? 0 : "32px",
              }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginBottom: "20px" }}>
                  {p.thumbs.map((t, idx) => (
                    <div key={idx} style={{
                      width: "72px", height: "72px",
                      borderRadius: "16px", overflow: "hidden",
                      border: "1px solid #e2e8f0", flexShrink: 0,
                      position: "relative",
                      marginTop: idx !== 1 ? "32px" : "0px",
                      background: "#f1f5f9",
                    }}>
                      <Image src={t.src} alt={t.alt} fill sizes="72px" style={{ objectFit: "cover" }} />
                    </div>
                  ))}
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#0A1628", margin: "0 0 8px" }}>{p.title}</h3>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.65, margin: "0 0 16px" }}>{p.desc}</p>
                <Link href="/" style={{ fontSize: "13px", fontWeight: 600, color: "#00C389", textDecoration: "none" }}>
  Xem thêm →
</Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AdvantagesSection />

      <WhyChooseBamboo />

      <ServicesCarousel />

      <NewsSection />

      <FAQSection />

      <CTASection />

    </div>
  )
}
