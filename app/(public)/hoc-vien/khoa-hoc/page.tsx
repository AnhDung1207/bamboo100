import Navbar from "@/components/Navbar"

export default function KhoaHocPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "var(--font-roboto), 'Roboto', sans-serif" }}>
      <Navbar />
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>🎓</div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#0A1628", marginBottom: "12px" }}>Khóa học</h1>
          <p style={{ fontSize: "15px", color: "#64748b", lineHeight: 1.7, maxWidth: "420px", margin: "0 auto" }}>
            Trang này đang được phát triển. Các khóa học từ cơ bản đến nâng cao về giao dịch hàng hóa sẽ sớm được ra mắt.
          </p>
          <div style={{ marginTop: "32px", display: "inline-flex", alignItems: "center", gap: "8px", background: "#00C38915", border: "1px solid #00C38930", borderRadius: "20px", padding: "8px 20px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00C389", display: "inline-block" }}></span>
            <span style={{ fontSize: "13px", color: "#00C389", fontWeight: 500 }}>Đang phát triển</span>
          </div>
        </div>
      </main>
    </div>
  )
}
