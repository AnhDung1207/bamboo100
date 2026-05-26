import Link from "next/link";
import Image from "next/image";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

export default function Footer() {
  return (
    <footer
      style={{ background: "#0A1628", fontFamily: "var(--font-roboto), 'Roboto', sans-serif" }}
      className={`${roboto.variable} text-white mt-auto`}
    >
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Cột 1 — Thương hiệu */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Image src="/o.png" alt="BAMBOO100" width={32} height={32} className="rounded-lg" />
            <span className="font-bold text-lg text-white">BAMBOO100</span>
          </div>
          <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.55)" }}>
            Đối tác đồng hành đáng tin cậy trên thị trường hàng hóa toàn cầu.
            Chúng tôi mang đến định hướng chuyên sâu, tài nguyên học tập thực
            tiễn và giải pháp đầu tư hiệu quả.
          </p>
          <div className="flex gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)" }}
            >
              <i className="ti ti-brand-facebook" style={{ fontSize: "16px" }} />
            </a>
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)" }}
            >
              <i className="ti ti-brand-telegram" style={{ fontSize: "16px" }} />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)" }}
            >
              <i className="ti ti-message-circle" style={{ fontSize: "16px" }} />
            </a>
          </div>
        </div>

        {/* Cột 2 — Liên kết nhanh */}
        <div>
          <h3 className="font-semibold text-sm text-white mb-5">Liên kết nhanh</h3>
          <ul className="space-y-3">
            {[
              { label: "Trang chủ", href: "/" },
              { label: "Tin tức", href: "/phan-tich" },
              { label: "Ebook", href: "/ebook" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm transition-colors hover:text-[#00C389]"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 3 — Dịch vụ */}
        <div>
          <h3 className="font-semibold text-sm text-white mb-5">Dịch vụ của chúng tôi</h3>
          <ul className="space-y-3">
            {[
              { label: "Khóa học giao dịch BAMBOO100", href: "/hoc-vien" },
              { label: "Tư vấn tài chính", href: "/dich-vu" },
              { label: "Báo cáo đầu tư", href: "/phan-tich" },
              { label: "Phân tích thị trường", href: "/phan-tich" },
              { label: "Quản lý danh mục", href: "/dich-vu" },
            ].map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-sm transition-colors hover:text-[#00C389]"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 4 — Liên hệ */}
        <div>
          <h3 className="font-semibold text-sm text-white mb-5">Liên hệ</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <i className="ti ti-mail" style={{ fontSize: "15px", color: "#00C389", flexShrink: 0, marginTop: "2px" }} />
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                daucohanghoa@gmail.com
              </span>
            </li>
            <li className="flex items-start gap-3">
              <i className="ti ti-phone" style={{ fontSize: "15px", color: "#00C389", flexShrink: 0, marginTop: "2px" }} />
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                +84378219712
              </span>
            </li>
            <li className="flex items-start gap-3">
              <i className="ti ti-map-pin" style={{ fontSize: "15px", color: "#00C389", flexShrink: 0, marginTop: "2px" }} />
              <span className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                Tầng 7, số 5B ngõ 55 Huỳnh Thúc Kháng, Đống Đa, Hà Nội
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          © 2026 BAMBOO100. All rights reserved
        </span>
        <div className="flex gap-5">
          {[
            { label: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
            { label: "Điều khoản dịch vụ", href: "/dieu-khoan" },
            { label: "Chính sách cookie", href: "/cookie" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs transition-colors hover:text-[#00C389]"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
