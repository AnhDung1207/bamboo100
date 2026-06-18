import Image from "next/image"

export default function ZaloButton() {
  return (
    <a
      href="https://zalo.me/0378219712"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Liên hệ qua Zalo"
      title="Liên hệ qua Zalo"
      style={{
        position: "fixed",
        right: "28px",
        bottom: "110px",
        zIndex: 9999,
        width: "60px",
        height: "60px",
        display: "block",
        borderRadius: "50%",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.25)",
      }}
    >
      <Image
        src="/images/IconZalo.svg"
        alt="Liên hệ qua Zalo"
        width={60}
        height={60}
        priority
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
    </a>
  )
}