"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { KY_QUY_GROUP_LABEL } from "@/lib/ky-quy-data"
import type { PreviewResponse, PreviewRow } from "@/lib/ky-quy-types"

const GREEN = "#00C389"

const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
const fmtPct = (p: number | null) => (p === null ? "" : `${p > 0 ? "+" : ""}${p.toFixed(1)}%`)
const fmtDate = (iso: string | null | undefined) => {
  if (!iso) return "—"
  const [y, m, d] = iso.slice(0, 10).split("-")
  return `${d}/${m}/${y}`
}
const fmtDateTime = (iso: string | null | undefined) => {
  if (!iso) return "—"
  const dt = new Date(iso)
  return dt.toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" })
}

type Current = { count: number; effectiveDate: string | null; updatedAt: string | null }

const cardStyle = { background: "#fff", borderRadius: "12px", border: "0.5px solid #e2e8f0", padding: "20px" } as const
const h3Style = { fontSize: "14px", fontWeight: 600, color: "#0A1628", margin: "0 0 4px" } as const
const mutedStyle = { fontSize: "12px", color: "#64748b", margin: 0, lineHeight: 1.6 } as const

function Delta({ oldV, newV, p }: { oldV: number | null; newV: number; p: number | null }) {
  if (oldV === null || oldV === newV) return <span style={{ color: "#94a3b8" }}>{fmt(newV)}</span>
  const up = newV > oldV
  return (
    <div style={{ lineHeight: 1.5 }}>
      <div style={{ fontSize: "11px", color: "#94a3b8", textDecoration: "line-through" }}>{fmt(oldV)}</div>
      <div style={{ fontWeight: 600, color: "#0A1628" }}>
        {fmt(newV)}{" "}
        <span style={{ fontSize: "11px", fontWeight: 600, color: up ? "#15803D" : "#DC2626" }}>
          {up ? "▲" : "▼"} {fmtPct(p)}
        </span>
      </div>
    </div>
  )
}

