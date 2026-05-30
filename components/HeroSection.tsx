"use client"
import Link from "next/link"
import Image from "next/image"
import { useEffect } from "react"

export default function HeroSection() {
  useEffect(() => {
    const style = document.createElement("style")
    style.id = "hero-keyframes"
    style.textContent = `
      @keyframes hs-fade-up {
        from { opacity: 0; transform: translateY(22px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes hs-entry-oil {
        from { opacity: 0; transform: rotate(8deg) translateX(60px) scale(0.85); }
        to   { opacity: 1; transform: rotate(8deg) translateX(0) scale(1); }
      }
      @keyframes hs-entry-cu {
        from { opacity: 0; transform: rotate(-6deg) translateY(40px) scale(0.85); }
        to   { opacity: 1; transform: rotate(-6deg) translateY(0) scale(1); }
      }
      @keyframes hs-entry-wheat {
        from { opacity: 0; transform: rotate(5deg) translateY(-30px) scale(0.85); }
        to   { opacity: 1; transform: rotate(5deg) translateY(0) scale(1); }
      }
      @keyframes hs-entry-pt {
        from { opacity: 0; transform: rotate(-7deg) translateX(-40px) scale(0.85); }
        to   { opacity: 1; transform: rotate(-7deg) translateX(0) scale(1); }
      }
      @keyframes hs-entry-ag {
        from { opacity: 0; transform: rotate(4deg) translateY(30px) scale(0.85); }
        to   { opacity: 1; transform: rotate(4deg) translateY(0) scale(1); }
      }
      @keyframes hs-float-oil {
        0%, 100% { transform: rotate(8deg) translateY(0px); }
        50%       { transform: rotate(8deg) translateY(-20px); }
      }
      @keyframes hs-float-cu {
        0%, 100% { transform: rotate(-6deg) translateY(0px); }
        50%       { transform: rotate(-6deg) translateY(-18px); }
      }
      @keyframes hs-float-wheat {
        0%, 100% { transform: rotate(5deg) translateY(0px); }
        50%       { transform: rotate(5deg) translateY(-14px); }
      }
      @keyframes hs-float-pt {
        0%, 100% { transform: rotate(-7deg) translateY(0px); }
        50%       { transform: rotate(-7deg) translateY(-12px); }
      }
      @keyframes hs-float-ag {
        0%, 100% { transform: rotate(4deg) translateY(0px); }
        50%       { transform: rotate(4deg) translateY(-16px); }
      }

      .hs-badges { animation: hs-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
      .hs-title  { animation: hs-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
      .hs-desc   { animation: hs-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
      .hs-cta    { animation: hs-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.35s both; }
      .hs-stats  { animation: hs-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.45s both; }

      @media (prefers-reduced-motion: no-preference) {
        .hs-icon-oil {
          animation:
            hs-entry-oil 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.3s both,
            hs-float-oil 3.5s ease-in-out 1s infinite;
        }
        .hs-icon-cu {
          animation:
            hs-entry-cu 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.5s both,
            hs-float-cu 4s ease-in-out 1.2s infinite;
        }
        .hs-icon-wheat {
          animation:
            hs-entry-wheat 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.7s both,
            hs-float-wheat 3.8s ease-in-out 1.4s infinite;
        }
        .hs-icon-pt {
          animation:
            hs-entry-pt 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.9s both,
            hs-float-pt 4.2s ease-in-out 1.6s infinite;
        }
        .hs-icon-ag {
          animation:
            hs-entry-ag 0.7s cubic-bezier(0.34,1.56,0.64,1) 1.1s both,
            hs-float-ag 3.2s ease-in-out 1.8s infinite;
        }
      }

      /* ── TABLET 769–1024px ── */
      @media (min-width: 769px) and (max-width: 1024px) {
        .hero-wrap {
          padding: 60px 40px 48px !important;
          min-height: 460px !important;
        }
        .hero-visual { height: 380px !important; }
        .hs-title { font-size: clamp(28px, 3.5vw, 40px) !important; }
        .hs-desc  { font-size: 14px !important; margin-bottom: 24px !important; }
        /* Thu nhỏ icon trên tablet */
        .hs-icon-oil-wrap {
          width: 180px !important; height: 180px !important;
          top: 0px !important; right: 10px !important;
        }
        .hs-icon-cu-wrap {
          width: 155px !important; height: 155px !important;
          bottom: 0px !important; right: 0px !important;
        }
        .hs-icon-wheat-wrap {
          width: 160px !important; height: 160px !important;
          top: 160px !important; right: 175px !important;
        }
        .hs-icon-pt-wrap {
          width: 110px !important; height: 110px !important;
          bottom: 10px !important; left: 10px !important;
        }
        .hs-icon-ag-wrap {
          width: 135px !important; height: 135px !important;
          top: 90px !important; left: 0px !important;
        }
      }

      /* ── MOBILE ≤768px ── */
      @media (max-width: 768px) {
        .hero-wrap {
          grid-template-columns: 1fr !important;
          padding: 65px 20px 32px !important;
          min-height: auto !important;
          gap: 0 !important;
        }
        .hero-visual {
          height: 180px !important;
          position: relative !important;
          margin-top: 32px !important;
        }
        /* Ẩn wheat, pt, ag trên mobile */
        .hero-hide-mobile { display: none !important; }
        /* Oil — trên phải */
        .hs-icon-oil-wrap {
          width: 115px !important; height: 115px !important;
          top: 10px !important; right: 20px !important;
          bottom: auto !important; left: auto !important;
          border-radius: 22px !important;
        }
        /* Cu — dưới trái */
        .hs-icon-cu-wrap {
          width: 120px !important; height: 120px !important;
          bottom: 10px !important; left: 20px !important;
          top: auto !important; right: auto !important;
          border-radius: 22px !important;
        }
        .hs-badges { gap: 6px !important; margin-bottom: 20px !important; }
        .hs-title  { font-size: 32px !important; margin-bottom: 14px !important; }
        .hs-desc   { font-size: 14px !important; margin-bottom: 24px !important; }
        .hs-cta    { gap: 10px !important; }
        .hs-stats  { gap: 20px !important; margin-top: 28px !important; padding-top: 20px !important; }
      }
    `
    if (!document.getElementById("hero-keyframes")) {
      document.head.appendChild(style)
    }
    return () => {
      const el = document.getElementById("hero-keyframes")
      if (el) el.remove()
    }
  }, [])

  return (
    <div
      className="hero-wrap"
      style={{
        background: "#F5F6F7",
        minHeight: "560px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        padding: "80px 80px 60px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top gradient for navbar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "120px",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, transparent 100%)",
        pointerEvents: "none", zIndex: 1,
      }} />

      {/* LEFT */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <div className="hs-badges" style={{ display: "flex", gap: "8px", marginBottom: "28px", flexWrap: "wrap" }}>
          {["35+ Sản phẩm hàng hóa", "Bán khống", "Giao dịch T+0"].map(t => (
            <span key={t} style={{
              display: "inline-flex", alignItems: "center",
              background: "rgba(255,255,255,0.7)", border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: "20px", padding: "5px 14px",
              fontSize: "12px", fontWeight: 500, color: "#0A1628", letterSpacing: "0.01em",
            }}>{t}</span>
          ))}
        </div>

        <h1 className="hs-title" style={{
          fontSize: "clamp(34px, 4.5vw, 58px)", fontWeight: 800, color: "#0A1628",
          lineHeight: 1.08, letterSpacing: "-0.03em", margin: "0 0 20px", maxWidth: "520px",
        }}>
          Đầu tư phái sinh<br />hàng hoá dựa trên<br />
          <span style={{ color: "#00C389" }}>dữ liệu</span>
        </h1>

        <p className="hs-desc" style={{
          fontSize: "15px", color: "#64748b", lineHeight: 1.7, margin: "0 0 36px", maxWidth: "400px",
        }}>
          Phân tích cung - cầu thực tế, kịch bản thị trường và tư vấn chiến lược 1 - 1 dành cho nhà đầu tư cá nhân và doanh nghiệp.
        </p>

        <div className="hs-cta" style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/lien-he#dat-lich" style={{
            display: "inline-block", background: "#00C389", color: "#fff",
            fontSize: "15px", fontWeight: 700, padding: "14px 32px", borderRadius: "8px",
            textDecoration: "none",
          }}>Mở tài khoản</Link>
          <Link href="/phan-tich" style={{
            fontSize: "14px", fontWeight: 500, color: "#0A1628", textDecoration: "none",
            display: "flex", alignItems: "center", gap: "5px",
          }}>Xem phân tích mẫu →</Link>
        </div>

        <div className="hs-stats" style={{
          display: "flex", gap: "32px", marginTop: "48px",
        }}>
          {[["500+", "Nhà đầu tư"], ["8+", "Năm kinh nghiệm"]].map(([val, lbl]) => (
            <div key={lbl}>
              <div style={{ fontSize: "26px", fontWeight: 800, color: "#0A1628", letterSpacing: "-0.02em" }}>{val}</div>
              <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="hero-visual" style={{ position: "relative", height: "480px", zIndex: 2 }}>

        {/* Dầu — lớn, góc trên phải */}
        <div className="hs-icon-oil-wrap hs-icon-oil" style={{
          position: "absolute", top: "0px", right: "20px",
          width: "240px", height: "240px", borderRadius: "36px",
          overflow: "hidden",
        }}>
          <Image src="/hero/dautho.png" alt="Dầu thô" fill sizes="240px" style={{ objectFit: "cover", mixBlendMode: "multiply" }} />
        </div>

        {/* Cu — góc dưới phải */}
        <div className="hs-icon-cu-wrap hs-icon-cu" style={{
          position: "absolute", bottom: "0px", right: "0px",
          width: "200px", height: "200px", borderRadius: "26px",
          overflow: "hidden",
        }}>
          <Image src="/hero/dong.png" alt="Đồng Cu" fill sizes="200px" style={{ objectFit: "cover", mixBlendMode: "multiply" }} />
        </div>

        {/* Lúa mì — giữa, ẩn mobile */}
        <div className="hs-icon-wheat-wrap hs-icon-wheat hero-hide-mobile" style={{
          position: "absolute", top: "200px", right: "230px",
          width: "220px", height: "220px", borderRadius: "24px",
          overflow: "hidden",
        }}>
          <Image src="/hero/lua-mi.png" alt="Lúa mì" fill sizes="220px" style={{ objectFit: "cover", mixBlendMode: "multiply" }} />
        </div>

        {/* Ngô — dưới trái, ẩn mobile */}
        <div className="hs-icon-pt-wrap hs-icon-pt hero-hide-mobile" style={{
          position: "absolute", bottom: "10px", left: "40px",
          width: "150px", height: "150px", borderRadius: "22px",
          overflow: "hidden",
        }}>
          <Image src="/hero/ngo.png" alt="Ngô" fill sizes="150px" style={{ objectFit: "cover", mixBlendMode: "multiply" }} />
        </div>

        {/* Ag — trái giữa, ẩn mobile */}
        <div className="hs-icon-ag-wrap hs-icon-ag hero-hide-mobile" style={{
          position: "absolute", top: "120px", left: "0px",
          width: "180px", height: "180px", borderRadius: "34px",
          overflow: "hidden",
        }}>
          <Image src="/hero/bac.png" alt="Bạc Ag" fill sizes="180px" style={{ objectFit: "cover", mixBlendMode: "multiply" }} />
        </div>

      </div>

    </div>
  )
}
