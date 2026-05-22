import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BAMBOO100 — Phân tích Phái sinh Hàng hóa",
    template: "%s | BAMBOO100",
  },
  description:
    "Nền tảng phân tích chuyên sâu về phái sinh hàng hóa. Dữ liệu cung-cầu thực tế, kịch bản thị trường và tư vấn chiến lược 1-1 dành cho nhà đầu tư cá nhân và doanh nghiệp.",
  keywords: [
    "phái sinh hàng hóa",
    "phân tích thị trường",
    "vàng",
    "dầu thô",
    "cà phê",
    "giao dịch hàng hóa",
    "đầu tư hàng hóa",
    "commodity",
    "futures",
  ],
  authors: [{ name: "BAMBOO100" }],
  creator: "BAMBOO100",
  metadataBase: new URL("https://bamboo100.vn"),
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://bamboo100.vn",
    siteName: "BAMBOO100",
    title: "BAMBOO100 — Phân tích Phái sinh Hàng hóa",
    description:
      "Nền tảng phân tích chuyên sâu về phái sinh hàng hóa. Dữ liệu cung-cầu thực tế, kịch bản thị trường và tư vấn chiến lược 1-1 dành cho nhà đầu tư cá nhân và doanh nghiệp.",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "BAMBOO100 — Phân tích Phái sinh Hàng hóa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BAMBOO100 — Phân tích Phái sinh Hàng hóa",
    description:
      "Nền tảng phân tích chuyên sâu về phái sinh hàng hóa. Dữ liệu cung-cầu thực tế, kịch bản thị trường và tư vấn chiến lược 1-1 dành cho nhà đầu tư cá nhân và doanh nghiệp.",
    images: ["/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${roboto.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font-roboto), 'Roboto', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
