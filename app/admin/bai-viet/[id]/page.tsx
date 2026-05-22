"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { revalidateArticle } from "../actions"

export default function SuaBaiViet() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const handleEditorImageUpload = async (file: File) => {
    if (!file) return
    const compressed = await compressImage(file)
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`
    const { error } = await supabase.storage.from("thumbnails").upload(fileName, compressed, {
      cacheControl: "3600", upsert: false, contentType: "image/jpeg",
    })
    if (error) return
    const { data: { publicUrl } } = supabase.storage.from("thumbnails").getPublicUrl(fileName)
    editorRef.current?.focus()
    document.execCommand("insertHTML", false, `<img src="${publicUrl}" style="max-width:100%;border-radius:8px;margin:12px 0;" />`)
    setForm((prev) => ({ ...prev, content: editorRef.current?.innerHTML || "" }))
  }

  const [categories, setCategories] = useState<any[]>([])
  const [productGroups, setProductGroups] = useState<any[]>([])
  const [filteredCategories, setFilteredCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [saveStatus, setSaveStatus] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState("")

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    thumbnail_url: "",
    category_id: "",
    group_id: "",
    read_time: "",
    is_premium: false,
    is_hot: false,
    status: "draft" as "draft" | "published",
    published_at: "",
    key_takeaways: "",
  })

  useEffect(() => {
    Promise.all([
      supabase.from("categories").select("*").order("order_index"),
      supabase.from("product_groups").select("*").order("order_index"),
      supabase.from("articles").select("*").eq("id", id).single(),
    ]).then(([{ data: cats }, { data: groups }, { data: article }]) => {
      if (cats) setCategories(cats)
      if (groups) setProductGroups(groups)
      if (article) {
        setForm({
          title: article.title || "",
          slug: article.slug || "",
          excerpt: article.excerpt || "",
          content: article.content || "",
          thumbnail_url: article.thumbnail_url || "",
          category_id: article.category_id || "",
          group_id: article.group_id || "",
          read_time: article.read_time?.toString() || "",
          is_premium: article.is_premium || false,
          is_hot: article.is_hot || false,
          status: article.status || "draft",
          published_at: article.published_at
            ? new Date(new Date(article.published_at).getTime() + 7 * 60 * 60 * 1000)
                .toISOString().slice(0, 16)
            : "",
          key_takeaways: article.key_takeaways || "",
        })
        if (article.thumbnail_url) setThumbnailPreview(article.thumbnail_url)
        if (editorRef.current && article.content) {
          editorRef.current.innerHTML = article.content
        }
      }
      setFetching(false)
    })
  }, [id])

  useEffect(() => {
    if (form.group_id) {
      setFilteredCategories(categories.filter((c) => c.group_id === form.group_id))
    } else {
      setFilteredCategories([])
    }
  }, [form.group_id, categories])

  useEffect(() => {
    if (!fetching && form.content && editorRef.current) {
      editorRef.current.innerHTML = form.content
    }
  }, [fetching])

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      const img = new Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        const maxW = 1200, maxH = 630
        let w = img.width, h = img.height
        if (w > maxW || h > maxH) {
          const ratio = Math.min(maxW / w, maxH / h)
          w = Math.round(w * ratio)
          h = Math.round(h * ratio)
        }
        canvas.width = w
        canvas.height = h
        ctx.drawImage(img, 0, 0, w, h)
        URL.revokeObjectURL(url)
        canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.8)
      }
      img.src = url
    })
  }

  const handleImageUpload = async (file: File) => {
    if (!file) return
    setUploadingImage(true)
    const compressed = await compressImage(file)
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`
    const { error } = await supabase.storage.from("thumbnails").upload(fileName, compressed, {
      cacheControl: "3600", upsert: false, contentType: "image/jpeg",
    })
    if (error) { setUploadingImage(false); return }
    const { data: { publicUrl } } = supabase.storage.from("thumbnails").getPublicUrl(fileName)
    setForm((prev) => ({ ...prev, thumbnail_url: publicUrl }))
    setThumbnailPreview(publicUrl)
    setUploadingImage(false)
  }

  const handleSave = async (status: "draft" | "published") => {
    if (!form.title) { setSaveStatus("error-title"); return }
    setLoading(true)
    setSaveStatus("")

    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt || null,
      content: form.content || null,
      category_id: form.category_id || null,
      group_id: form.group_id || null,
      read_time: form.read_time ? parseInt(form.read_time) : null,
      is_premium: form.is_premium,
      is_hot: form.is_hot,
      thumbnail_url: form.thumbnail_url || null,
      key_takeaways: form.key_takeaways || null,
      status,
      published_at: status === "published"
        ? (form.published_at
            ? new Date(new Date(form.published_at + "Z").getTime() - 7 * 60 * 60 * 1000).toISOString()
            : new Date().toISOString())
        : null,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from("articles").update(payload).eq("id", id)
    if (error) { setSaveStatus("error"); setLoading(false); return }

    await revalidateArticle(form.slug)

    setSaveStatus("success")
    setLoading(false)
    router.refresh()
    setTimeout(() => router.push("/admin/bai-viet"), 800)
  }

  if (fetching) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
        <p style={{ color: "#64748b" }}>Đang tải bài viết...</p>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", minHeight: "100vh", background: "#f8fafc" }}>
      {/* TOPBAR */}
      <div style={{
        background: "#fff", borderBottom: "0.5px solid #e2e8f0",
        padding: "14px 28px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 40,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/admin/bai-viet" style={{
            display: "flex", alignItems: "center", gap: "5px",
            color: "#64748b", textDecoration: "none", fontSize: "13px",
          }}>
            <i className="ti ti-arrow-left" style={{ fontSize: "14px" }} aria-hidden="true"></i>
            Quay lại
          </Link>
          <span style={{ color: "#e2e8f0" }}>|</span>
          <h1 style={{ fontSize: "15px", fontWeight: 600, color: "#0A1628" }}>Sửa bài viết</h1>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {saveStatus === "success" && <span style={{ fontSize: "12px", color: "#15803D" }}>✓ Đã lưu!</span>}
          {saveStatus === "error" && <span style={{ fontSize: "12px", color: "#DC2626" }}>Có lỗi xảy ra!</span>}
          {saveStatus === "error-title" && <span style={{ fontSize: "12px", color: "#DC2626" }}>Vui lòng nhập tiêu đề!</span>}
          <Link href={`/phan-tich/${form.slug}`} target="_blank" style={{
            padding: "7px 14px", borderRadius: "7px",
            background: "#fff", border: "0.5px solid #e2e8f0",
            color: "#64748b", fontSize: "13px", textDecoration: "none",
            display: "flex", alignItems: "center", gap: "5px",
          }}>
            <i className="ti ti-external-link" style={{ fontSize: "13px" }} aria-hidden="true"></i>
            Xem bài
          </Link>
          <button onClick={() => handleSave("draft")} disabled={loading} style={{
            padding: "7px 16px", borderRadius: "7px",
            background: "#fff", border: "0.5px solid #e2e8f0",
            color: "#64748b", fontSize: "13px", fontWeight: 500, cursor: "pointer",
          }}>
            {loading ? "Đang lưu..." : "Lưu nháp"}
          </button>
          <button onClick={() => handleSave("published")} disabled={loading} style={{
            padding: "7px 16px", borderRadius: "7px",
            background: "#00C389", border: "none",
            color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer",
            display: "flex", alignItems: "center", gap: "5px",
          }}>
            <i className="ti ti-send" style={{ fontSize: "13px" }} aria-hidden="true"></i>
            {loading ? "Đang lưu..." : "Cập nhật"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "28px", display: "grid", gridTemplateColumns: "1fr 280px", gap: "20px" }}>

        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ background: "#fff", borderRadius: "12px", border: "0.5px solid #e2e8f0", padding: "20px 24px" }}>
            <input
              placeholder="Tiêu đề bài viết..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={{ width: "100%", border: "none", outline: "none", fontSize: "22px", fontWeight: 600, color: "#0A1628", background: "transparent", fontFamily: "inherit" }}
            />
            <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "11px", color: "#94a3b8" }}>Slug:</span>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                style={{ flex: 1, fontSize: "11px", color: "#64748b", border: "none", outline: "none", background: "transparent", fontFamily: "monospace" }}
              />
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: "12px", border: "0.5px solid #e2e8f0", padding: "16px 24px" }}>
            <label style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "8px" }}>Tóm tắt</label>
            <textarea
              placeholder="Mô tả ngắn về bài viết..."
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={3}
              style={{ width: "100%", border: "none", outline: "none", fontSize: "14px", color: "#0A1628", lineHeight: 1.6, background: "transparent", resize: "none", fontFamily: "inherit", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ background: "#fff", borderRadius: "12px", border: "0.5px solid #e2e8f0", padding: "16px 24px" }}>
            <label style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "4px" }}>Key Takeaways</label>
            <p style={{ fontSize: "11px", color: "#94a3b8", margin: "0 0 8px" }}>Mỗi dòng là 1 bullet. Nhấn Enter để xuống dòng mới.</p>
            <textarea
              placeholder={"Giá vàng tăng mạnh do lo ngại lạm phát\nDầu thô WTI vượt mốc $85/thùng\nNhu cầu đồng tại Trung Quốc phục hồi"}
              value={form.key_takeaways}
              onChange={(e) => {
                const el = e.target
                el.style.height = "auto"
                el.style.height = el.scrollHeight + "px"
                setForm({ ...form, key_takeaways: e.target.value })
              }}
              rows={3}
              style={{ width: "100%", border: "none", outline: "none", fontSize: "14px", color: "#0A1628", lineHeight: 1.7, background: "transparent", resize: "none", fontFamily: "inherit", boxSizing: "border-box", overflow: "hidden" }}
            />
          </div>

          <div style={{ background: "#fff", borderRadius: "12px", border: "0.5px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ padding: "12px 24px", borderBottom: "0.5px solid #e2e8f0", background: "#f8fafc", display: "flex", gap: "4px", flexWrap: "wrap" }}>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => { const file = e.target.files?.[0]; if (file) handleEditorImageUpload(file); e.target.value = "" }}
              />
              {[
                { icon: "ti-bold", cmd: "bold" }, { icon: "ti-italic", cmd: "italic" },
                { icon: "ti-underline", cmd: "underline" }, { icon: "ti-list", cmd: "insertUnorderedList" },
                { icon: "ti-list-numbers", cmd: "insertOrderedList" }, { icon: "ti-link", cmd: "createLink" },
                { icon: "ti-quote", cmd: "formatBlock" }, { icon: "ti-h-1", cmd: "h2" }, { icon: "ti-h-2", cmd: "h3" },
              ].map((btn) => (
                <button key={btn.cmd} onMouseDown={(e) => {
                  e.preventDefault()
                  if (btn.cmd === "h2") {
                    const sel = window.getSelection()
                    const block = sel?.anchorNode?.parentElement?.closest("h2")
                    document.execCommand("formatBlock", false, block ? "p" : "h2")
                  } else if (btn.cmd === "h3") {
                    const sel = window.getSelection()
                    const block = sel?.anchorNode?.parentElement?.closest("h3")
                    document.execCommand("formatBlock", false, block ? "p" : "h3")
                  } else if (btn.cmd === "formatBlock") {
                    const sel = window.getSelection()
                    const block = sel?.anchorNode?.parentElement?.closest("blockquote")
                    document.execCommand("formatBlock", false, block ? "p" : "blockquote")
                  } else if (btn.cmd === "createLink") {
                    const url = prompt("Nhập URL:"); if (url) document.execCommand("createLink", false, url)
                  } else {
                    document.execCommand(btn.cmd, false)
                  }
                }} style={{ width: "30px", height: "30px", borderRadius: "5px", background: "transparent", border: "0.5px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b" }}>
                  <i className={`ti ${btn.icon}`} style={{ fontSize: "14px" }} aria-hidden="true"></i>
                </button>
              ))}
              <button
                onMouseDown={(e) => { e.preventDefault(); imageInputRef.current?.click() }}
                title="Upload ảnh"
                style={{ width: "30px", height: "30px", borderRadius: "5px", background: "transparent", border: "0.5px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b" }}
              >
                <i className="ti ti-photo" style={{ fontSize: "14px" }} aria-hidden="true"></i>
              </button>
            </div>
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => setForm({ ...form, content: e.currentTarget.innerHTML })}
              onPaste={async (e) => {
                const items = e.clipboardData?.items
                if (!items) return
                for (const item of Array.from(items)) {
                  if (item.type.startsWith("image/")) {
                    e.preventDefault()
                    const file = item.getAsFile()
                    if (!file) return
                    const compressed = await compressImage(file)
                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`
                    const { error } = await supabase.storage.from("thumbnails").upload(fileName, compressed, {
                      cacheControl: "3600", upsert: false, contentType: "image/jpeg",
                    })
                    if (error) return
                    const { data: { publicUrl } } = supabase.storage.from("thumbnails").getPublicUrl(fileName)
                    document.execCommand("insertHTML", false, `<img src="${publicUrl}" style="max-width:100%;border-radius:8px;margin:12px 0;" />`)
                    setForm((prev) => ({ ...prev, content: editorRef.current?.innerHTML || "" }))
                    return
                  }
                }
              }}
              style={{ minHeight: "400px", padding: "24px", fontSize: "15px", lineHeight: 1.8, color: "#0A1628", outline: "none", fontFamily: "inherit" }}
              data-placeholder="Bắt đầu viết nội dung bài phân tích..."
            />
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", position: "sticky", top: "80px", alignSelf: "start" }}>

          {/* Thumbnail */}
          <div style={{ background: "#fff", borderRadius: "12px", border: "0.5px solid #e2e8f0", padding: "16px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#0A1628", marginBottom: "12px" }}>Ảnh thumbnail</h3>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file) }} />
            {thumbnailPreview ? (
              <div style={{ position: "relative" }}>
                <img src={thumbnailPreview} alt="Thumbnail" style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "8px" }} />
                <button onClick={() => { setThumbnailPreview(""); setForm((prev) => ({ ...prev, thumbnail_url: "" })) }}
                  style={{ position: "absolute", top: "6px", right: "6px", width: "24px", height: "24px", borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
              </div>
            ) : (
              <div onClick={() => fileInputRef.current?.click()}
                style={{ border: "1.5px dashed #e2e8f0", borderRadius: "8px", padding: "24px", textAlign: "center", cursor: "pointer", background: "#f8fafc" }}>
                {uploadingImage ? <p style={{ fontSize: "12px", color: "#64748b" }}>Đang upload...</p> : (
                  <><div style={{ fontSize: "24px", marginBottom: "8px" }}>🖼️</div>
                  <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Click để chọn ảnh</p>
                  <p style={{ fontSize: "11px", color: "#94a3b8" }}>PNG, JPG, WEBP</p></>
                )}
              </div>
            )}
          </div>

          {/* Publish */}
          <div style={{ background: "#fff", borderRadius: "12px", border: "0.5px solid #e2e8f0", padding: "16px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#0A1628", marginBottom: "14px" }}>Xuất bản</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 500, color: "#64748b", display: "block", marginBottom: "5px" }}>Trạng thái</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" })}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: "7px", border: "0.5px solid #e2e8f0", fontSize: "13px", color: "#0A1628", background: "#fff", outline: "none" }}>
                  <option value="draft">Nháp</option>
                  <option value="published">Đã đăng</option>
                </select>
              </div>

              {/* Thời gian đăng */}
              <div>
                <label style={{ fontSize: "11px", fontWeight: 500, color: "#64748b", display: "block", marginBottom: "5px" }}>Thời gian đăng</label>
                <input
                  type="datetime-local"
                  value={form.published_at}
                  onChange={(e) => setForm({ ...form, published_at: e.target.value })}
                  style={{
                    width: "100%", padding: "7px 10px", borderRadius: "7px",
                    border: "0.5px solid #e2e8f0", fontSize: "13px",
                    color: "#0A1628", background: "#fff", outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <p style={{ fontSize: "10px", color: "#94a3b8", marginTop: "4px" }}>
                  Để trống = đăng ngay lập tức
                </p>
              </div>

              {[
                { key: "is_premium", label: "Bài Premium", desc: "Yêu cầu đăng nhập để đọc", color: "#00C389" },
                { key: "is_hot", label: "🔥 Bài Hot", desc: "Hiển thị badge Hot trên feed", color: "#E24B4A" },
              ].map((toggle) => (
                <div key={toggle.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "13px", color: "#0A1628" }}>{toggle.label}</div>
                    <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>{toggle.desc}</div>
                  </div>
                  <div onClick={() => setForm({ ...form, [toggle.key]: !form[toggle.key as keyof typeof form] })}
                    style={{ width: "36px", height: "20px", borderRadius: "10px", background: form[toggle.key as keyof typeof form] ? toggle.color : "#e2e8f0", position: "relative", cursor: "pointer", transition: "background 0.15s", flexShrink: 0 }}>
                    <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#fff", position: "absolute", top: "2px", left: form[toggle.key as keyof typeof form] ? "18px" : "2px", transition: "left 0.15s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category */}
          <div style={{ background: "#fff", borderRadius: "12px", border: "0.5px solid #e2e8f0", padding: "16px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#0A1628", marginBottom: "12px" }}>Phân loại</h3>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontSize: "11px", fontWeight: 500, color: "#64748b", display: "block", marginBottom: "5px" }}>Nhóm ngành</label>
              <select value={form.group_id} onChange={(e) => setForm({ ...form, group_id: e.target.value, category_id: "" })}
                style={{ width: "100%", padding: "7px 10px", borderRadius: "7px", border: "0.5px solid #e2e8f0", fontSize: "13px", color: "#0A1628", background: "#fff", outline: "none" }}>
                <option value="">-- Chọn nhóm ngành --</option>
                {productGroups.map((g) => <option key={g.id} value={g.id}>{g.icon} {g.name}</option>)}
              </select>
            </div>
            {form.group_id && (
              <div>
                <label style={{ fontSize: "11px", fontWeight: 500, color: "#64748b", display: "block", marginBottom: "5px" }}>Sản phẩm cụ thể</label>
                {filteredCategories.length > 0 ? (
                  <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "7px", border: "0.5px solid #e2e8f0", fontSize: "13px", color: "#0A1628", background: "#fff", outline: "none" }}>
                    <option value="">-- Chọn sản phẩm --</option>
                    {filteredCategories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                ) : (
                  <p style={{ fontSize: "12px", color: "#94a3b8", fontStyle: "italic" }}>Nhóm này không có sản phẩm con</p>
                )}
              </div>
            )}
          </div>

          {/* Read time */}
          <div style={{ background: "#fff", borderRadius: "12px", border: "0.5px solid #e2e8f0", padding: "16px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#0A1628", marginBottom: "12px" }}>Thời gian đọc</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input type="number" placeholder="5" value={form.read_time} onChange={(e) => setForm({ ...form, read_time: e.target.value })} min="1" max="60"
                style={{ width: "70px", padding: "7px 10px", borderRadius: "7px", border: "0.5px solid #e2e8f0", fontSize: "13px", color: "#0A1628", outline: "none", textAlign: "center" }} />
              <span style={{ fontSize: "13px", color: "#64748b" }}>phút</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        [contenteditable]:empty:before { content: attr(data-placeholder); color: #94a3b8; pointer-events: none; }
        [contenteditable] h2 { font-size: 20px; font-weight: 600; margin: 16px 0 8px; color: #0A1628; }
        [contenteditable] h3 { font-size: 17px; font-weight: 600; margin: 14px 0 6px; color: #0A1628; }
        [contenteditable] blockquote { border-left: 3px solid #00C389; padding-left: 14px; color: #475569; font-style: italic; margin: 12px 0; }
        [contenteditable] ul { padding-left: 20px; margin: 8px 0; list-style-type: disc !important; }
        [contenteditable] ol { padding-left: 20px; margin: 8px 0; list-style-type: decimal !important; }
        [contenteditable] li { margin: 4px 0; display: list-item !important; }
        [contenteditable] a { color: #00C389; }
      `}</style>
    </div>
  )
}
