// Đọc số liệu ký quỹ từ Supabase cho trang công khai /dich-vu/ky-quy.
// Nếu Supabase lỗi hoặc bảng trống → tự dùng dữ liệu dự phòng trong ky-quy-data.ts, trang không bao giờ bị trắng.

import { createClient } from "@supabase/supabase-js"
import {
  KY_QUY_DATA,
  KY_QUY_EFFECTIVE_DATE,
  type KyQuyGroup,
  type KyQuyItem,
} from "./ky-quy-data"

export type KyQuyResult = {
  items: KyQuyItem[]
  effectiveDate: string
  source: "database" | "fallback"
}

// Thứ tự hiển thị các nhóm trong bảng "Tất cả"
const GROUP_RANK: Record<KyQuyGroup, number> = {
  "nong-san": 0,
  "kim-loai": 1,
  "nang-luong": 2,
  "nguyen-lieu": 3,
}

// "2026-10-02" → "02/10/2026"
function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-")
  return y && m && d ? `${d}/${m}/${y}` : iso
}

export async function getKyQuyData(): Promise<KyQuyResult> {
  const fallback: KyQuyResult = {
    items: KY_QUY_DATA,
    effectiveDate: KY_QUY_EFFECTIVE_DATE,
    source: "fallback",
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return fallback

  try {
    // Client không dùng cookie → trang có thể cache (ISR) thay vì render lại mỗi lượt xem
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const [productsRes, metaRes] = await Promise.all([
      supabase.from("ky_quy_products").select("ma, ten, nhom, san, to_chuc, ca_nhan, sort_order"),
      supabase.from("ky_quy_meta").select("effective_date").eq("id", 1).maybeSingle(),
    ])

    if (productsRes.error) throw productsRes.error
    const rows = productsRes.data ?? []
    if (rows.length === 0) throw new Error("Bảng ky_quy_products đang trống")

    const items: KyQuyItem[] = rows
      .filter((r) => r.nhom in GROUP_RANK)
      .sort(
        (a, b) =>
          GROUP_RANK[a.nhom as KyQuyGroup] - GROUP_RANK[b.nhom as KyQuyGroup] ||
          a.sort_order - b.sort_order
      )
      .map((r) => ({
        ma: r.ma,
        ten: r.ten,
        nhom: r.nhom as KyQuyGroup,
        san: r.san,
        toChuc: Number(r.to_chuc),
        caNhan: Number(r.ca_nhan),
      }))

    const iso = metaRes.data?.effective_date as string | null | undefined
    return {
      items,
      effectiveDate: iso ? formatDate(iso) : KY_QUY_EFFECTIVE_DATE,
      source: "database",
    }
  } catch (err) {
    console.error("[ky-quy] Không đọc được Supabase, dùng dữ liệu dự phòng:", err)
    return fallback
  }
}
