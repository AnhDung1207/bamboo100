"use client"

import { useState, useEffect } from "react"

const ASSETS = [
  { name: "VÀNG",    symbol: "XAU/USD",   base: 3242.50, thumb: "/thumbnails/vang.png" },
  { name: "DẦU WTI", symbol: "CRUDE OIL", base: 78.12,   thumb: "/thumbnails/dau-tho.png" },
  { name: "CÀ PHÊ",  symbol: "COFFEE",    base: 4820,    thumb: "/thumbnails/ca-phe.png" },
  { name: "ĐỒNG",    symbol: "COPPER",    base: 9124,    thumb: "/thumbnails/dong.png" },
  { name: "BẠC",     symbol: "XAG/USD",   base: 32.45,   thumb: "/thumbnails/bac.png" },
]

function genHistory(base: number, n = 14) {
  let v = base
  return Array(n).fill(0).map(() => { v += v * (Math.random() - 0.47) * 0.015; return v })
}

function MiniBarChart({ history, up }: { history: number[]; up: boolean }) {
  const mn = Math.min(...history)
  const mx = Math.max(...history)
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "28px" }}>
      {history.map((h, i) => {
        const ht = mx === mn ? 14 : Math.round(4 + (h - mn) / (mx - mn) * 24)
        const isLast = i === history.length - 1
        return (
          <div key={i} style={{
            width: "5px", height: `${ht}px`,
            borderRadius: "2px",
            background: up ? "#22c55e" : "#e24b4a",
            opacity: isLast ? 1 : 0.6,
            transition: "height 0.5s ease",
          }} />
        )
      })}
    </div>
  )
}

export default function PriceWidget() {
  const [prices, setPrices] = useState(() =>
    ASSETS.map(a => ({ ...a, price: a.base, history: genHistory(a.base) }))
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(p => {
        const delta = p.base * (Math.random() - 0.48) * 0.002
        const newPrice = p.price + delta
        return {
          ...p,
          price: newPrice,
          history: [...p.history.slice(1), newPrice],
        }
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      border: "1px solid #e2e8f0", borderRadius: "12px",
      overflow: "hidden", marginBottom: "20px", background: "#fff",
      fontFamily: "'Roboto', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        padding: "11px 16px", borderBottom: "1px solid #e2e8f0",
        background: "#f8fafc", display: "flex",
        justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{
          fontSize: "11px", fontWeight: 700, color: "#64748b",
          textTransform: "uppercase", letterSpacing: "0.07em",
          fontFamily: "'Roboto', sans-serif",
        }}>
          Nhịp đập thị trường
        </span>
        <span style={{
          fontSize: "10px", color: "#64748b",
          display: "flex", alignItems: "center", gap: "5px",
          fontFamily: "'Roboto', sans-serif",
        }}>
          <span style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: "#22c55e", display: "inline-block",
            animation: "pulse 2s infinite",
          }} />
          Live
        </span>
      </div>

      {/* Rows */}
      {prices.map((p) => {
        const up = p.price >= p.base
        return (
          <div key={p.name} style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 16px", borderBottom: "1px solid #f1f5f9",
            cursor: "pointer",
          }}>
            {/* Left: thumbnail + name */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "8px",
                background: "#f8fafc", display: "flex",
                alignItems: "center", justifyContent: "center",
                border: "1px solid #e2e8f0", overflow: "hidden", flexShrink: 0,
              }}>
                <img
                  src={p.thumb} alt={p.name}
                  style={{ width: "28px", height: "28px", objectFit: "contain" }}
                />
              </div>
              <div>
                <div style={{
                  fontSize: "12px", fontWeight: 600, color: "#0A1628",
                  fontFamily: "'Roboto', sans-serif",
                }}>{p.name}</div>
                <div style={{
                  fontSize: "10px", color: "#94a3b8",
                  fontFamily: "'Roboto', sans-serif",
                }}>{p.symbol}</div>
              </div>
            </div>

            {/* Right: mini bar chart */}
            <MiniBarChart history={p.history} up={up} />
          </div>
        )
      })}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
      `}</style>
    </div>
  )
}
