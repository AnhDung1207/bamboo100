"use client"

import { useState } from "react"
import { saveSettings, updateAdminProfile, updateAdminPassword } from "./actions"

interface Props {
  settings: Record<string, string>
  userId: string
  profile: { full_name: string | null; phone: string | null } | null
}

type Tab = "account" | "website" | "lead" | "tracking" | "seo" | "popup"

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "account",  label: "Tài khoản",  icon: "ti-user-circle" },
  { key: "website",  label: "Website",    icon: "ti-world" },
  { key: "lead",     label: "Lead",       icon: "ti-users" },
  { key: "tracking", label: "Tracking",   icon: "ti-chart-bar" },
  { key: "seo",      label: "SEO",        icon: "ti-search" },
  { key: "popup",    label: "Popup CTA",  icon: "ti-speakerphone" },
]

export default function SettingsForm({ settings, userId, profile }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("account")
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")

  // Tab: Tài khoản
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [phone, setPhone] = useState(profile?.phone || "")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  // Tab: Website
  const [siteName, setSiteName] = useState(settings["site_name"] || "")
  const [siteDesc, setSiteDesc] = useState(settings["site_description"] || "")
  const [contactEmail, setContactEmail] = useState(settings["contact_email"] || "")
  const [contactPhone, setContactPhone] = useState(settings["contact_phone"] || "")
  const [contactAddress, setContactAddress] = useState(settings["contact_address"] || "")
  const [facebook, setFacebook] = useState(settings["social_facebook"] || "")
  const [zalo, setZalo] = useState(settings["social_zalo"] || "")
  const [youtube, setYoutube] = useState(settings["social_youtube"] || "")

  // Tab: Lead
  const [leadEmail, setLeadEmail] = useState(settings["lead_notify_email"] || "")

  // Tab: Tracking
  const [gaId, setGaId] = useState(settings["ga_id"] || "")
  const [fbPixel, setFbPixel] = useState(settings["fb_pixel_id"] || "")

  // Tab: SEO
  const [seoTitle, setSeoTitle] = useState(settings["seo_title"] || "")
  const [seoDesc, setSeoDesc] = useState(settings["seo_description"] || "")
  const [seoOg, setSeoOg] = useState(settings["seo_og_image"] || "")

  // Tab: Popup
  const [popupEnabled, setPopupEnabled] = useState(settings["popup_enabled"] === "true")
  const [popupTitle, setPopupTitle] = useState(settings["popup_title"] || "")
  const [popupBody, setPopupBody] = useState(settings["popup_body"] || "")
  const [popupCta, setPopupCta] = useState(settings["popup_cta_label"] || "")
  const [popupUrl, setPopupUrl] = useState(settings["popup_cta_url"] || "")

  const labelStyle: React.CSSProperties = {
    display: "block", marginBottom: "6px",
    fontSize: "11px", fontWeight: 600,
    color: "#64748B", letterSpacing: "0.04em", textTransform: "uppercase",
  }
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px",
    background: "#F8FAFC", border: "1px solid #CBD5E1",
    borderRadius: "8px", color: "#0A1628",
    fontSize: "13px", outline: "none",
    fontFamily: "'DM Sans', 'Inter', sans-serif",
    transition: "border-color 0.15s", boxSizing: "border-box",
  }
  const panelStyle: React.CSSProperties = {
    background: "#FFFFFF", border: "1px solid #E8EDF3",
    borderRadius: "14px", padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    marginBottom: "16px",
  }
  const fieldStyle: React.CSSProperties = { marginBottom: "16px" }

  const handleSave = async () => {
    setSaving(true)
    setSaveStatus("idle")
    setPasswordError("")

    try {
      if (activeTab === "account") {
        await updateAdminProfile(userId, fullName, phone)
        if (newPassword) {
          if (newPassword !== confirmPassword) {
            setPasswordError("Mật khẩu xác nhận không khớp!")
            setSaving(false)
            return
          }
          if (newPassword.length < 6) {
            setPasswordError("Mật khẩu tối thiểu 6 ký tự!")
            setSaving(false)
            return
          }
          await updateAdminPassword(newPassword)
          setNewPassword("")
          setConfirmPassword("")
        }
      } else if (activeTab === "website") {
        await saveSettings({
          site_name: siteName, site_description: siteDesc,
          contact_email: contactEmail, contact_phone: contactPhone,
          contact_address: contactAddress,
          social_facebook: facebook, social_zalo: zalo, social_youtube: youtube,
        })
      } else if (activeTab === "lead") {
        await saveSettings({ lead_notify_email: leadEmail })
      } else if (activeTab === "tracking") {
        await saveSettings({ ga_id: gaId, fb_pixel_id: fbPixel })
      } else if (activeTab === "seo") {
        await saveSettings({ seo_title: seoTitle, seo_description: seoDesc, seo_og_image: seoOg })
      } else if (activeTab === "popup") {
        await saveSettings({
          popup_enabled: popupEnabled ? "true" : "false",
          popup_title: popupTitle, popup_body: popupBody,
          popup_cta_label: popupCta, popup_cta_url: popupUrl,
        })
      }
      setSaveStatus("success")
    } catch {
      setSaveStatus("error")
    } finally {
      setSaving(false)
      setTimeout(() => setSaveStatus("idle"), 3000)
    }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>

      {/* TOPBAR */}
      <div style={{
        background: "#fff", borderBottom: "0.5px solid #e2e8f0",
        padding: "14px 28px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 40,
      }}>
        <div>
          <h1 style={{ fontSize: "16px", fontWeight: 600, color: "#0A1628" }}>Cài đặt</h1>
          <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>Quản lý cấu hình hệ thống</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {saveStatus === "success" && (
            <span style={{ fontSize: "12px", color: "#15803D", display: "flex", alignItems: "center", gap: "4px" }}>
              <i className="ti ti-check" /> Đã lưu thành công!
            </span>
          )}
          {saveStatus === "error" && (
            <span style={{ fontSize: "12px", color: "#dc2626" }}>Có lỗi xảy ra!</span>
          )}
          <button onClick={handleSave} disabled={saving} style={{
            background: saving ? "#94a3b8" : "#00C389", color: "#fff",
            border: "none", borderRadius: "8px", padding: "8px 18px",
            fontSize: "13px", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer",
            fontFamily: "inherit", display: "flex", alignItems: "center", gap: "6px",
          }}>
            <i className="ti ti-device-floppy" style={{ fontSize: "14px" }} />
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>

      {/* TABS */}
      <div style={{ borderBottom: "0.5px solid #e2e8f0", background: "#fff", padding: "0 28px" }}>
        <div style={{ display: "flex", gap: "2px", overflowX: "auto" }}>
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "14px 16px", fontSize: "13px", fontWeight: activeTab === tab.key ? 600 : 400,
              color: activeTab === tab.key ? "#0A1628" : "#64748b",
              background: "transparent", border: "none", borderBottom: activeTab === tab.key ? "2px solid #00C389" : "2px solid transparent",
              cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit",
            }}>
              <i className={`ti ${tab.icon}`} style={{ fontSize: "15px" }} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "28px" }}>

        {/* ── TAB: TÀI KHOẢN ── */}
        {activeTab === "account" && (
          <>
            <div style={panelStyle}>
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0A1628", marginBottom: "20px" }}>
                Thông tin cá nhân
              </h3>
              <div style={fieldStyle}>
                <label style={labelStyle}>Họ và tên</label>
                <input value={fullName} onChange={e => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A" style={inputStyle} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Số điện thoại</label>
                <input value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="0901 234 567" style={inputStyle} />
              </div>
            </div>

            <div style={panelStyle}>
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0A1628", marginBottom: "4px" }}>
                Đổi mật khẩu
              </h3>
              <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "20px" }}>
                Để trống nếu không muốn đổi mật khẩu
              </p>
              <div style={fieldStyle}>
                <label style={labelStyle}>Mật khẩu mới</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự" style={inputStyle} />
              </div>
              <div style={{ ...fieldStyle, marginBottom: 0 }}>
                <label style={labelStyle}>Xác nhận mật khẩu</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới" style={inputStyle} />
              </div>
              {passwordError && (
                <p style={{ fontSize: "12px", color: "#dc2626", marginTop: "8px" }}>⚠️ {passwordError}</p>
              )}
            </div>
          </>
        )}

        {/* ── TAB: WEBSITE ── */}
        {activeTab === "website" && (
          <>
            <div style={panelStyle}>
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0A1628", marginBottom: "20px" }}>
                Thông tin website
              </h3>
              <div style={fieldStyle}>
                <label style={labelStyle}>Tên website</label>
                <input value={siteName} onChange={e => setSiteName(e.target.value)}
                  placeholder="BAMBOO100" style={inputStyle} />
              </div>
              <div style={{ ...fieldStyle, marginBottom: 0 }}>
                <label style={labelStyle}>Mô tả ngắn</label>
                <textarea value={siteDesc} onChange={e => setSiteDesc(e.target.value)}
                  placeholder="Phân tích Phái sinh Hàng hóa chuyên sâu" rows={3}
                  style={{ ...inputStyle, resize: "none" }} />
              </div>
            </div>

            <div style={panelStyle}>
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0A1628", marginBottom: "20px" }}>
                Thông tin liên hệ
              </h3>
              <div style={fieldStyle}>
                <label style={labelStyle}>Email liên hệ</label>
                <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)}
                  placeholder="contact@bamboo100.vn" style={inputStyle} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Số điện thoại</label>
                <input value={contactPhone} onChange={e => setContactPhone(e.target.value)}
                  placeholder="0901 234 567" style={inputStyle} />
              </div>
              <div style={{ ...fieldStyle, marginBottom: 0 }}>
                <label style={labelStyle}>Địa chỉ</label>
                <input value={contactAddress} onChange={e => setContactAddress(e.target.value)}
                  placeholder="123 Đường ABC, Quận 1, TP.HCM" style={inputStyle} />
              </div>
            </div>

            <div style={panelStyle}>
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0A1628", marginBottom: "20px" }}>
                Mạng xã hội
              </h3>
              <div style={fieldStyle}>
                <label style={labelStyle}>Facebook URL</label>
                <input value={facebook} onChange={e => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/bamboo100" style={inputStyle} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Zalo URL / Số điện thoại</label>
                <input value={zalo} onChange={e => setZalo(e.target.value)}
                  placeholder="0901 234 567" style={inputStyle} />
              </div>
              <div style={{ ...fieldStyle, marginBottom: 0 }}>
                <label style={labelStyle}>YouTube URL</label>
                <input value={youtube} onChange={e => setYoutube(e.target.value)}
                  placeholder="https://youtube.com/@bamboo100" style={inputStyle} />
              </div>
            </div>
          </>
        )}

        {/* ── TAB: LEAD ── */}
        {activeTab === "lead" && (
          <div style={panelStyle}>
            <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0A1628", marginBottom: "4px" }}>
              Thông báo Lead mới
            </h3>
            <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "20px" }}>
              Khi có lead mới, hệ thống sẽ gửi thông báo về email này
            </p>
            <div style={{ ...fieldStyle, marginBottom: 0 }}>
              <label style={labelStyle}>Email nhận thông báo</label>
              <input type="email" value={leadEmail} onChange={e => setLeadEmail(e.target.value)}
                placeholder="admin@bamboo100.vn" style={inputStyle} />
            </div>
            <div style={{
              marginTop: "16px", padding: "12px 14px", borderRadius: "8px",
              background: "#FEF3C7", border: "1px solid #FDE68A",
            }}>
              <p style={{ fontSize: "12px", color: "#92400E" }}>
                ⚠️ Chức năng gửi email cần tích hợp thêm Resend hoặc SendGrid. Tab này chỉ lưu cấu hình.
              </p>
            </div>
          </div>
        )}

        {/* ── TAB: TRACKING ── */}
        {activeTab === "tracking" && (
          <div style={panelStyle}>
            <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0A1628", marginBottom: "4px" }}>
              Mã theo dõi
            </h3>
            <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "20px" }}>
              Sau khi lưu, thêm script vào <code style={{ background: "#f1f5f9", padding: "1px 5px", borderRadius: "4px", fontSize: "11px" }}>app/layout.tsx</code> để kích hoạt
            </p>
            <div style={fieldStyle}>
              <label style={labelStyle}>Google Analytics ID</label>
              <input value={gaId} onChange={e => setGaId(e.target.value)}
                placeholder="G-XXXXXXXXXX" style={inputStyle} />
            </div>
            <div style={{ ...fieldStyle, marginBottom: 0 }}>
              <label style={labelStyle}>Facebook Pixel ID</label>
              <input value={fbPixel} onChange={e => setFbPixel(e.target.value)}
                placeholder="1234567890" style={inputStyle} />
            </div>
          </div>
        )}

        {/* ── TAB: SEO ── */}
        {activeTab === "seo" && (
          <div style={panelStyle}>
            <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0A1628", marginBottom: "20px" }}>
              SEO mặc định
            </h3>
            <div style={fieldStyle}>
              <label style={labelStyle}>Meta title</label>
              <input value={seoTitle} onChange={e => setSeoTitle(e.target.value)}
                placeholder="BAMBOO100 — Phân tích Phái sinh Hàng hóa" style={inputStyle} />
              <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                {seoTitle.length}/60 ký tự {seoTitle.length > 60 && <span style={{ color: "#dc2626" }}>— Quá dài!</span>}
              </p>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Meta description</label>
              <textarea value={seoDesc} onChange={e => setSeoDesc(e.target.value)}
                placeholder="Phân tích cung-cầu thực tế, kịch bản thị trường và tư vấn chiến lược..." rows={3}
                style={{ ...inputStyle, resize: "none" }} />
              <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                {seoDesc.length}/160 ký tự {seoDesc.length > 160 && <span style={{ color: "#dc2626" }}>— Quá dài!</span>}
              </p>
            </div>
            <div style={{ ...fieldStyle, marginBottom: 0 }}>
              <label style={labelStyle}>OG Image URL</label>
              <input value={seoOg} onChange={e => setSeoOg(e.target.value)}
                placeholder="https://bamboo100.vn/og-image.jpg" style={inputStyle} />
              <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                Ảnh hiển thị khi chia sẻ lên mạng xã hội. Khuyến nghị 1200×630px.
              </p>
              {seoOg && (
                <img src={seoOg} alt="OG Preview"
                  style={{ marginTop: "10px", width: "100%", maxHeight: "160px", objectFit: "cover", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  onError={e => (e.currentTarget.style.display = "none")}
                />
              )}
            </div>
          </div>
        )}

        {/* ── TAB: POPUP ── */}
        {activeTab === "popup" && (
          <div style={panelStyle}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <div>
                <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0A1628", marginBottom: "2px" }}>
                  Popup CTA
                </h3>
                <p style={{ fontSize: "12px", color: "#94a3b8" }}>
                  Hiển thị popup kêu gọi hành động cho người dùng
                </p>
              </div>
              {/* Toggle */}
              <div onClick={() => setPopupEnabled(!popupEnabled)}
                style={{ width: "44px", height: "24px", borderRadius: "12px", background: popupEnabled ? "#00C389" : "#e2e8f0", position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#fff", position: "absolute", top: "2px", left: popupEnabled ? "22px" : "2px", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
              </div>
            </div>

            <div style={{ opacity: popupEnabled ? 1 : 0.4, pointerEvents: popupEnabled ? "auto" : "none", transition: "opacity 0.2s" }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Tiêu đề popup</label>
                <input value={popupTitle} onChange={e => setPopupTitle(e.target.value)}
                  placeholder="Nhận tín hiệu giao dịch miễn phí" style={inputStyle} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Nội dung</label>
                <textarea value={popupBody} onChange={e => setPopupBody(e.target.value)}
                  placeholder="Đăng ký nhận phân tích thị trường hàng tuần..." rows={3}
                  style={{ ...inputStyle, resize: "none" }} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Nhãn nút CTA</label>
                <input value={popupCta} onChange={e => setPopupCta(e.target.value)}
                  placeholder="Đăng ký ngay" style={inputStyle} />
              </div>
              <div style={{ ...fieldStyle, marginBottom: 0 }}>
                <label style={labelStyle}>Link CTA</label>
                <input value={popupUrl} onChange={e => setPopupUrl(e.target.value)}
                  placeholder="/lien-he" style={inputStyle} />
              </div>
            </div>

            {/* Preview */}
            {popupEnabled && popupTitle && (
              <div style={{ marginTop: "24px", padding: "16px", borderRadius: "12px", background: "#0A1628", border: "1px solid rgba(255,255,255,0.1)" }}>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Preview</p>
                <h4 style={{ color: "#fff", fontSize: "15px", fontWeight: 700, marginBottom: "6px" }}>{popupTitle}</h4>
                {popupBody && <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", lineHeight: 1.6, marginBottom: "14px" }}>{popupBody}</p>}
                {popupCta && (
                  <div style={{ background: "#00C389", color: "#fff", fontSize: "13px", fontWeight: 600, padding: "10px 20px", borderRadius: "8px", display: "inline-block" }}>
                    {popupCta} →
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
