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

      /* ── TABLET ── */
      @media (min-width: 769px) and (max-width: 1024px) {
        .hero-wrap {
          padding: 60px 40px !important;
        }
        .hero-visual {
          height: 340px !important;
        }
        .hs-title {
          font-size: clamp(28px, 3.5vw, 40px) !important;
        }
        .hs-desc {
          font-size: 14px !important;
        }
      }

      /* ── MOBILE ── */
      @media (max-width: 768px) {
        .hero-wrap {
          grid-template-columns: 1fr !important;
          padding: 65px 20px 32px !important;
          min-height: auto !important;
          gap: 32px !important;
        }
        .hero-visual {
          height: 160px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 24px !important;
        }
        .hero-hide-mobile {
          display: none !important;
        }
        /* Reset absolute positioning on mobile for Cu and Oil */
        .hs-icon-cu-wrap {
          position: static !important;
          width: 110px !important;
          height: 110px !important;
          border-radius: 22px !important;
        }
        .hs-icon-oil-wrap {
          position: static !important;
          width: 100px !important;
          height: 100px !important;
          border-radius: 20px !important;
        }
        .hs-badges { gap: 6px !important; margin-bottom: 20px !important; }
        .hs-title { font-size: 32px !important; margin-bottom: 14px !important; }
        .hs-desc  { font-size: 14px !important; margin-bottom: 24px !important; }
        .hs-cta   { gap: 10px !important; }
        .hs-stats { gap: 20px !important; margin-top: 28px !important; padding-top: 20px !important; }
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
      <div className="hero-visual" style={{ position: "relative", height: "480px", zIndex: 2 }}>

        {/* Dầu — hiện trên mobile */}
        <div className="hs-icon-oil-wrap hs-icon-oil" style={{
          position: "absolute", top: "0px", right: "10px",
          width: "200px", height: "200px", borderRadius: "40px",
          background: "linear-gradient(145deg, #2a2a2a 0%, #111 60%, #0a0a0a 100%)",
          boxShadow: "0 28px 70px rgba(0,0,0,0.4), inset 0 2px 6px rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="88" height="88" viewBox="0 0 379.279 379.279" fill="none">
            <path d="M338.145,30.677c8.47,0,15.339-6.869,15.339-15.339S346.615,0,338.145,0H302.94H193.7H76.34h-9.112H41.135c-8.47,0-15.339,6.869-15.339,15.339s6.869,15.339,15.339,15.339h12.551v87.846H41.135c-8.47,0-15.339,6.869-15.339,15.339S32.665,149.2,41.135,149.2h12.551v87.846H41.135c-8.47,0-15.339,6.869-15.339,15.339c0,8.47,6.869,15.339,15.339,15.339h12.551v80.879H41.135c-8.47,0-15.339,6.869-15.339,15.339c0,8.47,6.869,15.339,15.339,15.339h297.01c8.47,0,15.339-6.869,15.339-15.339c0-8.47-6.869-15.339-15.339-15.339h-12.551v-80.879h12.551c8.47,0,15.339-6.869,15.339-15.339c0-8.47-6.869-15.339-15.339-15.339h-12.551v-87.837h12.551c8.47,0,15.339-6.869,15.339-15.339s-6.869-15.339-15.339-15.339h-12.551V30.677H338.145z M189.636,332.418c-160.434,0-66.378-181.129-20.598-256.066c11.941-19.541,20.598-31.88,20.598-31.88s1.496,2.138,4.064,5.966C221.223,91.528,374.658,332.418,189.636,332.418z" fill="rgba(220,220,220,0.85)"/>
            <path d="M215.444,306.512c33.758-15.582,41.659-51.933,33.408-85.529c-4.519-18.411-32.88-10.6-28.361,7.82c5.34,21.744,1.87,42.277-19.891,52.316C183.393,289.06,198.349,314.405,215.444,306.512z" fill="rgba(255,255,255,0.5)"/>
          </svg>
        </div>

        {/* Cu — hiện trên mobile */}
        <div className="hs-icon-cu-wrap hs-icon-cu" style={{
          position: "absolute", top: "80px", left: "0px",
          width: "185px", height: "185px", borderRadius: "36px",
          background: "linear-gradient(145deg, #d4904e 0%, #b8722a 40%, #8b4513 100%)",
          boxShadow: "0 24px 60px rgba(139,69,19,0.28), inset 0 3px 6px rgba(255,255,255,0.28)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{
            fontSize: "80px", fontWeight: 900, color: "rgba(70,25,0,0.4)",
            fontFamily: "Georgia, serif", letterSpacing: "-6px",
          }}>Cu</span>
        </div>

        {/* Lúa mì — ẩn mobile */}
        <div className="hero-hide-mobile hs-icon-wheat" style={{
          position: "absolute", top: "200px", right: "240px",
          width: "130px", height: "130px", borderRadius: "26px",
          background: "linear-gradient(145deg, #fef3c7 0%, #fde68a 50%, #f59e0b 100%)",
          boxShadow: "0 16px 40px rgba(180,140,0,0.2), inset 0 2px 4px rgba(255,255,255,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="58" height="58" viewBox="0 0 512 512" fill="none">
            <path d="M267.798,145.49l-11.793,16.64l-11.981-16.64c-18.415-25.779-18.415-60.399,0-86.178l11.981-16.649l11.793,16.649C286.213,85.091,286.213,119.711,267.798,145.49" fill="rgba(80,40,0,0.7)"/>
            <path d="M252.562,210.294l3.43,20.105l-20.241-3.294c-31.249-5.205-55.731-29.687-60.937-60.937l-3.294-20.241l20.105,3.43C222.866,154.563,247.357,179.045,252.562,210.294" fill="rgba(80,40,0,0.6)"/>
            <path d="M252.562,304.16l3.43,20.105l-20.241-3.294c-31.249-5.205-55.731-29.687-60.937-60.937l-3.294-20.241l20.105,3.43C222.866,248.429,247.357,272.911,252.562,304.16" fill="rgba(80,40,0,0.6)"/>
            <path d="M252.562,398.027l3.43,20.105l-20.241-3.294c-31.249-5.205-55.731-29.687-60.937-60.937l-3.294-20.241l20.105,3.43C222.866,342.296,247.357,366.778,252.562,398.027" fill="rgba(80,40,0,0.6)"/>
            <path d="M259.438,210.294l-3.43,20.105l20.241-3.294c31.249-5.205,55.731-29.687,60.937-60.937l3.294-20.241l-20.105,3.43C289.134,154.563,264.643,179.045,259.438,210.294" fill="rgba(80,40,0,0.6)"/>
            <path d="M259.438,304.16l-3.43,20.105l20.241-3.294c31.249-5.205,55.731-29.687,60.937-60.937l3.294-20.241l-20.105,3.43C289.134,248.429,264.643,272.911,259.438,304.16" fill="rgba(80,40,0,0.6)"/>
            <path d="M259.438,398.027l-3.43,20.105l20.241-3.294c31.249-5.205,55.731-29.687,60.937-60.937l3.294-20.241l-20.105,3.43C289.134,342.296,264.643,366.778,259.438,398.027" fill="rgba(80,40,0,0.6)"/>
            <path d="M256.006,51.2c-4.71,0-8.533-3.814-8.533-8.533l-0.009-34.133c0-4.71,3.814-8.533,8.525-8.533h0.009c4.71,0,8.533,3.814,8.533,8.533l0.009,34.133C264.54,47.377,260.725,51.2,256.006,51.2z" fill="rgba(80,40,0,0.5)"/>
            <path d="M256.006,512c-4.71,0-8.533-3.823-8.533-8.533v-51.2c0-4.71,3.823-8.533,8.533-8.533c4.71,0,8.533,3.823,8.533,8.533v51.2C264.54,508.177,260.717,512,256.006,512" fill="rgba(80,40,0,0.5)"/>
          </svg>
        </div>

        {/* Pt — ẩn mobile */}
        <div className="hero-hide-mobile hs-icon-pt" style={{
          position: "absolute", bottom: "40px", left: "60px",
          width: "120px", height: "120px", borderRadius: "24px",
          background: "linear-gradient(145deg, #e8e8f0 0%, #c8c8d8 50%, #a0a0b8 100%)",
          boxShadow: "0 14px 36px rgba(100,100,140,0.2), inset 0 2px 4px rgba(255,255,255,0.7)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{
            fontSize: "50px", fontWeight: 900, color: "rgba(60,60,90,0.45)",
            fontFamily: "Georgia, serif", letterSpacing: "-2px",
          }}>Pt</span>
        </div>

        {/* Ag — ẩn mobile */}
        <div className="hero-hide-mobile hs-icon-ag" style={{
          position: "absolute", bottom: "20px", right: "20px",
          width: "145px", height: "145px", borderRadius: "28px",
          background: "linear-gradient(145deg, #ececec 0%, #c8c8c8 50%, #a8a8a8 100%)",
          boxShadow: "0 18px 46px rgba(130,130,130,0.22), inset 0 2px 5px rgba(255,255,255,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{
            fontSize: "62px", fontWeight: 900, color: "rgba(80,80,80,0.45)",
            fontFamily: "Georgia, serif",
          }}>Ag</span>
        </div>

        {/* Decorative blur */}
        <div style={{
          position: "absolute", top: "20%", left: "20%",
          width: "260px", height: "260px", borderRadius: "50%",
          background: "rgba(0,195,137,0.07)", filter: "blur(60px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "10%",
          width: "160px", height: "160px", borderRadius: "50%",
          background: "rgba(200,120,65,0.08)", filter: "blur(40px)", pointerEvents: "none",
        }} />
      </div>
    </div>
  )
}
