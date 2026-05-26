"use client"
import { useEffect } from "react"

export default function TableOfContents() {
  useEffect(() => {
    const content = document.querySelector('.article-content')
    const toc = document.getElementById('toc-container')
    if (!content || !toc) return

    const headings = content.querySelectorAll('h2, h3')
    if (headings.length === 0) {
      const tocBox = document.getElementById('toc-box')
      if (tocBox) tocBox.style.display = 'none'
      return
    }

    toc.innerHTML = ''
    headings.forEach((h, i) => {
      const heading = h as HTMLElement
      heading.id = 'heading-' + i
      const a = document.createElement('a')
      a.href = '#heading-' + i
      a.textContent = h.textContent
      a.className = 'toc-link' + (h.tagName === 'H3' ? ' toc-link-h3' : '')
      a.addEventListener('click', (e) => {
        e.preventDefault()
        const target = document.getElementById('heading-' + i)
        if (!target) return
        const top = target.getBoundingClientRect().top + window.pageYOffset - 90
        window.scrollTo({ top, behavior: 'smooth' })
      })
      toc.appendChild(a)
    })

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = toc.querySelector(`a[href="#${entry.target.id}"]`)
        if (link && entry.isIntersecting) {
          toc.querySelectorAll('a').forEach((a) => a.classList.remove('active'))
          link.classList.add('active')
        }
      })
    }, { rootMargin: '-90px 0px -60% 0px' })

    headings.forEach((h) => observer.observe(h))
    return () => observer.disconnect()
  }, [])

  return (
    <div id="toc-box" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px", maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}>
      <h4 style={{ fontSize: "12px", fontWeight: 600, color: "#0A1628", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        <i className="ti ti-list" style={{ fontSize: "14px", color: "#00C389" }} />
        Mục lục
      </h4>
      <div id="toc-container" style={{ display: "flex", flexDirection: "column", gap: "2px" }} />
    </div>
  )
}
