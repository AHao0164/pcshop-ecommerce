import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../ui/Toast'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Save,
  RefreshCw,
} from 'lucide-react'

export default function AdminProfile() {
  const { api, user, login, token } = useAuth()
  const { show: toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    province: '',
    ward: '',
    addressDetail: '',
  })

  const loadProfile = async () => {
    try {
      setLoading(true)
      const res = await api.get('/auth/me')
      const d = res.data
      setFormData({
        fullName: d.fullname || '',
        email: d.email || '',
        phone: d.phone || '',
        province: d.city || d.province || '',
        ward: d.ward || '',
        addressDetail: d.address || d.address_detail || '',
      })
    } catch (err) {
      console.error('Failed to load profile:', err)
      toast('Không thể tải thông tin hồ sơ', { type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    if (!formData.fullName.trim()) {
      toast('Họ và tên không được để trống', { type: 'warning' })
      return
    }

    try {
      setSaving(true)
      const payload = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim() || null,
        province: formData.province.trim() || null,
        ward: formData.ward.trim() || null,
        addressDetail: formData.addressDetail.trim() || null,
      }

      await api.patch('/auth/profile', payload)
      toast('Cập nhật thông tin cá nhân thành công!', { type: 'success' })

      // Update user state in auth context
      if (user && token) {
        login(token, {
          ...user,
          fullname: formData.fullName.trim(),
          phone: formData.phone.trim() || null,
        })
      }
    } catch (err) {
      console.error('Save profile failed:', err)
      toast(err.response?.data?.error || 'Lỗi khi lưu thông tin', { type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Hồ Sơ Quản Trị Viên</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Thông tin liên hệ và cài đặt tài khoản của bạn
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-muted-foreground">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
          Đang tải thông tin cá nhân...
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xs">
          {/* Avatar card */}
          <div className="flex items-center gap-4 pb-6 border-b border-border">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-orange-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              {formData.fullName?.[0]?.toUpperCase() || formData.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {formData.fullName || 'Quản trị viên'}
              </h2>
              <p className="text-xs text-muted-foreground">{formData.email}</p>
              <div className="mt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                  <Shield className="w-3 h-3" /> Quyền Quản Trị (ADMIN)
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="mt-6 space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Họ và tên *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Địa chỉ Email (Cố định)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    disabled
                    value={formData.email}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-input bg-muted/60 text-muted-foreground text-sm cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Số điện thoại liên hệ
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="tel"
                    placeholder="VD: 0987654321"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Tỉnh / Thành phố
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="VD: TP. Hồ Chí Minh"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Quận / Huyện / Phường / Xã
                </label>
                <input
                  type="text"
                  placeholder="VD: Quận 1"
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Địa chỉ chi tiết
                </label>
                <input
                  type="text"
                  placeholder="Số nhà, tên đường..."
                  value={formData.addressDetail}
                  onChange={(e) => setFormData({ ...formData, addressDetail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition shadow-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
