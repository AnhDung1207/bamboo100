"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"

const SLIDES = [
  {
    key: "phan-tich",
    title: "Phân tích thị trường",
    desc: "Báo cáo định kỳ theo ngành hàng: Năng lượng, Kim loại, Nông sản.",
    cta: "Xem báo cáo mẫu",
    href: "/phan-tich",
    imgSrc: "/services/phan-tich.png",
    imgAlt: "Phân tích thị trường",
    bg: "#f0f0f0",
  },
  {
    key: "tu-van",
    title: "Tư vấn chiến lược 1-1",
    desc: "Cùng chuyên gia xây dựng danh mục và kế hoạch giao dịch cá nhân hóa.",
    cta: "Đặt lịch tư vấn",
    href: "/lien-he#dat-lich",
    imgSrc: "/services/tu-van.png",
    imgAlt: "Tư vấn chiến lược",
    bg: "#f0f0f0",
  },
  {
    key: "dao-tao",
    title: "Đào tạo & học viện",
    desc: "Khóa học từ cơ bản đến nâng cao về phái sinh hàng hóa.",
    cta: "Khám phá khóa học",
    href: "/hoc-vien/khoa-hoc",
    imgSrc: "/services/dao-tao.png",
    imgAlt: "Đào tạo & học viện",
    bg: "#f0f0f0",
  },
  {
    key: "cong-dong",
    title: "Cộng đồng nhà đầu tư",
    desc: "Kết nối với hàng trăm nhà đầu tư cùng chí hướng, chia sẻ kinh nghiệm và cơ hội giao dịch.",
    cta: "Tham gia ngay",
    href: "/cong-dong",
    imgSrc: "/services/cong-dong.png",
    imgAlt: "Cộng đồng nhà đầu tư",
    bg: "#f0f0f0",
  },
]

const N = SLIDES.length
const AUTOPLAY_MS = 3000
const SLIDE_VW_DESKTOP = 70
const SLIDE_VW_MOBILE = 82

// Track layout: [clone_last2, clone_last1, ...SLIDES, clone_first0, clone_first1]
// Real slides start at index 2 in the track
const CLONE_COUNT = 2
const TRACK_OFFSET = CLONE_COUNT // real slide[0] is at track index 2

const TRACK_SLIDES = [
  ...SLIDES.slice(-CLONE_COUNT),   // clones of last 2 at front
  ...SLIDES,                        // real slides
  ...SLIDES.slice(0, CLONE_COUNT),  // clones of first 2 at end
]

