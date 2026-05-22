import type { Metadata } from "next"
import LienHeClient from "./LienHeClient"

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Liên hệ với BAMBOO100 để được tư vấn chiến lược giao dịch phái sinh hàng hóa miễn phí. Chuyên gia sẽ phản hồi trong vòng 24 giờ.",
  openGraph: {
    title: "Liên hệ | BAMBOO100",
    description: "Liên hệ với BAMBOO100 để được tư vấn chiến lược giao dịch phái sinh hàng hóa miễn phí. Chuyên gia sẽ phản hồi trong vòng 24 giờ.",
    url: "https://bamboo100.vn/lien-he",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Liên hệ BAMBOO100" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Liên hệ | BAMBOO100",
    description: "Liên hệ với BAMBOO100 để được tư vấn chiến lược giao dịch phái sinh hàng hóa miễn phí.",
    images: ["/og-default.jpg"],
  },
  alternates: {
    canonical: "https://bamboo100.vn/lien-he",
  },
}

export default function LienHePage() {
  return <LienHeClient />
}
