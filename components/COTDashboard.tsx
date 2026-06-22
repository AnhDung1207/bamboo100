"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Chart, registerables } from "chart.js"
import Link from "next/link"
import { LockKeyhole } from "lucide-react"

Chart.register(...registerables)

type GroupName = "Nông sản" | "Năng lượng" | "Kim loại"
type SignalKey =
  | "long_building"
  | "long_reducing"
  | "short_building"
  | "short_covering"

interface ContractMeta {
  name: string
  shortName: string
  group: GroupName
  exchange: string
  symbol: string
}

interface RawCftcRow {
  report_date_as_yyyy_mm_dd?: string
  cftc_contract_market_code?: string
  market_and_exchange_names?: string
  open_interest_all?: string
  m_money_positions_long_all?: string
  m_money_positions_short_all?: string
  m_money_positions_spread_all?: string
}

interface HistoryPoint {
  date: string
  long: number
  short: number
  spreading: number
  net: number
  oi: number
  netPctOi: number
}

interface CommodityData extends ContractMeta {
  key: string
  market: string
  net: number
  long: number
  short: number
  spreading: number
  oi: number
  netDelta: number
  longDelta: number
  shortDelta: number
  oiDelta: number
  netPctOi: number
  cotIndex: number | null
  lastDate: string
  history: HistoryPoint[]
}

interface ApiResponse {
  rows?: RawCftcRow[]
  fetchedAt?: string
  error?: string
}

interface DataHealth {
  missing: string[]
  duplicateCount: number
  invalidCount: number
  stale: string[]
}

const CONTRACTS: Record<string, ContractMeta> = {
  "001602": { name: "Wheat SRW (Lúa mì)", shortName: "Wheat", group: "Nông sản", exchange: "CBOT", symbol: "ZW" },
  "002602": { name: "Corn (Ngô)", shortName: "Corn", group: "Nông sản", exchange: "CBOT", symbol: "ZC" },
  "005602": { name: "Soybeans (Đậu tương)", shortName: "Soybeans", group: "Nông sản", exchange: "CBOT", symbol: "ZS" },
  "007601": { name: "Soybean Oil (Dầu đậu tương)", shortName: "Soy Oil", group: "Nông sản", exchange: "CBOT", symbol: "ZL" },
  "026603": { name: "Soybean Meal (Khô đậu tương)", shortName: "Soy Meal", group: "Nông sản", exchange: "CBOT", symbol: "ZM" },
  "033661": { name: "Cotton No. 2 (Bông)", shortName: "Cotton", group: "Nông sản", exchange: "ICE US", symbol: "CT" },
  "083731": { name: "Coffee C (Cà phê)", shortName: "Coffee", group: "Nông sản", exchange: "ICE US", symbol: "KC" },
  "080732": { name: "Sugar No. 11 (Đường)", shortName: "Sugar", group: "Nông sản", exchange: "ICE US", symbol: "SB" },
  "073732": { name: "Cocoa (Ca cao)", shortName: "Cocoa", group: "Nông sản", exchange: "ICE US", symbol: "CC" },
  "057642": { name: "Live Cattle (Bò sống)", shortName: "Live Cattle", group: "Nông sản", exchange: "CME", symbol: "LE" },
  "054642": { name: "Lean Hogs (Heo nạc)", shortName: "Lean Hogs", group: "Nông sản", exchange: "CME", symbol: "HE" },
  "061641": { name: "Feeder Cattle (Bò vỗ béo)", shortName: "Feeder", group: "Nông sản", exchange: "CME", symbol: "GF" },
  "067651": { name: "Crude Oil WTI (Dầu thô)", shortName: "WTI", group: "Năng lượng", exchange: "NYMEX", symbol: "CL" },
  "023651": { name: "Natural Gas (Khí tự nhiên)", shortName: "Nat Gas", group: "Năng lượng", exchange: "NYMEX", symbol: "NG" },
  "111659": { name: "Gasoline RBOB (Xăng)", shortName: "RBOB", group: "Năng lượng", exchange: "NYMEX", symbol: "RB" },
  "022651": { name: "NY Harbor ULSD (Dầu diesel)", shortName: "ULSD", group: "Năng lượng", exchange: "NYMEX", symbol: "HO" },
  "088691": { name: "Gold (Vàng)", shortName: "Gold", group: "Kim loại", exchange: "COMEX", symbol: "GC" },
  "084691": { name: "Silver (Bạc)", shortName: "Silver", group: "Kim loại", exchange: "COMEX", symbol: "SI" },
  "085692": { name: "Copper (Đồng)", shortName: "Copper", group: "Kim loại", exchange: "COMEX", symbol: "HG" },
  "076651": { name: "Platinum (Bạch kim)", shortName: "Platinum", group: "Kim loại", exchange: "NYMEX", symbol: "PL" },
  "075651": { name: "Palladium (Paladi)", shortName: "Palladium", group: "Kim loại", exchange: "NYMEX", symbol: "PA" },
}

