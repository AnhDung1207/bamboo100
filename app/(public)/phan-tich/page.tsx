import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import type { Metadata } from "next"
import ArticleFeed from "./ArticleFeed"
import PriceWidget from "./PriceWidget"
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
  title: "Phân tích thị trường | BAMBOO100",
  description: "Phân tích cung-cầu chuyên sâu về vàng, dầu thô, cà phê, đồng và các hàng hóa phái sinh.",
}

export default async function PhanTichPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const supabase = await createClient()
  const { category } = await searchParams

  let query = supabase
    .from("articles")
    .select(`
      id, title, slug, excerpt, thumbnail_url,
      is_premium, is_hot, view_count, read_time, published_at,
      categories(id, name, slug, color),
      profiles(full_name)
    `)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(20)

  if (category === "hot-news") {
    query = query.eq("is_hot", true)
  } else if (category) {
    const { data: group } = await supabase
      .from("product_groups")
      .select("id")
      .eq("slug", category)
      .single()
    if (group) {
      query = query.eq("group_id", group.id)
    }
  }

  const { data: articles } = await query

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", minHeight: "100vh", background: "#fff" }}>

      {/* ── MOBILE CSS ── */}
      <style>{`
        @media (max-width: 768px) {
          /* Navbar — handled by shared Navbar component */
          .nav-links  { display: none !important; }
          .nav-login  { display: none !important; }
          .hamburger  { display: flex !important; }

          /* Category filter */
          .category-bar {
            padding: 0 16px !important;
            top: 60px !important;
          }

          /* Main layout — 1 cột, sidebar xuống dưới feed */
          .main-grid {
            grid-template-columns: 1fr !important;
            padding: 20px 16px !important;
            gap: 24px !important;
          }

          /* Sidebar: bỏ sticky, hiện bình thường dưới feed */
          .sidebar-right {
            position: static !important;
          }

          /* Ẩn search + price widget trên mobile — giữ CTA */
          .sidebar-search  { display: none !important; }
          .sidebar-prices  { display: none !important; }
        }
      `}</style>

      {/* ── NAVBAR (dùng chung) ── */}
      <Navbar />

      {/* CATEGORY FILTER BAR */}
      <div className="category-bar" style={{
        borderBottom: "1px solid #e8ecef",
        padding: "0 40px",
        background: "#fff",
        position: "sticky", top: "60px", zIndex: 99,
      }}>
        <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none" as any, gap: "4px", padding: "10px 0" }}>
          {[
            { label: "Tất cả tin tức", slug: "" },
            { label: "Hot news", slug: "hot-news" },
            { label: "Nông sản", slug: "nong-san" },
            { label: "Nguyên Liệu Công Nghiệp", slug: "nguyen-lieu-cong-nghiep" },
            { label: "Kim Loại", slug: "kim-loai" },
            { label: "Năng Lượng", slug: "nang-luong" },
            { label: "Phân tích kỹ thuật", slug: "phan-tich-ky-thuat" },
            { label: "Báo cáo kinh tế", slug: "bao-cao-kinh-te" },
          ].map((cat) => {
            const isActive = (!category && cat.slug === "") || category === cat.slug
            return (
              <Link key={cat.slug} href={cat.slug ? `/phan-tich?category=${cat.slug}` : "/phan-tich"} style={{
                display: "flex", alignItems: "center",
                padding: "6px 16px",
                fontSize: "13px",
                fontWeight: isActive ? 700 : 400,
                textDecoration: "none",
                whiteSpace: "nowrap",
                color: isActive ? "#0A1628" : "#64748b",
                borderRadius: "20px",
                border: isActive ? "1.5px solid #0A1628" : "1.5px solid transparent",
                background: "transparent",
                letterSpacing: "0.01em",
              }}>{cat.label}</Link>
            )
          })}
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div style={{ background: "#f7f8fa", minHeight: "60vh" }}>
        <div
          className="main-grid"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "32px 40px",
            display: "grid",
            gridTemplateColumns: "1fr 280px",
            gap: "40px",
          }}
        >
          {/* FEED */}
          <ArticleFeed articles={articles || []} />

          {/* SIDEBAR */}
          <div className="sidebar-right" style={{ position: "sticky", top: "120px", alignSelf: "start" }}>
            {/* Search */}
            <div className="sidebar-search" style={{
              display: "flex", alignItems: "center", gap: "8px",
              border: "1px solid #e2e8f0", borderRadius: "8px",
              padding: "9px 14px", marginBottom: "20px",
              background: "#fff",
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input placeholder="Tìm kiếm phân tích..." style={{
                border: "none", outline: "none", fontSize: "13px",
                color: "#0A1628", background: "transparent", width: "100%",
              }} />
            </div>

            {/* Price widget */}
            <div className="sidebar-prices"><PriceWidget /></div>

            {/* CTA */}
            <div style={{ background: "linear-gradient(135deg, #0A1628, #0D2040)", borderRadius: "12px", padding: "20px" }}>
              <h3 style={{ color: "#fff", fontSize: "14px", fontWeight: 600, marginBottom: "8px", lineHeight: 1.4 }}>
                Tư vấn chiến lược 1-1
              </h3>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", lineHeight: 1.6, marginBottom: "14px" }}>
                Cùng chuyên gia xây dựng kế hoạch giao dịch phù hợp mục tiêu của bạn.
              </p>
              <Link href="/lien-he#dat-lich" style={{
                display: "block", textAlign: "center",
                background: "#00C389", color: "#fff",
                fontSize: "13px", fontWeight: 600,
                padding: "10px", borderRadius: "7px", textDecoration: "none",
              }}>Đặt lịch tư vấn →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
