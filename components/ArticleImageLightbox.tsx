"use client"

import { useEffect, useRef, useState } from "react"

const MIN_SCALE = 1
const MAX_SCALE = 6

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function distance(a: { clientX: number; clientY: number }, b: { clientX: number; clientY: number }) {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
}

export default function ArticleImageLightbox() {
  const [src, setSrc] = useState("")
  const [alt, setAlt] = useState("Ảnh bài viết")
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const dragRef = useRef({ active: false, startX: 0, startY: 0, x: 0, y: 0 })
  const pinchRef = useRef({ active: false, startDistance: 0, startScale: 1 })
  const lastTapRef = useRef(0)

  const isOpen = Boolean(src)

  const resetView = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const close = () => {
    setSrc("")
    resetView()
  }

  const zoomBy = (delta: number) => {
    setScale((current) => {
      const next = clamp(Number((current + delta).toFixed(2)), MIN_SCALE, MAX_SCALE)
      if (next === 1) setPosition({ x: 0, y: 0 })
      return next
    })
  }

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const image = target?.closest(".article-content img") as HTMLImageElement | null

      if (!image?.src) return

      event.preventDefault()
      setSrc(image.src)
      setAlt(image.alt || "Ảnh bài viết")
      resetView()
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close()
      if (event.key === "+" || event.key === "=") zoomBy(0.4)
      if (event.key === "-") zoomBy(-0.4)
      if (event.key === "0") resetView()
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault()
    zoomBy(event.deltaY > 0 ? -0.28 : 0.28)
  }

  const startDrag = (clientX: number, clientY: number) => {
    if (scale <= 1) return
    dragRef.current = {
      active: true,
      startX: clientX,
      startY: clientY,
      x: position.x,
      y: position.y,
    }
    setIsDragging(true)
  }

  const moveDrag = (clientX: number, clientY: number) => {
    if (!dragRef.current.active || scale <= 1) return

    const maxOffset = Math.max(120, (scale - 1) * 260)
    const nextX = clamp(dragRef.current.x + clientX - dragRef.current.startX, -maxOffset, maxOffset)
    const nextY = clamp(dragRef.current.y + clientY - dragRef.current.startY, -maxOffset, maxOffset)

    setPosition({ x: nextX, y: nextY })
  }

  const stopDrag = () => {
    dragRef.current.active = false
    setIsDragging(false)
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2) {
      pinchRef.current = {
        active: true,
        startDistance: distance(event.touches[0], event.touches[1]),
        startScale: scale,
      }
      stopDrag()
      return
    }

    if (event.touches.length === 1) {
      const now = Date.now()

      if (now - lastTapRef.current < 260) {
        setScale((current) => {
          const next = current > 1 ? 1 : 2.4
          if (next === 1) setPosition({ x: 0, y: 0 })
          return next
        })
      }

      lastTapRef.current = now
      startDrag(event.touches[0].clientX, event.touches[0].clientY)
    }
  }

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2 && pinchRef.current.active) {
      event.preventDefault()
      const nextDistance = distance(event.touches[0], event.touches[1])
      const nextScale = clamp(
        pinchRef.current.startScale * (nextDistance / pinchRef.current.startDistance),
        MIN_SCALE,
        MAX_SCALE,
      )

      setScale(nextScale)
      if (nextScale === 1) setPosition({ x: 0, y: 0 })
      return
    }

    if (event.touches.length === 1) {
      event.preventDefault()
      moveDrag(event.touches[0].clientX, event.touches[0].clientY)
    }
  }

  if (!isOpen) {
    return (
      <style>{`
        .article-content img {
          cursor: zoom-in;
          transition: opacity 0.15s, transform 0.15s;
          border-radius: 8px;
          margin: 16px 0;
          max-width: 100%;
        }
        .article-content img:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
      `}</style>
    )
  }

  return (
    <>
      <style>{`
        .article-content img {
          cursor: zoom-in;
          transition: opacity 0.15s, transform 0.15s;
          border-radius: 8px;
          margin: 16px 0;
          max-width: 100%;
        }
        .article-content img:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .article-lightbox {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(3, 7, 18, 0.94);
          backdrop-filter: blur(10px);
          touch-action: none;
        }
        .article-lightbox-image {
          max-width: 90vw;
          max-height: 86vh;
          border-radius: 12px;
          object-fit: contain;
          user-select: none;
          will-change: transform;
          cursor: ${scale > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in"};
          box-shadow: 0 24px 80px rgba(0,0,0,.38);
        }
        .article-lightbox-toolbar {
          position: fixed;
          top: 18px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px;
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 999px;
          background: rgba(15, 23, 42, .72);
          backdrop-filter: blur(16px);
        }
        .article-lightbox-button {
          width: 34px;
          height: 34px;
          border: 0;
          border-radius: 999px;
          background: rgba(255,255,255,.11);
          color: #fff;
          cursor: pointer;
          font-size: 15px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .article-lightbox-button:hover {
          background: rgba(255,255,255,.2);
        }
        .article-lightbox-scale {
          min-width: 48px;
          color: rgba(255,255,255,.74);
          font-size: 11px;
          font-weight: 700;
          text-align: center;
        }
        .article-lightbox-close {
          position: fixed;
          top: 18px;
          right: 20px;
        }
        .article-lightbox-hint {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(15, 23, 42, .66);
          color: rgba(255,255,255,.62);
          font-size: 11px;
          pointer-events: none;
          white-space: nowrap;
        }
        .article-lightbox-mobile-hint { display: none; }
        @media (max-width: 768px) {
          .article-lightbox-toolbar {
            top: auto;
            bottom: 18px;
          }
          .article-lightbox-close {
            top: 14px;
            right: 14px;
          }
          .article-lightbox-image {
            max-width: 94vw;
            max-height: 78vh;
            border-radius: 10px;
          }
          .article-lightbox-hint {
            bottom: 72px;
            font-size: 10px;
          }
          .article-lightbox-desktop-hint { display: none; }
          .article-lightbox-mobile-hint { display: inline; }
        }
      `}</style>

      <div
        className="article-lightbox"
        role="dialog"
        aria-modal="true"
        aria-label="Xem ảnh bài viết"
        onClick={(event) => {
          if (event.target === event.currentTarget) close()
        }}
        onWheel={handleWheel}
        onMouseDown={(event) => startDrag(event.clientX, event.clientY)}
        onMouseMove={(event) => moveDrag(event.clientX, event.clientY)}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onDoubleClick={() => {
          setScale((current) => {
            const next = current > 1 ? 1 : 2.4
            if (next === 1) setPosition({ x: 0, y: 0 })
            return next
          })
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => {
          pinchRef.current.active = false
          stopDrag()
        }}
      >
        <div className="article-lightbox-toolbar">
          <button className="article-lightbox-button" type="button" onClick={() => zoomBy(-0.4)} aria-label="Thu nhỏ">
            −
          </button>
          <button className="article-lightbox-button" type="button" onClick={() => zoomBy(0.4)} aria-label="Phóng to">
            +
          </button>
          <button className="article-lightbox-button" type="button" onClick={resetView} aria-label="Đặt lại">
            1:1
          </button>
          <span className="article-lightbox-scale">{Math.round(scale * 100)}%</span>
        </div>

        <button className="article-lightbox-button article-lightbox-close" type="button" onClick={close} aria-label="Đóng">
          ×
        </button>

        <img
          className="article-lightbox-image"
          src={src}
          alt={alt}
          draggable={false}
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
          }}
        />

        <div className="article-lightbox-hint">
          <span className="article-lightbox-desktop-hint">Cuộn để zoom · Kéo để di chuyển · Esc để đóng</span>
          <span className="article-lightbox-mobile-hint">Chụm/mở 2 ngón để zoom · Chạm đúp để phóng to</span>
        </div>
      </div>
    </>
  )
}
