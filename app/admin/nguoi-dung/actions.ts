"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function updateUserRole(userId: string, newRole: string) {
  const adminClient = createAdminClient()
  const { error } = await adminClient
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/nguoi-dung")
}

export async function deleteUser(userId: string) {
  const adminClient = createAdminClient()

  // Xóa profile trước
  await adminClient.from("profiles").delete().eq("id", userId)

  // Xóa auth user
  await adminClient.auth.admin.deleteUser(userId)

  revalidatePath("/admin/nguoi-dung")
}
