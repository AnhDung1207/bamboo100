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

function StatCard({ label, value, sub, color = "#00A67E" }: {
  label: string; value: string; sub?: string; color?: string
}) {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e8ecf0",
      borderRadius: "14px",
      padding: "20px 24px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    }}>
      <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "8px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontSize: "24px", fontWeight: 800, color, lineHeight: 1.2 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>{sub}</div>}
    </div>
  )
}

function PerformanceCalendar({ trades, selectedMonth }: { trades: Trade[], selectedMonth: string }) {
  // Build daily map
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

  // Determine which month to show
  const now = new Date()
  let year: number, month: number

  if (selectedMonth !== "all") {
    const [y, m] = selectedMonth.split("-")
    year = parseInt(y)
    month = parseInt(m)
  } else {
    // Show most recent month with data
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
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay() // 0=Sun
  // Convert to Mon-first
  const startOffset = (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1)

  const days = []
  for (let i = 0; i < startOffset; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  return (
    <div>
      <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
          {MONTH_FULL[monthStr]} {year}
        </span>
      </div>

      {/* Weekday headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "4px" }}>
        {weekDays.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: "11px", fontWeight: 600, color: "#94a3b8", padding: "4px 0" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
        {days.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />
          const dateStr = `${year}-${monthStr}-${String(day).padStart(2, "0")}`
          const data = dailyMap[dateStr]
          const isWeekend = ((i % 7) >= 5)

          return (
            <div key={dateStr} style={{
              borderRadius: "8px",
              padding: "6px",
              minHeight: "64px",
              background: data
                ? data.pnl >= 0
                  ? "rgba(0,166,126,0.08)"
                  : "rgba(239,68,68,0.07)"
                : isWeekend ? "#f8fafc" : "#fff",
              border: data
                ? data.pnl >= 0
                  ? "1px solid rgba(0,166,126,0.2)"
                  : "1px solid rgba(239,68,68,0.2)"
                : "1px solid #f1f5f9",
            }}>
              <div style={{ fontSize: "11px", fontWeight: 600, color: data ? "#374151" : "#cbd5e1", marginBottom: "2px" }}>
                {day}
              </div>
              {data && (
                <>
                  <div style={{
                    fontSize: "11px", fontWeight: 700,
                    color: data.pnl >= 0 ? "#00A67E" : "#ef4444",
                    lineHeight: 1.2,
                  }}>
                    {data.pnl >= 0 ? "+" : ""}{Math.round(data.pnl).toLocaleString()}
                  </div>
                  <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "2px" }}>
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
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        <MonthFilter availableMonths={availableMonths} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
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
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(0,166,126,0.08)", border: "1px solid rgba(0,166,126,0.2)", borderRadius: "20px", padding: "4px 14px", marginBottom: "12px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00A67E", display: "inline-block" }} />
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#00A67E", letterSpacing: "0.08em" }}>LIVE TRADING HISTORY</span>
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#0f172a", margin: 0, lineHeight: 1.3 }}>
            Hiệu suất giao dịch thực tế
          </h1>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
            {stats.total} lệnh đã đóng · Dữ liệu cập nhật liên tục
          </p>

          {/* Month filter */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "16px" }}>
            <button onClick={() => setSelectedMonth("all")} style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, cursor: "pointer", border: "1px solid", background: selectedMonth === "all" ? "#00A67E" : "#fff", borderColor: selectedMonth === "all" ? "#00A67E" : "#e2e8f0", color: selectedMonth === "all" ? "#fff" : "#64748b", transition: "all 0.15s" }}>
              Tất cả
            </button>
            {availableMonths.map(m => {
              const [year, month] = m.split("-")
              return (
                <button key={m} onClick={() => setSelectedMonth(m)} style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, cursor: "pointer", border: "1px solid", background: selectedMonth === m ? "#00A67E" : "#fff", borderColor: selectedMonth === m ? "#00A67E" : "#e2e8f0", color: selectedMonth === m ? "#fff" : "#64748b", transition: "all 0.15s" }}>
                  {MONTH_NAMES[month]} {year}
                </button>
              )
            })}
          </div>
        </div>

        {/* Metric cards row 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "12px" }}>
          <StatCard label="REALIZED PNL" value={`${stats.totalNetPnl >= 0 ? "+" : ""}$${stats.totalNetPnl.toLocaleString("en-US", { maximumFractionDigits: 0 })}`} color={stats.totalNetPnl >= 0 ? "#00A67E" : "#ef4444"} sub="Lợi nhuận ròng sau phí" />
          <StatCard label="WIN RATE" value={`${stats.winRate.toFixed(1)}%`} sub={`${stats.wins} Win / ${stats.losses} Loss`} color="#00A67E" />
          <StatCard label="AVERAGE R:R" value={stats.avgRR.toFixed(2)} sub="Tỷ lệ lãi/lỗ trung bình" color="#3b82f6" />
        </div>

        {/* Metric cards row 2 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "12px" }}>
          <StatCard label="PROFIT FACTOR" value={stats.profitFactor.toFixed(2)} sub="Tổng lãi / tổng lỗ" color="#f59e0b" />
          <StatCard label="EXPECTED VALUE" value={`$${stats.expectedValue.toFixed(0)}`} sub="Kỳ vọng mỗi lệnh" color="#8b5cf6" />
          <StatCard label="AVG HOLD TIME" value={`${stats.holdHours}h ${stats.holdMins}m`} sub="Thời gian giữ lệnh TB" color="#0f172a" />
        </div>

        {/* Metric cards row 3 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "20px" }}>
          <StatCard label="TOTAL FEES" value={`$${Math.abs(stats.totalFees).toLocaleString("en-US", { maximumFractionDigits: 0 })}`} sub="Tổng phí giao dịch" color="#ef4444" />
          <StatCard label="MAX DRAWDOWN" value={`-$${stats.maxDrawdown.toLocaleString("en-US", { maximumFractionDigits: 0 })}`} sub="Mức giảm tối đa" color="#ef4444" />
          <StatCard label="MAX RUNUP" value={`+$${stats.maxRunup.toLocaleString("en-US", { maximumFractionDigits: 0 })}`} sub="Mức tăng tối đa" color="#00A67E" />
        </div>

        {/* Charts row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>

          {/* Equity Curve */}
          <div style={{ background: "#fff", border: "1px solid #e8ecf0", borderRadius: "14px", padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
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
          <div style={{ background: "#fff", border: "1px solid #e8ecf0", borderRadius: "14px", padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
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
        <div style={{ background: "#fff", border: "1px solid #e8ecf0", borderRadius: "14px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: "24px" }}>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", marginBottom: "16px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Performance Calendar</div>
          <PerformanceCalendar trades={filteredTrades} selectedMonth={selectedMonth} />
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", padding: "32px", background: "rgba(0,166,126,0.05)", border: "1px solid rgba(0,166,126,0.15)", borderRadius: "16px" }}>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "8px" }}>
            Đây là kết quả giao dịch thực tế — không chỉnh sửa, không chọn lọc
          </p>
          <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", marginBottom: "16px" }}>
            Bắt đầu đầu tư cùng BAMBOO100
          </h3>
          <Link href="/lien-he" style={{ display: "inline-block", background: "#00A67E", color: "#fff", fontSize: "14px", fontWeight: 700, padding: "12px 28px", borderRadius: "8px", textDecoration: "none" }}>
            Đặt lịch tư vấn miễn phí →
          </Link>
        </div>

      </div>
    </div>
  )
}

function MonthFilter({ availableMonths, selectedMonth, setSelectedMonth }: { availableMonths: string[], selectedMonth: string, setSelectedMonth: (m: string) => void }) {
  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
      <button onClick={() => setSelectedMonth("all")} style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, cursor: "pointer", border: "1px solid", background: selectedMonth === "all" ? "#00A67E" : "#fff", borderColor: selectedMonth === "all" ? "#00A67E" : "#e2e8f0", color: selectedMonth === "all" ? "#fff" : "#64748b" }}>Tất cả</button>
      {availableMonths.map(m => {
        const [year, month] = m.split("-")
        return <button key={m} onClick={() => setSelectedMonth(m)} style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, cursor: "pointer", border: "1px solid", background: selectedMonth === m ? "#00A67E" : "#fff", borderColor: selectedMonth === m ? "#00A67E" : "#e2e8f0", color: selectedMonth === m ? "#fff" : "#64748b" }}>{MONTH_NAMES[month]} {year}</button>
      })}
    </div>
  )
}
