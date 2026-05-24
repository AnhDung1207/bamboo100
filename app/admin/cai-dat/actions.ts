"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function saveSettings(data: Record<string, string>) {
  const adminClient = createAdminClient()
  for (const [key, value] of Object.entries(data)) {
    await adminClient.from("settings").upsert({ key, value, updated_at: new Date().toISOString() })
  }
  revalidatePath("/admin/cai-dat")
}

export async function updateAdminProfile(userId: string, fullName: string, phone: string) {
  const adminClient = createAdminClient()
  await adminClient.from("profiles").update({ full_name: fullName, phone }).eq("id", userId)
  revalidatePath("/admin/cai-dat")
}

export async function updateAdminPassword(newPassword: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw new Error(error.message)
}
