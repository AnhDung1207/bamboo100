import type { Metadata } from "next"
import Navbar from "@/components/Navbar"
import COTDashboard from "@/components/COTDashboard"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Báo cáo COT | BAMBOO100",
  description: "Dữ liệu Disaggregated Commitments of Traders từ CFTC: vị thế Managed Money trên các thị trường hàng hóa.",
  openGraph: {
    title: "Báo cáo COT | BAMBOO100",
    description: "Vị thế Managed Money — Futures & Options Combined — từ CFTC.",
    url: "https://bamboo100.vn/dich-vu/bao-cao-cot",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "COT Dashboard BAMBOO100" }],
  },
  alternates: { canonical: "https://bamboo100.vn/dich-vu/bao-cao-cot" },
}

export default async function BaoCaoCOTPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <Navbar />
      <COTDashboard isLocked={!user} />
    </div>
  )
}
