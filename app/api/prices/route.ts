import { NextResponse } from "next/server"

export const revalidate = 300

const SYMBOLS = [
  { symbol: "XAU/USD", name: "VÀNG",    sub: "XAU/USD"        },
  { symbol: "XAG/USD", name: "BẠC",     sub: "XAG/USD"        },
  { symbol: "WTI/USD", name: "DẦU WTI", sub: "CRUDE OIL"      },
  { symbol: "COFFEE",  name: "CÀ PHÊ",  sub: "ARABICA · ICE"  },
  { symbol: "COPPER",  name: "ĐỒNG",    sub: "COPPER · COMEX" },
]

export async function GET() {
  try {
    const apiKey = process.env.TWELVE_DATA_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API key" }, { status: 500 })
    }

    // Gọi batch 1 lần — tiết kiệm request
    const symbolList = SYMBOLS.map((s) => s.symbol).join(",")
    const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbolList)}&apikey=${apiKey}`
    const res = await fetch(url, { next: { revalidate: 300 } })
    const data = await res.json()

    const results = SYMBOLS.map((s) => {
      // Batch response trả về object với key là symbol
      const quote = Array.isArray(data) ? null : data[s.symbol] ?? data

      if (!quote || quote.status === "error" || !quote.close) {
        return { name: s.name, sub: s.sub, price: "—", change: "—", up: true }
      }

      const price = parseFloat(quote.close).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })

      const changeVal = parseFloat(quote.percent_change ?? "0")
      const up = changeVal >= 0

      return {
        name: s.name,
        sub: s.sub,
        price,
        change: `${up ? "+" : ""}${changeVal.toFixed(2)}%`,
        up,
      }
    })

    return NextResponse.json({ prices: results })
  } catch (err) {
    console.error("Price fetch error:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
