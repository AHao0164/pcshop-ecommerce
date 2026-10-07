import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../ui/Toast'
import {
  TicketPercent,
  Search,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  X,
  CheckCircle,
  Clock,
  Ban,
  Tag,
} from 'lucide-react'

export default function AdminPromotions() {
  const { api } = useAuth()
  const { show: toast } = useToast()

  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [form, setForm] = useState({
    code: '',
    type: 'percent', // percent | fixed | freeship
    value: 10,
    active: 1,
    startDate: '',
    endDate: '',
    maxUsage: 100,
  })

  const loadCoupons = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/coupons')
      setCoupons(res.data || [])
    } catch (err) {
      console.error('Failed to load coupons:', err)
      toast('Không thể tải danh sách mã giảm giá', { type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [api])

  useEffect(() => {
    loadCoupons()
  }, [loadCoupons])

  const openCreateModal = () => {
    const now = new Date()
    const future = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    setEditingCoupon(null)
    setForm({
      code: '',
      type: 'percent',
      value: 10,
      active: 1,
      startDate: now.toISOString().slice(0, 16),
      endDate: future.toISOString().slice(0, 16),
      maxUsage: 100,
    })
    setIsModalOpen(true)
  }

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon)
    const val = coupon.type === 'fixed' ? (coupon.value || 0) / 100 : coupon.value || 0

    setForm({
      code: coupon.code || '',
      type: coupon.type || 'percent',
      value: val,
      active: coupon.active ? 1 : 0,
      startDate: coupon.start_date ? new Date(coupon.start_date).toISOString().slice(0, 16) : '',
      endDate: coupon.end_date ? new Date(coupon.end_date).toISOString().slice(0, 16) : '',
      maxUsage: coupon.max_usage ?? 100,
    })
    setIsModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.code.trim()) {
      toast('Mã giảm giá không được để trống', { type: 'warning' })
      return
    }

    const formatForAPI = (dt) => {
      if (!dt) return null
      const d = new Date(dt)
      return d.toISOString().slice(0, 19).replace('T', ' ')
    }

    const payload = {
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value:
        form.type === 'freeship'
          ? 0
          : form.type === 'fixed'
          ? Math.round(Number(form.value || 0) * 100)
          : Number(form.value || 0),
      active: form.active ? 1 : 0,
      startDate: formatForAPI(form.startDate),
      endDate: formatForAPI(form.endDate),
      maxUsage: form.maxUsage ? Number(form.maxUsage) : null,
    }

    try {
      if (editingCoupon) {
        await api.put(`/admin/coupons/${editingCoupon.id}`, payload)
        toast('Cập nhật mã giảm giá thành công', { type: 'success' })
      } else {
        await api.post('/admin/coupons', payload)
        toast('Thêm mã giảm giá mới thành công', { type: 'success' })
      }
      setIsModalOpen(false)
      loadCoupons()
    } catch (err) {
      console.error('Save coupon failed:', err)
      toast(err.response?.data?.error || 'Lỗi khi lưu mã giảm giá', { type: 'error' })
    }
  }

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Bạn có chắc muốn xóa mã giảm giá "${code}"?`)) return
    try {
      await api.delete(`/admin/coupons/${id}`)
      toast('Đã xóa mã giảm giá', { type: 'success' })
      loadCoupons()
    } catch (err) {
      console.error('Delete coupon failed:', err)
      toast('Lỗi khi xóa mã giảm giá', { type: 'error' })
    }
  }

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0)
  }

  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Khuyến Mãi & Voucher</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Quản lý mã giảm giá, voucher freeship và các chương trình ưu đãi
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={loadCoupons}
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
            <span>Thêm Mã Giảm Giá</span>
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo mã code (VD: SALE2026)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/60 text-muted-foreground font-semibold border-b border-border">
              <tr>
                <th className="py-3.5 px-4">Mã Code</th>
                <th className="py-3.5 px-4">Loại Khuyến Mãi</th>
                <th className="py-3.5 px-4">Giá Trị Giảm</th>
                <th className="py-3.5 px-4">Thời Hạn</th>
                <th className="py-3.5 px-4 text-center">Lượt Dùng</th>
                <th className="py-3.5 px-4 text-center">Trạng Thái</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                    Đang tải danh sách voucher...
                  </td>
                </tr>
              ) : filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <TicketPercent className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    Không tìm thấy mã giảm giá nào
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => {
                  const isExpired = coupon.end_date && new Date(coupon.end_date) < new Date()

                  return (
                    <tr key={coupon.id} className="hover:bg-muted/40 transition">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-extrabold text-sm px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {coupon.type === 'percent' && (
                          <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-500/10 text-blue-600">
                            Giảm theo %
                          </span>
                        )}
                        {coupon.type === 'fixed' && (
                          <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-500/10 text-purple-600">
                            Giảm số tiền cố định
                          </span>
                        )}
                        {coupon.type === 'freeship' && (
                          <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-600">
                            Miễn phí vận chuyển
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-foreground text-sm">
                        {coupon.type === 'percent' && `${coupon.value}%`}
                        {coupon.type === 'fixed' && formatVND((coupon.value || 0) / 100)}
                        {coupon.type === 'freeship' && 'FreeShip 100%'}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {coupon.start_date && (
                          <div>Từ: {new Date(coupon.start_date).toLocaleDateString('vi-VN')}</div>
                        )}
                        {coupon.end_date && (
                          <div>Đến: {new Date(coupon.end_date).toLocaleDateString('vi-VN')}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold">
                        <span className="text-foreground">{coupon.used_count || 0}</span>
                        <span className="text-muted-foreground">
                          {' '}
                          / {coupon.max_usage ? coupon.max_usage : '∞'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {isExpired ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-destructive/10 text-destructive border border-destructive/20">
                            <Clock className="w-3 h-3" /> Hết hạn
                          </span>
                        ) : coupon.active ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            <CheckCircle className="w-3 h-3" /> Hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground border border-border">
                            <Ban className="w-3 h-3" /> Đang khóa
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(coupon)}
                            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition"
                            title="Chỉnh sửa mã"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon.id, coupon.code)}
                            className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"
                            title="Xóa mã"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">
                {editingCoupon ? 'Chỉnh Sửa Mã Giảm Giá' : 'Thêm Mã Giảm Giá Mới'}
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
                <label className="block font-semibold text-foreground mb-1">Mã code *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: SPRING2026, FREESHIP..."
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Hình thức giảm *</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="percent">Giảm theo phần trăm (%)</option>
                  <option value="fixed">Giảm số tiền cố định (VNĐ)</option>
                  <option value="freeship">Miễn phí vận chuyển (Freeship)</option>
                </select>
              </div>

              {form.type !== 'freeship' && (
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    {form.type === 'percent' ? 'Mức giảm (%) *' : 'Số tiền giảm (VNĐ) *'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={form.type === 'percent' ? 100 : undefined}
                    placeholder={form.type === 'percent' ? '10' : '50000'}
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Bắt đầu từ</label>
                  <input
                    type="datetime-local"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-input bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Hết hạn vào</label>
                  <input
                    type="datetime-local"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-input bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Giới hạn số lượt dùng</label>
                <input
                  type="number"
                  placeholder="Để trống nếu không giới hạn"
                  value={form.maxUsage}
                  onChange={(e) => setForm({ ...form, maxUsage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeCoupon"
                  checked={Boolean(form.active)}
                  onChange={(e) => setForm({ ...form, active: e.target.checked ? 1 : 0 })}
                  className="rounded border-border text-primary focus:ring-primary/30 w-4 h-4"
                />
                <label htmlFor="activeCoupon" className="font-semibold text-foreground cursor-pointer">
                  Kích hoạt mã để khách hàng áp dụng ngay
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
                  {editingCoupon ? 'Lưu Thay Đổi' : 'Thêm Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
