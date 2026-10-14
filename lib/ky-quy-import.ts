// Đọc file Excel (.xlsx) hoặc CSV "Danh sách hàng hóa" của MXV và lấy ra các cột cần thiết.
// Tìm cột theo TÊN TIÊU ĐỀ (không theo vị trí), nên MXV thêm/bớt cột khác trong file vẫn đọc được.

import ExcelJS from "exceljs"
import type { KyQuyGroup } from "./ky-quy-data"

export type ImportedItem = {
  ma: string
  ten: string
  nhom: KyQuyGroup | null
  san: string
  toChuc: number
  caNhan: number
}

export type ParseResult = {
  items: ImportedItem[]
  effectiveDate: string | null // "YYYY-MM-DD"
  warnings: string[]
}

type Cell = string | number | null

// Bỏ dấu, hạ chữ thường, gộp khoảng trắng/xuống dòng: "Mức ký quỹ\n ban đầu" → "muc ky quy ban dau"
const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()

function toGroup(raw: string): KyQuyGroup | null {
  const s = norm(raw)
  if (s.includes("nong")) return "nong-san"
  if (s.includes("kim")) return "kim-loai"
  if (s.includes("nang")) return "nang-luong"
  if (s.includes("nguyen")) return "nguyen-lieu"
  return null
}

function toCell(v: unknown): Cell {
  if (v == null) return null
  if (typeof v === "number" || typeof v === "string") return v
  if (typeof v === "boolean") return String(v)
  if (typeof v === "object" && !(v instanceof Date)) {
    const o = v as Record<string, unknown>
    if ("result" in o) return toCell(o.result) // ô công thức
    if (Array.isArray(o.richText)) return (o.richText as { text: string }[]).map((t) => t.text).join("")
    if ("text" in o) return toCell(o.text) // liên kết
  }
  return null
}

// 58449600 | "58.449.600" | "58,449,600" | "58449600.0" → 58449600
function toNumber(c: Cell): number | null {
  if (c == null) return null
  if (typeof c === "number") return Number.isFinite(c) ? Math.round(c) : null
  const s = c.trim()
  if (!s) return null
  if (/^\d{1,3}(\.\d{3})+$/.test(s)) return Number(s.replace(/\./g, ""))
  if (/^\d+(\.\d+)?$/.test(s)) return Math.round(Number(s))
  const digits = s.replace(/[^\d]/g, "")
  return digits ? Number(digits) : null
}

function parseCsv(text: string): Cell[][] {
  const rows: Cell[][] = []
  let row: string[] = []
  let cell = ""
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cell += '"'
          i++
        } else inQuotes = false
      } else cell += c
    } else if (c === '"') inQuotes = true
    else if (c === "," || c === ";") {
      row.push(cell)
      cell = ""
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++
      row.push(cell)
      rows.push(row)
      row = []
      cell = ""
    } else cell += c
  }
  if (cell !== "" || row.length > 0) {
    row.push(cell)
    rows.push(row)
  }
  return rows
}