export default function CapNhatKyQuyPage() {
  const supabase = useMemo(() => createClient(), [])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [current, setCurrent] = useState<Current | null>(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [applying, setApplying] = useState(false)
  const [error, setError] = useState("")
  const [preview, setPreview] = useState<PreviewResponse | null>(null)
  const [effectiveDate, setEffectiveDate] = useState("")
  const [addMa, setAddMa] = useState<Record<string, boolean>>({})
  const [done, setDone] = useState<{ updated: number; added: number } | null>(null)

  const loadCurrent = useCallback(async () => {
    const [{ count }, { data: meta }] = await Promise.all([
      supabase.from("ky_quy_products").select("*", { count: "exact", head: true }),
      supabase.from("ky_quy_meta").select("effective_date, updated_at").eq("id", 1).maybeSingle(),
    ])
    setCurrent({ count: count ?? 0, effectiveDate: meta?.effective_date ?? null, updatedAt: meta?.updated_at ?? null })
  }, [supabase])

  useEffect(() => {
    loadCurrent()
  }, [loadCurrent])

  const reset = () => {
    setPreview(null)
    setError("")
    setAddMa({})
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setError("")
    setDone(null)
    setPreview(null)
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/admin/ky-quy/preview", { method: "POST", body: fd })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || "Không đọc được file.")
      const data = json as PreviewResponse
      setPreview(data)
      setEffectiveDate(data.effectiveDate ?? current?.effectiveDate ?? "")
      const defaults: Record<string, boolean> = {}
      data.rows.filter((r) => r.status === "new" && r.canAdd).forEach((r) => (defaults[r.ma] = true))
      setAddMa(defaults)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Có lỗi xảy ra.")
    } finally {
      setLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const changed = useMemo(() => preview?.rows.filter((r) => r.status === "changed") ?? [], [preview])
  const unchanged = useMemo(() => preview?.rows.filter((r) => r.status === "unchanged") ?? [], [preview])
  const added = useMemo(() => preview?.rows.filter((r) => r.status === "new") ?? [], [preview])
  const flaggedCount = changed.filter((r) => r.flagged).length
  const selectedNew = added.filter((r) => r.canAdd && addMa[r.ma])
  const dateChanged = !!effectiveDate && effectiveDate !== (current?.effectiveDate ?? "")
  const totalToSave = changed.length + selectedNew.length
  const canApply = !applying && (totalToSave > 0 || dateChanged)

  const handleApply = async () => {
    if (!preview) return
    setApplying(true)
    setError("")
    try {
      const res = await fetch("/api/admin/ky-quy/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updates: changed.map((r) => ({ ma: r.ma, toChuc: r.toChuc, caNhan: r.caNhan })),
          additions: selectedNew.map((r) => ({ ma: r.ma, ten: r.ten, nhom: r.nhom, san: r.san, toChuc: r.toChuc, caNhan: r.caNhan })),
          effectiveDate: effectiveDate || null,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || "Lưu thất bại.")
      setDone({ updated: json.updated ?? 0, added: json.added ?? 0 })
      reset()
      loadCurrent()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Có lỗi xảy ra.")
    } finally {
      setApplying(false)
    }
  }

  const th = { fontSize: "10px", fontWeight: 600, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase" as const, padding: "10px 12px", borderBottom: "0.5px solid #e2e8f0", background: "#f8fafc", whiteSpace: "nowrap" as const }
  const td = { fontSize: "13px", color: "#0A1628", padding: "10px 12px", borderBottom: "0.5px solid #f1f5f9", verticalAlign: "top" as const }

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      {/* TOPBAR */}
      <div className="admin-topbar" style={{ background: "#fff", borderBottom: "0.5px solid #e2e8f0", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
        <div>
          <h1 style={{ fontSize: "16px", fontWeight: 600, color: "#0A1628", margin: 0 }}>Cập nhật ký quỹ</h1>
          <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0" }}>Kéo file “Danh sách hàng hóa” của MXV vào, kiểm tra thay đổi rồi xác nhận.</p>
        </div>
        <Link href="/dich-vu/ky-quy" target="_blank" style={{ fontSize: "12px", color: GREEN, textDecoration: "none", fontWeight: 500, whiteSpace: "nowrap" }}>
          Xem trang ký quỹ →
        </Link>
      </div>

      <div className="admin-content" style={{ maxWidth: "980px", margin: "0 auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Trạng thái hiện tại */}
        <div style={{ ...cardStyle, display: "flex", flexWrap: "wrap", gap: "24px" }}>
          {[
            { label: "Sản phẩm trên web", value: current ? `${current.count}` : "…" },
            { label: "Hiệu lực từ", value: current ? fmtDate(current.effectiveDate) : "…" },
            { label: "Cập nhật lần cuối", value: current ? fmtDateTime(current.updatedAt) : "…" },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "3px" }}>{s.label}</div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "#0A1628" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {done && (
          <div style={{ background: "#f0fdf8", border: "1px solid #bbf7e0", borderRadius: "10px", padding: "14px 16px", fontSize: "13px", color: "#047857", lineHeight: 1.6 }}>
            ✓ Đã cập nhật xong: <b>{done.updated}</b> sản phẩm đổi số{done.added > 0 ? <>, <b>{done.added}</b> sản phẩm mới</> : null}. Trang ký quỹ đã hiển thị số mới.
          </div>
        )}

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "14px 16px", fontSize: "13px", color: "#B91C1C", lineHeight: 1.6 }}>
            {error}
          </div>
        )}

        {/* Khu vực upload */}
        {!preview && (
          <div style={cardStyle}>
            <h3 style={h3Style}>1. Chọn file mới</h3>
            <p style={{ ...mutedStyle, marginBottom: "14px" }}>Hỗ trợ Excel (.xlsx) và CSV. Hệ thống chỉ lấy 2 cột ký quỹ, các thông tin khác của sản phẩm giữ nguyên.</p>
            <input ref={fileInputRef} type="file" accept=".xlsx,.csv" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files?.[0])} />
            <div
              role="button"
              tabIndex={0}
              onClick={() => !loading && fileInputRef.current?.click()}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !loading && fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); if (!loading) handleFile(e.dataTransfer.files?.[0]) }}
              style={{ border: `1.5px dashed ${dragging ? GREEN : "#cbd5e1"}`, background: dragging ? "#f0fdf8" : "#f8fafc", borderRadius: "10px", padding: "36px 16px", textAlign: "center", cursor: loading ? "default" : "pointer", transition: "all 0.15s" }}
            >
              {loading ? (
                <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Đang đọc file…</p>
              ) : (
                <>
                  <i className="ti ti-upload" style={{ fontSize: "28px", color: GREEN }} />
                  <p style={{ fontSize: "13px", color: "#0A1628", fontWeight: 500, margin: "8px 0 2px" }}>Kéo file vào đây hoặc bấm để chọn</p>
                  <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>.xlsx hoặc .csv, tối đa 5MB</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Xem trước */}
        {preview && (
          <>
            <div style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
                <div>
                  <h3 style={h3Style}>2. Kiểm tra thay đổi</h3>
                  <p style={mutedStyle}>File: <b style={{ color: "#0A1628" }}>{preview.fileName}</b></p>
                </div>
                <button onClick={reset} style={{ padding: "6px 12px", borderRadius: "7px", background: "#fff", border: "0.5px solid #e2e8f0", color: "#64748b", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>
                  Chọn file khác
                </button>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "14px" }}>
                {[
                  { n: changed.length, label: "đổi số", bg: "#fffbeb", color: "#B45309" },
                  { n: unchanged.length, label: "không đổi", bg: "#f1f5f9", color: "#475569" },
                  { n: added.length, label: "sản phẩm mới", bg: "#eff6ff", color: "#1D4ED8" },
                  { n: preview.missing.length, label: "không có trong file", bg: "#f1f5f9", color: "#475569" },
                ].map((c) => (
                  <span key={c.label} style={{ background: c.bg, color: c.color, fontSize: "12px", fontWeight: 600, padding: "5px 12px", borderRadius: "20px" }}>
                    {c.n} {c.label}
                  </span>
                ))}
              </div>

              {flaggedCount > 0 && (
                <div style={{ marginTop: "14px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px", padding: "10px 14px", fontSize: "12px", color: "#92400E", lineHeight: 1.6 }}>
                  ⚠ Có <b>{flaggedCount}</b> sản phẩm lệch hơn 30% so với số hiện tại (đánh dấu vàng bên dưới). Hãy kiểm tra kỹ, có thể bạn đã chọn nhầm file.
                </div>
              )}
              {preview.warnings.map((w, i) => (
                <div key={i} style={{ marginTop: "8px", fontSize: "12px", color: "#92400E", lineHeight: 1.6 }}>⚠ {w}</div>
              ))}
            </div>

            {/* Sản phẩm đổi số */}
            {changed.length > 0 && (
              <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px 12px" }}>
                  <h3 style={h3Style}>Sản phẩm đổi số ({changed.length})</h3>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "560px" }}>
                    <thead>
                      <tr>
                        <th style={{ ...th, textAlign: "left" }}>Mã</th>
                        <th style={{ ...th, textAlign: "left" }}>Tên</th>
                        <th style={{ ...th, textAlign: "right" }}>Ký quỹ tổ chức</th>
                        <th style={{ ...th, textAlign: "right" }}>Ký quỹ cá nhân</th>
                      </tr>
                    </thead>
                    <tbody>
                      {changed.map((r: PreviewRow) => (
                        <tr key={r.ma} style={{ background: r.flagged ? "#fffbeb" : undefined }}>
                          <td style={{ ...td, fontWeight: 700, color: GREEN }}>{r.ma}</td>
                          <td style={td}>{r.ten}{r.flagged && <span style={{ marginLeft: "6px", fontSize: "10px", fontWeight: 600, color: "#B45309" }}>⚠ lệch lớn</span>}</td>
                          <td style={{ ...td, textAlign: "right" }}><Delta oldV={r.oldToChuc} newV={r.toChuc} p={r.pctToChuc} /></td>
                          <td style={{ ...td, textAlign: "right" }}><Delta oldV={r.oldCaNhan} newV={r.caNhan} p={r.pctCaNhan} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sản phẩm mới */}
            {added.length > 0 && (
              <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px 12px" }}>
                  <h3 style={h3Style}>Sản phẩm mới trong file ({added.length})</h3>
                  <p style={mutedStyle}>Chưa có trên web. Tick những sản phẩm bạn muốn thêm vào bảng ký quỹ.</p>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "640px" }}>
                    <thead>
                      <tr>
                        <th style={{ ...th, width: "40px" }} />
                        <th style={{ ...th, textAlign: "left" }}>Mã</th>
                        <th style={{ ...th, textAlign: "left" }}>Tên</th>
                        <th style={{ ...th, textAlign: "left" }}>Nhóm</th>
                        <th style={{ ...th, textAlign: "left" }}>Sở GD</th>
                        <th style={{ ...th, textAlign: "right" }}>Tổ chức</th>
                        <th style={{ ...th, textAlign: "right" }}>Cá nhân</th>
                      </tr>
                    </thead>
                    <tbody>
                      {added.map((r) => (
                        <tr key={r.ma} style={{ opacity: r.canAdd ? 1 : 0.5 }}>
                          <td style={td}>
                            <input type="checkbox" disabled={!r.canAdd} checked={!!addMa[r.ma]} onChange={(e) => setAddMa({ ...addMa, [r.ma]: e.target.checked })} />
                          </td>
                          <td style={{ ...td, fontWeight: 700, color: GREEN }}>{r.ma}</td>
                          <td style={td}>{r.ten || "—"}</td>
                          <td style={{ ...td, color: "#64748b" }}>{r.nhom ? KY_QUY_GROUP_LABEL[r.nhom] : "—"}</td>
                          <td style={{ ...td, color: "#64748b" }}>{r.san || "—"}</td>
                          <td style={{ ...td, textAlign: "right" }}>{fmt(r.toChuc)}</td>
                          <td style={{ ...td, textAlign: "right" }}>{fmt(r.caNhan)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {changed.length === 0 && added.length === 0 && (
              <div style={{ ...cardStyle, fontSize: "13px", color: "#475569" }}>
                Số liệu trong file <b>giống hệt</b> số đang hiển thị trên web, không có gì cần đổi.
              </div>
            )}

            {preview.missing.length > 0 && (
              <div style={{ ...cardStyle, fontSize: "12px", color: "#64748b", lineHeight: 1.7 }}>
                <b style={{ color: "#0A1628" }}>Không có trong file ({preview.missing.length}):</b>{" "}
                {preview.missing.map((m) => m.ma).join(", ")}. Các sản phẩm này được giữ nguyên số cũ trên web.
              </div>
            )}

            {/* Xác nhận */}
            <div style={{ ...cardStyle, display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 500, color: "#64748b", display: "block", marginBottom: "5px" }}>Ngày hiệu lực</label>
                <input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)}
                  style={{ padding: "7px 10px", borderRadius: "7px", border: "0.5px solid #e2e8f0", fontSize: "13px", color: "#0A1628", background: "#fff", fontFamily: "inherit" }} />
                <p style={{ fontSize: "10px", color: "#94a3b8", margin: "4px 0 0" }}>
                  {preview.effectiveDate ? "Tự lấy từ tiêu đề file, bạn có thể sửa." : "Không tìm thấy trong file, hãy kiểm tra lại."}
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={reset} disabled={applying} style={{ padding: "9px 18px", borderRadius: "7px", background: "#fff", border: "0.5px solid #e2e8f0", color: "#64748b", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                  Hủy
                </button>
                <button onClick={handleApply} disabled={!canApply}
                  style={{ padding: "9px 18px", borderRadius: "7px", background: canApply ? GREEN : "#cbd5e1", border: "none", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: canApply ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
                  {applying ? "Đang lưu…" : totalToSave > 0 ? `Xác nhận cập nhật (${totalToSave})` : dateChanged ? "Chỉ cập nhật ngày hiệu lực" : "Không có thay đổi"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
