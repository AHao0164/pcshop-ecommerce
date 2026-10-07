import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Cpu,
  Layers,
  HardDrive,
  Zap,
  Box,
  Fan,
  Monitor,
  Keyboard,
  Mouse,
  Headphones,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  RefreshCw,
  ShoppingCart,
  Printer,
  Search,
  X,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react'
import { listProducts, listCategories } from '../services/catalog'
import { resolveImageUrl } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../ui/Toast'
import { addItemToCart, addGuestItemToCart } from '../services/cart'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog'
import { Separator } from '../components/ui/separator'

const BUILDER_SLOTS = [
  { id: 'cpu', name: 'Bộ vi xử lý (CPU)', keyword: 'CPU', icon: Cpu, required: true, watts: 125 },
  { id: 'mainboard', name: 'Bo mạch chủ (Mainboard)', keyword: 'Mainboard', icon: Layers, required: true, watts: 50 },
  { id: 'ram', name: 'Bộ nhớ RAM', keyword: 'RAM', icon: Layers, required: true, watts: 15 },
  { id: 'ssd', name: 'Ổ cứng SSD', keyword: 'SSD', icon: HardDrive, required: true, watts: 10 },
  { id: 'gpu', name: 'Card đồ họa (VGA)', keyword: 'GPU', icon: Monitor, required: false, watts: 280 },
  { id: 'psu', name: 'Nguồn máy tính (PSU)', keyword: 'PSU', icon: Zap, required: true, isPsu: true },
  { id: 'case', name: 'Vỏ máy tính (Case)', keyword: 'Case', icon: Box, required: true, watts: 0 },
  { id: 'cooling', name: 'Tản nhiệt CPU (Cooler)', keyword: 'Cooling', icon: Fan, required: false, watts: 15 },
  { id: 'monitor', name: 'Màn hình máy tính', keyword: 'Monitor', icon: Monitor, required: false, watts: 0 },
  { id: 'keyboard', name: 'Bàn phím máy tính', keyword: 'Keyboard', icon: Keyboard, required: false, watts: 0 },
  { id: 'mouse', name: 'Chuột máy tính', keyword: 'Mouse', icon: Mouse, required: false, watts: 0 },
  { id: 'headset', name: 'Tai nghe gaming', keyword: 'Headset', icon: Headphones, required: false, watts: 0 },
]