function findEffectiveDate(rows: Cell[][]): string | null {
  for (const row of rows.slice(0, 5)) {
    for (const c of row) {
      if (typeof c !== "string") continue
      const m = c.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
      if (m && norm(c).includes("hieu luc")) {
        return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`
      }
    }
  }
  return null
}

function extractFromRows(rows: Cell[][]): ParseResult | null {
  // 1) Tìm dòng tiêu đề (trong 20 dòng đầu)
  let headerIdx = -1
  let col = { code: -1, name: -1, exch: -1, group: -1, org: -1, per: -1 }

  for (let i = 0; i < Math.min(rows.length, 20); i++) {
    const heads = (rows[i] ?? []).map((c) => (typeof c === "string" ? norm(c) : ""))
    const code = heads.findIndex((h) => h === "ma hang hoa" || h === "ma")
    const org = heads.findIndex(
      (h) =>
        (h.includes("ky quy") && h.includes("ban dau") && h.includes("vnd")) ||
        h.includes("ky quy to chuc")
    )
    const per = heads.findIndex(
      (h) =>
        (h.includes("ky quy") && h.includes("giao dich") && !h.includes("usd")) ||
        h.includes("ky quy ca nhan")
    )
    if (code >= 0 && org >= 0 && per >= 0) {
      headerIdx = i
      col = {
        code,
        org,
        per,
        name: heads.findIndex((h) => h === "ten hang hoa" || h === "ten"),
        exch: heads.findIndex((h) => h.startsWith("so giao dich") || h === "so gd"),
        group: heads.findIndex((h) => h.startsWith("nhom")),
      }
      break
    }
  }
  if (headerIdx < 0) return null

  // 2) Đọc từng dòng dữ liệu
  const warnings: string[] = []
  const items: ImportedItem[] = []
  const seen = new Set<string>()
  let currentGroup: KyQuyGroup | null = null

  for (let j = headerIdx + 1; j < rows.length; j++) {
    const row = rows[j] ?? []

    const firstCell = typeof row[0] === "string" ? norm(row[0]) : ""
    if (firstCell.startsWith("bang ky hieu")) break // hết phần danh sách hàng hóa

    if (col.group >= 0 && typeof row[col.group] === "string") {
      const g = toGroup(row[col.group] as string)
      if (g) currentGroup = g
    }

    const rawCode = row[col.code]
    const ma = (typeof rawCode === "number" ? String(rawCode) : (rawCode ?? "")).toString().trim().toUpperCase()
    if (!/^[A-Z0-9]{2,10}$/.test(ma)) continue

    const toChuc = toNumber(row[col.org] ?? null)
    const caNhan = toNumber(row[col.per] ?? null)
    if (!toChuc || !caNhan || toChuc <= 0 || caNhan <= 0) continue

    if (seen.has(ma)) {
      warnings.push(`Mã ${ma} xuất hiện nhiều lần trong file — chỉ lấy dòng đầu tiên.`)
      continue
    }
    seen.add(ma)

    items.push({
      ma,
      ten: col.name >= 0 ? String(row[col.name] ?? "").trim() : "",
      nhom: currentGroup,
      san: col.exch >= 0 ? String(row[col.exch] ?? "").trim() : "",
      toChuc,
      caNhan,
    })
  }

  return { items, effectiveDate: findEffectiveDate(rows), warnings }
}

export async function parseUpload(fileName: string, data: ArrayBuffer): Promise<ParseResult> {
  const lower = fileName.toLowerCase()
  let sheets: Cell[][][] = []

  if (lower.endsWith(".csv")) {
    const text = new TextDecoder("utf-8").decode(data).replace(/^\uFEFF/, "")
    sheets = [parseCsv(text)]
  } else if (lower.endsWith(".xlsx")) {
    const wb = new ExcelJS.Workbook()
    // exceljs khai báo kiểu Buffer cũ nên cần ép kiểu để TypeScript không báo lỗi
    await wb.xlsx.load(Buffer.from(data) as unknown as Parameters<typeof wb.xlsx.load>[0])
    sheets = wb.worksheets.map((ws) => {
      const rows: Cell[][] = []
      ws.eachRow({ includeEmpty: true }, (row) => {
        rows[row.number - 1] = Array.from((row.values as unknown[]).slice(1), toCell)
      })
      return Array.from(rows, (r) => r ?? [])
    })
  } else {
    throw new Error("Chỉ hỗ trợ file Excel (.xlsx) hoặc CSV (.csv). Nếu file của bạn là .xls, hãy mở bằng Excel và lưu lại thành .xlsx.")
  }

  for (const rows of sheets) {
    const result = extractFromRows(rows)
    if (result) return result
  }
  throw new Error(
    "Không tìm thấy các cột cần thiết (Mã hàng hóa, Mức ký quỹ ban đầu (VND), Mức ký quỹ giao dịch). Hãy kiểm tra đây có đúng file “Danh sách hàng hóa” của MXV không."
  )
}
