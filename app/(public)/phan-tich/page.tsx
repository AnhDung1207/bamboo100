import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import type { Metadata } from "next"
import ArticleFeed from "./ArticleFeed"
import PriceWidget from "./PriceWidget"
import Navbar from "@/components/Navbar"
export const revalidate = 300

export const metadata: Metadata = {
  title: "Phân tích thị trường | BAMBOO100",
  description: "Phân tích cung-cầu chuyên sâu về vàng, dầu thô, cà phê, đồng và các hàng hóa phái sinh.",
}

const FILTER_TABS = [
  { label: "Tất cả",              slug: "",                        icon: "ti-layout-grid",       color: "#00C389" },
  { label: "Hot news",            slug: "hot-news",                icon: "ti-flame",             color: "#dc2626" },
  { label: "Kim loại",            slug: "kim-loai",                icon: "ti-medal",             color: "#EF9F27" },
  { label: "Nông sản",            slug: "nong-san",                icon: "ti-plant-2",           color: "#639922" },
  { label: "Nguyên liệu CN",      slug: "nguyen-lieu-cong-nghiep", icon: "ti-building-factory",  color: "#BA7517" },
  { label: "Năng lượng",          slug: "nang-luong",              icon: "ti-bolt",              color: "#E24B4A" },
  { label: "Phân tích kỹ thuật",  slug: "phan-tich-ky-thuat",      icon: "ti-chart-candle",      color: "#6D28D9" },
  { label: "Báo cáo kinh tế",     slug: "bao-cao-kinh-te",         icon: "ti-file-text",         color: "#1D4ED8" },
]

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
      product_groups(slug),
      profiles(full_name)
    `)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })

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

  const { data: articles, error } = await query
  console.log("articles:", articles)
  console.log("error:", error)

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", minHeight: "100vh", background: "#fff" }}>

      <style>{`
        @media (max-width: 768px) {
          .nav-links  { display: none !important; }
          .nav-login  { display: none !important; }
          .hamburger  { display: flex !important; }

          .category-bar { padding: 0 16px !important; top: 60px !important; }

          .main-grid {
            grid-template-columns: 1fr !important;
            padding: 20px 16px !important;
            gap: 24px !important;
          }

          .sidebar-right  { position: static !important; }
          .sidebar-search { display: none !important; }
          .sidebar-prices { display: none !important; }
        }

        /* ── PILL STYLES ── */
        .filter-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          white-space: nowrap;
          border: 1px solid #e2e8f0;
          background: transparent;
          color: #64748b;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
        }
        .filter-pill:hover {
          border-color: #cbd5e1;
          color: #0A1628;
          background: #f8fafc;
        }
        .filter-pill i { font-size: 14px; }

        /* Active states per category */
        .pill-all.active      { color: #00C389; border-color: #00C389; background: #f0fdf8; }
        .pill-hot.active      { color: #dc2626; border-color: #dc2626; background: #fef2f2; }
        .pill-kim-loai.active { color: #EF9F27; border-color: #EF9F27; background: #fffbeb; }
        .pill-nong-san.active { color: #639922; border-color: #639922; background: #f7fee7; }
        .pill-cn.active       { color: #BA7517; border-color: #BA7517; background: #fefce8; }
        .pill-nl.active       { color: #E24B4A; border-color: #E24B4A; background: #fef2f2; }
        .pill-kt.active       { color: #6D28D9; border-color: #6D28D9; background: #f5f3ff; }
        .pill-bc.active       { color: #1D4ED8; border-color: #1D4ED8; background: #eff6ff; }
      `}</style>

      <Navbar />

      {/* ── CATEGORY FILTER BAR ── */}
      <div className="category-bar" style={{
        borderBottom: "1px solid #e8ecef",
        padding: "0 40px",
        background: "#fff",
        position: "sticky", top: "60px", zIndex: 99,
      }}>
        <div style={{
          display: "flex", overflowX: "auto",
          scrollbarWidth: "none" as any,
          gap: "8px", padding: "10px 0",
        }}>
          {FILTER_TABS.map((tab) => {
            const isActive = (!category && tab.slug === "") || category === tab.slug
            const pillClass = [
              "filter-pill",
              `pill-${tab.slug || "all"}`,
              isActive ? "active" : "",
            ].join(" ")
            return (
              <Link
                key={tab.slug}
                href={tab.slug ? `/phan-tich?category=${tab.slug}` : "/phan-tich"}
                className={pillClass}
              >
                <i className={`ti ${tab.icon}`} aria-hidden="true" />
                {tab.label}
              </Link>
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
