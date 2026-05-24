"use client"

import { useState } from "react"
import { updateUserRole, deleteUser } from "./actions"

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
  const [loading, setLoading]       = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [role, setRole]             = useState(currentRole)

  const handleRoleChange = async (newRole: string) => {
    if (newRole === role) return
    setLoading(true)
    try {
      await updateUserRole(userId, newRole)
      setRole(newRole)
    } catch (e) {
      alert("Lỗi khi đổi quyền, thử lại nhé!")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteUser(userId)
    } catch (e) {
      alert("Lỗi khi xóa người dùng!")
      setLoading(false)
      setShowDelete(false)
    }
  }

  return (
    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
      {/* Dropdown đổi role */}
      <select
        value={role}
        onChange={(e) => handleRoleChange(e.target.value)}
        disabled={loading}
        style={{
          padding: "5px 8px", borderRadius: "6px",
          border: "0.5px solid #e2e8f0", fontSize: "11px",
          color: "#0A1628", background: "#fff", outline: "none",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
          transition: "opacity 0.15s",
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
          disabled={loading}
          title="Xóa người dùng"
          style={{
            width: "28px", height: "28px", borderRadius: "6px",
            background: "#FEF2F2", border: "0.5px solid #FECACA",
            color: "#DC2626", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <i className="ti ti-trash" style={{ fontSize: "13px" }} />
        </button>
      ) : (
        <div style={{ display: "flex", gap: "4px" }}>
          <button
            onClick={handleDelete}
            disabled={loading}
            style={{
              padding: "4px 8px", borderRadius: "5px",
              background: "#DC2626", border: "none",
              color: "#fff", fontSize: "11px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >{loading ? "..." : "Xóa"}</button>
          <button
            onClick={() => setShowDelete(false)}
            disabled={loading}
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
