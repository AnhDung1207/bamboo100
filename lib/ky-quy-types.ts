import type { KyQuyGroup } from "./ky-quy-data"

// Kiểu dữ liệu dùng chung giữa API xem trước (server) và trang admin (client)

export type PreviewRow = {
  ma: string
  ten: string
  nhom: KyQuyGroup | null
  san: string
  toChuc: number
  caNhan: number
  status: "changed" | "unchanged" | "new"
  oldToChuc: number | null
  oldCaNhan: number | null
  pctToChuc: number | null
  pctCaNhan: number | null
  flagged: boolean
  canAdd: boolean
}

export type PreviewResponse = {
  fileName: string
  effectiveDate: string | null
  rows: PreviewRow[]
  missing: { ma: string; ten: string }[]
  warnings: string[]
}
