import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import type { Metadata } from "next"
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
  title: "Nền tảng kiến thức | BAMBOO100",
  description: "Kho tàng kiến thức chuyên sâu về giao dịch hàng hóa, phân tích kỹ thuật và chiến lược đầu tư từ các chuyên gia BAMBOO100.",
  alternates: { canonical: "https://bamboo100.vn/hoc-vien/nen-tang-kien-thuc" },
}

export default async function NenTangKienThucPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams
  const cat = params?.cat
  const q = params?.q

  const [{ data: categories }, { data: allArticles }, { data: allCategories }] = await Promise.all([
    supabase.from("knowledge_categories").select("*").order("order_index"),
    supabase.from("knowledge_articles")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false }),
    supabase.from("knowledge_categories").select("*"),
  ])

  const categoryMap: Record<string, any> = {}
  ;(allCategories ?? []).forEach((c: any) => { categoryMap[c.id] = c })

  let articles = (allArticles ?? []).map((a: any) => ({
    ...a,
    knowledge_categories: a.category_id ? categoryMap[a.category_id] : null,
  }))

  if (cat && cat !== "tat-ca") {
    articles = articles.filter((a: any) => a.knowledge_categories?.slug === cat)
  }

  if (q) {
    const lower = q.toLowerCase()
    articles = articles.filter((a: any) =>
      a.title?.toLowerCase().includes(lower) || a.excerpt?.toLowerCase().includes(lower)
    )
  }

  const activeCategory = cat || "tat-ca"

  // Group articles into rows: full, split(2), full, split(2)...
  type Row =
    | { type: "full"; article: any }
    | { type: "split"; left: any; right: any | null }

  const rows: Row[] = []
  let i = 0
  let turn = 0 // 0 = full, 1 = split
  while (i < articles.length) {
    if (turn % 2 === 0) {
      rows.push({ type: "full", article: articles[i] })
      i += 1
    } else {
      rows.push({ type: "split", left: articles[i], right: articles[i + 1] ?? null })
      i += 2
    }
    turn++
  }

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", background: "#fff", minHeight: "100vh" }}>

      <style>{`
        @media (max-width: 768px) {
          .kt-hero { padding: 40px 16px 28px !important; }
          .kt-hero h1 { font-size: 26px !important; }
          .kt-tags { padding: 0 16px 24px !important; }
          .kt-feed { padding: 0 16px 48px !important; }
          .kt-split-row { grid-template-columns: 1fr !important; }
          .kt-card-full { min-height: 220px !important; border-radius: 8px !important; }
          .kt-card-full-text { padding: 1.25rem !important; max-width: 100% !important; }
          .kt-card-full-title { font-size: 18px !important; }
          .kt-card-left { min-height: 220px !important; border-radius: 8px !important; }
          .kt-card-plain { border-radius: 8px !important; }
        }
        .kt-tag:hover { border-color: #0A1628 !important; color: #0A1628 !important; background: #f1f5f9 !important; }
        .kt-card-full:hover .kt-readmore,
        .kt-card-left:hover .kt-readmore,
        .kt-card-plain:hover .kt-readmore { color: #00e6a4 !important; }
        .kt-card-plain:hover { border-color: #0A1628 !important; }
        .kt-card-full:hover { opacity: 0.95; }
        .kt-card-left:hover { opacity: 0.95; }
      `}</style>

      <Navbar />

      {/* HERO */}
      <div className="kt-hero" style={{ textAlign: "center", padding: "56px 40px 36px" }}>
        <p style={{ fontSize: "12px", color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>
          Nền tảng Kiến thức
        </p>
        <h1 style={{ fontSize: "36px", fontWeight: 700, color: "#0A1628", marginBottom: "24px", letterSpacing: "-0.02em" }}>
          Kiến thức nền tảng
        </h1>
        <form method="GET" action="/hoc-vien/nen-tang-kien-thuc" style={{ maxWidth: "420px", margin: "0 auto" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            border: "1px solid #e2e8f0", borderRadius: "10px",
            padding: "10px 16px", background: "#f8fafc",
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              name="q"
              defaultValue={q || ""}
              placeholder="Tìm kiếm kiến thức..."
              style={{
                border: "none", outline: "none", background: "transparent",
                fontSize: "14px", color: "#0A1628", width: "100%", fontFamily: "inherit",
              }}
            />
            {q && (
              <a href="/hoc-vien/nen-tang-kien-thuc" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "12px", flexShrink: 0 }}>✕</a>
            )}
          </div>
        </form>
      </div>

      {/* CATEGORY TAGS */}
      <div className="kt-tags" style={{ padding: "0 40px 28px", display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", maxWidth: "1100px", margin: "0 auto" }}>
        {[
          { name: "Các chủ đề được quan tâm", slug: "tat-ca" },
          ...(categories ?? []).filter((c: any) => c.slug !== "tat-ca"),
        ].map((c: any) => (
          <Link
            key={c.slug}
            href={`/hoc-vien/nen-tang-kien-thuc?cat=${c.slug}${q ? `&q=${q}` : ""}`}
            className="kt-tag"
            style={{
              padding: "6px 16px", borderRadius: "20px", fontSize: "13px",
              textDecoration: "none", whiteSpace: "nowrap",
              transition: "all 0.12s",
              background: activeCategory === c.slug ? "#0A1628" : "#fff",
              color: activeCategory === c.slug ? "#fff" : "#475569",
              border: `1px solid ${activeCategory === c.slug ? "#0A1628" : "#e2e8f0"}`,
            }}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {/* ARTICLE FEED */}
      <div className="kt-feed" style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 40px 60px", display: "flex", flexDirection: "column", gap: "12px" }}>

        {articles.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📚</div>
            <p style={{ fontSize: "15px", color: "#94a3b8" }}>
              {q ? `Không tìm thấy kết quả cho "${q}"` : "Chưa có bài viết nào. Hãy quay lại sau!"}
            </p>
          </div>
        ) : (
          rows.map((row, rowIdx) => {
            if (row.type === "full") {
              const a = row.article
              return (
                <Link key={a.id} href={`/hoc-vien/nen-tang-kien-thuc/${a.slug}`} style={{ textDecoration: "none" }}>
                  <div className="kt-card-full" style={{
                    borderRadius: "8px", overflow: "hidden", cursor: "pointer",
                    background: a.thumbnail_url
                      ? `url(${a.thumbnail_url}) center/cover no-repeat`
                      : "linear-gradient(135deg, #0D1F38 0%, #0A2540 100%)",
                    minHeight: "280px", position: "relative",
                    transition: "opacity 0.15s",
                  }}>
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to right, rgba(5,15,30,0.96) 35%, rgba(5,15,30,0.15) 100%)",
                    }} />
                    <div className="kt-card-full-text" style={{ position: "relative", padding: "2.5rem", maxWidth: "52%" }}>
                      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginBottom: "12px", letterSpacing: "0.02em" }}>
                        Thời gian đọc · {a.read_time || 5} phút
                      </p>
                      <h2 className="kt-card-full-title" style={{
                        fontSize: "22px", fontWeight: 700, color: "#fff",
                        lineHeight: 1.35, marginBottom: "12px", letterSpacing: "-0.01em",
                      }}>{a.title}</h2>
                      {a.excerpt && (
                        <p style={{
                          fontSize: "13px", color: "rgba(255,255,255,0.55)",
                          lineHeight: 1.65, marginBottom: "16px",
                          display: "-webkit-box", WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical", overflow: "hidden",
                        } as any}>{a.excerpt}</p>
                      )}
                      <span className="kt-readmore" style={{ fontSize: "13px", color: "#00C389", fontWeight: 500, transition: "color 0.12s" }}>
                        Tìm hiểu thêm →
                      </span>
                    </div>
                  </div>
                </Link>
              )
            }

            // split row
            const { left, right } = row
            return (
              <div key={left.id} className="kt-split-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {/* Left — dark image card */}
                <Link href={`/hoc-vien/nen-tang-kien-thuc/${left.slug}`} style={{ textDecoration: "none" }}>
                  <div className="kt-card-left" style={{
                    borderRadius: "8px", overflow: "hidden", cursor: "pointer",
                    background: left.thumbnail_url
                      ? `url(${left.thumbnail_url}) center/cover no-repeat`
                      : "linear-gradient(135deg, #0D1F38 0%, #0A2540 100%)",
                    minHeight: "280px", position: "relative", display: "flex", alignItems: "flex-end",
                    transition: "opacity 0.15s",
                  }}>
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to top, rgba(5,15,30,0.97) 0%, rgba(5,15,30,0.55) 50%, transparent 100%)",
                    }} />
                    <div style={{ position: "relative", padding: "1.5rem" }}>
                      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", marginBottom: "8px" }}>
                        Thời gian đọc · {left.read_time || 5} phút
                      </p>
                      <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", lineHeight: 1.4, marginBottom: "8px" }}>
                        {left.title}
                      </h3>
                      {left.excerpt && (
                        <p style={{
                          fontSize: "12px", color: "rgba(255,255,255,0.5)",
                          lineHeight: 1.6, marginBottom: "12px",
                          display: "-webkit-box", WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical", overflow: "hidden",
                        } as any}>{left.excerpt}</p>
                      )}
                      <span className="kt-readmore" style={{ fontSize: "12px", color: "#00C389", fontWeight: 500, transition: "color 0.12s" }}>
                        Tìm hiểu thêm →
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Right — white card (hoặc placeholder nếu không có bài) */}
                {right ? (
                  <Link href={`/hoc-vien/nen-tang-kien-thuc/${right.slug}`} style={{ textDecoration: "none" }}>
                    <div className="kt-card-plain" style={{
                      borderRadius: "8px", padding: "1.5rem", cursor: "pointer",
                      border: "1px solid #e2e8f0", background: "#fff",
                      transition: "border-color 0.12s", height: "100%",
                      display: "flex", flexDirection: "column", justifyContent: "space-between",
                      boxSizing: "border-box",
                    }}>
                      <div>
                        <p style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "10px" }}>
                          Thời gian đọc · {right.read_time || 5} phút
                        </p>
                        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0A1628", lineHeight: 1.45, marginBottom: "10px" }}>
                          {right.title}
                        </h3>
                        {right.excerpt && (
                          <p style={{
                            fontSize: "13px", color: "#64748b", lineHeight: 1.6, marginBottom: "14px",
                            display: "-webkit-box", WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical", overflow: "hidden",
                          } as any}>{right.excerpt}</p>
                        )}
                      </div>
                      <span className="kt-readmore" style={{ fontSize: "13px", color: "#00C389", fontWeight: 500, transition: "color 0.12s" }}>
                        Tìm hiểu thêm →
                      </span>
                    </div>
                  </Link>
                ) : (
                  // Ô trống khi số bài lẻ — giữ layout cân bằng
                  <div style={{ borderRadius: "8px", background: "#f8fafc", border: "1px solid #f1f5f9" }} />
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
