import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const articleId = typeof body?.articleId === "string" ? body.articleId : ""

    if (!articleId) {
      return NextResponse.json({ error: "Missing articleId" }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: article, error: readError } = await supabase
      .from("articles")
      .select("id, view_count")
      .eq("id", articleId)
      .eq("status", "published")
      .single()

    if (readError || !article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    const nextViewCount = Number(article.view_count || 0) + 1

    const { error: updateError } = await supabase
      .from("articles")
      .update({ view_count: nextViewCount })
      .eq("id", articleId)

    if (updateError) {
      return NextResponse.json({ error: "Could not update view count" }, { status: 500 })
    }

    return NextResponse.json({ ok: true, view_count: nextViewCount })
  } catch {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}
