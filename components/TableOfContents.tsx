"use client"
import { useEffect } from "react"

export default function TableOfContents() {
  useEffect(() => {
    const content = document.querySelector('.article-content')
    const toc = document.getElementById('toc-container')
    const tocBox = document.getElementById('toc-box')
    if (!content || !toc) return

    const headings = Array.from(content.querySelectorAll('h2, h3')) as HTMLElement[]
    if (headings.length === 0) {
      if (tocBox) tocBox.style.display = 'none'
      return
    }

    toc.innerHTML = ''

    // Gán id và tạo link
    headings.forEach((h, i) => {
      h.id = 'heading-' + i
    })

    headings.forEach((h, i) => {
      const a = document.createElement('a')
      a.href = '#heading-' + i
      a.textContent = h.textContent
      a.className = 'toc-link' + (h.tagName === 'H3' ? ' toc-link-h3' : '')

      a.addEventListener('click', function(e) {
        e.preventDefault()
        const id = 'heading-' + i
        const target = document.getElementById(id)
        if (!target) return
        const top = target.getBoundingClientRect().top + window.pageYOffset - 90
        window.scrollTo({ top: top, behavior: 'smooth' })
      })

      toc.appendChild(a)
    })

    // Active highlight on scroll
    const links = Array.from(toc.querySelectorAll('a')) as HTMLElement[]

    const onScroll = () => {
      let current = 0
      headings.forEach((h, i) => {
        const rect = h.getBoundingClientRect()
        if (rect.top <= 100) current = i
      })
      links.forEach((a, i) => {
        if (i === current) a.classList.add('active')
        else a.classList.remove('active')
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // Ẩn/hiện mục lục theo scroll
    const handleScroll = () => {
      if (tocBox) {
        tocBox.style.opacity = window.scrollY > 400 ? '1' : '0'
        tocBox.style.visibility = window.scrollY > 400 ? 'visible' : 'hidden'
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div
      id="toc-box"
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "16px",
        maxHeight: "calc(100vh - 120px)",
        overflowY: "auto",
        opacity: 0,
        visibility: "hidden",
        transition: "opacity 0.2s",
        pointerEvents: "auto",
      }}
    >
      <h4 style={{ fontSize: "12px", fontWeight: 600, color: "#0A1628", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        <i className="ti ti-list" style={{ fontSize: "14px", color: "#00C389" }} />
        Mục lục
      </h4>
      <div id="toc-container" style={{ display: "flex", flexDirection: "column", gap: "2px" }} />
    </div>
  )
}
