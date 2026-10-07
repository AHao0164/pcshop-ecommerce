import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import {
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  Star,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Tag,
  DollarSign
} from 'lucide-react'
import { listProducts } from '../services/catalog'
import { VI } from '../constants/vi'
import { getCategoryVietnameseName } from '../constants/categoryMapping'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../ui/Toast'
import { addItemToCart, addGuestItemToCart } from '../services/cart'
import ProductCard from '../components/ProductCard'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Skeleton } from '../components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../components/ui/sheet'
import { Separator } from '../components/ui/separator'

export default function Products() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const { api, token } = useAuth()
  const { refreshCart } = useCart()
  const toast = useToast()

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({ items: [], page: 1, pageSize: 20, total: 0 })
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('productViewMode') || 'grid'
  })
  const [addingToCart, setAddingToCart] = useState(new Set())
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const q = params.get('q') || ''
  const page = parseInt(params.get('page') || '1', 10)
  const sort = params.get('sort') || 'id_desc'
  const categoryId = params.get('categoryId') || ''
  const brandId = params.get('brandId') || ''
  const minPrice = params.get('minPrice') || ''
  const maxPrice = params.get('maxPrice') || ''
  const minRating = params.get('minRating') || ''

  useEffect(() => {
    document.title = 'Danh sách sản phẩm - GearUp'
  }, [])

  // Load brands and categories from catalog service
  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8080'
    fetch(`${apiBase}/catalog/brands`)
      .then((r) => r.json())
      .then((res) => setBrands(Array.isArray(res) ? res : res.items || []))
      .catch(() => setBrands([]))

    fetch(`${apiBase}/catalog/categories`)
      .then((r) => r.json())
      .then((res) => setCategories(Array.isArray(res) ? res : res.items || []))
      .catch(() => setCategories([]))
  }, [])

  // Fetch product listings with applied query params
  useEffect(() => {
    let ignore = false
    setLoading(true)
    listProducts({ q, page, sort, categoryId, brandId, minPrice, maxPrice, minRating })
      .then((res) => {
        if (!ignore) setData(res || { items: [], page: 1, pageSize: 20, total: 0 })
      })
      .catch((err) => {
        console.error('Fetch products error:', err)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [q, page, sort, categoryId, brandId, minPrice, maxPrice, minRating])

  const totalPages = useMemo(() => Math.max(1, Math.ceil(data.total / data.pageSize)), [data])

  function updateParam(key, value) {
    const next = new URLSearchParams(params)
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    // Reset to page 1 when filter changes
    if (key !== 'page') {
      next.delete('page')
    }
    setParams(next)
  }

  function handleViewModeChange(mode) {
    setViewMode(mode)
    localStorage.setItem('productViewMode', mode)
  }

  async function handleAddToCart(p) {
    if (addingToCart.has(p.id)) return

    setAddingToCart((prev) => new Set(prev).add(p.id))

    try {
      const originalPrice = Number(p.price_cents || 0)
      const discountPercent = Number(p.discount_percent || 0)
      const finalPrice = Math.round((originalPrice * (100 - discountPercent)) / 100)

      if (token) {
        await addItemToCart(api, {
          productId: p.id,
          quantity: 1,
          priceCents: finalPrice,
        })
        await refreshCart()
        toast.show('Đã thêm sản phẩm vào giỏ hàng!', { type: 'success' })
      } else {
        let guestCartId = sessionStorage.getItem('guestCartId')
        const { guestCartId: newGuestCartId, items } = await addGuestItemToCart({
          guestCartId,
          productId: p.id,
          quantity: 1,
          priceCents: finalPrice,
        })
        sessionStorage.setItem('guestCartId', newGuestCartId)
        sessionStorage.setItem('guestCartItems', JSON.stringify(items))
        await refreshCart()
        toast.show('Đã thêm sản phẩm vào giỏ hàng!', { type: 'success' })
      }
    } catch (e) {
      toast.show(e.message || 'Lỗi khi thêm vào giỏ hàng', { type: 'error' })
    } finally {
      setAddingToCart((prev) => {
        const next = new Set(prev)
        next.delete(p.id)
        return next
      })
    }
  }

  async function handleBuyNow(p) {
    const originalPrice = Number(p.price_cents || 0)
    const discountPercent = Number(p.discount_percent || 0)
    const finalPrice = Math.round((originalPrice * (100 - discountPercent)) / 100)

    if (token) {
      try {
        await addItemToCart(api, {
          productId: p.id,
          quantity: 1,
          priceCents: finalPrice,
        })
        await refreshCart()
        const cartData = await api.get('/cart').then((r) => r.data)
        const addedItem = cartData?.items?.find((item) => item.product_id === p.id)

        if (addedItem) {
          navigate('/checkout', {
            state: {
              selectedItems: [addedItem],
              selectedItemIds: [addedItem.id],
            },
          })
        } else {
          navigate('/cart')
        }
      } catch (e) {
        toast.show(e.message || 'Lỗi khi xử lý đặt mua', { type: 'error' })
      }
    } else {
      navigate('/checkout', {
        state: {
          guestItems: [
            {
              productId: p.id,
              quantity: 1,
              priceCents: finalPrice,
            },
          ],
        },
      })
    }
  }

  const hasActiveFilters = Boolean(q || categoryId || brandId || minPrice || minRating)

  // Price presets
  const pricePresets = [
    { label: 'Tất cả giá', min: '', max: '' },
    { label: 'Dưới 10 triệu', min: '0', max: '10000000' },
    { label: '10 - 20 triệu', min: '10000000', max: '20000000' },
    { label: '20 - 35 triệu', min: '20000000', max: '35000000' },
    { label: '35 - 50 triệu', min: '35000000', max: '50000000' },
    { label: 'Trên 50 triệu', min: '50000000', max: '999999999' },
  ]

  const currentPriceRangeValue = minPrice ? `${minPrice}-${maxPrice}` : ''

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      {/* Page Title & Breadcrumb */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
            <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Sản phẩm</span>
            {q && (
              <>
                <span>/</span>
                <span className="text-primary truncate max-w-xs">"{q}"</span>
              </>
            )}
          </nav>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-bitcount text-foreground">
            {VI.products.allProducts}
          </h1>
        </div>

        {/* View Mode & Sort (Desktop) */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="sm:hidden gap-1.5">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Bộ lọc</span>
                {hasActiveFilters && (
                  <Badge variant="default" className="h-5 w-5 p-0 justify-center text-[10px]">
                    !
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-md p-6 overflow-y-auto">
              <SheetHeader className="text-left mb-4">
                <SheetTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" />
                  <span>Bộ Lọc Sản Phẩm</span>
                </SheetTitle>
              </SheetHeader>

              <div className="space-y-6 pt-2">
                {/* Category Mobile */}
                <div>
                  <label className="text-sm font-semibold mb-2 block">Danh mục</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <Button
                      variant={!categoryId ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        updateParam('categoryId', '')
                        setMobileFilterOpen(false)
                      }}
                      className="justify-start text-xs truncate"
                    >
                      Tất cả
                    </Button>
                    {categories.map((cat) => (
                      <Button
                        key={cat.id}
                        variant={categoryId === String(cat.id) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          updateParam('categoryId', String(cat.id))
                          setMobileFilterOpen(false)
                        }}
                        className="justify-start text-xs truncate"
                      >
                        {cat.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Brands Mobile */}
                <div>
                  <label className="text-sm font-semibold mb-2 block">Thương hiệu</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <Button
                      variant={!brandId ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        updateParam('brandId', '')
                        setMobileFilterOpen(false)
                      }}
                      className="text-xs"
                    >
                      Tất cả
                    </Button>
                    {brands.map((b) => (
                      <Button
                        key={b.id}
                        variant={brandId === String(b.id) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          updateParam('brandId', String(b.id))
                          setMobileFilterOpen(false)
                        }}
                        className="text-xs truncate"
                      >
                        {b.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Price Mobile */}
                <div>
                  <label className="text-sm font-semibold mb-2 block">Mức giá</label>
                  <div className="flex flex-col gap-1.5">
                    {pricePresets.map((pr, i) => (
                      <Button
                        key={i}
                        variant={
                          (!minPrice && !pr.min) || (minPrice === pr.min && maxPrice === pr.max)
                            ? 'default'
                            : 'outline'
                        }
                        size="sm"
                        onClick={() => {
                          updateParam('minPrice', pr.min)
                          updateParam('maxPrice', pr.max)
                          setMobileFilterOpen(false)
                        }}
                        className="justify-start text-xs"
                      >
                        {pr.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {hasActiveFilters && (
                  <Button
                    variant="destructive"
                    className="w-full gap-2"
                    onClick={() => {
                      setParams({})
                      setMobileFilterOpen(false)
                    }}
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Xóa toàn bộ bộ lọc</span>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden md:inline">Sắp xếp:</span>
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="h-9 rounded-lg border border-input bg-background px-3 pr-8 text-xs font-medium focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
            >
              <option value="id_desc">Mới nhất</option>
              <option value="price_asc">Giá: Thấp đến Cao</option>
              <option value="price_desc">Giá: Cao đến Thấp</option>
              <option value="name_asc">Tên: A-Z</option>
              <option value="name_desc">Tên: Z-A</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg border border-border p-0.5 bg-muted/40">
            <button
              onClick={() => handleViewModeChange('grid')}
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-background text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Xem dạng lưới"
              aria-label="Xem dạng lưới"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleViewModeChange('list')}
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-background text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Xem dạng danh sách"
              aria-label="Xem dạng danh sách"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Filter Bar (Faceted Horizontal Controls) */}
      <div className="hidden sm:block mb-6 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary shrink-0" />
            <select
              value={categoryId}
              onChange={(e) => updateParam('categoryId', e.target.value)}
              className="h-9 min-w-[170px] rounded-lg border border-input bg-background px-3 text-xs font-medium focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {getCategoryVietnameseName(cat.name)}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={brandId}
              onChange={(e) => updateParam('brandId', e.target.value)}
              className="h-9 min-w-[150px] rounded-lg border border-input bg-background px-3 text-xs font-medium focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
            >
              <option value="">Tất cả hãng sản xuất</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Dropdown */}
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-500 shrink-0" />
            <select
              value={currentPriceRangeValue}
              onChange={(e) => {
                const [min, max] = e.target.value.split('-')
                updateParam('minPrice', min || '')
                updateParam('maxPrice', max || '')
              }}
              className="h-9 min-w-[160px] rounded-lg border border-input bg-background px-3 text-xs font-medium focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
            >
              {pricePresets.map((pr, idx) => (
                <option key={idx} value={pr.min ? `${pr.min}-${pr.max}` : ''}>
                  {pr.label}
                </option>
              ))}
            </select>
          </div>

          {/* Rating Dropdown */}
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500 shrink-0" />
            <select
              value={minRating}
              onChange={(e) => updateParam('minRating', e.target.value)}
              className="h-9 min-w-[130px] rounded-lg border border-input bg-background px-3 text-xs font-medium focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
            >
              <option value="">Tất cả đánh giá</option>
              <option value="4.5">★ 4.5+ sao</option>
              <option value="4.0">★ 4.0+ sao</option>
              <option value="3.5">★ 3.5+ sao</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setParams({})}
              className="ml-auto text-destructive hover:bg-destructive/10 text-xs h-9 gap-1"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Xóa bộ lọc</span>
            </Button>
          )}
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground font-medium">Đang lọc theo:</span>

          {q && (
            <Badge variant="secondary" className="gap-1 pr-1 py-1">
              <span>Tìm kiếm: "{q}"</span>
              <button
                onClick={() => updateParam('q', '')}
                className="hover:text-destructive rounded-full p-0.5"
                aria-label="Xóa tìm kiếm"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {categoryId && (
            <Badge variant="secondary" className="gap-1 pr-1 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <span>
                {getCategoryVietnameseName(categories.find((c) => String(c.id) === String(categoryId))?.name || '')}
              </span>
              <button
                onClick={() => updateParam('categoryId', '')}
                className="hover:text-destructive rounded-full p-0.5"
                aria-label="Xóa danh mục"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {brandId && (
            <Badge variant="secondary" className="gap-1 pr-1 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <span>{brands.find((b) => String(b.id) === String(brandId))?.name || ''}</span>
              <button
                onClick={() => updateParam('brandId', '')}
                className="hover:text-destructive rounded-full p-0.5"
                aria-label="Xóa hãng"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {minPrice && (
            <Badge variant="secondary" className="gap-1 pr-1 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <span>
                {parseInt(minPrice) === 0
                  ? `Dưới ${(parseInt(maxPrice) / 1000000).toFixed(0)} triệu`
                  : parseInt(maxPrice) > 50000000
                  ? `Trên ${(parseInt(minPrice) / 1000000).toFixed(0)} triệu`
                  : `${(parseInt(minPrice) / 1000000).toFixed(0)} - ${(parseInt(maxPrice) / 1000000).toFixed(0)} triệu`}
              </span>
              <button
                onClick={() => {
                  updateParam('minPrice', '')
                  updateParam('maxPrice', '')
                }}
                className="hover:text-destructive rounded-full p-0.5"
                aria-label="Xóa khoảng giá"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {minRating && (
            <Badge variant="secondary" className="gap-1 pr-1 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <span>★ {parseFloat(minRating).toFixed(1)}+ sao</span>
              <button
                onClick={() => updateParam('minRating', '')}
                className="hover:text-destructive rounded-full p-0.5"
                aria-label="Xóa đánh giá"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          <button
            onClick={() => setParams({})}
            className="text-xs text-muted-foreground hover:text-destructive underline ml-2"
          >
            Xóa tất cả
          </button>
        </div>
      )}

      {/* Results Header Count */}
      <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
        {!loading && (
          <span>
            Tìm thấy <strong className="text-foreground font-semibold">{data.total}</strong> sản phẩm phù hợp
          </span>
        )}
      </div>

      {/* Product Grid / List Content */}
      {loading ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
              : 'space-y-4'
          }
        >
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="rounded-xl border border-border p-4 space-y-3">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-9 flex-1 rounded-lg" />
                <Skeleton className="h-9 flex-1 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : data.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-border bg-card/50 p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Search className="h-8 w-8 text-muted-foreground opacity-60" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Không tìm thấy sản phẩm phù hợp
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            Thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt các bộ lọc danh mục và mức giá để xem thêm sản phẩm khác.
          </p>
          {hasActiveFilters && (
            <Button onClick={() => setParams({})} variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              <span>Xóa bộ lọc</span>
            </Button>
          )}
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
              : 'space-y-4'
          }
        >
          {data.items.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              viewMode={viewMode}
              onAdd={handleAddToCart}
              onBuyNow={handleBuyNow}
              isAdding={addingToCart.has(p.id)}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && data.items.length > 0 && totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-1.5 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => updateParam('page', String(page - 1))}
            className="gap-1 h-9"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Trước</span>
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (page <= 3) {
                pageNum = i + 1
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = page - 2 + i
              }

              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => updateParam('page', String(pageNum))}
                  className="h-9 w-9 p-0 font-medium text-xs"
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => updateParam('page', String(page + 1))}
            className="gap-1 h-9"
          >
            <span className="hidden sm:inline">Sau</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
