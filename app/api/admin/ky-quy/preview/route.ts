import { NextResponse } from "next/server"
import { requireStaff } from "@/lib/ky-quy-auth"
import { createAdminClient } from "@/lib/supabase/admin"
import { parseUpload } from "@/lib/ky-quy-import"
import type { PreviewResponse, PreviewRow } from "@/lib/ky-quy-types"

export const runtime = "nodejs"

const MAX_BYTES = 5 * 1024 * 1024
const FLAG_PERCENT = 30 // lệch quá 30% so với số hiện tại thì cảnh báo

const pct = (oldV: number, newV: number) => (oldV > 0 ? ((newV - oldV) / oldV) * 100 : null)

export async function POST(req: Request) {
  const staff = await requireStaff()
  if (!staff) return NextResponse.json({ error: "Bạn không có quyền thực hiện thao tác này." }, { status: 403 })

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: "Dữ liệu tải lên không hợp lệ." }, { status: 400 })
  }

  const file = form.get("file")
  if (!(file instanceof File)) return NextResponse.json({ error: "Chưa chọn file." }, { status: 400 })
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File quá lớn (tối đa 5MB)." }, { status: 413 })

  let parsed
  try {
    parsed = await parseUpload(file.name, await file.arrayBuffer())
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Không đọc được file." }, { status: 422 })
  }
  if (parsed.items.length === 0) {
    return NextResponse.json({ error: "Không có dòng sản phẩm hợp lệ nào trong file." }, { status: 422 })
  }

  const admin = createAdminClient()
  const { data: current, error } = await admin
    .from("ky_quy_products")
    .select("ma, ten, to_chuc, ca_nhan")
  if (error) return NextResponse.json({ error: "Không đọc được dữ liệu hiện tại: " + error.message }, { status: 500 })

  const byMa = new Map((current ?? []).map((r) => [r.ma as string, r]))
  const warnings = [...parsed.warnings]
  const rows: PreviewRow[] = []

  for (const it of parsed.items) {
    const old = byMa.get(it.ma)

    if (!old) {
      const canAdd = !!(it.ten && it.nhom && it.san)
      if (!canAdd) warnings.push(`Mã ${it.ma} chưa có trên web và file thiếu tên/nhóm/sở giao dịch nên không thể thêm tự động.`)
      rows.push({ ...it, status: "new", oldToChuc: null, oldCaNhan: null, pctToChuc: null, pctCaNhan: null, flagged: false, canAdd })
      continue
    }

    const oldToChuc = Number(old.to_chuc)
    const oldCaNhan = Number(old.ca_nhan)
    const changed = oldToChuc !== it.toChuc || oldCaNhan !== it.caNhan
    const pctToChuc = pct(oldToChuc, it.toChuc)
    const pctCaNhan = pct(oldCaNhan, it.caNhan)
    const flagged = Math.max(Math.abs(pctToChuc ?? 0), Math.abs(pctCaNhan ?? 0)) > FLAG_PERCENT

    rows.push({
      ma: it.ma,
      ten: old.ten as string, // giữ tên đang dùng trên web
      nhom: it.nhom,
      san: it.san,
      toChuc: it.toChuc,
      caNhan: it.caNhan,
      status: changed ? "changed" : "unchanged",
      oldToChuc,
      oldCaNhan,
      pctToChuc,
      pctCaNhan,
      flagged,
      canAdd: false,
    })
  }

  const inFile = new Set(parsed.items.map((i) => i.ma))
  const missing = (current ?? [])
    .filter((r) => !inFile.has(r.ma as string))
    .map((r) => ({ ma: r.ma as string, ten: r.ten as string }))

  if (parsed.items.length < 10) {
    warnings.push(`Chỉ đọc được ${parsed.items.length} sản phẩm từ file — hãy kiểm tra lại đây có đúng file đầy đủ không.`)
  }

  const body: PreviewResponse = { fileName: file.name, effectiveDate: parsed.effectiveDate, rows, missing, warnings }
  return NextResponse.json(body)
}
