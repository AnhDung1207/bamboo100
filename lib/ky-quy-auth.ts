import { createClient } from "@/lib/supabase/server"

// Chỉ admin và editor mới được cập nhật ký quỹ.
// Kiểm tra ngay trong API vì proxy.ts chỉ chặn các trang /admin, không chặn /api.
export async function requireStaff(): Promise<{ userId: string; role: string } | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (!profile || !["admin", "editor"].includes(profile.role)) return null

  return { userId: user.id, role: profile.role }
}
