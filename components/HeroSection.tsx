"use client"
import Link from "next/link"
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
        from { opacity: 0; transform: rotate(12deg) translateY(-10px) translateX(60px) scale(0.85); }
        to   { opacity: 1; transform: rotate(12deg) translateY(-10px) translateX(0) scale(1); }
      }
      @keyframes hs-entry-cu {
        from { opacity: 0; transform: rotate(-8deg) translateY(40px) scale(0.85); }
        to   { opacity: 1; transform: rotate(-8deg) translateY(0) scale(1); }
      }
      @keyframes hs-entry-ag {
        from { opacity: 0; transform: rotate(6deg) translateY(10px) translateX(40px) scale(0.85); }
        to   { opacity: 1; transform: rotate(6deg) translateY(10px) translateX(0) scale(1); }
      }
      @keyframes hs-float-oil {
        0%, 100% { transform: rotate(12deg) translateY(-10px) translateX(0); }
        50%       { transform: rotate(12deg) translateY(-26px) translateX(0); }
      }
      @keyframes hs-float-cu {
        0%, 100% { transform: rotate(-8deg) translateY(0px); }
        50%       { transform: rotate(-8deg) translateY(-18px); }
      }
      @keyframes hs-float-ag {
        0%, 100% { transform: rotate(6deg) translateY(10px) translateX(0); }
        50%       { transform: rotate(6deg) translateY(-4px) translateX(0); }
      }

      .hs-badges  { animation: hs-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
      .hs-title   { animation: hs-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
      .hs-desc    { animation: hs-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
      .hs-cta     { animation: hs-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.35s both; }
      .hs-stats   { animation: hs-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.45s both; }

      .hs-icon-oil {
        animation:
          hs-entry-oil 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.3s both,
          hs-float-oil 3.5s ease-in-out 1.0s infinite;
      }
      .hs-icon-cu {
        animation:
          hs-entry-cu 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.5s both,
          hs-float-cu 4.0s ease-in-out 1.2s infinite;
      }
      .hs-icon-ag {
        animation:
          hs-entry-ag 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.7s both,
          hs-float-ag 3.2s ease-in-out 1.4s infinite;
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
      style={{
        background: "#f0f2f5",
        minHeight: "560px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        padding: "80px 80px 60px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "120px",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, transparent 100%)",
        pointerEvents: "none",
        zIndex: 1,
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
          paddingTop: "28px", borderTop: "1px solid rgba(0,0,0,0.08)", flexWrap: "wrap",
        }}>
          {[["500+", "Nhà đầu tư"], ["8+", "Năm kinh nghiệm"], ["20+", "Hàng hóa CFD"]].map(([val, lbl]) => (
            <div key={lbl}>
              <div style={{ fontSize: "26px", fontWeight: 800, color: "#0A1628", letterSpacing: "-0.02em" }}>{val}</div>
              <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div style={{ position: "relative", height: "460px", zIndex: 2 }}>

        {/* Dầu */}
        <div className="hs-icon-oil" style={{
          position: "absolute", top: "0px", right: "0px",
          width: "220px", height: "220px", borderRadius: "44px",
          background: "linear-gradient(145deg, #2a2a2a 0%, #111 60%, #0a0a0a 100%)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.45), inset 0 2px 6px rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="96" height="96" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8 2 5 6 5 10c0 5 7 12 7 12s7-7 7-12c0-4-3-8-7-8z" fill="rgba(220,220,220,0.92)" />
            <path d="M12 6c-2 0-4 2-4 4 0 2.5 4 7 4 7s4-4.5 4-7c0-2-2-4-4-4z" fill="rgba(160,160,160,0.65)" />
          </svg>
        </div>

        {/* Cu */}
        <div className="hs-icon-cu" style={{
          position: "absolute", top: "140px", left: "20px",
          width: "200px", height: "200px", borderRadius: "40px",
          background: "linear-gradient(145deg, #d4904e 0%, #b8722a 40%, #8b4513 100%)",
          boxShadow: "0 28px 70px rgba(139,69,19,0.3), inset 0 3px 6px rgba(255,255,255,0.28)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{
            fontSize: "88px", fontWeight: 900, color: "rgba(70,25,0,0.4)",
            fontFamily: "Georgia, serif", letterSpacing: "-6px",
          }}>Cu</span>
        </div>

        {/* Ag */}
        <div className="hs-icon-ag" style={{
          position: "absolute", bottom: "30px", right: "20px",
          width: "155px", height: "155px", borderRadius: "30px",
          background: "linear-gradient(145deg, #ececec 0%, #c8c8c8 50%, #a8a8a8 100%)",
          boxShadow: "0 20px 50px rgba(130,130,130,0.25), inset 0 2px 5px rgba(255,255,255,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{
            fontSize: "68px", fontWeight: 900, color: "rgba(80,80,80,0.45)",
            fontFamily: "Georgia, serif",
          }}>Ag</span>
        </div>

        {/* Decorative blur */}
        <div style={{
          position: "absolute", top: "15%", left: "25%",
          width: "280px", height: "280px", borderRadius: "50%",
          background: "rgba(0,195,137,0.07)", filter: "blur(60px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "5%", right: "5%",
          width: "180px", height: "180px", borderRadius: "50%",
          background: "rgba(200,120,65,0.09)", filter: "blur(40px)", pointerEvents: "none",
        }} />
      </div>
    </div>
  )
}