export default function ServicesCarousel() {
  // current = real slide index (0..N-1)
  const [current, setCurrent] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isJumping = useRef(false)

  const getContainerOffset = useCallback(() => {
    const vw = window.innerWidth
    if (vw <= 768) {
      // slide 82vw → căn giữa → offset = (100 - 82) / 2 vw = 9vw
      return vw * 0.09
    }
    return Math.max((vw - 1280) / 2, 0) + 40
  }, [])

  // Move track to a specific track index (with or without animation)
  const moveToTrack = useCallback((trackIdx: number, animated: boolean) => {
    if (!trackRef.current) return
    const slide = trackRef.current.querySelector<HTMLDivElement>(".service-slide")
    if (!slide) return
    const slideW = slide.offsetWidth + 16
    const offset = getContainerOffset()
    if (!animated) {
      trackRef.current.style.transition = "none"
    } else {
      trackRef.current.style.transition = "transform 0.5s cubic-bezier(0.4,0,0.2,1)"
    }
    trackRef.current.style.transform = `translateX(calc(${offset}px - ${trackIdx * slideW}px))`
  }, [getContainerOffset])

  const scrollToReal = useCallback((realIdx: number, animated = true) => {
    moveToTrack(realIdx + TRACK_OFFSET, animated)
  }, [moveToTrack])

  const goTo = useCallback((realIdx: number) => {
    setCurrent(realIdx)
    scrollToReal(realIdx)
  }, [scrollToReal])

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % N
        scrollToReal(next)
        return next
      })
    }, AUTOPLAY_MS)
  }, [scrollToReal])

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  // After transition ends: if we're on a clone, jump silently to the real slide
  const handleTransitionEnd = useCallback(() => {
    if (isJumping.current) { isJumping.current = false; return }
    setCurrent((prev) => {
      // We just landed on real index `prev` — check if it matches
      // The track is currently at prev + TRACK_OFFSET, which is always a real slide
      // No jump needed here since we only scroll to real positions
      // But if somehow at clone: handle gracefully
      scrollToReal(prev, false)
      return prev
    })
  }, [scrollToReal])

  useEffect(() => {
    const init = setTimeout(() => {
      scrollToReal(0, false)
      startTimer()
    }, 50)
    return () => { clearTimeout(init); stopTimer() }
  }, [scrollToReal, startTimer, stopTimer])

  useEffect(() => {
    const handleResize = () => {
      setCurrent((prev) => { scrollToReal(prev, false); return prev })
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [scrollToReal])

  return (
    <section
      style={{ background: "#fff", padding: "72px 0", overflow: "hidden" }}
      onMouseEnter={stopTimer}
      onMouseLeave={startTimer}
    >
      {/* Header */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 40px", marginBottom: "28px" }}>
        <p style={{
          fontSize: "11px", fontWeight: 600, color: "#00C389",
          textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px",
        }}>
          Giải pháp
        </p>
        <h2 style={{
          fontSize: "34px", fontWeight: 800, color: "#0A1628",
          letterSpacing: "-0.03em", margin: 0, lineHeight: 1.1,
        }}>
          Dịch vụ dành cho mọi cấp độ
        </h2>
      </div>

      {/* Track */}
      <div style={{ overflow: "hidden", paddingTop: "12px" }}>
        <div
          ref={trackRef}
          style={{ display: "flex", gap: "16px" }}
          onTransitionEnd={handleTransitionEnd}
        >
          {TRACK_SLIDES.map((s, i) => {
            // real index of this track slot (works for both real and clone slides)
            const realIdx = (i - TRACK_OFFSET + N * 10) % N
            const isActive = realIdx === current
            return (
              <div
                key={`${s.key}-${i}`}
                className="service-slide"
                onClick={() => goTo(realIdx)}
                style={{
                  flex: `0 0 ${SLIDE_VW_DESKTOP}vw`,
                  borderRadius: "20px",
                  background: s.bg,
                  overflow: "hidden",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  height: "340px",
                  position: "relative",
                  cursor: !isActive ? "pointer" : "default",
                  opacity: !isActive ? 0.5 : 1,
                  transform: isActive ? "scale(1) translateY(0)" : "scale(0.97) translateY(8px)",
                  transition: "opacity 0.4s, transform 0.4s",
                }}
              >
                {/* Text */}
                <div className="service-slide-text" style={{
                  padding: "32px 40px",
                  display: "flex", flexDirection: "column", justifyContent: "center",
                  position: "relative", zIndex: 1,
                }}>
                  <h3 style={{
                    fontSize: "24px", fontWeight: 800, color: "#0A1628",
                    margin: "0 0 14px", letterSpacing: "-0.02em", lineHeight: 1.2,
                  }}>
                    {s.title}
                  </h3>
                  <p style={{
                    fontSize: "13px", color: "#666",
                    lineHeight: 1.75, margin: "0 0 22px", maxWidth: "220px",
                  }}>
                    {s.desc}
                  </p>
                  <Link href={s.href} style={{
                    fontSize: "13px", fontWeight: 600, color: "#00C389",
                    textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "5px",
                  }}>
                    {s.cta} →
                  </Link>
                </div>

                {/* Visual */}
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <Image
                    src={s.imgSrc}
                    alt={s.imgAlt}
                    fill
                    sizes="(max-width: 768px) 88vw, 40vw"
                    quality={100}
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Dots */}
      <div style={{
        display: "flex", gap: "8px", justifyContent: "center",
        marginTop: "28px", alignItems: "center",
      }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => { goTo(i); startTimer() }}
            style={{
              height: "7px",
              width: current === i ? "28px" : "7px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              background: current === i ? "#0A1628" : "#d1d5db",
              padding: 0,
              transition: "width 0.2s, background 0.2s",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {current === i && (
              <span
                key={current}
                style={{
                  position: "absolute", top: 0, left: 0, height: "100%",
                  background: "#00C389", borderRadius: "4px",
                  animation: `progress ${AUTOPLAY_MS}ms linear forwards`,
                }}
              />
            )}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0% }
          to { width: 100% }
        }
        @media (max-width: 768px) {
          .service-slide {
            flex: 0 0 ${SLIDE_VW_MOBILE}vw !important;
            grid-template-columns: 1fr !important;
            grid-template-rows: auto 240px !important;
            height: auto !important;
          }
          .service-slide-text {
            padding: 24px 24px 20px !important;
          }
        }
      `}</style>
    </section>
  )
}
