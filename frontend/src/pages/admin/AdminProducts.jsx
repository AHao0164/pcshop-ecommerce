import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../ui/Toast'
import { resolveImageUrl } from '../../api/client'
import { exportToCSV, formatProductsForExport } from '../../utils/exportCSV'
import {
  Search,
  Plus,
  Trash2,
  Edit,
  Download,
  Upload,
  RefreshCw,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Package,
} from 'lucide-react'

export default function AdminProducts() {
  const { api } = useAuth()
  const { show: toast } = useToast()

  const [products, setProducts] = useState([])
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  // Filters & Pagination
  const [search, setSearch] = useState('')
  const [brandFilter, setBrandFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sort, setSort] = useState('id_desc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)

  // Selection
  const [selectedIds, setSelectedIds] = useState([])

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [form, setForm] = useState({
    name: '',
    sku: '',
    brand_id: '',
    category_id: '',
    price: '',
    discount_percent: 0,
    stock: 0,
    description: '',
    image_url: '',
  })

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const params = {
        q: search,
        page,
        pageSize,
        sort,
      }
      if (brandFilter) params.brandId = brandFilter
      if (categoryFilter) params.categoryId = categoryFilter

      const [pRes, bRes, cRes] = await Promise.all([
        api.get('/admin/catalog/products', { params }),
        api.get('/admin/catalog/brands'),
        api.get('/admin/catalog/categories'),
      ])

      setProducts(pRes.data?.items || [])
      setTotal(pRes.data?.total || 0)
      setBrands(bRes.data || [])
      setCategories(cRes.data || [])
      setSelectedIds([])
    } catch (err) {
      console.error('Failed to load products:', err)
      toast('Không thể tải danh sách sản phẩm', { type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [api, search, brandFilter, categoryFilter, sort, page, pageSize])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Open modal for Create or Edit
  const openCreateModal = () => {
    setEditingProduct(null)
    setForm({
      name: '',
      sku: '',
      brand_id: brands[0]?.id || '',
      category_id: categories[0]?.id || '',
      price: '',
      discount_percent: 0,
      stock: 10,
      description: '',
      image_url: '',
    })
    setIsModalOpen(true)
  }

  const openEditModal = (prod) => {
    setEditingProduct(prod)
    setForm({
      name: prod.name || '',
      sku: prod.sku || '',
      brand_id: prod.brand_id || '',
      category_id: prod.category_id || '',
      price: (prod.price_cents || 0) / 100,
      discount_percent: prod.discount_percent || 0,
      stock: prod.stock || 0,
      description: prod.description || '',
      image_url: prod.image_url || '',
    })
    setIsModalOpen(true)
  }

  // Handle image upload
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast('Vui lòng chọn file hình ảnh (PNG, JPG, WEBP)', { type: 'warning' })
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
        setForm((prev) => ({ ...prev, image_url: imageUrl }))
        toast('Tải ảnh lên thành công', { type: 'success' })
      }
    } catch (err) {
      console.error('Upload failed:', err)
      toast('Không thể tải ảnh lên', { type: 'error' })
    } finally {
      setUploadingImage(false)
    }
  }

  // Save product
  const handleSaveProduct = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast('Tên sản phẩm không được để trống', { type: 'warning' })
      return
    }

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      brand_id: form.brand_id ? Number(form.brand_id) : null,
      category_id: form.category_id ? Number(form.category_id) : null,
      price_cents: Math.round(Number(form.price || 0) * 100),
      discount_percent: Number(form.discount_percent || 0),
      stock: Number(form.stock || 0),
      description: form.description.trim(),
      image_url: form.image_url,
    }

    try {
      if (editingProduct) {
        await api.put(`/admin/catalog/products/${editingProduct.id}`, payload)
        toast('Cập nhật sản phẩm thành công', { type: 'success' })
      } else {
        await api.post('/admin/catalog/products', payload)
        toast('Thêm sản phẩm mới thành công', { type: 'success' })
      }
      setIsModalOpen(false)
      loadData()
    } catch (err) {
      console.error('Save product failed:', err)
      toast(err.response?.data?.error || 'Lỗi khi lưu sản phẩm', { type: 'error' })
    }
  }

  // Delete product
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}"?`)) return
    try {
      await api.delete(`/admin/catalog/products/${id}`)
      toast('Đã xóa sản phẩm', { type: 'success' })
      loadData()
    } catch (err) {
      console.error('Delete product failed:', err)
      toast('Lỗi khi xóa sản phẩm', { type: 'error' })
    }
  }

  // Batch delete
  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} sản phẩm đã chọn?`)) return

    try {
      await Promise.all(selectedIds.map((id) => api.delete(`/admin/catalog/products/${id}`)))
      toast(`Đã xóa ${selectedIds.length} sản phẩm`, { type: 'success' })
      loadData()
    } catch (err) {
      console.error('Batch delete failed:', err)
      toast('Có lỗi xảy ra khi xóa danh sách sản phẩm', { type: 'error' })
    }
  }

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0)
  }

  const totalPages = Math.ceil(total / pageSize) || 1

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Quản Lý Sản Phẩm</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Tổng cộng <span className="font-semibold text-foreground">{total}</span> sản phẩm trong kho
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBatchDelete}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-destructive text-destructive-foreground hover:opacity-90 transition shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xóa ({selectedIds.length})</span>
            </button>
          )}
          <button
            onClick={() => exportToCSV(formatProductsForExport(products), 'DanhSachSanPham')}
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
            <span>Thêm Sản Phẩm</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc SKU..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value)
              setPage(1)
            }}
            className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Filter */}
        <div>
          <select
            value={brandFilter}
            onChange={(e) => {
              setBrandFilter(e.target.value)
              setPage(1)
            }}
            className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">Tất cả thương hiệu</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Select */}
        <div>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value)
              setPage(1)
            }}
            className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="id_desc">Mới nhất trước</option>
            <option value="id_asc">Cũ nhất trước</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
            <option value="stock_asc">Tồn kho ít nhất</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/60 text-muted-foreground font-semibold border-b border-border">
              <tr>
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={products.length > 0 && selectedIds.length === products.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(products.map((p) => p.id))
                      } else {
                        setSelectedIds([])
                      }
                    }}
                    className="rounded border-border text-primary focus:ring-primary/30"
                  />
                </th>
                <th className="py-3.5 px-4">Sản Phẩm</th>
                <th className="py-3.5 px-4">Thương Hiệu & Danh Mục</th>
                <th className="py-3.5 px-4">Giá Bán</th>
                <th className="py-3.5 px-4">Tồn Kho</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                    Đang tải dữ liệu sản phẩm...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    Không tìm thấy sản phẩm nào phù hợp
                  </td>
                </tr>
              ) : (
                products.map((prod) => {
                  const isChecked = selectedIds.includes(prod.id)
                  const originalPrice = (prod.price_cents || 0) / 100
                  const finalPrice = (prod.final_price_cents || prod.price_cents || 0) / 100

                  return (
                    <tr
                      key={prod.id}
                      className={`hover:bg-muted/40 transition ${isChecked ? 'bg-primary/5' : ''}`}
                    >
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setSelectedIds((prev) =>
                              prev.includes(prod.id)
                                ? prev.filter((id) => id !== prod.id)
                                : [...prev, prod.id]
                            )
                          }}
                          className="rounded border-border text-primary focus:ring-primary/30"
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl border border-border bg-muted/40 flex items-center justify-center overflow-hidden shrink-0">
                            {prod.image_url ? (
                              <img
                                src={resolveImageUrl(prod.image_url)}
                                alt={prod.name}
                                className="w-full h-full object-contain p-1"
                                onError={(e) => {
                                  e.target.style.display = 'none'
                                }}
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <p className="font-bold text-foreground text-xs leading-snug line-clamp-2">
                              {prod.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                              SKU: {prod.sku || 'Chưa có'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 space-y-1">
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-muted text-foreground">
                            {prod.brand_name || prod.brand || 'Khác'}
                          </span>
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {prod.category_name || prod.category || 'Chưa phân loại'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-foreground text-xs">
                          {formatVND(finalPrice)}
                        </div>
                        {prod.discount_percent > 0 && (
                          <div className="flex items-center gap-1.5 mt-0.5 text-[11px]">
                            <span className="line-through text-muted-foreground">
                              {formatVND(originalPrice)}
                            </span>
                            <span className="font-bold text-destructive">
                              -{prod.discount_percent}%
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {prod.stock <= 5 ? (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-destructive/10 text-destructive border border-destructive/20">
                            Còn {prod.stock}
                          </span>
                        ) : prod.stock <= 10 ? (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                            Còn {prod.stock}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            Còn {prod.stock}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(prod)}
                            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition"
                            title="Chỉnh sửa sản phẩm"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"
                            title="Xóa sản phẩm"
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

        {/* Pagination Bar */}
        <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>
            Hiển thị trang <span className="font-semibold text-foreground">{page}</span> /{' '}
            <span className="font-semibold text-foreground">{totalPages}</span> (Tổng {total} sản phẩm)
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 rounded-xl border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-semibold text-foreground">{page}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 rounded-xl border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">
                {editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-5 space-y-4 text-xs">
              {/* Product Name */}
              <div>
                <label className="block font-semibold text-foreground mb-1">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Laptop Gaming ASUS ROG Strix G16..."
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* SKU & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Mã SKU</label>
                  <input
                    type="text"
                    placeholder="VD: ASUS-G16-2024"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Số lượng tồn kho</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              {/* Brand & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Thương hiệu</label>
                  <select
                    value={form.brand_id}
                    onChange={(e) => setForm({ ...form, brand_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="">-- Chọn thương hiệu --</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Danh mục</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Discount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Giá bán gốc (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="VD: 25000000"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Giảm giá (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.discount_percent}
                    onChange={(e) => setForm({ ...form, discount_percent: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              {/* Image Upload & URL */}
              <div>
                <label className="block font-semibold text-foreground mb-1">Hình ảnh sản phẩm</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl border border-border bg-muted/40 overflow-hidden flex items-center justify-center shrink-0">
                    {form.image_url ? (
                      <img
                        src={resolveImageUrl(form.image_url)}
                        alt="Preview"
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition">
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
                      value={form.image_url}
                      onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl border border-input bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-foreground mb-1">Mô tả sản phẩm</label>
                <textarea
                  rows="4"
                  placeholder="Nhập thông tin giới thiệu, thông số nổi bật..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* Form buttons */}
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
                  {editingProduct ? 'Lưu Thay Đổi' : 'Thêm Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
