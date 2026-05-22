"use server"

import { revalidatePath } from "next/cache"

export async function revalidateArticle(slug: string) {
  revalidatePath("/phan-tich")
  revalidatePath(`/phan-tich/${slug}`)
  revalidatePath("/admin/bai-viet")
}