import { getKyQuyData } from "@/lib/ky-quy-db"
import KyQuyClient from "./KyQuyClient"

// Số liệu được làm mới ngay khi admin bấm "Xác nhận" (revalidatePath).
// Con số 3600 giây chỉ là lớp dự phòng.
export const revalidate = 3600

export default async function KyQuyPage() {
  const { items, effectiveDate } = await getKyQuyData()
  return <KyQuyClient items={items} effectiveDate={effectiveDate} />
}