export default function BuildPC() {
  const navigate = useNavigate()
  const { api, token } = useAuth()
  const { refreshCart } = useCart()
  const toast = useToast()

  // Selections state: { [slotId]: { product, quantity } }
  const [selections, setSelections] = useState(() => {
    try {
      const saved = localStorage.getItem('pc_builder_selections')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  // Modal selector state
  const [activeSlot, setActiveSlot] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalProducts, setModalProducts] = useState([])
  const [loadingModal, setLoadingModal] = useState(false)
  const [modalSearch, setModalSearch] = useState('')
  const [modalSort, setModalSort] = useState('price_asc')
  const [categories, setCategories] = useState([])
  const [addingAll, setAddingAll] = useState(false)

  // Save selections to localStorage
  useEffect(() => {
    localStorage.setItem('pc_builder_selections', JSON.stringify(selections))
  }, [selections])

  // Load catalog categories once
  useEffect(() => {
    document.title = 'Xây dựng cấu hình PC - GearUp'
    listCategories({ limit: 30 })
      .then(setCategories)
      .catch((err) => console.error('Failed to load categories:', err))
  }, [])

  // Open product picker for slot
  const handleOpenSlotPicker = async (slot) => {
    setActiveSlot(slot)
    setModalSearch('')
    setModalOpen(true)
    setLoadingModal(true)

    try {
      // Find matching category ID from categories
      const matchedCat = categories.find((c) =>
        c.name.toLowerCase().includes(slot.keyword.toLowerCase())
      )

      const categoryId = matchedCat ? matchedCat.id : ''
      const res = await listProducts({
        categoryId,
        q: !categoryId ? slot.keyword : '',
        limit: 50,
      })

      setModalProducts(Array.isArray(res?.items) ? res.items : [])
    } catch (err) {
      console.error('Failed to load slot products:', err)
      setModalProducts([])
    } finally {
      setLoadingModal(false)
    }
  }

  // Select product for current slot
  const handleSelectProduct = (product) => {
    if (!activeSlot) return
    setSelections((prev) => ({
      ...prev,
      [activeSlot.id]: {
        product,
        quantity: 1,
      },
    }))
    setModalOpen(false)
    toast.show(`Đã chọn ${product.name} cho ${activeSlot.name}`, { type: 'success' })
  }

  // Remove selection from slot
  const handleRemoveSlot = (slotId) => {
    setSelections((prev) => {
      const next = { ...prev }
      delete next[slotId]
      return next
    })
  }

  // Update quantity of a selected item
  const handleUpdateQty = (slotId, delta) => {
    setSelections((prev) => {
      const current = prev[slotId]
      if (!current) return prev
      const newQty = Math.max(1, current.quantity + delta)
      return {
        ...prev,
        [slotId]: { ...current, quantity: newQty },
      }
    })
  }

  // Reset entire build
  const handleResetBuild = () => {
    if (Object.keys(selections).length === 0) return
    if (window.confirm('Bạn có chắc chắn muốn làm mới toàn bộ cấu hình PC không?')) {
      setSelections({})
      localStorage.removeItem('pc_builder_selections')
      toast.show('Đã làm mới cấu hình', { type: 'info' })
    }
  }

  // Calculation summaries
  const { totalPrice, totalWatts, selectedCount, isReady } = useMemo(() => {
    let price = 0
    let watts = 0
    let count = 0

    Object.entries(selections).forEach(([slotId, item]) => {
      if (item?.product) {
        count += 1
        const original = Number(item.product.price_cents || 0)
        const discount = Number(item.product.discount_percent || 0)
        const unitPrice = Math.round((original * (100 - discount)) / 100)
        price += unitPrice * item.quantity

        const slotDef = BUILDER_SLOTS.find((s) => s.id === slotId)
        if (slotDef?.watts) {
          watts += slotDef.watts * item.quantity
        }
      }
    })

    const requiredSlots = BUILDER_SLOTS.filter((s) => s.required)
    const hasAllRequired = requiredSlots.every((s) => selections[s.id]?.product)

    return {
      totalPrice: price,
      totalWatts: watts,
      selectedCount: count,
      isReady: hasAllRequired,
    }
  }, [selections])

  // Recommended PSU Wattage
  const recommendedPsuWatts = useMemo(() => {
    return Math.max(500, Math.ceil((totalWatts * 1.3) / 50) * 50)
  }, [totalWatts])

  // Filtered & sorted products in modal
  const filteredModalProducts = useMemo(() => {
    let list = [...modalProducts]
    if (modalSearch.trim()) {
      const q = modalSearch.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q))
      )
    }
    if (modalSort === 'price_asc') {
      list.sort((a, b) => Number(a.price_cents || 0) - Number(b.price_cents || 0))
    } else if (modalSort === 'price_desc') {
      list.sort((a, b) => Number(b.price_cents || 0) - Number(a.price_cents || 0))
    }
    return list
  }, [modalProducts, modalSearch, modalSort])

  // Add all selected products to cart
  const handleAddAllToCart = async () => {
    const selectedItemsList = Object.values(selections).filter((it) => it?.product)
    if (selectedItemsList.length === 0) {
      toast.show('Vui lòng chọn ít nhất 1 linh kiện trước khi thêm vào giỏ!', { type: 'warning' })
      return
    }

    setAddingAll(true)
    try {
      for (const item of selectedItemsList) {
        const originalPrice = Number(item.product.price_cents || 0)
        const discountPercent = Number(item.product.discount_percent || 0)
        const finalPrice = Math.round((originalPrice * (100 - discountPercent)) / 100)

        if (token) {
          await addItemToCart(api, {
            productId: item.product.id,
            quantity: item.quantity,
            priceCents: finalPrice,
          })
        } else {
          let guestCartId = sessionStorage.getItem('guestCartId')
          const { guestCartId: newGuestCartId, items } = await addGuestItemToCart({
            guestCartId,
            productId: item.product.id,
            quantity: item.quantity,
            priceCents: finalPrice,
          })
          sessionStorage.setItem('guestCartId', newGuestCartId)
          sessionStorage.setItem('guestCartItems', JSON.stringify(items))
        }
      }
      await refreshCart()
      toast.show(`Đã thêm ${selectedItemsList.length} linh kiện cấu hình vào giỏ hàng!`, { type: 'success' })
      navigate('/cart')
    } catch (err) {
      toast.show(err.message || 'Lỗi khi thêm linh kiện vào giỏ hàng', { type: 'error' })
    } finally {
      setAddingAll(false)
    }
  }

  // Print build sheet
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      {/* Top Banner & Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <nav className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
            <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Xây dựng cấu hình PC</span>
          </nav>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Cpu className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-bitcount text-foreground">
                Xây Dựng Cấu Hình PC
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Tự thiết kế bộ máy tính theo nhu cầu với tính toán điện năng & kiểm tra tương thích tự động
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons Top */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">In cấu hình</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetBuild}
            disabled={selectedCount === 0}
            className="gap-1.5 text-muted-foreground hover:text-destructive"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Làm mới</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Component Slots Column */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2 px-1">
            <span>Danh mục linh kiện ({selectedCount}/{BUILDER_SLOTS.length} đã chọn)</span>
            <span>Bảo hành chính hãng 100%</span>
          </div>

          {BUILDER_SLOTS.map((slot) => {
            const SlotIcon = slot.icon
            const selection = selections[slot.id]
            const product = selection?.product
            const quantity = selection?.quantity || 1

            const originalPrice = product ? Number(product.price_cents || 0) : 0
            const discountPercent = product ? Number(product.discount_percent || 0) : 0
            const finalPrice = product
              ? Math.round((originalPrice * (100 - discountPercent)) / 100)
              : 0

            return (
              <div
                key={slot.id}
                className={`relative rounded-xl border transition-all duration-200 ${
                  product
                    ? 'border-border bg-card shadow-sm'
                    : 'border-dashed border-border/80 bg-muted/20 hover:border-primary/50'
                }`}
              >
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Slot Header & Icon */}
                  <div className="flex items-start sm:items-center gap-3 min-w-[200px]">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        product
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <SlotIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-semibold text-foreground">
                          {slot.name}
                        </h3>
                        {slot.required && (
                          <span className="text-[10px] text-destructive font-bold">*</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {slot.isPsu
                          ? `Khuyên dùng >= ${recommendedPsuWatts}W`
                          : slot.watts > 0
                          ? `Ước tính: ~${slot.watts}W`
                          : 'Tùy chọn'}
                      </p>
                    </div>
                  </div>

                  {/* Empty Slot State */}
                  {!product ? (
                    <div className="flex items-center justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenSlotPicker(slot)}
                        className="gap-1.5 border-dashed border-primary/40 hover:border-primary hover:bg-primary/5 text-primary text-xs h-9"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Chọn {slot.keyword}</span>
                      </Button>
                    </div>
                  ) : (
                    /* Selected Slot State */
                    <div className="flex flex-1 flex-col sm:flex-row sm:items-center justify-between gap-4 pl-0 sm:pl-4 border-t sm:border-t-0 sm:border-l border-border/60 pt-3 sm:pt-0">
                      {/* Product Thumbnail & Details */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <img
                          src={
                            product.image_url
                              ? resolveImageUrl(product.image_url)
                              : 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=200&auto=format&fit=crop'
                          }
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-contain bg-muted/40 p-1 shrink-0"
                        />
                        <div className="min-w-0">
                          <Link
                            to={`/product/${product.id}`}
                            target="_blank"
                            className="text-xs sm:text-sm font-semibold hover:text-primary transition-colors line-clamp-1 flex items-center gap-1"
                            title={product.name}
                          >
                            <span>{product.name}</span>
                            <ExternalLink className="h-3 w-3 opacity-50 shrink-0" />
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-primary font-sans">
                              {finalPrice.toLocaleString('vi-VN')} ₫
                            </span>
                            {discountPercent > 0 && (
                              <span className="text-[10px] text-muted-foreground line-through">
                                {originalPrice.toLocaleString('vi-VN')} ₫
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quantity & Actions */}
                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        {/* Quantity Counter */}
                        <div className="flex items-center rounded-lg border border-border">
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(slot.id, -1)}
                            className="px-2 py-1 text-xs hover:bg-muted text-muted-foreground hover:text-foreground"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-semibold">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(slot.id, 1)}
                            className="px-2 py-1 text-xs hover:bg-muted text-muted-foreground hover:text-foreground"
                          >
                            +
                          </button>
                        </div>

                        {/* Change product button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenSlotPicker(slot)}
                          className="text-xs h-8 px-2"
                        >
                          Đổi
                        </Button>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveSlot(slot.id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                          title="Xóa linh kiện"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Sidebar Summary & Checkout Column */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-foreground flex items-center justify-between">
              <span>Tổng Quan Cấu Hình</span>
              <Badge variant="outline" className="font-semibold text-xs">
                {selectedCount} linh kiện
              </Badge>
            </h2>

            <Separator />

            {/* Power & Compatibility Cards */}
            <div className="space-y-3">
              <div className="rounded-lg bg-muted/40 p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5 text-amber-500" /> Công suất ước tính:
                  </span>
                  <span className="font-bold text-foreground">~{totalWatts} W</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Khuyến nghị nguồn:</span>
                  <span className="font-bold text-primary">{recommendedPsuWatts}W trở lên</span>
                </div>
              </div>

              {/* Compatibility Check Banner */}
              <div
                className={`rounded-lg p-3 text-xs flex items-start gap-2.5 ${
                  isReady
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                }`}
              >
                {isReady ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Cấu hình hoàn thiện & tương thích</p>
                      <p className="text-[11px] opacity-90 mt-0.5">
                        Tất cả linh kiện chính đã sẵn sàng để lắp ráp & cài đặt!
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Chưa đủ linh kiện bắt buộc</p>
                      <p className="text-[11px] opacity-90 mt-0.5">
                        Hãy chọn đủ CPU, Mainboard, RAM, Ổ cứng, Nguồn và Case.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <Separator />

            {/* Price Calculations */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Tạm tính linh kiện:</span>
                <span className="font-medium text-foreground">
                  {totalPrice.toLocaleString('vi-VN')} ₫
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Công lắp ráp & cài đặt:</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  Miễn phí 100%
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Bảo hành tận nhà 12T:</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  Miễn phí
                </span>
              </div>

              <div className="pt-3 border-t border-border flex items-baseline justify-between">
                <span className="text-base font-bold text-foreground">Tổng cộng:</span>
                <span className="text-2xl font-black text-primary font-sans">
                  {totalPrice.toLocaleString('vi-VN')} ₫
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              className="w-full gap-2 text-sm font-semibold h-11 shadow-md shadow-primary/20"
              disabled={selectedCount === 0 || addingAll}
              onClick={handleAddAllToCart}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>{addingAll ? 'Đang thêm linh kiện...' : 'Thêm Toàn Bộ Vào Giỏ Hàng'}</span>
            </Button>

            <div className="text-center">
              <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                Hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Component Picker Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-6">
          <DialogHeader className="pb-3 border-b border-border">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <span>Chọn {activeSlot?.name}</span>
            </DialogTitle>
          </DialogHeader>

          {/* Search & Sort inside dialog */}
          <div className="flex items-center gap-3 pt-3 pb-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm tên hoặc thương hiệu..."
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                className="w-full rounded-lg border border-input bg-muted/40 py-2 pl-9 pr-3 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
            <select
              value={modalSort}
              onChange={(e) => setModalSort(e.target.value)}
              className="h-9 rounded-lg border border-input bg-background px-3 text-xs font-medium cursor-pointer"
            >
              <option value="price_asc">Giá: Thấp đến Cao</option>
              <option value="price_desc">Giá: Cao đến Thấp</option>
            </select>
          </div>

          {/* Product List in dialog */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-3 py-2 min-h-[300px]">
            {loadingModal ? (
              <div className="flex flex-col items-center justify-center h-64 gap-2 text-muted-foreground text-sm">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
                <span>Đang tải danh mục linh kiện...</span>
              </div>
            ) : filteredModalProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground text-sm">
                <p>Không tìm thấy linh kiện phù hợp với từ khóa.</p>
              </div>
            ) : (
              filteredModalProducts.map((p) => {
                const originalPrice = Number(p.price_cents || 0)
                const discountPercent = Number(p.discount_percent || 0)
                const finalPrice = Math.round((originalPrice * (100 - discountPercent)) / 100)
                const isSelected = selections[activeSlot?.id]?.product?.id === p.id

                return (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between gap-4 rounded-xl border p-3 transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-border/80 bg-card hover:bg-muted/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={
                          p.image_url
                            ? resolveImageUrl(p.image_url)
                            : 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=200&auto=format&fit=crop'
                        }
                        alt={p.name}
                        className="h-14 w-14 rounded-lg object-contain bg-muted/40 p-1 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-semibold text-foreground line-clamp-1">
                          {p.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs sm:text-sm font-bold text-primary font-sans">
                            {finalPrice.toLocaleString('vi-VN')} ₫
                          </span>
                          {discountPercent > 0 && (
                            <span className="text-[10px] text-muted-foreground line-through">
                              {originalPrice.toLocaleString('vi-VN')} ₫
                            </span>
                          )}
                          {p.brand && (
                            <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                              {p.brand}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant={isSelected ? 'secondary' : 'default'}
                      onClick={() => handleSelectProduct(p)}
                      className="shrink-0 text-xs gap-1"
                    >
                      {isSelected ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Đang chọn</span>
                        </>
                      ) : (
                        <span>Chọn linh kiện</span>
                      )}
                    </Button>
                  </div>
                )
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
