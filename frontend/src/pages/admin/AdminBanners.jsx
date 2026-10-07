import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../ui/Toast'
import { resolveImageUrl } from '../../api/client'
import {
  Image as ImageIcon,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Upload,
  X,
  ExternalLink,
  Eye,
  EyeOff,
} from 'lucide-react'

export default function AdminBanners() {
  const { api } = useAuth()
  const { show: toast } = useToast()

  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(false)

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [form, setForm] = useState({
    title: '',
    imageUrl: '',
    linkUrl: '',
    displayOrder: 1,
    active: 1,
  })

  const loadBanners = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/banners')
      const sorted = (res.data || []).sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
      setBanners(sorted)
    } catch (err) {
      console.error('Failed to load banners:', err)
      toast('Không thể tải danh sách banner', { type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [api])

  useEffect(() => {
    loadBanners()
  }, [loadBanners])

  const openCreateModal = () => {
    const nextOrder = banners.length > 0 ? Math.max(...banners.map((b) => b.display_order || 0)) + 1 : 1
    setEditingBanner(null)
    setForm({
      title: '',
      imageUrl: '',
      linkUrl: '',
      displayOrder: nextOrder,
      active: 1,
    })
    setIsModalOpen(true)
  }

  const openEditModal = (b) => {
    setEditingBanner(b)
    setForm({
      title: b.title || '',
      imageUrl: b.image_url || b.imageUrl || '',
      linkUrl: b.link_url || b.linkUrl || '',
      displayOrder: b.display_order ?? b.displayOrder ?? 1,
      active: b.active ? 1 : 0,
    })
    setIsModalOpen(true)
  }

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast('Vui lòng chọn file hình ảnh', { type: 'warning' })
      return
    }

    try {
      setUploadingImage(true)
      const formData = new FormData()
      formData.append('image', file)

      const res = await api.post('/admin/catalog/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const imageUrl = res.data?.imageUrl
      if (imageUrl) {
        setForm((prev) => ({ ...prev, imageUrl }))
        toast('Tải ảnh banner thành công', { type: 'success' })
      }
    } catch (err) {
      console.error('Upload failed:', err)
      toast('Không thể tải ảnh banner lên', { type: 'error' })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.imageUrl.trim()) {
      toast('Vui lòng chọn hình ảnh cho banner', { type: 'warning' })
      return
    }

    const payload = {
      title: form.title.trim() || 'Banner',
      imageUrl: form.imageUrl.trim(),
      linkUrl: form.linkUrl.trim() || '/',
      displayOrder: Number(form.displayOrder || 1),
      active: form.active ? 1 : 0,
    }

    try {
      if (editingBanner) {
        await api.put(`/admin/banners/${editingBanner.id}`, payload)
        toast('Cập nhật banner thành công', { type: 'success' })
      } else {
        await api.post('/admin/banners', payload)
        toast('Thêm banner mới thành công', { type: 'success' })
      }
      setIsModalOpen(false)
      loadBanners()
    } catch (err) {
      console.error('Save banner failed:', err)
      toast(err.response?.data?.error || 'Lỗi khi lưu banner', { type: 'error' })
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa banner này?')) return
    try {
      await api.delete(`/admin/banners/${id}`)
      toast('Đã xóa banner', { type: 'success' })
      loadBanners()
    } catch (err) {
      console.error('Delete banner failed:', err)
      toast('Lỗi khi xóa banner', { type: 'error' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Banner Trang Chủ</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Quản lý slider hình ảnh và các chiến dịch quảng cáo hiển thị trên trang chủ
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={loadBanners}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border border-border bg-card hover:bg-muted text-foreground transition shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Banner</span>
          </button>
        </div>
      </div>

      {/* Banner Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-muted-foreground">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
          Đang tải banner...
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground shadow-xs">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-semibold text-foreground">Chưa có banner nào</p>
          <p className="text-xs text-muted-foreground mt-1">
            Nhấn "Thêm Banner" ở trên để tải lên hình ảnh quảng cáo đầu tiên.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => {
            const img = banner.image_url || banner.imageUrl
            const link = banner.link_url || banner.linkUrl

            return (
              <div
                key={banner.id}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between group hover:border-primary/40 transition"
              >
                <div>
                  {/* Banner Image Preview */}
                  <div className="relative aspect-[16/7] bg-muted/50 overflow-hidden border-b border-border">
                    {img ? (
                      <img
                        src={resolveImageUrl(img)}
                        alt={banner.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      {banner.active ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow">
                          <Eye className="w-3 h-3" /> Hiển thị
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted-foreground/80 text-white shadow">
                          <EyeOff className="w-3 h-3" /> Đang ẩn
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Banner Info */}
                  <div className="p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-foreground text-sm line-clamp-1">
                        {banner.title || 'Không có tiêu đề'}
                      </h4>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        Thứ tự: {banner.display_order ?? banner.displayOrder ?? 0}
                      </span>
                    </div>

                    {link && (
                      <div className="flex items-center gap-1.5 text-muted-foreground truncate">
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span className="truncate">{link}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 pt-0 border-t border-border flex items-center justify-end gap-2 mt-2">
                  <button
                    onClick={() => openEditModal(banner)}
                    className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition text-xs font-semibold inline-flex items-center gap-1.5"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Sửa</span>
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition text-xs font-semibold inline-flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">
                {editingBanner ? 'Chỉnh Sửa Banner' : 'Thêm Banner Mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">Tiêu đề quảng cáo</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Siêu Sale Khai Xuân 2026..."
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* Image Preview & Upload */}
              <div>
                <label className="block font-semibold text-foreground mb-1">Hình ảnh Banner *</label>
                <div className="space-y-3">
                  <div className="aspect-[16/7] w-full rounded-xl border border-border bg-muted/40 overflow-hidden flex items-center justify-center">
                    {form.imageUrl ? (
                      <img
                        src={resolveImageUrl(form.imageUrl)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                        <span className="text-[11px]">Chưa chọn hình ảnh</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition">
                      <Upload className="w-4 h-4" />
                      <span>{uploadingImage ? 'Đang tải lên...' : 'Chọn file ảnh'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageFileChange}
                        disabled={uploadingImage}
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Hoặc dán URL ảnh trực tiếp..."
                      value={form.imageUrl}
                      onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-xl border border-input bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Đường dẫn khi nhấp (Link)</label>
                  <input
                    type="text"
                    placeholder="VD: /products?brandId=1"
                    value={form.linkUrl}
                    onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Thứ tự hiển thị</label>
                  <input
                    type="number"
                    value={form.displayOrder}
                    onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeBanner"
                  checked={Boolean(form.active)}
                  onChange={(e) => setForm({ ...form, active: e.target.checked ? 1 : 0 })}
                  className="rounded border-border text-primary focus:ring-primary/30 w-4 h-4"
                />
                <label htmlFor="activeBanner" className="font-semibold text-foreground cursor-pointer">
                  Kích hoạt hiển thị ngay trên trang chủ
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition shadow-sm"
                >
                  {editingBanner ? 'Lưu Thay Đổi' : 'Thêm Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
