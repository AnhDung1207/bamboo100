"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const STATUS_OPTIONS = [
  { value: "new",        label: "Mới" },
  { value: "processing", label: "Đang xử lý" },
  { value: "converted",  label: "Đã chốt" },
  { value: "closed",     label: "Đóng" },
]

export default function LeadActions({
  leadId,
  currentStatus,
}: {
  leadId: string
  currentStatus: string
}) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return
    setLoading(true)
    await supabase.from("leads").update({ status: newStatus }).eq("id", leadId)
    setLoading(false)
    router.refresh()
  }

  const handleDelete = async () => {
    setLoading(true)
    await supabase.from("leads").delete().eq("id", leadId)
    setLoading(false)
    setShowDelete(false)
    router.refresh()
  }

  return (
    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
      {/* Dropdown đổi trạng thái */}
      <select
        value={currentStatus}
        onChange={(e) => handleStatusChange(e.target.value)}
        disabled={loading}
        style={{
          padding: "5px 8px", borderRadius: "6px",
          border: "0.5px solid #e2e8f0", fontSize: "11px",
          color: "#0A1628", background: "#fff", outline: "none",
          cursor: "pointer",
        }}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {/* Xóa */}
      {!showDelete ? (
        <button
          onClick={() => setShowDelete(true)}
          style={{
            width: "28px", height: "28px", borderRadius: "6px",
            background: "#FEF2F2", border: "0.5px solid #FECACA",
            color: "#DC2626", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <i className="ti ti-trash" style={{ fontSize: "13px" }} aria-hidden="true"></i>
        </button>
      ) : (
        <div style={{ display: "flex", gap: "4px" }}>
          <button
            onClick={handleDelete}
            disabled={loading}
            style={{
              padding: "4px 8px", borderRadius: "5px",
              background: "#DC2626", border: "none",
              color: "#fff", fontSize: "11px", cursor: "pointer",
            }}
          >Xóa</button>
          <button
            onClick={() => setShowDelete(false)}
            style={{
              padding: "4px 8px", borderRadius: "5px",
              background: "#f1f5f9", border: "0.5px solid #e2e8f0",
              color: "#64748b", fontSize: "11px", cursor: "pointer",
            }}
          >Hủy</button>
        </div>
      )}
    </div>
  )
}
