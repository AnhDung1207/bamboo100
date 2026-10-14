import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { requireStaff } from "@/lib/ky-quy-auth"
import { createAdminClient } from "@/lib/supabase/admin"

export const runtime = "nodejs"

const GROUPS = ["nong-san", "kim-loai", "nang-luong", "nguyen-lieu"]
const isMoney = (v: unknown): v is number =>
  typeof v === "number" && Number.isInteger(v) && v > 0 && v < 1e12
const isText = (v: unknown, max = 120): v is string => typeof v === "string" && v.trim().length > 0 && v.length <= max

type Update = { ma: string; toChuc: number; caNhan: number }
type Addition = Update & { ten: string; nhom: string; san: string }

const bad = (msg: string, status = 400) => NextResponse.json({ error: msg }, { status })

export async function POST(req: Request) {
  const staff = await requireStaff()
  if (!staff) return bad("Bạn không có quyền thực hiện thao tác này.", 403)

  let body: { updates?: Update[]; additions?: Addition[]; effectiveDate?: string | null }
  try {
    body = await req.json()
  } catch {
    return bad("Dữ liệu gửi lên không hợp lệ.")
  }

  const updates = body.updates ?? []
  const additions = body.additions ?? []
  const effectiveDate = body.effectiveDate ?? null

  if (!Array.isArray(updates) || !Array.isArray(additions)) return bad("Dữ liệu gửi lên không hợp lệ.")
  if (updates.length + additions.length === 0 && !effectiveDate) return bad("Không có thay đổi nào để lưu.")
  if (updates.length + additions.length > 500) return bad("Quá nhiều dòng trong một lần cập nhật.")

  if (effectiveDate !== null) {
    const ok = typeof effectiveDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(effectiveDate) && !Number.isNaN(Date.parse(effectiveDate))
    if (!ok) return bad("Ngày hiệu lực không hợp lệ.")
  }

  const codes = new Set<string>()
  for (const u of updates) {
    if (!isText(u?.ma, 10) || !isMoney(u.toChuc) || !isMoney(u.caNhan)) return bad("Có dòng cập nhật không hợp lệ.")
    if (codes.has(u.ma)) return bad(`Mã ${u.ma} bị trùng.`)
    codes.add(u.ma)
  }
  for (const a of additions) {
    if (!isText(a?.ma, 10) || !isMoney(a.toChuc) || !isMoney(a.caNhan) || !isText(a.ten) || !isText(a.san, 40) || !GROUPS.includes(a.nhom)) {
      return bad("Có sản phẩm mới không hợp lệ.")
    }
    if (codes.has(a.ma)) return bad(`Mã ${a.ma} bị trùng.`)
    codes.add(a.ma)
  }

  const admin = createAdminClient()
  const { data: current, error: readErr } = await admin
    .from("ky_quy_products")
    .select("ma, ten, nhom, san, sort_order")
  if (readErr) return bad("Không đọc được dữ liệu hiện tại: " + readErr.message, 500)

  const byMa = new Map((current ?? []).map((r) => [r.ma as string, r]))
  const now = new Date().toISOString()
  const payload: Record<string, unknown>[] = []

  // Sản phẩm đã có: chỉ đổi 2 cột ký quỹ, giữ nguyên tên/nhóm/sở/thứ tự
  for (const u of updates) {
    const old = byMa.get(u.ma)
    if (!old) return bad(`Mã ${u.ma} chưa có trên web.`)
    payload.push({ ma: old.ma, ten: old.ten, nhom: old.nhom, san: old.san, sort_order: old.sort_order, to_chuc: u.toChuc, ca_nhan: u.caNhan, updated_at: now })
  }

  // Sản phẩm mới: thêm vào cuối nhóm
  let order = Math.max(0, ...(current ?? []).map((r) => Number(r.sort_order) || 0))
  for (const a of additions) {
    if (byMa.has(a.ma)) return bad(`Mã ${a.ma} đã tồn tại.`)
    payload.push({ ma: a.ma, ten: a.ten.trim(), nhom: a.nhom, san: a.san.trim(), sort_order: ++order, to_chuc: a.toChuc, ca_nhan: a.caNhan, updated_at: now })
  }

  if (payload.length > 0) {
    const { error } = await admin.from("ky_quy_products").upsert(payload, { onConflict: "ma" })
    if (error) return bad("Lưu thất bại: " + error.message, 500)
  }

  const meta: Record<string, unknown> = { id: 1, updated_at: now, updated_by: staff.userId }
  if (effectiveDate) meta.effective_date = effectiveDate
  const { error: metaErr } = await admin.from("ky_quy_meta").upsert(meta, { onConflict: "id" })
  if (metaErr) return bad("Đã lưu số liệu nhưng chưa cập nhật được ngày hiệu lực: " + metaErr.message, 500)

  // Báo cho Next.js làm mới trang công khai ngay lập tức
  revalidatePath("/dich-vu/ky-quy")

  return NextResponse.json({ ok: true, updated: updates.length, added: additions.length })
}