const GROUPS: Array<"Tất cả" | GroupName> = ["Tất cả", "Nông sản", "Năng lượng", "Kim loại"]
const GROUP_COLORS: Record<GroupName, { bg: string; text: string; border: string; chart: string }> = {
  "Nông sản": { bg: "#edfbf4", text: "#166534", border: "#bbf7d0", chart: "#1D9E75" },
  "Năng lượng": { bg: "#fff7ed", text: "#9a3412", border: "#fed7aa", chart: "#EF9F27" },
  "Kim loại": { bg: "#eff6ff", text: "#1e40af", border: "#bfdbfe", chart: "#378ADD" },
}

function parseNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function formatNumber(value: number) {
  const absolute = Math.abs(value)
  if (absolute >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (absolute >= 1_000) return `${(value / 1_000).toFixed(1)}k`
  return Math.round(value).toLocaleString("vi-VN")
}

function formatDelta(value: number) {
  return `${value >= 0 ? "+" : ""}${formatNumber(value)}`
}

function formatPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`
}

function formatDate(value: string) {
  if (!value) return "—"
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`))
}

function calculateCotIndex(history: HistoryPoint[]) {
  const values = history.slice(0, 52).map((point) => point.net)
  if (values.length < 13) return null
  const minimum = Math.min(...values)
  const maximum = Math.max(...values)
  return maximum === minimum ? 50 : ((values[0] - minimum) / (maximum - minimum)) * 100
}

function latestExpectedCotDate(now = new Date()) {
  const utcDay = now.getUTCDay()
  const daysSinceTuesday = (utcDay - 2 + 7) % 7
  const latestTuesday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysSinceTuesday))
  const graceDeadline = new Date(latestTuesday.getTime() + 7 * 86_400_000)
  const expectedTuesday = now >= graceDeadline
    ? latestTuesday
    : new Date(latestTuesday.getTime() - 7 * 86_400_000)
  return expectedTuesday.toISOString().slice(0, 10)
}

function getSignal(net: number, delta: number) {
  if (net >= 0 && delta >= 0) {
    return { key: "long_building" as const, label: "Tăng mua ròng", symbol: "↗", bg: "#dcfce7", color: "#166534" }
  }
  if (net >= 0 && delta < 0) {
    return { key: "long_reducing" as const, label: "Thu hẹp mua", symbol: "↘", bg: "#fef9c3", color: "#854d0e" }
  }
  if (net < 0 && delta < 0) {
    return { key: "short_building" as const, label: "Tăng bán ròng", symbol: "↘", bg: "#fee2e2", color: "#991b1b" }
  }
  return { key: "short_covering" as const, label: "Thu hẹp bán", symbol: "↗", bg: "#e0f2fe", color: "#075985" }
}

function SignalBadge({ net, delta }: { net: number; delta: number }) {
  const signal = getSignal(net, delta)
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px",
      borderRadius: 99, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
      background: signal.bg, color: signal.color,
    }}>
      {signal.symbol} {signal.label}
    </span>
  )
}

function CommodityBadge({ item, size = 30 }: { item: CommodityData; size?: number }) {
  const colors = GROUP_COLORS[item.group]
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        flex: `0 0 ${size}px`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: `1px solid ${colors.border}`,
        borderRadius: Math.round(size * 0.28),
        background: colors.bg,
        color: colors.text,
        fontSize: Math.max(9, Math.round(size * 0.34)),
        fontWeight: 800,
        letterSpacing: "-0.02em",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.7)",
      }}
    >
      {item.symbol}
    </span>
  )
}

function Sparkline({ history, color }: { history: HistoryPoint[]; color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current || history.length === 0) return
    chartRef.current?.destroy()
    const points = history.slice(0, 12).reverse()
    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: points.map((point) => point.date),
        datasets: [{
          data: points.map((point) => point.net),
          borderColor: color,
          borderWidth: 1.5,
          pointRadius: 0,
          tension: 0.25,
          fill: true,
          backgroundColor: `${color}18`,
        }],
      },
      options: {
        responsive: false,
        animation: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } },
      },
    })
    return () => chartRef.current?.destroy()
  }, [history, color])

  return <canvas ref={canvasRef} width={80} height={36} aria-label="Biến động net position 12 tuần" />
}

