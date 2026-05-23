import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Navbar from "@/components/Navbar"

const BASE_URL = "https://bamboo100.vn"

function formatDateTime(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleString("vi-VN", {
    hour: "2-digit", minute: "2-digit",
    day: "2-digit", month: "long", year: "numeric",
  })
}

function formatDateShort(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from("knowledge_articles")
    .select("title, excerpt, thumbnail_url, published_at, updated_at, knowledge_categories(name)")
    .eq("slug", slug)
    .single()

  if (!data) return { title: "Kiến thức | BAMBOO100" }

  const title = data.title
  const description = data.excerpt ?? "Kiến thức chuyên sâu về giao dịch hàng hóa từ BAMBOO100."
  const image = data.thumbnail_url ?? `${BASE_URL}/og-default.jpg`
  const url = `${BASE_URL}/hoc-vien/nen-tang-kien-thuc/${slug}`
  const categoryName = (data.knowledge_categories as any)?.name

  return {
    title,
    description,
    openGraph: {
      title, description, url, type: "article",
      publishedTime: data.published_at,
      modifiedTime: data.updated_at ?? data.published_at,
      authors: ["BAMBOO100"],
      tags: categoryName ? [categoryName] : undefined,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    alternates: { canonical: url },
  }
}

export default async function KienThucDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()

  const { data: article } = await supabase
    .from("knowledge_articles")
    .select("*, knowledge_categories(id, name, slug)")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (!article) notFound()

  const a = article as any
  const isLocked = a.is_premium && !session

  const takeaways: string[] = a.key_takeaways
    ? a.key_takeaways.split("\n").map((s: string) => s.trim()).filter((s: string) => s.length > 0)
    : []

  const { data: related } = await supabase
    .from("knowledge_articles")
    .select("id, title, slug, thumbnail_url, published_at, read_time, knowledge_categories(name, slug)")
    .eq("status", "published")
    .neq("slug", slug)
    .order("published_at", { ascending: false })
    .limit(4)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.excerpt ?? "",
    image: a.thumbnail_url ?? `${BASE_URL}/og-default.jpg`,
    datePublished: a.published_at,
    dateModified: a.updated_at ?? a.published_at,
    author: { "@type": "Organization", name: "BAMBOO100" },
    publisher: {
      "@type": "Organization", name: "BAMBOO100",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/o.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/hoc-vien/nen-tang-kien-thuc/${a.slug}` },
  }

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", minHeight: "100vh", background: "#fff" }}>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* LIGHTBOX STYLES */}
      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-login { display: none !important; }
          .hamburger { display: flex !important; }
          .article-hero { height: 260px !important; }
          .article-hero-text { padding: 0 16px 16px !important; }
          .article-hero-title { font-size: 20px !important; }
          .breadcrumb { padding: 10px 16px !important; }
          .breadcrumb-title { display: none !important; }
          .article-grid { grid-template-columns: 1fr !important; padding: 20px 0 !important; gap: 0 !important; }
          .sidebar-left { display: none !important; }
          .sidebar-right { display: none !important; }
          .article-main { order: 1 !important; }
          .related-grid { grid-template-columns: 1fr !important; }
          .article-cta { flex-direction: column !important; gap: 12px !important; }
        }
        #lb-overlay {
          display: none; position: fixed; inset: 0; z-index: 9999;
          background: rgba(0,0,0,0.93); align-items: center; justify-content: center;
        }
        #lb-overlay.open { display: flex; }
        #lb-img {
          max-width: 90vw; max-height: 90vh;
          border-radius: 8px; object-fit: contain;
          transform-origin: 0 0;
          cursor: grab; user-select: none;
          transition: none;
        }
        #lb-img.dragging { cursor: grabbing; }
        #lb-close {
          position: fixed; top: 20px; right: 24px;
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(255,255,255,0.15); border: none;
          color: #fff; font-size: 18px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          z-index: 10000;
        }
        #lb-close:hover { background: rgba(255,255,255,0.25); }
        #lb-hint {
          position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
          color: rgba(255,255,255,0.45); font-size: 11px; pointer-events: none;
        }
        .article-content img { cursor: zoom-in; transition: opacity 0.15s; border-radius: 8px; margin: 16px 0; max-width: 100%; }
        .article-content img:hover { opacity: 0.88; }
      `}</style>

      {/* LIGHTBOX HTML */}
      <div id="lb-overlay">
        <button id="lb-close" aria-label="Đóng">✕</button>
        <img id="lb-img" alt="Preview" draggable="false" />
        <div id="lb-hint">Cuộn để zoom · Kéo để di chuyển · Esc để đóng</div>
      </div>

      {/* LIGHTBOX SCRIPT */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          var overlay = document.getElementById('lb-overlay');
          var img = document.getElementById('lb-img');
          var closeBtn = document.getElementById('lb-close');
          var scale = 1, tx = 0, ty = 0;
          var dragging = false, startX = 0, startY = 0, startTx = 0, startTy = 0;

          function applyTransform() {
            img.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
          }

          function openLightbox(src) {
            img.src = src;
            scale = 1; tx = 0; ty = 0;
            applyTransform();
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
          }

          function closeLightbox() {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
          }

          document.addEventListener('click', function(e) {
            var t = e.target;
            if (t.tagName === 'IMG' && t.closest('.article-content')) {
              openLightbox(t.src);
            }
          });

          closeBtn.addEventListener('click', closeLightbox);

          overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closeLightbox();
          });

          document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeLightbox();
          });

          overlay.addEventListener('wheel', function(e) {
            e.preventDefault();
            var rect = img.getBoundingClientRect();
            var mouseX = e.clientX - rect.left;
            var mouseY = e.clientY - rect.top;
            var delta = e.deltaY > 0 ? 0.85 : 1.18;
            var newScale = Math.min(Math.max(scale * delta, 0.5), 8);
            tx = tx - mouseX * (newScale - scale);
            ty = ty - mouseY * (newScale - scale);
            scale = newScale;
            applyTransform();
          }, { passive: false });

          img.addEventListener('mousedown', function(e) {
            dragging = true;
            startX = e.clientX; startY = e.clientY;
            startTx = tx; startTy = ty;
            img.classList.add('dragging');
            e.preventDefault();
          });

          document.addEventListener('mousemove', function(e) {
            if (!dragging) return;
            tx = startTx + (e.clientX - startX);
            ty = startTy + (e.clientY - startY);
            applyTransform();
          });

          document.addEventListener('mouseup', function() {
            dragging = false;
            img.classList.remove('dragging');
          });
        })();
      `}} />

      <Navbar />

      {/* HERO IMAGE */}
      <div className="article-hero" style={{
        position: "relative", width: "100%", height: "480px",
        background: a.thumbnail_url
          ? 'url(' + a.thumbnail_url + ') center/cover no-repeat'
          : "linear-gradient(135deg, #0A1628 0%, #0D2040 100%)",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.95) 30%, rgba(0,0,0,0.4) 55%, transparent 100%)" }} />
        <div className="article-hero-text" style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 40px 4px", textAlign: "center" }}>
          {a.published_at && (
            <div style={{ display: "inline-block", background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", color: "rgba(255,255,255,0.85)", fontSize: "11px", padding: "4px 12px", borderRadius: "20px", marginBottom: "14px", letterSpacing: "0.02em" }}>
              {formatDateTime(a.published_at)}
            </div>
          )}
          <h1 className="article-hero-title" style={{ color: "#fff", fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 700, lineHeight: 1.35, maxWidth: "760px", margin: "0 auto", textShadow: "0 0 1px #000, 0 1px 3px #000, 0 2px 8px rgba(0,0,0,1), 0 4px 20px rgba(0,0,0,1)" }}>
            {a.title}
          </h1>
        </div>
      </div>

      {/* BREADCRUMB */}
      <div className="breadcrumb" style={{ background: "#f7f8fa", borderBottom: "1px solid #e8ecef", padding: "10px 40px", fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "6px" }}>
        <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>Trang chủ</Link>
        <span>›</span>
        <Link href="/hoc-vien/nen-tang-kien-thuc" style={{ color: "#64748b", textDecoration: "none" }}>Nền tảng kiến thức</Link>
        <span>›</span>
        <span style={{ color: "#00C389", fontWeight: 500 }}>{a.knowledge_categories?.name ?? "Kiến thức"}</span>
        <span className="breadcrumb-title">›</span>
        <span className="breadcrumb-title" style={{ color: "#0A1628", maxWidth: "320px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</span>
      </div>

      {/* MAIN 2-COLUMN GRID */}
      <div className="article-wrapper" style={{ maxWidth: "1440px", margin: "0 auto", padding: "32px 40px" }}>
        <div className="article-grid" style={{ display: "grid", gridTemplateColumns: "22% minmax(0, 1fr)", gap: "32px", alignItems: "start" }}>

          {/* SIDEBAR TRÁI */}
          <aside className="sidebar-left" style={{ position: "sticky", top: "80px", alignSelf: "start" }}>
            <div style={{ background: "#0A1628", borderRadius: "12px", padding: "20px" }}>
              <h4 style={{ color: "#fff", fontSize: "14px", fontWeight: 600, marginBottom: "8px", lineHeight: 1.4 }}>Tư vấn chiến lược 1-1</h4>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", lineHeight: 1.6, marginBottom: "14px" }}>Cùng chuyên gia xây dựng kế hoạch giao dịch phù hợp mục tiêu của bạn.</p>
              <Link href="/lien-he#dat-lich" style={{ display: "block", textAlign: "center", background: "#00C389", color: "#fff", fontSize: "13px", fontWeight: 600, padding: "10px", borderRadius: "7px", textDecoration: "none" }}>Đặt lịch tư vấn →</Link>
            </div>
            <Link href="/hoc-vien/nen-tang-kien-thuc" style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px", padding: "12px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", textDecoration: "none", color: "#64748b", fontSize: "13px" }}>
              <i className="ti ti-arrow-left" style={{ fontSize: "14px" }} aria-hidden="true"></i>
              Quay lại danh sách
            </Link>
          </aside>

          {/* ARTICLE CONTENT */}
          <article className="article-main">

            {/* KEY TAKEAWAYS */}
            {takeaways.length > 0 && (
              <div style={{ background: "#f0fdf8", border: "0.5px solid #bbf7e0", borderRadius: "12px", overflow: "hidden", marginBottom: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 18px", borderBottom: "0.5px solid #bbf7e0" }}>
                  <i className="ti ti-target" style={{ fontSize: "18px", color: "#00C389" }} aria-hidden="true"></i>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#0A1628" }}>Điểm chính cần nắm</span>
                </div>
                <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {takeaways.map((point: string, i: number) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00C389", marginTop: "8px", flexShrink: 0 }} />
                      <p style={{ fontSize: "14px", color: "#1e293b", lineHeight: 1.65, margin: 0 }}>{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <style>{`
              .article-content { font-size: 15px; color: #1e293b; line-height: 1.85; letter-spacing: 0.01em; }
              .article-content h2 { font-size: 22px; font-weight: 700; color: #0A1628; margin: 32px 0 14px; line-height: 1.35; border-left: 4px solid #00C389; padding-left: 14px; }
              .article-content h3 { font-size: 18px; font-weight: 600; color: #0A1628; margin: 24px 0 10px; line-height: 1.4; }
              .article-content h4 { font-size: 15px; font-weight: 600; color: #0A1628; margin: 18px 0 8px; }
              .article-content p  { margin: 0 0 16px; }
              .article-content ul { list-style: disc; padding-left: 22px; margin: 0 0 16px; }
              .article-content ol { list-style: decimal; padding-left: 22px; margin: 0 0 16px; }
              .article-content li { margin-bottom: 8px; line-height: 1.75; }
              .article-content blockquote { border-left: 4px solid #00C389; background: #f0fdf8; padding: 14px 18px; margin: 20px 0; border-radius: 0 8px 8px 0; font-style: italic; color: #334155; }
              .article-content strong, .article-content b { font-weight: 700; color: #0A1628; }
              .article-content em, .article-content i { font-style: italic; }
              .article-content a { color: #00C389; text-decoration: underline; }
              .article-content a:hover { color: #009e6e; }
              .article-content table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
              .article-content th { background: #0A1628; color: #fff; padding: 10px 14px; text-align: left; font-weight: 600; }
              .article-content td { padding: 9px 14px; border-bottom: 1px solid #e8ecef; }
              .article-content tr:hover td { background: #f8fafc; }
              .article-content hr { border: none; border-top: 1px solid #e8ecef; margin: 28px 0; }
              .article-content code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 13px; font-family: monospace; color: #dc2626; }
              .article-content pre { background: #f1f5f9; padding: 16px; border-radius: 8px; overflow-x: auto; margin: 16px 0; }
              .article-content pre code { background: none; padding: 0; color: #334155; }
              @media (max-width: 768px) {
                .article-content { font-size: 14px; }
                .article-content h2 { font-size: 18px; }
                .article-content h3 { font-size: 16px; }
                .article-content table { font-size: 12px; }
                .article-content th, .article-content td { padding: 7px 10px; }
              }
            `}</style>

            {isLocked ? (
              <div>
                <div style={{ position: "relative" }}>
                  <div className="article-content" dangerouslySetInnerHTML={{
                    __html: (() => {
                      const content = a.content ?? ""
                      const cutoff = content.indexOf("</p>", 200)
                      return cutoff > -1 ? content.slice(0, cutoff + 4) : content.slice(0, 300)
                    })(),
                  }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "80px", background: "linear-gradient(to bottom, transparent, #fff)" }} />
                </div>
                <div style={{ textAlign: "center", padding: "8px 0 40px" }}>
                  <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#0A1628", marginBottom: "8px", lineHeight: 1.4 }}>
                    Đăng nhập hoặc tạo tài khoản<br />miễn phí để đọc tiếp
                  </h3>
                  <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "22px" }}>Kiến thức chuyên sâu từ các chuyên gia BAMBOO100</p>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                    <Link href="/dang-ky" style={{ display: "inline-block", background: "#00C389", color: "#fff", padding: "12px 36px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, textDecoration: "none", minWidth: "220px", textAlign: "center" }}>Tạo tài khoản →</Link>
                    <Link href={`/dang-nhap?redirect=/hoc-vien/nen-tang-kien-thuc/${a.slug}`} style={{ fontSize: "13px", color: "#64748b", textDecoration: "none" }}>Đăng nhập</Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="article-content" dangerouslySetInnerHTML={{
                __html: a.content ?? `<p style="color:#64748b;font-style:italic;">Nội dung bài viết đang được cập nhật...</p>`,
              }} />
            )}

            {/* CTA */}
            {!isLocked && (
              <div className="article-cta" style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "24px", margin: "36px 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", background: "#f8fafc" }}>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0A1628", marginBottom: "6px" }}>Tiếp cận hơn 500 cơ hội đầu tư hàng hóa</h3>
                  <p style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.5 }}>Vàng, dầu thô, cà phê, đồng và nhiều hàng hóa khác — tất cả trong một nền tảng.</p>
                  <Link href="/lien-he#dat-lich" style={{ display: "inline-block", marginTop: "12px", color: "#00C389", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>Tư vấn ngay →</Link>
                </div>
              </div>
            )}

            {/* RELATED */}
            {related && related.length > 0 && (
              <div style={{ marginTop: "40px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0A1628", marginBottom: "16px", paddingBottom: "10px", borderBottom: "2px solid #e5e5e5" }}>Bài viết liên quan</h3>
                <div className="related-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
                  {related.slice(0, 4).map((rel: any) => (
                    <Link key={rel.id} href={`/hoc-vien/nen-tang-kien-thuc/${rel.slug}`} style={{ textDecoration: "none" }}>
                      <div style={{ borderRadius: "10px", overflow: "hidden", background: rel.thumbnail_url ? `url(${rel.thumbnail_url}) center/cover` : "#0A1628", minHeight: "180px", position: "relative", cursor: "pointer" }}>
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.92) 40%, rgba(0,0,0,0.3) 65%, transparent 100%)" }} />
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px" }}>
                          {rel.published_at && <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)", marginBottom: "4px" }}>{formatDateShort(rel.published_at)}</div>}
                          <h4 style={{ color: "#fff", fontSize: "12px", fontWeight: 600, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" } as any}>{rel.title}</h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* SHARE */}
            <div style={{ marginTop: "36px", paddingTop: "20px", borderTop: "1px solid #e8ecef", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>Chia sẻ:</span>
              {[
                { icon: "🔗", label: "Sao chép link", bg: "#f1f5f9", color: "#475569" },
                { icon: "in", label: "LinkedIn", bg: "#0077B5", color: "#fff" },
                { icon: "f",  label: "Facebook",  bg: "#1877F2", color: "#fff" },
                { icon: "𝕏", label: "X (Twitter)", bg: "#000", color: "#fff" },
              ].map((s) => (
                <button key={s.label} title={s.label} style={{ width: "34px", height: "34px", background: s.bg, color: s.color, border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</button>
              ))}
            </div>

            {/* DISCLAIMER */}
            <div style={{ marginTop: "32px", padding: "16px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "10px", color: "#94a3b8", lineHeight: 1.7 }}>
              <strong style={{ color: "#64748b" }}>TUYÊN BỐ MIỄN TRÁCH NHIỆM:</strong>{" "}
              Nội dung bài viết này được cung cấp bởi BAMBOO100 chỉ mang tính chất thông tin và tham khảo, không cấu thành lời khuyên đầu tư. Giao dịch phái sinh hàng hóa có rủi ro cao. Bạn có thể mất toàn bộ vốn đầu tư. Hãy cân nhắc kỹ trước khi giao dịch.
            </div>
          </article>

        </div>
      </div>
    </div>
  )
}
