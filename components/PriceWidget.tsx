"use client"

import { useEffect, useState } from "react"

interface Price {
  name: string
  sub: string
  price: string
  change: string
  up: boolean
}

export default function PriceWidget() {
  const [prices, setPrices] = useState<Price[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  const fetchPrices = async () => {
    setError(null)
    try {
      const res = await fetch("/api/prices")
      if (!res.ok) throw new Error("PRICE_API_ERROR")

      const data = await res.json()
      if (Array.isArray(data.prices) && data.prices.length > 0) {
        setPrices(data.prices)
        setLastUpdated(new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit", minute: "2-digit",
        }))
      } else {
        throw new Error("EMPTY_PRICE_DATA")
      }
    } catch (err) {
      console.error("Failed to fetch prices:", err)
      setError("Giá thị trường đang tạm ngưng cập nhật")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrices()
    const interval = setInterval(fetchPrices, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      border: "1px solid #e2e8f0", borderRadius: "12px",
      overflow: "hidden", marginBottom: "16px",
    }}>
      {/* Header — font Roboto */}
      <div style={{
        padding: "10px 14px", background: "#0A1628",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{
          fontSize: "11px", fontWeight: 700,
          fontFamily: "'Roboto', 'DM Sans', sans-serif",
          color: "rgba(255,255,255,0.85)",
          textTransform: "uppercase", letterSpacing: "0.1em",
        }}>Giá thị trường</span>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {lastUpdated && (
            <span style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.5)",
              fontFamily: "'Roboto', sans-serif",
            }}>{lastUpdated}</span>
          )}
          <span style={{
            width: "7px", height: "7px", borderRadius: "50%",
            background: loading ? "#94a3b8" : error ? "#f59e0b" : "#00C389",
            display: "inline-block",
            boxShadow: loading ? "none" : error ? "0 0 6px rgba(245,158,11,.75)" : "0 0 6px #00C389",
          }} />
        </div>
      </div>

      {/* Loading skeleton */}
      {loading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 14px",
            borderBottom: i < 4 ? "1px solid #f1f5f9" : "none",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <div style={{ width: "60px", height: "12px", background: "#f1f5f9", borderRadius: "4px" }} />
              <div style={{ width: "40px", height: "9px", background: "#f8fafc", borderRadius: "4px" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "flex-end" }}>
              <div style={{ width: "70px", height: "14px", background: "#f1f5f9", borderRadius: "4px" }} />
              <div style={{ width: "45px", height: "10px", background: "#f8fafc", borderRadius: "4px" }} />
            </div>
          </div>
        ))
      ) : error ? (
        <div style={{
          padding: "18px 16px",
          background: "linear-gradient(135deg, #fff 0%, #fffbeb 100%)",
          borderTop: "1px solid #fef3c7",
        }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "#fff7ed", color: "#f59e0b",
            border: "1px solid #fed7aa", marginBottom: "10px",
          }}>
            <i className="ti ti-wifi-off" style={{ fontSize: "17px" }} />
          </div>
          <div style={{
            fontSize: "13px", fontWeight: 700, color: "#0A1628",
            fontFamily: "'Roboto', 'DM Sans', sans-serif", marginBottom: "5px",
          }}>
            Tạm thời chưa có dữ liệu giá
          </div>
          <div style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.5, marginBottom: "12px" }}>
            Hệ thống sẽ tự cập nhật lại sau ít phút. Bạn cũng có thể thử tải lại ngay.
          </div>
          <button
            type="button"
            onClick={() => {
              setLoading(true)
              fetchPrices()
            }}
            style={{
              height: "32px", padding: "0 12px", borderRadius: "8px",
              border: "1px solid #fcd34d", background: "#fff",
              color: "#92400e", fontSize: "12px", fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Thử lại
          </button>
        </div>
      ) : (
        prices.map((p, idx) => (
          <div key={p.name} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 14px",
            borderBottom: idx < prices.length - 1 ? "1px solid #f1f5f9" : "none",
            cursor: "pointer", transition: "background 0.15s",
          }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#f8fafc")}
            onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div>
              <div style={{
                fontSize: "13px", fontWeight: 700, color: "#0A1628",
                letterSpacing: "0.02em",
                fontFamily: "'Roboto', 'DM Sans', sans-serif",
              }}>{p.name}</div>
              <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "2px" }}>{p.sub}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontSize: "15px", fontWeight: 700, color: "#0A1628",
                letterSpacing: "-0.5px",
                fontFamily: "'Roboto', 'DM Sans', sans-serif",
              }}>{p.price}</div>
              <div style={{
                fontSize: "11px", fontWeight: 600, marginTop: "1px",
                color: p.up ? "#16a34a" : "#dc2626",
              }}>
                {p.up ? "▲" : "▼"} {p.change}
              </div>
            </div>
          </div>
        ))
      )}
      {/* Footer ẩn */}
    </div>
  )
}
