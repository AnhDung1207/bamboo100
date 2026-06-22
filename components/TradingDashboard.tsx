"use client"

import { useMemo, useState } from "react"
import Link from "next/link"

interface Trade {
  id: string
  trader: string
  entry_date: string
  exit_date: string
  exit_time: string
  commodity_name: string
  sector: string
  direction: string
  entry_price: number
  exit_price: number
  pnl: number
  commission: number
  net_pnl: number
  result: string
  rr_actual: number
  hold_minutes: number
  symbol: string
  contract_month?: number
}

interface Props {
  trades: Trade[]
}

const MONTH_NAMES: Record<string, string> = {
  "01": "Tháng 1", "02": "Tháng 2", "03": "Tháng 3", "04": "Tháng 4",
  "05": "Tháng 5", "06": "Tháng 6", "07": "Tháng 7", "08": "Tháng 8",
  "09": "Tháng 9", "10": "Tháng 10", "11": "Tháng 11", "12": "Tháng 12",
}

const MONTH_FULL: Record<string, string> = {
  "01": "January", "02": "February", "03": "March", "04": "April",
  "05": "May", "06": "June", "07": "July", "08": "August",
  "09": "September", "10": "October", "11": "November", "12": "December",
}

// Responsive style helper – returns inline style merged with media-query-like
// overrides via CSS custom properties. Since Next.js inline styles can't do
// media queries we inject a <style> tag once and use CSS classes.
const GLOBAL_CSS = `
  .td-metrics-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 12px;
  }
  .td-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 12px;
  }
  .td-stat-value { font-size: 24px; }
  .td-h1 { font-size: 26px; }
  .td-calendar-cell { min-height: 64px; padding: 6px; }
  .td-calendar-pnl { font-size: 11px; }
  .td-calendar-wl  { font-size: 10px; }
  .td-month-scroll {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 16px;
  }
  .td-container { padding: 32px 24px 64px; }
  .td-header { margin-bottom: 28px; }
  .td-trades-table { width: 100%; border-collapse: collapse; }
  .td-trades-table th {
    padding: 11px 16px;
    text-align: right;
    color: #94a3b8;
    background: #f8fafc;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .05em;
    text-transform: uppercase;
  }
  .td-trades-table th:first-child { text-align: left; }
  .td-trades-table th:nth-child(2),
  .td-trades-table td:nth-child(2) { text-align: center; }
  .td-trades-table td {
    padding: 14px 16px;
    border-top: 1px solid #f1f5f9;
    text-align: right;
    color: #334155;
    font-size: 13px;
  }
  .td-trades-table td:first-child { text-align: left; }
  .td-trades-mobile { display: none; }

  @media (max-width: 768px) {
    .td-daily-pnl { display: none; }
    .td-metrics-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-bottom: 10px;
    }
    .td-metric-primary {
      background: linear-gradient(135deg, #ffffff 0%, #f0fdf8 100%) !important;
      border-color: #bbf7d0 !important;
    }
    .td-metric-mobile-hidden { display: none; }
    .td-metric-primary { grid-column: 1; grid-row: 1; }
    .td-metric-fees { grid-column: 2; grid-row: 1; }
    .td-grid-2 {
      grid-template-columns: 1fr;
      gap: 10px;
      margin-bottom: 10px;
    }
    .td-stat-value { font-size: 20px; }
    .td-h1 { font-size: 20px; }
    .td-calendar-cell { min-height: 52px; padding: 4px; }
    .td-calendar-pnl { font-size: 10px; }
    .td-calendar-wl  { font-size: 9px; }
    .td-month-scroll {
      flex-wrap: nowrap;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 4px;
      scrollbar-width: none;
    }
    .td-month-scroll::-webkit-scrollbar { display: none; }
    .td-month-btn { white-space: nowrap; flex-shrink: 0; }
    .td-container { padding: 20px 16px 48px; }
    .td-header { margin-bottom: 20px; }
    .td-card { padding: 14px !important; }
    .td-card-label { font-size: 10px !important; }
    .td-history-header { padding: 18px 16px 14px !important; }
    .td-trades-desktop { display: none; }
    .td-trades-mobile {
      display: grid;
      gap: 10px;
      padding: 0 16px 16px;
    }
    .td-trade-mobile-card {
      padding: 14px;
      border: 1px solid #e8eef3;
      border-radius: 12px;
      background: #fff;
      box-shadow: 0 1px 2px rgba(15, 23, 42, .03);
    }
    .td-trade-mobile-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 13px;
    }
    .td-trade-mobile-metrics {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
    }
    .td-trade-mobile-metric {
      min-width: 0;
      padding: 9px 8px;
      border-radius: 9px;
      background: #f8fafc;
    }
    .td-trade-mobile-label {
      margin-bottom: 5px;
      color: #94a3b8;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: .04em;
      text-transform: uppercase;
    }
    .td-trade-mobile-value {
      overflow: hidden;
      color: #334155;
      font-size: 12px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .td-trades-lock { padding: 24px 16px 30px !important; }
  }

  @media (max-width: 480px) {
    .td-metrics-grid {
      grid-template-columns: 1fr 1fr;
    }
    .td-stat-value { font-size: 18px; }
    .td-calendar-cell { min-height: 44px; padding: 3px; }
    .td-calendar-day { font-size: 10px !important; }
    .td-calendar-pnl { font-size: 9px; }
    .td-calendar-wl  { display: none; }
  }
`

