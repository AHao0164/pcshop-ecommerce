import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../ui/Toast'
import { exportToCSV, formatBrandsForExport } from '../../utils/exportCSV'
import {
  Tag,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  X,
} from 'lucide-react'

export default function AdminBrands() {
  const { api } = useAuth()
  const { show: toast } = useToast()

  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState(null)
  const [form, setForm] = useState({
    name: '',
    icon: '',
    description: '',
    displayOrder: 0,
  })

  const loadBrands = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/catalog/brands', { params: { search } })
      setBrands(res.data || [])
    } catch (err) {
      console.error('Failed to load brands:', err)
      toast('Không thể tải danh sách thương hiệu', { type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [api, search])

  useEffect(() => {
    loadBrands()
  }, [loadBrands])

  const openCreateModal = () => {
    const nextOrder = brands.length > 0 ? Math.max(...brands.map((b) => b.display_order || 0)) + 1 : 1
    setEditingBrand(null)
    setForm({
      name: '',
      icon: '',
      description: '',
      displayOrder: nextOrder,
    })
    setIsModalOpen(true)
  }

  const openEditModal = (b) => {
    setEditingBrand(b)
    setForm({
      name: b.name || '',
      icon: b.icon || '',
      description: b.description || '',
      displayOrder: b.display_order || 0,
    })
    setIsModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast('Tên thương hiệu không được để trống', { type: 'warning' })
      return
    }

    const payload = {
      name: form.name.trim(),
      icon: form.icon.trim() || null,
      description: form.description.trim() || null,
      displayOrder: Number(form.displayOrder || 0),
    }

    try {
      if (editingBrand) {
        await api.put(`/admin/catalog/brands/${editingBrand.id}`, payload)
        toast('Cập nhật thương hiệu thành công', { type: 'success' })
      } else {
        await api.post('/admin/catalog/brands', payload)
        toast('Thêm thương hiệu mới thành công', { type: 'success' })
      }
      setIsModalOpen(false)
      loadBrands()
    } catch (err) {
      console.error('Save brand failed:', err)
      toast(err.response?.data?.error || 'Lỗi khi lưu thương hiệu', { type: 'error' })
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn có chắc muốn xóa thương hiệu "${name}"?`)) return
    try {
      await api.delete(`/admin/catalog/brands/${id}`)
      toast('Đã xóa thương hiệu', { type: 'success' })
      loadBrands()
    } catch (err) {
      console.error('Delete brand failed:', err)
      toast('Không thể xóa thương hiệu này', { type: 'error' })
    }
  }

  const filteredBrands = brands.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      (b.description && b.description.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Quản Lý Thương Hiệu</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Danh sách các nhà sản xuất linh kiện máy tính (ASUS, MSI, GIGABYTE, Intel, AMD...)
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => exportToCSV(formatBrandsForExport(filteredBrands), 'DanhSachThuongHieu')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border border-border bg-card hover:bg-muted text-foreground transition shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Xuất CSV</span>
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Thương Hiệu</span>
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo tên thương hiệu hoặc mô tả..."
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
                <th className="py-3.5 px-4 w-16">ID</th>
                <th className="py-3.5 px-4">Tên Thương Hiệu</th>
                <th className="py-3.5 px-4">Mô Tả</th>
                <th className="py-3.5 px-4 text-center">Thứ Tự</th>
                <th className="py-3.5 px-4 text-center">Số Sản Phẩm</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                    Đang tải thương hiệu...
                  </td>
                </tr>
              ) : filteredBrands.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <Tag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    Không tìm thấy thương hiệu nào
                  </td>
                </tr>
              ) : (
                filteredBrands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-muted/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      #{brand.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-foreground text-sm flex items-center gap-2">
                        {brand.icon && <span className="text-base">{brand.icon}</span>}
                        <span>{brand.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground max-w-xs truncate">
                      {brand.description || '(Chưa có mô tả)'}
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-foreground">
                      {brand.display_order || 0}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                        {brand.product_count || 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(brand)}
                          className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition"
                          title="Chỉnh sửa thương hiệu"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(brand.id, brand.name)}
                          className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"
                          title="Xóa thương hiệu"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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
                {editingBrand ? 'Chỉnh Sửa Thương Hiệu' : 'Thêm Thương Hiệu Mới'}
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
                <label className="block font-semibold text-foreground mb-1">Tên thương hiệu *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: ASUS, GIGABYTE, MSI..."
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Logo / Icon (Emoji hoặc Text)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 🏷️"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
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

              <div>
                <label className="block font-semibold text-foreground mb-1">Mô tả thương hiệu</label>
                <textarea
                  rows="3"
                  placeholder="Giới thiệu về hãng sản xuất..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
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
                  {editingBrand ? 'Lưu Thay Đổi' : 'Thêm Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
