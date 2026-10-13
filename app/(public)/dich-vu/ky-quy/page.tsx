"use client"

import { useMemo, useState } from "react"
import Navbar from "@/components/Navbar"
import {
  KY_QUY_DATA,
  KY_QUY_EFFECTIVE_DATE,
  KY_QUY_GROUP_LABEL,
  type KyQuyGroup,
} from "@/lib/ky-quy-data"

type Filter = "all" | KyQuyGroup

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "nong-san", label: "Nông sản" },
  { key: "kim-loai", label: "Kim loại" },
  { key: "nang-luong", label: "Năng lượng" },
  { key: "nguyen-lieu", label: "Nguyên liệu CN" },
]

const GREEN = "#00A67E"

// 14636760 -> "14.636.760"
const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

// Bỏ dấu để tìm "dau tuong" ra "Đậu Tương"
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()

export default function KyQuyPage() {
  const [filter, setFilter] = useState<Filter>("all")
  const [query, setQuery] = useState("")

  const rows = useMemo(() => {
    const q = normalize(query)
    return KY_QUY_DATA.filter((r) => {
      if (filter !== "all" && r.nhom !== filter) return false
      if (!q) return true
      return normalize(r.ma).includes(q) || normalize(r.ten).includes(q)
    })
  }, [filter, query])

  const emptyText = `Không tìm thấy sản phẩm khớp với “${query}”. Thử nhập mã hoặc tên khác.`

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <style>{`
        /* ── Nút lọc + ô tìm kiếm ── */
        .kq-tools { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        .kq-filters { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        .kq-pill { border: none; cursor: pointer; font-family: inherit; font-size: 12px; font-weight: 600; padding: 7px 14px; border-radius: 20px; background: #f1f5f9; color: #475569; transition: background 0.15s, color 0.15s; white-space: nowrap; flex-shrink: 0; }
        .kq-pill:hover { background: #e2e8f0; }
        .kq-pill[aria-pressed="true"] { background: ${GREEN}; color: #fff; }
        .kq-pill:focus-visible, .kq-search:focus-visible { outline: 2px solid ${GREEN}; outline-offset: 2px; }
        .kq-search { font-family: inherit; font-size: 13px; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 20px; padding: 8px 16px; width: 200px; background: #fff; }
        .kq-search::placeholder { color: #94a3b8; }
        .kq-unit { display: none; }

        /* ── Bảng (máy tính / tablet) ── */
        .kq-table { width: 100%; border-collapse: collapse; min-width: 760px; }
        .kq-table th { font-size: 11px; font-weight: 600; color: #64748b; letter-spacing: 0.06em; padding: 14px 12px; border-bottom: 1px solid #e8ecf0; text-transform: uppercase; line-height: 1.4; }
        .kq-table td { font-size: 14px; color: #0f172a; padding: 14px 12px; border-bottom: 1px solid #f1f5f9; }
        .kq-table th:first-child, .kq-table td:first-child { padding-left: 28px; }
        .kq-table th:last-child, .kq-table td:last-child { padding-right: 28px; }
        .kq-table tbody tr:hover td { background: #f8fafc; }
        .kq-table tbody tr:last-child td { border-bottom: none; }

        /* ── Danh sách thẻ (mobile) ── */
        .kq-cards { display: none; list-style: none; margin: 0; padding: 0; }
        .kq-card { padding: 16px 16px 18px; border-bottom: 1px solid #f1f5f9; }
        .kq-card:last-child { border-bottom: none; }
        .kq-card-name { font-size: 16px; font-weight: 700; color: #0f172a; line-height: 1.35; }
        .kq-card-meta { font-size: 13px; color: #64748b; margin: 3px 0 12px; line-height: 1.5; }
        .kq-card-code { font-weight: 700; color: ${GREEN}; }
        .kq-card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .kq-box { background: #f8fafc; border-radius: 10px; padding: 10px 12px; min-width: 0; }
        .kq-box-label { display: block; font-size: 12px; color: #64748b; margin-bottom: 2px; }
        .kq-box-value { display: block; font-size: 15px; font-weight: 700; color: #0f172a; font-variant-numeric: tabular-nums; white-space: nowrap; }
        .kq-empty { padding: 40px 16px; text-align: center; color: #64748b; font-size: 14px; line-height: 1.6; }

        @media (max-width: 640px) {
          .kq-wrap { padding: 96px 16px 100px !important; }
          .kq-intro { margin-bottom: 24px !important; }
          .kq-h1 { font-size: 28px !important; }
          .kq-sub { font-size: 14px !important; }
          .kq-head { padding: 20px 16px 16px !important; gap: 14px !important; }
          .kq-tools { flex-direction: column; align-items: stretch; width: 100%; gap: 12px; }
          .kq-filters { flex-wrap: wrap; gap: 8px; }
          .kq-pill { padding: 9px 16px; font-size: 13px; }
          .kq-search { width: 100%; font-size: 16px; padding: 11px 18px; }
          .kq-unit { display: inline; }
          .kq-desktop { display: none; }
          .kq-cards { display: block; }
        }
      `}</style>

      <Navbar />

      <div className="kq-wrap" style={{ maxWidth: "1100px", margin: "0 auto", padding: "120px 24px 80px" }}>
        {/* Tiêu đề trang */}
        <div className="kq-intro" style={{ marginBottom: "36px" }}>
          <h1 className="kq-h1" style={{ fontSize: "32px", fontWeight: 800, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 }}>Ký quỹ</h1>
          <p className="kq-sub" style={{ fontSize: "15px", color: "#64748b", margin: 0 }}>
            Mức ký quỹ của từng sản phẩm. Hiệu lực từ {KY_QUY_EFFECTIVE_DATE}.
          </p>
        </div>

        {/* Khung bảng */}
        <div style={{ background: "#fff", border: "1px solid #e8ecf0", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden" }}>
          <div
            className="kq-head"
            style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "24px 28px 20px", borderBottom: "1px solid #e8ecf0" }}
          >
            <div>
              <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>Biểu ký quỹ</h2>
              <div style={{ fontSize: "12px", color: "#64748b" }}>
                {rows.length} sản phẩm<span className="kq-unit"> · đơn vị VNĐ</span>
              </div>
            </div>

            <div className="kq-tools">
              <div className="kq-filters">
                {FILTERS.map((f) => (
                  <button key={f.key} type="button" className="kq-pill" aria-pressed={filter === f.key} onClick={() => setFilter(f.key)}>
                    {f.label}
                  </button>
                ))}
              </div>
              <input
                className="kq-search"
                type="search"
                placeholder="Tìm mã / tên..."
                aria-label="Tìm theo mã hoặc tên sản phẩm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Bảng — máy tính */}
          <div className="kq-desktop" style={{ overflowX: "auto" }}>
            <table className="kq-table">
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Mã</th>
                  <th style={{ textAlign: "left" }}>Tên</th>
                  <th style={{ textAlign: "left" }}>Nhóm</th>
                  <th style={{ textAlign: "center" }}>Sở GD nước ngoài<br />liên thông</th>
                  <th style={{ textAlign: "right" }}><span style={{ display: "inline-block", textAlign: "center" }}>Ký quỹ tổ chức<br />(VNĐ)</span></th>
                  <th style={{ textAlign: "right" }}><span style={{ display: "inline-block", textAlign: "center" }}>Ký quỹ cá nhân<br />(VNĐ)</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.ma}>
                    <td style={{ fontWeight: 700, color: GREEN }}>{r.ma}</td>
                    <td>{r.ten}</td>
                    <td style={{ color: "#64748b" }}>{KY_QUY_GROUP_LABEL[r.nhom]}</td>
                    <td style={{ textAlign: "center", color: "#475569" }}>{r.san}</td>
                    <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt(r.toChuc)}</td>
                    <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt(r.caNhan)}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", color: "#64748b", padding: "40px 12px" }}>
                      {emptyText}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Danh sách thẻ — điện thoại */}
          <ul className="kq-cards">
            {rows.map((r) => (
              <li key={r.ma} className="kq-card">
                <div className="kq-card-name">{r.ten}</div>
                <div className="kq-card-meta">
                  <span className="kq-card-code">{r.ma}</span> · {KY_QUY_GROUP_LABEL[r.nhom]} · {r.san}
                </div>
                <div className="kq-card-grid">
                  <div className="kq-box">
                    <span className="kq-box-label">Ký quỹ tổ chức</span>
                    <span className="kq-box-value">{fmt(r.toChuc)}</span>
                  </div>
                  <div className="kq-box">
                    <span className="kq-box-label">Ký quỹ cá nhân</span>
                    <span className="kq-box-value">{fmt(r.caNhan)}</span>
                  </div>
                </div>
              </li>
            ))}
            {rows.length === 0 && <li className="kq-empty">{emptyText}</li>}
          </ul>
        </div>

        <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.6, margin: "16px 4px 0" }}>
          Đơn vị: VND / hợp đồng. Mức ký quỹ quy đổi theo tỷ giá tạm tính và có thể thay đổi theo thông báo của Sở Giao dịch Hàng hóa Việt Nam (MXV).
        </p>
      </div>
    </div>
  )
}
