"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const ROLE_OPTIONS = [
  { value: "member", label: "Member" },
  { value: "editor", label: "Editor" },
  { value: "admin",  label: "Admin"  },
]

export default function UserActions({
  userId,
  currentRole,
}: {
  userId: string
  currentRole: string
}) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const handleRoleChange = async (newRole: string) => {
    if (newRole === currentRole) return
    setLoading(true)
    await supabase.from("profiles").update({ role: newRole }).eq("id", userId)
    setLoading(false)
    router.refresh()
  }

  const handleDelete = async () => {
    setLoading(true)
    await supabase.from("profiles").delete().eq("id", userId)
    setLoading(false)
    setShowDelete(false)
    router.refresh()
  }

  return (
    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
      {/* Dropdown đổi role */}
      <select
        value={currentRole}
        onChange={(e) => handleRoleChange(e.target.value)}
        disabled={loading}
        style={{
          padding: "5px 8px", borderRadius: "6px",
          border: "0.5px solid #e2e8f0", fontSize: "11px",
          color: "#0A1628", background: "#fff", outline: "none",
          cursor: "pointer",
        }}
      >
        {ROLE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {/* Xóa */}
      {!showDelete ? (
        <button
          onClick={() => setShowDelete(true)}
          title="Xoá người dùng"
          style={{
            width: "28px", height: "28px", borderRadius: "6px",
            background: "#FEF2F2", border: "0.5px solid #FECACA",
            color: "#DC2626", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "13px",
          }}
        >🗑</button>
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
          >Xoá</button>
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
