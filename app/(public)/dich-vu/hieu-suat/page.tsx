import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"
import Navbar from "@/components/Navbar"
import TradingDashboard from "@/components/TradingDashboard"

export const metadata: Metadata = {
  title: "Dashboard hiệu suất đầu tư | BAMBOO100",
  description: "Dashboard thống kê hiệu suất đầu tư của BAMBOO100 — minh bạch, rõ ràng và cập nhật liên tục.",
  openGraph: {
    title: "Dashboard hiệu suất đầu tư | BAMBOO100",
    description: "Dashboard thống kê hiệu suất đầu tư của BAMBOO100.",
    url: "https://bamboo100.vn/dich-vu/hieu-suat",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "BAMBOO100 Trading Dashboard" }],
  },
  alternates: { canonical: "https://bamboo100.vn/dich-vu/hieu-suat" },
}

export default async function HieuSuatPage() {
  const supabase = await createClient()
  const { data: trades } = await supabase
    .from("trades")
    .select("*")
    .eq("trader", "NAEM")
    .order("exit_date", { ascending: true })
    .order("exit_time", { ascending: true })

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <Navbar />
      <TradingDashboard trades={trades || []} />
    </div>
  )
}