function DetailModal({ item, onClose }: { item: CommodityData; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)
  const [showComponents, setShowComponents] = useState(false)
  const colors = GROUP_COLORS[item.group]

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [onClose])

  useEffect(() => {
    if (!canvasRef.current || item.history.length === 0) return
    chartRef.current?.destroy()
    const points = item.history.slice(0, 52).reverse()
    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: points.map((point) => point.date.slice(5).replace("-", "/")),
        datasets: [
          ...(showComponents ? [
            { label: "Long", data: points.map((point) => point.long / 1000), borderColor: "#378ADD", pointRadius: 0, borderWidth: 1.5, tension: 0.2 },
            { label: "Short", data: points.map((point) => point.short / 1000), borderColor: "#E24B4A", pointRadius: 0, borderWidth: 1.5, tension: 0.2 },
          ] : []),
          { label: "Net", data: points.map((point) => point.net / 1000), borderColor: colors.chart, pointRadius: 0, borderWidth: 2.5, tension: 0.2 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: "index" },
        plugins: { legend: { position: "top", labels: { boxWidth: 12, font: { size: 11 } } } },
        scales: {
          x: { ticks: { maxTicksLimit: 10, font: { size: 10 } }, grid: { display: false } },
          y: { ticks: { font: { size: 10 }, callback: (value) => `${value}k` } },
        },
      },
    })
    return () => chartRef.current?.destroy()
  }, [item, colors.chart, showComponents])

  const metrics = [
    { label: "Net position", value: formatDelta(item.net), color: item.net >= 0 ? "#00A67E" : "#ef4444" },
    { label: "Net Δ tuần", value: formatDelta(item.netDelta), color: item.netDelta >= 0 ? "#00A67E" : "#ef4444" },
    { label: "Net / Total OI", value: formatPercent(item.netPctOi), color: "#0f172a" },
    { label: "COT Index 52T", value: item.cotIndex === null ? "Chưa đủ dữ liệu" : item.cotIndex.toFixed(0), color: colors.chart },
    { label: "Managed Money Long", value: formatNumber(item.long), color: "#378ADD" },
    { label: "Managed Money Short", value: formatNumber(item.short), color: "#E24B4A" },
    { label: "Spreading", value: formatNumber(item.spreading), color: "#7c3aed" },
    { label: "Total Open Interest", value: formatNumber(item.oi), color: "#475569" },
  ]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Chi tiết ${item.name}`}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(15,23,42,.55)" }}
    >
      <div onClick={(event) => event.stopPropagation()} style={{ width: "100%", maxWidth: 760, maxHeight: "92vh", overflowY: "auto", padding: 24, borderRadius: 20, background: "#fff", boxShadow: "0 24px 70px rgba(0,0,0,.25)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <CommodityBadge item={item} size={42} />
            <div>
              <h2 style={{ margin: 0, fontSize: 19, color: "#0f172a" }}>{item.name}</h2>
              <p style={{ margin: "3px 0 0", fontSize: 12, color: "#64748b" }}>
                {item.exchange} · CFTC code {item.key} · Báo cáo {formatDate(item.lastDate)}
              </p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Đóng" style={{ width: 34, height: 34, border: 0, borderRadius: 9, cursor: "pointer", background: "#f1f5f9", color: "#475569" }}>✕</button>
        </div>

        <div className="cot-modal-metrics" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
          {metrics.map((metric) => (
            <div key={metric.label} style={{ padding: 12, borderRadius: 12, background: "#f8fafc" }}>
              <p style={{ margin: "0 0 4px", fontSize: 10, color: "#94a3b8" }}>{metric.label}</p>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: metric.color }}>{metric.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
          <button onClick={() => setShowComponents((value) => !value)} style={{ padding: "6px 10px", border: "1px solid #e2e8f0", borderRadius: 8, background: showComponents ? "#0f172a" : "#fff", color: showComponents ? "#fff" : "#475569", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>
            {showComponents ? "Chỉ xem Net" : "Hiện Long / Short"}
          </button>
        </div>
        <div style={{ position: "relative", height: 300 }}>
          <canvas ref={canvasRef} />
        </div>
        <p style={{ margin: "12px 0 0", fontSize: 11, lineHeight: 1.5, color: "#94a3b8" }}>
          Net = Managed Money Long − Short. Spreading được hiển thị riêng và không nằm trong Net.
          COT Index đo vị trí tương đối của Net trong tối đa 52 tuần, không phải khuyến nghị mua/bán.
        </p>
      </div>
    </div>
  )
}

function UnlockedCOTDashboard() {
  const [items, setItems] = useState<CommodityData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeGroup, setActiveGroup] = useState<"Tất cả" | GroupName>("Tất cả")
  const [selected, setSelected] = useState<CommodityData | null>(null)
  const [fetchedAt, setFetchedAt] = useState("")
  const [health, setHealth] = useState<DataHealth>({ missing: [], duplicateCount: 0, invalidCount: 0, stale: [] })

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/cftc", { cache: "no-store" })
      const payload = await response.json() as ApiResponse
      if (!response.ok) throw new Error(payload.error || `CFTC API trả về lỗi ${response.status}`)
      if (!Array.isArray(payload.rows) || payload.rows.length === 0) throw new Error("CFTC không trả về dữ liệu")

      const historyByCode = new Map<string, HistoryPoint[]>()
      const marketByCode = new Map<string, string>()
      const seen = new Set<string>()
      let duplicateCount = 0
      let invalidCount = 0

      for (const row of payload.rows) {
        const code = row.cftc_contract_market_code?.trim() || ""
        if (!CONTRACTS[code]) continue
        const date = row.report_date_as_yyyy_mm_dd?.slice(0, 10) || ""
        const long = parseNumber(row.m_money_positions_long_all)
        const short = parseNumber(row.m_money_positions_short_all)
        const spreading = parseNumber(row.m_money_positions_spread_all)
        const oi = parseNumber(row.open_interest_all)
        if (!date || long === null || short === null || spreading === null || oi === null || oi <= 0) {
          invalidCount += 1
          continue
        }

        const uniqueKey = `${code}:${date}`
        if (seen.has(uniqueKey)) {
          duplicateCount += 1
          continue
        }
        seen.add(uniqueKey)

        const net = long - short
        const point: HistoryPoint = { date, long, short, spreading, oi, net, netPctOi: (net / oi) * 100 }
        const history = historyByCode.get(code) || []
        history.push(point)
        historyByCode.set(code, history)
        marketByCode.set(code, row.market_and_exchange_names?.trim() || CONTRACTS[code].exchange)
      }

      const parsedItems: CommodityData[] = []
      const missing: string[] = []
      const stale: string[] = []
      const expectedDate = latestExpectedCotDate()

      for (const [code, meta] of Object.entries(CONTRACTS)) {
        const history = (historyByCode.get(code) || []).sort((a, b) => b.date.localeCompare(a.date))
        if (history.length === 0) {
          missing.push(meta.name)
          continue
        }
        const latest = history[0]
        const previous = history[1]
        if (latest.date < expectedDate) stale.push(meta.name)

        parsedItems.push({
          ...meta,
          key: code,
          market: marketByCode.get(code) || meta.exchange,
          history,
          net: latest.net,
          long: latest.long,
          short: latest.short,
          spreading: latest.spreading,
          oi: latest.oi,
          netPctOi: latest.netPctOi,
          netDelta: previous ? latest.net - previous.net : 0,
          longDelta: previous ? latest.long - previous.long : 0,
          shortDelta: previous ? latest.short - previous.short : 0,
          oiDelta: previous ? latest.oi - previous.oi : 0,
          cotIndex: calculateCotIndex(history),
          lastDate: latest.date,
        })
      }

      if (parsedItems.length === 0) throw new Error("Không có hợp đồng mục tiêu hợp lệ trong dữ liệu CFTC")
      setItems(parsedItems)
      setFetchedAt(payload.fetchedAt || new Date().toISOString())
      setHealth({ missing, duplicateCount, invalidCount, stale })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Không thể tải dữ liệu CFTC")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0)
    return () => window.clearTimeout(timer)
  }, [load])

  const grouped = useMemo(() => {
    const result: Record<GroupName, CommodityData[]> = { "Nông sản": [], "Năng lượng": [], "Kim loại": [] }
    for (const item of items) result[item.group].push(item)
    return result
  }, [items])

  const visibleGroups = GROUPS.slice(1)
    .filter((group): group is GroupName => activeGroup === "Tất cả" || group === activeGroup)
    .map((group) => [group, grouped[group]] as const)
    .filter(([, groupItems]) => groupItems.length > 0)

  const signalCounts = useMemo(() => {
    const counts: Record<SignalKey, number> = {
      long_building: 0,
      long_reducing: 0,
      short_building: 0,
      short_covering: 0,
    }
    for (const item of items) counts[getSignal(item.net, item.netDelta).key] += 1
    return counts
  }, [items])

  const reportDate = items.reduce((latest, item) => item.lastDate > latest ? item.lastDate : latest, "")
  const hasWarnings = health.missing.length > 0 || health.stale.length > 0 || health.duplicateCount > 0 || health.invalidCount > 0

  return (
    <>
      <style>{`
        .cot-table tbody tr:hover { background: #f8fafc; cursor: pointer; }
        .cot-table-wrap { overflow-x: auto; }
        .cot-mobile-list { display: none; }
        @media (max-width: 900px) {
          .cot-grid { grid-template-columns: 1fr !important; }
          .cot-summary { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .cot-desktop-table { display: none !important; }
          .cot-mobile-list { display: grid !important; gap: 10px; }
          .cot-modal-metrics { grid-template-columns: repeat(2, 1fr) !important; }
          .cot-main { padding: 84px 14px 44px !important; }
          .cot-header-row { align-items: flex-start !important; }
          .cot-header-actions { width: 100%; justify-content: space-between; }
          .cot-summary { gap: 8px !important; }
          .cot-summary-card { padding: 13px 14px !important; }
          .cot-group-chart { display: none !important; }
          .cot-group-tabs {
            flex-wrap: nowrap !important;
            overflow-x: auto;
            padding-bottom: 4px;
            scrollbar-width: none;
          }
          .cot-group-tabs::-webkit-scrollbar { display: none; }
          .cot-group-tabs button { white-space: nowrap; flex-shrink: 0; }
        }
      `}</style>

      <main className="cot-main" style={{ maxWidth: 1240, margin: "0 auto", padding: "100px 24px 64px", fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
        <header style={{ marginBottom: 28 }}>
          <div className="cot-header-row" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <h1 style={{ margin: "0 0 5px", fontSize: 30, color: "#0f172a" }}>Báo cáo COT</h1>
              <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Managed Money · Futures & Options Combined</p>
              {reportDate && (
                <p style={{ margin: "5px 0 0", fontSize: 12, color: "#94a3b8" }}>
                  Vị thế tính đến {formatDate(reportDate)} · CFTC thường công bố vào thứ Sáu
                </p>
              )}
            </div>
            <div className="cot-header-actions" style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {fetchedAt && <span style={{ fontSize: 11, color: "#94a3b8" }}>Tải lúc {new Date(fetchedAt).toLocaleString("vi-VN")}</span>}
              <button onClick={() => void load()} disabled={loading} style={{ padding: "8px 15px", border: 0, borderRadius: 8, cursor: loading ? "wait" : "pointer", background: "#00A67E", color: "#fff", fontSize: 13, fontWeight: 700 }}>
                ↻ {loading ? "Đang tải" : "Làm mới"}
              </button>
            </div>
          </div>
        </header>

        {!loading && items.length > 0 && (
          <section className="cot-summary" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 22 }}>
            {[
              { label: "Tăng mua ròng", value: signalCounts.long_building, sub: "Long ròng và Net tăng", color: "#00A67E" },
              { label: "Thu hẹp mua", value: signalCounts.long_reducing, sub: "Long ròng nhưng Net giảm", color: "#a16207" },
              { label: "Tăng bán ròng", value: signalCounts.short_building, sub: "Short ròng và Net giảm", color: "#ef4444" },
              { label: "Thu hẹp bán", value: signalCounts.short_covering, sub: "Short ròng nhưng Net tăng", color: "#0284c7" },
            ].map((card) => (
              <div className="cot-summary-card" key={card.label} style={{ padding: "15px 18px", border: "1px solid #e8ecf0", borderRadius: 14, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
                <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".05em" }}>{card.label}</p>
                <p style={{ margin: "0 0 2px", fontSize: 27, fontWeight: 800, color: card.color }}>{card.value}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>{card.sub}</p>
              </div>
            ))}
          </section>
        )}

        {!loading && hasWarnings && (
          <details style={{ marginBottom: 20, padding: "11px 14px", border: "1px solid #fde68a", borderRadius: 12, background: "#fffbeb", color: "#854d0e", fontSize: 12 }}>
            <summary style={{ cursor: "pointer", fontWeight: 700 }}>Kiểm tra dữ liệu: có cảnh báo cần lưu ý</summary>
            <ul style={{ margin: "8px 0 0", paddingLeft: 18, lineHeight: 1.6 }}>
              {health.missing.length > 0 && <li>Thiếu hợp đồng: {health.missing.join(", ")}</li>}
              {health.stale.length > 0 && <li>Chưa có báo cáo mới theo chu kỳ công bố CFTC: {health.stale.join(", ")}</li>}
              {health.duplicateCount > 0 && <li>Đã loại {health.duplicateCount} dòng trùng contract code + ngày báo cáo.</li>}
              {health.invalidCount > 0 && <li>Đã bỏ {health.invalidCount} dòng có trường số/ngày không hợp lệ.</li>}
            </ul>
          </details>
        )}

        <nav className="cot-group-tabs" aria-label="Nhóm hàng hóa" style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
          {GROUPS.map((group) => (
            <button key={group} onClick={() => setActiveGroup(group)} style={{
              padding: "7px 15px", border: "1px solid", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700,
              background: activeGroup === group ? "#0f172a" : "#fff",
              color: activeGroup === group ? "#fff" : "#475569",
              borderColor: activeGroup === group ? "#0f172a" : "#e2e8f0",
            }}>{group}</button>
          ))}
        </nav>

        {loading && items.length === 0 && (
          <div style={{ padding: "72px 0", textAlign: "center", color: "#64748b" }}>Đang tải và kiểm tra dữ liệu CFTC…</div>
        )}

        {error && (
          <div style={{ padding: 32, border: "1px solid #fecaca", borderRadius: 16, textAlign: "center", background: "#fef2f2" }}>
            <p style={{ margin: "0 0 7px", fontWeight: 800, color: "#991b1b" }}>Không tải được dữ liệu CFTC</p>
            <p style={{ margin: "0 0 15px", fontSize: 13, color: "#ef4444" }}>{error}</p>
            <button onClick={() => void load()} style={{ padding: "8px 18px", border: 0, borderRadius: 8, cursor: "pointer", background: "#ef4444", color: "#fff", fontWeight: 700 }}>Thử lại</button>
          </div>
        )}

        {!error && visibleGroups.map(([group, groupItems]) => {
          const colors = GROUP_COLORS[group]
          const maxAbsolute = Math.max(...groupItems.map((item) => Math.abs(item.net)), 1)
          return (
            <section key={group} style={{ marginBottom: 34 }}>
              <div style={{ display: "inline-flex", gap: 6, marginBottom: 14, padding: "4px 13px", border: `1px solid ${colors.border}`, borderRadius: 10, background: colors.bg, color: colors.text }}>
                <strong style={{ fontSize: 13 }}>{group}</strong>
                <span style={{ fontSize: 11, opacity: .7 }}>({groupItems.length})</span>
              </div>

              <div className="cot-grid" style={{ display: "grid", gridTemplateColumns: "minmax(260px, .8fr) minmax(620px, 2.2fr)", gap: 16 }}>
                <div className="cot-group-chart" style={{ padding: "16px 18px", border: "1px solid #e8ecf0", borderRadius: 14, background: "#fff" }}>
                  <p style={{ margin: "0 0 14px", fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Managed Money Net (nghìn HĐ)</p>
                  <svg viewBox={`0 0 300 ${groupItems.length * 31 + 10}`} style={{ width: "100%", height: "auto" }} role="img" aria-label={`Net position nhóm ${group}`}>
                    <line x1="162" x2="162" y1="0" y2={groupItems.length * 31 + 4} stroke="#cbd5e1" strokeWidth="1" />
                    {groupItems.map((item, index) => {
                      const barLength = Math.abs(item.net) / maxAbsolute * 68
                      const positive = item.net >= 0
                      const y = index * 31 + 5
                      return (
                        <g key={item.key}>
                          <text x="0" y={y + 12} textAnchor="start" fontSize="9.5" fontWeight="600" fill="#475569">{item.shortName}</text>
                          <rect x={positive ? 162 : 162 - barLength} y={y} width={Math.max(barLength, 2)} height="17" rx="3" fill={positive ? colors.chart : "#E24B4A"} opacity=".85" />
                          <text x="298" y={y + 12} textAnchor="end" fontSize="9.5" fontWeight="700" fill={positive ? colors.chart : "#E24B4A"}>
                            {formatDelta(Math.round(item.net / 1000))}k
                          </text>
                        </g>
                      )
                    })}
                  </svg>
                </div>

                <div className="cot-table-wrap cot-desktop-table" style={{ border: "1px solid #e8ecf0", borderRadius: 14, background: "#fff" }}>
                  <table className="cot-table" style={{ width: "100%", minWidth: 760, borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
                        {[
                          ["Hàng hóa", "left"],
                          ["Net", "right", "Managed Money Long trừ Managed Money Short."],
                          ["Net Δ", "right", "Thay đổi Net position so với báo cáo tuần trước."],
                          ["Net/OI", "right", "Net position chia cho tổng Open Interest của thị trường."],
                          ["COT 52T", "right", "Vị trí tương đối của Net trong biên độ tối đa 52 tuần; không phải tín hiệu mua bán."],
                          ["12 tuần", "right"],
                          ["Trạng thái", "left"],
                        ].map(([label, align], index) => (
                          <th key={label} className={index === 5 ? "cot-hide-mobile" : undefined} style={{ padding: "10px 12px", textAlign: align as "left" | "right", fontSize: 10, color: "#94a3b8", textTransform: "uppercase" }}>
                            {label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {groupItems.map((item, index) => (
                        <tr key={item.key} onClick={() => setSelected(item)} style={{ borderBottom: index < groupItems.length - 1 ? "1px solid #f8fafc" : 0 }}>
                          <td style={{ padding: "10px 12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <CommodityBadge item={item} />
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{item.name}</div>
                                <div style={{ fontSize: 10, color: "#94a3b8" }}>{item.exchange} · {formatDate(item.lastDate)}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right", fontSize: 13, fontWeight: 700, color: item.net >= 0 ? "#00A67E" : "#ef4444" }}>{formatDelta(item.net)}</td>
                          <td style={{ padding: "10px 12px", textAlign: "right", fontSize: 12, color: item.netDelta >= 0 ? "#00A67E" : "#ef4444" }}>{formatDelta(item.netDelta)}</td>
                          <td style={{ padding: "10px 12px", textAlign: "right", fontSize: 12, fontWeight: 700, color: "#475569" }}>{formatPercent(item.netPctOi)}</td>
                          <td style={{ padding: "10px 12px", textAlign: "right", fontSize: 12, fontWeight: 700, color: item.cotIndex !== null && item.cotIndex >= 80 ? "#00A67E" : item.cotIndex !== null && item.cotIndex <= 20 ? "#ef4444" : "#64748b" }}>
                            {item.cotIndex === null ? "—" : item.cotIndex.toFixed(0)}
                          </td>
                          <td className="cot-hide-mobile" style={{ padding: "7px 12px", textAlign: "right" }}><Sparkline history={item.history} color={colors.chart} /></td>
                          <td style={{ padding: "10px 12px" }}><SignalBadge net={item.net} delta={item.netDelta} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="cot-mobile-list">
                  {groupItems.map((item) => {
                    const signal = getSignal(item.net, item.netDelta)
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setSelected(item)}
                        style={{
                          width: "100%",
                          padding: 14,
                          border: "1px solid #e2e8f0",
                          borderRadius: 14,
                          background: "#fff",
                          boxShadow: "0 1px 3px rgba(15,23,42,.04)",
                          color: "inherit",
                          font: "inherit",
                          textAlign: "left",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 13 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                            <CommodityBadge item={item} size={36} />
                            <div style={{ minWidth: 0 }}>
                              <div style={{ overflow: "hidden", color: "#0f172a", fontSize: 13, fontWeight: 800, textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                              <div style={{ marginTop: 2, color: "#94a3b8", fontSize: 10 }}>{item.exchange} · {formatDate(item.lastDate)}</div>
                            </div>
                          </div>
                          <span style={{ flexShrink: 0, padding: "3px 8px", borderRadius: 99, background: signal.bg, color: signal.color, fontSize: 10, fontWeight: 700 }}>
                            {signal.symbol} {signal.label}
                          </span>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                          {[
                            { label: "Net", value: formatDelta(item.net), color: item.net >= 0 ? "#00A67E" : "#ef4444" },
                            { label: "Net Δ", value: formatDelta(item.netDelta), color: item.netDelta >= 0 ? "#00A67E" : "#ef4444" },
                            { label: "Net/OI", value: formatPercent(item.netPctOi), color: "#475569" },
                          ].map((metric) => (
                            <div key={metric.label} style={{ padding: "9px 8px", borderRadius: 10, background: "#f8fafc" }}>
                              <div style={{ marginBottom: 3, color: "#94a3b8", fontSize: 9, fontWeight: 700, textTransform: "uppercase" }}>{metric.label}</div>
                              <div style={{ color: metric.color, fontSize: 12, fontWeight: 800 }}>{metric.value}</div>
                            </div>
                          ))}
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 11, paddingTop: 10, borderTop: "1px solid #f1f5f9" }}>
                          <span style={{ color: "#64748b", fontSize: 10 }}>
                            COT Index 52T: <strong style={{ color: item.cotIndex !== null && item.cotIndex >= 80 ? "#00A67E" : item.cotIndex !== null && item.cotIndex <= 20 ? "#ef4444" : "#475569" }}>{item.cotIndex === null ? "—" : item.cotIndex.toFixed(0)}</strong>
                          </span>
                          <span style={{ color: "#008e6c", fontSize: 10, fontWeight: 700 }}>Xem chi tiết →</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </section>
          )
        })}

        {!loading && items.length > 0 && (
          <footer style={{ marginTop: 18, textAlign: "center", fontSize: 11, lineHeight: 1.6, color: "#94a3b8" }}>
            Nguồn: CFTC Disaggregated Commitments of Traders · Futures & Options Combined · Net = Managed Money Long − Short.
            <br />Dữ liệu phản ánh vị thế, không phải tín hiệu giao dịch hay khuyến nghị đầu tư.
          </footer>
        )}
      </main>

      {selected && <DetailModal item={selected} onClose={() => setSelected(null)} />}
    </>
  )
}

function LockedCOTDashboard() {
  return (
    <main style={{ maxWidth: 1240, margin: "0 auto", padding: "100px 24px 64px", fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <style>{`
        @media (max-width: 720px) {
          .cot-lock-preview { grid-template-columns: 1fr !important; }
          .cot-lock-card { padding: 26px 20px !important; }
          .cot-lock-actions { flex-direction: column !important; }
          .cot-lock-actions a { width: 100% !important; }
        }
      `}</style>

      <header style={{ marginBottom: 28 }}>
        <h1 style={{ margin: "0 0 5px", fontSize: 30, color: "#0f172a" }}>Báo cáo COT</h1>
        <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Managed Money · Futures & Options Combined</p>
      </header>

      <section style={{ position: "relative", minHeight: 480, overflow: "hidden", border: "1px solid #e2e8f0", borderRadius: 20, background: "#fff" }}>
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, padding: 22, opacity: .56, filter: "blur(5px)", pointerEvents: "none", userSelect: "none" }}>
          <div className="cot-lock-preview" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 22 }}>
            {[7, 9, 3, 2].map((value, index) => (
              <div key={index} style={{ height: 112, padding: 16, border: "1px solid #e8ecf0", borderRadius: 14 }}>
                <div style={{ width: "62%", height: 9, borderRadius: 5, background: "#cbd5e1", marginBottom: 16 }} />
                <div style={{ fontSize: 26, fontWeight: 800, color: index === 2 ? "#ef4444" : "#00A67E" }}>{value}</div>
                <div style={{ width: "76%", height: 8, borderRadius: 5, background: "#e2e8f0", marginTop: 10 }} />
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(240px, .8fr) minmax(500px, 2.2fr)", gap: 16 }}>
            <div style={{ height: 290, border: "1px solid #e8ecf0", borderRadius: 14, background: "linear-gradient(90deg, transparent 48%, #cbd5e1 48%, #cbd5e1 49%, transparent 49%)" }} />
            <div style={{ height: 290, border: "1px solid #e8ecf0", borderRadius: 14, background: "repeating-linear-gradient(to bottom, #f8fafc 0, #f8fafc 44px, #e8ecf0 45px, #fff 46px)" }} />
          </div>
        </div>

        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(248,250,252,.3), rgba(248,250,252,.92) 52%, #f8fafc 100%)" }} />

        <div className="cot-lock-card" style={{
          position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
          width: "calc(100% - 32px)", maxWidth: 520, padding: "34px 36px", textAlign: "center",
          border: "1px solid #dbe4ea", borderRadius: 18, background: "rgba(255,255,255,.96)",
          boxShadow: "0 20px 60px rgba(15,23,42,.14)", backdropFilter: "blur(12px)",
        }}>
          <div style={{ width: 48, height: 48, margin: "0 auto 15px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #b7ead9", borderRadius: 14, background: "linear-gradient(145deg, #f0fdf8, #ddf8ef)", color: "#008e6c", boxShadow: "0 8px 22px rgba(0,166,126,.12)" }}>
            <LockKeyhole size={23} strokeWidth={1.9} aria-hidden="true" />
          </div>
          <h2 style={{ margin: "0 0 9px", fontSize: 21, lineHeight: 1.35, color: "#0f172a" }}>
            Đăng nhập để xem toàn bộ báo cáo COT
          </h2>
          <p style={{ margin: "0 auto 22px", maxWidth: 400, fontSize: 13, lineHeight: 1.65, color: "#64748b" }}>
            Truy cập đầy đủ dữ liệu và biểu đồ COT.
          </p>
          <div className="cot-lock-actions" style={{ display: "flex", justifyContent: "center", gap: 10 }}>
            <Link href="/dang-ky?redirect=/dich-vu/bao-cao-cot" style={{ minWidth: 180, padding: "11px 22px", borderRadius: 9, background: "#00A67E", color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
              Tạo tài khoản miễn phí
            </Link>
            <Link href="/dang-nhap?redirect=/dich-vu/bao-cao-cot" style={{ minWidth: 120, padding: "11px 22px", border: "1px solid #cbd5e1", borderRadius: 9, background: "#fff", color: "#334155", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
              Đăng nhập
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default function COTDashboard({ isLocked = false }: { isLocked?: boolean }) {
  return isLocked ? <LockedCOTDashboard /> : <UnlockedCOTDashboard />
}
