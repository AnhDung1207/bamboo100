"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function ArticleActions({
  articleId,
  articleSlug,
}: {
  articleId: string
  articleSlug: string
}) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    await supabase.from("articles").delete().eq("id", articleId)
    setLoading(false)
    setShowConfirm(false)
    router.refresh()
  }

  if (showConfirm) {
    return (
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>

        <button
          onClick={handleDelete}
          disabled={loading}
          style={{
            padding: "4px 8px", borderRadius: "5px",
            background: "#DC2626", border: "none",
            color: "#fff", fontSize: "11px", cursor: "pointer",
          }}
        >{loading ? "..." : "Xóa"}</button>
        <button
          onClick={() => setShowConfirm(false)}
          style={{
            padding: "4px 8px", borderRadius: "5px",
            background: "#f1f5f9", border: "0.5px solid #e2e8f0",
            color: "#64748b", fontSize: "11px", cursor: "pointer",
          }}
        >Hủy</button>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", gap: "6px" }}>
      {/* Sửa */}
      <Link href={`/admin/bai-viet/${articleId}`} style={{
        display: "flex", alignItems: "center", gap: "4px",
        padding: "5px 10px", borderRadius: "6px",
        background: "#f8fafc", border: "0.5px solid #e2e8f0",
        color: "#64748b", textDecoration: "none", fontSize: "11px",
        fontWeight: 500,
      }}>
        <i className="ti ti-edit" style={{ fontSize: "12px" }} aria-hidden="true"></i>
        Sửa
      </Link>

      {/* Xem */}
      <Link href={`/phan-tich/${articleSlug}`} target="_blank" style={{
        display: "flex", alignItems: "center",
        padding: "5px 8px", borderRadius: "6px",
        background: "#f8fafc", border: "0.5px solid #e2e8f0",
        color: "#64748b", textDecoration: "none",
      }}>
        <i className="ti ti-external-link" style={{ fontSize: "12px" }} aria-hidden="true"></i>
      </Link>

      {/* Xóa */}
      <button
        onClick={() => setShowConfirm(true)}
        style={{
          display: "flex", alignItems: "center",
          padding: "5px 8px", borderRadius: "6px",
          background: "#FEF2F2", border: "0.5px solid #FECACA",
          color: "#DC2626", cursor: "pointer",
        }}
      >
        <i className="ti ti-trash" style={{ fontSize: "12px" }} aria-hidden="true"></i>
      </button>
    </div>
  )
}
