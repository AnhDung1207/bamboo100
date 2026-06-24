"use client"

import { useEffect } from "react"

const VIEW_TTL_MS = 12 * 60 * 60 * 1000

export default function ArticleViewTracker({ articleId }: { articleId: string }) {
  useEffect(() => {
    if (!articleId) return

    const storageKey = `bamboo100:article-view:${articleId}`
    const now = Date.now()

    try {
      const lastViewedAt = Number(window.localStorage.getItem(storageKey) || 0)
      if (lastViewedAt && now - lastViewedAt < VIEW_TTL_MS) return
      window.localStorage.setItem(storageKey, String(now))
    } catch {
      // Nếu localStorage bị chặn, vẫn ghi nhận view một cách im lặng.
    }

    fetch("/api/articles/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId }),
      keepalive: true,
    }).catch(() => {
      try {
        window.localStorage.removeItem(storageKey)
      } catch {}
    })
  }, [articleId])

  return null
}
