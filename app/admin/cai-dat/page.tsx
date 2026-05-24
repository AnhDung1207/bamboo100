import { createClient } from "@/lib/supabase/server"
import SettingsForm from "./SettingsForm"

export default async function CaiDatPage() {
  const supabase = await createClient()
  const { data } = await supabase.from("settings").select("key, value")

  const settings: Record<string, string> = {}
  data?.forEach(row => { settings[row.key] = row.value || "" })

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from("profiles").select("full_name, phone").eq("id", user!.id).single()

  return <SettingsForm settings={settings} userId={user!.id} profile={profile} />
}