function GlobalStyle() {
  return <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
}

function StatCard({ label, value, sub, color = "#00A67E", className = "" }: {
  label: string; value: string; sub?: string; color?: string; className?: string
}) {
  return (
    <div className={`td-card ${className}`.trim()} style={{
      background: "#fff",
      border: "1px solid #e8ecf0",
      borderRadius: "14px",
      padding: "20px 24px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    }}>
      <div className="td-card-label" style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "8px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}
      </div>
      <div className="td-stat-value" style={{ fontWeight: 800, color, lineHeight: 1.2 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>{sub}</div>}
    </div>
  )
}

function PerformanceCalendar({ trades, selectedMonth }: { trades: Trade[], selectedMonth: string }) {
  const dailyMap = useMemo(() => {
    const map: Record<string, { pnl: number; wins: number; losses: number }> = {}
    trades.forEach(t => {
      if (!t.exit_date) return
      if (!map[t.exit_date]) map[t.exit_date] = { pnl: 0, wins: 0, losses: 0 }
      map[t.exit_date].pnl += t.net_pnl || 0
      if (t.result === "Win") map[t.exit_date].wins++
      else map[t.exit_date].losses++
    })
    return map
  }, [trades])

  const now = new Date()
  let year: number, month: number

  if (selectedMonth !== "all") {
    const [y, m] = selectedMonth.split("-")
    year = parseInt(y)
    month = parseInt(m)
  } else {
    const dates = Object.keys(dailyMap).sort()
    if (dates.length > 0) {
      const last = dates[dates.length - 1]
      year = parseInt(last.slice(0, 4))
      month = parseInt(last.slice(5, 7))
    } else {
      year = now.getFullYear()
      month = now.getMonth() + 1
    }
  }

  const monthStr = String(month).padStart(2, "0")
  const daysInMonth = new Date(year, month, 0).getDate()
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay()
  const startOffset = (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1)

  const days = []
  for (let i = 0; i < startOffset; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)

  const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]
  return (
    <div>
      <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
          {MONTH_FULL[monthStr]} {year}
        </span>
      </div>

      {/* Weekday headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "3px", marginBottom: "3px" }}>
        {weekDays.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: "11px", fontWeight: 600, color: "#94a3b8", padding: "4px 0" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "3px" }}>
        {days.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />
          const dateStr = `${year}-${monthStr}-${String(day).padStart(2, "0")}`
          const data = dailyMap[dateStr]
          const isWeekend = ((i % 7) >= 5)

          return (
            <div key={dateStr} className="td-calendar-cell" style={{
              borderRadius: "6px",
              background: data
                ? data.pnl >= 0 ? "rgba(0,166,126,0.08)" : "rgba(239,68,68,0.07)"
                : isWeekend ? "#f8fafc" : "#fff",
              border: data
                ? data.pnl >= 0 ? "1px solid rgba(0,166,126,0.2)" : "1px solid rgba(239,68,68,0.2)"
                : "1px solid #f1f5f9",
            }}>
              <div className="td-calendar-day" style={{ fontSize: "11px", fontWeight: 600, color: data ? "#374151" : "#cbd5e1", marginBottom: "2px" }}>
                {day}
              </div>
              {data && (
                <>
                  <div className="td-calendar-pnl" style={{
                    fontWeight: 700,
                    color: data.pnl >= 0 ? "#00A67E" : "#ef4444",
                    lineHeight: 1.2,
                  }}>
                    {data.pnl >= 0 ? "+" : ""}{Math.round(data.pnl).toLocaleString()}
                  </div>
                  <div className="td-calendar-wl" style={{ color: "#94a3b8", marginTop: "2px" }}>
                    {data.wins > 0 && `${data.wins}W`}{data.wins > 0 && data.losses > 0 && "-"}{data.losses > 0 && `${data.losses}L`}
                    {data.wins + data.losses > 0 && (
                      <span style={{ marginLeft: "2px" }}>
                        ({Math.round(data.wins / (data.wins + data.losses) * 100)}%)
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

    </div>
  )
}

function formatPrice(value: number) {
  if (!Number.isFinite(value)) return "—"
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  })
}

const FUTURES_MONTH_CODES: Record<number, string> = {
  1: "F", 2: "G", 3: "H", 4: "J", 5: "K", 6: "M",
  7: "N", 8: "Q", 9: "U", 10: "V", 11: "X", 12: "Z",
}

function formatContractSymbol(trade: Trade) {
  const root = (trade.symbol || "").trim().toUpperCase()
  const contractMonth = Number(trade.contract_month)
  const monthCode = FUTURES_MONTH_CODES[contractMonth]
  if (!root || !monthCode) return root || trade.commodity_name || "N/A"

  const referenceDate = trade.exit_date || trade.entry_date
  const referenceYear = Number(referenceDate?.slice(0, 4))
  const referenceMonth = Number(referenceDate?.slice(5, 7))
  if (!referenceYear || !referenceMonth) return `${root}${monthCode}`

  const contractYear = contractMonth < referenceMonth ? referenceYear + 1 : referenceYear
  return `${root}${monthCode}${String(contractYear).slice(-2)}`
}

function RecentTrades({
  trades,
  monthLabel,
  revealLatest,
}: {
  trades: Trade[]
  monthLabel: string
  revealLatest: boolean
}) {
  const sortedTrades = useMemo(() => (
    [...trades].sort((a, b) => {
      const aTime = `${a.exit_date || ""}T${a.exit_time || "00:00:00"}`
      const bTime = `${b.exit_date || ""}T${b.exit_time || "00:00:00"}`
      return bTime.localeCompare(aTime)
    })
  ), [trades])

  const visibleTrades = revealLatest ? sortedTrades.slice(0, 3) : []
  const hiddenCount = Math.max(sortedTrades.length - visibleTrades.length, 0)

  return (
    <section className="td-card" style={{ position: "relative", marginBottom: 24, overflow: "hidden", border: "1px solid #e8ecf0", borderRadius: 14, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
      <div className="td-history-header" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, padding: "20px 20px 14px" }}>
        <div>
          <div style={{ marginBottom: 4, color: "#94a3b8", fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase" }}>
            Lịch sử
          </div>
          <div style={{ color: "#64748b", fontSize: 12 }}>
            {revealLatest ? "Giao dịch mới nhất" : "Lịch sử giao dịch được bảo vệ"} · {monthLabel}
          </div>
        </div>
      </div>

      {revealLatest && (
        <>
        <div className="td-trades-desktop" style={{ overflowX: "auto" }}>
        <table className="td-trades-table">
          <colgroup>
            <col style={{ width: "26%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>
          <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Loại lệnh</th>
                <th className="td-trades-price">Giá vào</th>
                <th className="td-trades-price">Giá thoát</th>
                <th>Net PNL</th>
              </tr>
            </thead>
            <tbody>
              {visibleTrades.map((trade) => (
                <tr key={trade.id}>
                  <td>
                    <div>
                      <div style={{ color: "#0f172a", fontSize: 14, fontWeight: 800, letterSpacing: ".01em" }}>{formatContractSymbol(trade)}</div>
                      <div style={{ marginTop: 3, color: "#94a3b8", fontSize: 10 }}>{trade.exit_date}</div>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      minWidth: 48, padding: "4px 9px", borderRadius: 99,
                      background: trade.direction?.toLowerCase() === "buy" ? "#dcfce7" : trade.direction?.toLowerCase() === "sell" ? "#fee2e2" : "#f1f5f9",
                      color: trade.direction?.toLowerCase() === "buy" ? "#166534" : trade.direction?.toLowerCase() === "sell" ? "#991b1b" : "#64748b",
                      fontSize: 10, fontWeight: 800,
                    }}>
                      {trade.direction?.toLowerCase() === "buy" ? "Mua" : trade.direction?.toLowerCase() === "sell" ? "Bán" : "—"}
                    </span>
                  </td>
                  <td className="td-trades-price" style={{ fontVariantNumeric: "tabular-nums" }}>{formatPrice(trade.entry_price)}</td>
                  <td className="td-trades-price" style={{ fontVariantNumeric: "tabular-nums" }}>{formatPrice(trade.exit_price)}</td>
                  <td style={{ color: trade.net_pnl >= 0 ? "#00A67E" : "#ef4444", fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
                    {trade.net_pnl >= 0 ? "+" : "-"}${Math.abs(trade.net_pnl).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="td-trades-mobile">
          {visibleTrades.map((trade) => {
            const isBuy = trade.direction?.toLowerCase() === "buy"
            const isSell = trade.direction?.toLowerCase() === "sell"
            const pnlText = `${trade.net_pnl >= 0 ? "+" : "-"}$${Math.abs(trade.net_pnl).toLocaleString("en-US", { maximumFractionDigits: 0 })}`

            return (
              <article className="td-trade-mobile-card" key={`mobile-${trade.id}`}>
                <div className="td-trade-mobile-head">
                  <div>
                    <div style={{ color: "#0f172a", fontSize: 15, fontWeight: 800, letterSpacing: ".01em" }}>{formatContractSymbol(trade)}</div>
                    <div style={{ marginTop: 3, color: "#94a3b8", fontSize: 10 }}>{trade.exit_date}</div>
                  </div>
                  <span style={{
                    display: "inline-flex", minWidth: 50, alignItems: "center", justifyContent: "center",
                    padding: "6px 11px", borderRadius: 999,
                    background: isBuy ? "#dcfce7" : isSell ? "#fee2e2" : "#f1f5f9",
                    color: isBuy ? "#15803d" : isSell ? "#b91c1c" : "#64748b",
                    fontSize: 10, fontWeight: 800,
                  }}>
                    {isBuy ? "Mua" : isSell ? "Bán" : "—"}
                  </span>
                </div>
                <div className="td-trade-mobile-metrics">
                  <div className="td-trade-mobile-metric">
                    <div className="td-trade-mobile-label">Giá vào</div>
                    <div className="td-trade-mobile-value">{formatPrice(trade.entry_price)}</div>
                  </div>
                  <div className="td-trade-mobile-metric">
                    <div className="td-trade-mobile-label">Giá thoát</div>
                    <div className="td-trade-mobile-value">{formatPrice(trade.exit_price)}</div>
                  </div>
                  <div className="td-trade-mobile-metric">
                    <div className="td-trade-mobile-label">Net PNL</div>
                    <div className="td-trade-mobile-value" style={{ color: trade.net_pnl >= 0 ? "#00A67E" : "#ef4444" }}>{pnlText}</div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
        </>
      )}

      {(hiddenCount > 0 || !revealLatest) && (
        <div className="td-trades-lock" style={{ position: "relative", minHeight: revealLatest ? undefined : 230, padding: revealLatest ? "32px 22px 30px" : "58px 22px 48px", overflow: "hidden", textAlign: "center", borderTop: "1px solid #eef2f6", background: "linear-gradient(180deg, #fff 0%, #f8fafc 100%)" }}>
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, opacity: .5, filter: "blur(5px)", pointerEvents: "none" }}>
            {[0, 1].map((row) => (
              <div key={row} style={{ display: "grid", gridTemplateColumns: "1.7fr .7fr 1fr 1fr 1fr", gap: 18, padding: "12px 18px", borderBottom: "1px solid #e2e8f0" }}>
                <span style={{ height: 12, borderRadius: 6, background: "#cbd5e1" }} />
                <span style={{ height: 12, borderRadius: 6, background: row ? "#fecaca" : "#bbf7d0" }} />
                <span style={{ height: 12, borderRadius: 6, background: "#e2e8f0" }} />
                <span style={{ height: 12, borderRadius: 6, background: "#e2e8f0" }} />
                <span style={{ height: 12, borderRadius: 6, background: row ? "#fecaca" : "#bbf7d0" }} />
              </div>
            ))}
          </div>
          <div style={{ position: "relative", zIndex: 1, maxWidth: 480, margin: "0 auto", padding: "8px 0" }}>
            <div style={{ marginBottom: 7, color: "#0f172a", fontSize: 15, fontWeight: 800 }}>
              Khám phá toàn bộ lịch sử
            </div>
            <p style={{ margin: "0 0 15px", color: "#64748b", fontSize: 12, lineHeight: 1.55 }}>
              Nhận lịch sử giao dịch đầy đủ và trao đổi cùng chuyên gia.
            </p>
            <Link href="/lien-he#dat-lich" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "10px 20px", borderRadius: 8, background: "#00A67E", color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
              Đăng ký tư vấn
            </Link>
          </div>
        </div>
      )}
    </section>
  )
}

function MonthFilterRow({
  availableMonths,
  selectedMonth,
  onSelect,
}: {
  availableMonths: string[]
  selectedMonth: string
  onSelect: (month: string) => void
}) {
  return (
    <div className="td-month-scroll">
      <button
        className="td-month-btn"
        onClick={() => onSelect("all")}
        style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, cursor: "pointer", border: "1px solid", background: selectedMonth === "all" ? "#00A67E" : "#fff", borderColor: selectedMonth === "all" ? "#00A67E" : "#e2e8f0", color: selectedMonth === "all" ? "#fff" : "#64748b", transition: "all 0.15s" }}>
        Tất cả
      </button>
      {availableMonths.map((value) => {
        const [year, month] = value.split("-")
        return (
          <button
            key={value}
            className="td-month-btn"
            onClick={() => onSelect(value)}
            style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, cursor: "pointer", border: "1px solid", background: selectedMonth === value ? "#00A67E" : "#fff", borderColor: selectedMonth === value ? "#00A67E" : "#e2e8f0", color: selectedMonth === value ? "#fff" : "#64748b", transition: "all 0.15s" }}>
            {MONTH_NAMES[month]} {year}
          </button>
        )
      })}
    </div>
  )
}

export default function TradingDashboard({ trades }: Props) {
  const [selectedMonth, setSelectedMonth] = useState<string>("all")

  const availableMonths = useMemo(() => {
    const months = new Set<string>()
    trades.forEach(t => {
      if (t.exit_date) months.add(t.exit_date.slice(0, 7))
    })
    return Array.from(months).sort().reverse()
  }, [trades])

  const filteredTrades = useMemo(() => {
    if (selectedMonth === "all") return trades
    return trades.filter(t => t.exit_date?.startsWith(selectedMonth))
  }, [trades, selectedMonth])

  const selectedMonthLabel = useMemo(() => {
    const displayMonth = selectedMonth === "all" ? availableMonths[0] : selectedMonth
    if (!displayMonth) return "Chưa có dữ liệu"
    const [year, month] = displayMonth.split("-")
    return `${MONTH_NAMES[month]} ${year}`
  }, [availableMonths, selectedMonth])

  const latestMonth = availableMonths[0] || ""
  const revealLatestTrades = selectedMonth === "all" || selectedMonth === latestMonth
  const recentTrades = useMemo(() => {
    if (!latestMonth) return []
    if (revealLatestTrades) return trades.filter((trade) => trade.exit_date?.startsWith(latestMonth))
    return filteredTrades
  }, [filteredTrades, latestMonth, revealLatestTrades, trades])

  const stats = useMemo(() => {
    if (!filteredTrades.length) return null
    const trades = filteredTrades

    const total = trades.length
    const wins = trades.filter(t => t.result === "Win")
    const losses = trades.filter(t => t.result === "Loss")
    const winRate = (wins.length / total) * 100

    const totalNetPnl = trades.reduce((s, t) => s + (t.net_pnl || 0), 0)
    const totalFees = trades.reduce((s, t) => s + (t.commission || 0), 0)

    const avgWin = wins.length ? wins.reduce((s, t) => s + (t.pnl || 0), 0) / wins.length : 0
    const avgLoss = losses.length ? Math.abs(losses.reduce((s, t) => s + (t.pnl || 0), 0) / losses.length) : 0
    const profitFactor = avgLoss > 0 ? (avgWin * wins.length) / (avgLoss * losses.length) : 0
    const expectedValue = (winRate / 100) * avgWin - (1 - winRate / 100) * avgLoss

    const avgRR = trades.filter(t => t.rr_actual).reduce((s, t) => s + (t.rr_actual || 0), 0) /
      (trades.filter(t => t.rr_actual).length || 1)

    const avgHoldMinutes = trades.filter(t => t.hold_minutes).reduce((s, t) => s + (t.hold_minutes || 0), 0) /
      (trades.filter(t => t.hold_minutes).length || 1)
    const holdHours = Math.floor(avgHoldMinutes / 60)
    const holdMins = Math.round(avgHoldMinutes % 60)

    let cumulative = 0
    const equityCurve = trades.map(t => {
      cumulative += t.net_pnl || 0
      return { date: t.exit_date, value: Math.round(cumulative) }
    })

    let peak = 0, trough = Infinity, maxDrawdown = 0, maxRunup = 0, runningPnl = 0
    trades.forEach(t => {
      runningPnl += t.net_pnl || 0
      if (runningPnl > peak) { peak = runningPnl; trough = runningPnl }
      if (runningPnl < trough) { trough = runningPnl; const dd = peak - trough; if (dd > maxDrawdown) maxDrawdown = dd }
      if (runningPnl > maxRunup) maxRunup = runningPnl
    })

    const dailyMap: Record<string, number> = {}
    trades.forEach(t => { if (t.exit_date) dailyMap[t.exit_date] = (dailyMap[t.exit_date] || 0) + (t.net_pnl || 0) })
    const dailyPnl = Object.entries(dailyMap).sort(([a], [b]) => a.localeCompare(b)).slice(-20).map(([date, val]) => ({ date, value: Math.round(val) }))
    const worstDay = Math.min(...dailyPnl.map(d => d.value))
    const bestDay = Math.max(...dailyPnl.map(d => d.value))

    return {
      total, wins: wins.length, losses: losses.length, winRate,
      totalNetPnl, totalFees, profitFactor, expectedValue,
      avgRR, holdHours, holdMins, equityCurve, dailyPnl,
      maxDrawdown, maxRunup, worstDay, bestDay,
    }
  }, [filteredTrades])

  if (!stats) return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <GlobalStyle />
      <div style={{ maxWidth: "1200px", margin: "0 auto" }} className="td-container">
        <MonthFilterRow availableMonths={availableMonths} selectedMonth={selectedMonth} onSelect={setSelectedMonth} />
        <div style={{ textAlign: "center", padding: "80px 40px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
          <p style={{ color: "#94a3b8" }}>Không có dữ liệu cho tháng này</p>
        </div>
      </div>
    </div>
  )

  const chartW = 580, chartH = 160, chartPad = 16
  const eqMin = Math.min(0, ...stats.equityCurve.map(p => p.value))
  const eqMax = Math.max(...stats.equityCurve.map(p => p.value))
  const eqRange = eqMax - eqMin || 1
  const toX = (i: number) => chartPad + (i / (stats.equityCurve.length - 1 || 1)) * (chartW - chartPad * 2)
  const toY = (v: number) => chartH - chartPad - ((v - eqMin) / eqRange) * (chartH - chartPad * 2)
  const linePath = stats.equityCurve.map((p, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(p.value)}`).join(" ")
  const fillPath = `${linePath} L ${toX(stats.equityCurve.length - 1)} ${toY(eqMin)} L ${toX(0)} ${toY(eqMin)} Z`

  const barW = 580, barH = 120, barPad = 8
  const dMax = Math.max(...stats.dailyPnl.map(d => Math.abs(d.value)), 1)
  const barWidth = Math.floor((barW - barPad * 2) / stats.dailyPnl.length) - 2
  const zeroY = barH / 2

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <GlobalStyle />
      <div style={{ maxWidth: "1200px", margin: "0 auto" }} className="td-container">

        {/* Header */}
        <div className="td-header">
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(0,166,126,0.08)", border: "1px solid rgba(0,166,126,0.2)", borderRadius: "20px", padding: "4px 14px", marginBottom: "12px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00A67E", display: "inline-block" }} />
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#00A67E", letterSpacing: "0.08em" }}>LIVE TRADING HISTORY</span>
          </div>
          <h1 className="td-h1" style={{ fontWeight: 800, color: "#0f172a", margin: 0, lineHeight: 1.3 }}>
            Dashboard hiệu suất đầu tư
          </h1>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
            Dữ liệu real-time cập nhật liên tục.
          </p>

          {/* Month filter — horizontal scroll on mobile */}
          <MonthFilterRow availableMonths={availableMonths} selectedMonth={selectedMonth} onSelect={setSelectedMonth} />
        </div>

        {/* Performance metrics */}
        <div className="td-metrics-grid">
          <StatCard className="td-metric-primary" label="REALIZED PNL" value={`${stats.totalNetPnl >= 0 ? "+" : ""}$${stats.totalNetPnl.toLocaleString("en-US", { maximumFractionDigits: 0 })}`} color={stats.totalNetPnl >= 0 ? "#00A67E" : "#ef4444"} sub="Lợi nhuận ròng sau phí" />
          <StatCard label="WIN RATE" value={`${stats.winRate.toFixed(1)}%`} sub={`${stats.wins}W / ${stats.losses}L`} color="#00A67E" />
          <StatCard label="AVG R:R" value={stats.avgRR.toFixed(2)} sub="Tỷ lệ lãi/lỗ TB" color="#3b82f6" />
          <StatCard className="td-metric-mobile-hidden" label="PROFIT FACTOR" value={stats.profitFactor.toFixed(2)} sub="Tổng lãi / tổng lỗ" color="#f59e0b" />
          <StatCard className="td-metric-mobile-hidden" label="EXP. VALUE" value={`$${stats.expectedValue.toFixed(0)}`} sub="Kỳ vọng / lệnh" color="#8b5cf6" />
          <StatCard className="td-metric-mobile-hidden" label="HOLD TIME" value={`${stats.holdHours}h ${stats.holdMins}m`} sub="Giữ lệnh TB" color="#0f172a" />
          <StatCard className="td-metric-fees" label="TOTAL FEES" value={`$${Math.abs(stats.totalFees).toLocaleString("en-US", { maximumFractionDigits: 0 })}`} sub="Tổng phí giao dịch" color="#ef4444" />
          <StatCard label="MAX DRAWDOWN" value={`-$${stats.maxDrawdown.toLocaleString("en-US", { maximumFractionDigits: 0 })}`} sub="Mức giảm tối đa" color="#ef4444" />
          <StatCard label="MAX RUNUP" value={`+$${stats.maxRunup.toLocaleString("en-US", { maximumFractionDigits: 0 })}`} sub="Mức tăng tối đa" color="#00A67E" />
        </div>

        {/* Charts row — stacks to 1 col on mobile */}
        <div className="td-grid-2">

          {/* Equity Curve */}
          <div className="td-card" style={{ background: "#fff", border: "1px solid #e8ecf0", borderRadius: "14px", padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", marginBottom: "4px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Equity Curve</div>
            <div style={{ fontSize: "12px", color: "#cbd5e1", marginBottom: "12px" }}>{stats.equityCurve[0]?.date} → {stats.equityCurve[stats.equityCurve.length - 1]?.date}</div>
            <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: "100%", height: "auto" }}>
              <defs>
                <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00A67E" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#00A67E" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={fillPath} fill="url(#eqGrad)" />
              <path d={linePath} fill="none" stroke="#00A67E" strokeWidth="2" strokeLinejoin="round" />
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
              <span style={{ fontSize: "11px", color: "#ef4444" }}>Worst: ${stats.worstDay.toLocaleString()}</span>
              <span style={{ fontSize: "11px", color: "#00A67E" }}>Best: +${stats.bestDay.toLocaleString()}</span>
            </div>
          </div>

          {/* Daily PNL */}
          <div className="td-card td-daily-pnl" style={{ background: "#fff", border: "1px solid #e8ecf0", borderRadius: "14px", padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", marginBottom: "4px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Daily PNL</div>
            <div style={{ fontSize: "12px", color: "#cbd5e1", marginBottom: "12px" }}>{stats.dailyPnl.length} ngày gần nhất</div>
            <svg viewBox={`0 0 ${barW} ${barH}`} style={{ width: "100%", height: "auto" }}>
              <line x1={barPad} y1={zeroY} x2={barW - barPad} y2={zeroY} stroke="#f1f5f9" strokeWidth="1.5" />
              {stats.dailyPnl.map((d, i) => {
                const x = barPad + i * ((barW - barPad * 2) / stats.dailyPnl.length)
                const bh = Math.abs(d.value) / dMax * (zeroY - 8)
                const y = d.value >= 0 ? zeroY - bh : zeroY
                return <rect key={i} x={x + 1} y={y} width={barWidth} height={bh} fill={d.value >= 0 ? "#00A67E" : "#ef4444"} opacity={0.8} rx="2" />
              })}
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
              <span style={{ fontSize: "11px", color: "#94a3b8" }}>{stats.dailyPnl[0]?.date}</span>
              <span style={{ fontSize: "11px", color: "#94a3b8" }}>{stats.dailyPnl[stats.dailyPnl.length - 1]?.date}</span>
            </div>
          </div>
        </div>

        {/* Performance Calendar */}
        <div className="td-card" style={{ background: "#fff", border: "1px solid #e8ecf0", borderRadius: "14px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: "24px" }}>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", marginBottom: "16px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Performance Calendar</div>
          <PerformanceCalendar trades={filteredTrades} selectedMonth={selectedMonth} />
        </div>

        <RecentTrades trades={recentTrades} monthLabel={selectedMonthLabel} revealLatest={revealLatestTrades} />

      </div>
    </div>
  )
}
