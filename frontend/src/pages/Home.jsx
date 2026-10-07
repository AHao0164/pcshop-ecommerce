import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'
import { listProducts, listCategories, listProductsByCategory } from '../services/catalog'
import { addItemToCart, addGuestItemToCart } from '../services/cart'
import ProductCarousel from '../components/ui/ProductCarousel'
import { useToast } from '../ui/Toast'
import Banner from '../components/Banner'
import Category from '../components/Category/Categoty'
import Footer from '../components/Footer'
import { useNavigate, Link } from 'react-router-dom'
import { Cpu, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/button'
import VI from '../constants/vi'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [featuredCategories, setFeaturedCategories] = useState([])
  const [categoryProducts, setCategoryProducts] = useState({})
  const { api, token } = useAuth()
  const { refreshCart } = useCart()
  const toast = useToast()
  const navigate = useNavigate()
  
  useEffect(() => {
    document.title = 'Trang chủ - GearUp';
  }, []);
  
  useEffect(() => { 
    let ignore = false
    setLoading(true)
    Promise.all([
      // Lấy danh sách sản phẩm mới nhất (dùng cho New Products + Best Sellers + Featured)
      listProducts({ sort: 'id_desc', page: 1 }),
      listCategories({ limit: 8 })
    ]).then(async ([resProducts, cats]) => {
      if (ignore) return
      setProducts(Array.isArray(resProducts?.items) ? resProducts.items : [])
      setFeaturedCategories(cats)
      // fetch products per category in parallel
      const entries = await Promise.all(
        cats.map(async (c) => [c.id, await listProductsByCategory(c.id, { limit: 4 })])
      )
      if (!ignore) setCategoryProducts(Object.fromEntries(entries))
    }).finally(() => setLoading(false))
    return () => { ignore = true }
  }, [])
  
  async function add(p) {
    // Calculate final price with discount (same as displayed price)
    const originalPrice = Number(p.price_cents || 0);
    const discountPercent = Number(p.discount_percent || 0);
    const finalPrice = Math.round(originalPrice * (100 - discountPercent) / 100);
    
    // Stock sẽ được check lại khi checkout và chỉ trừ khi thanh toán xong
    const availableStock = p.stock || 0;
    const quantityToAdd = 1;
    
    if (availableStock === 0) {
      toast.show('Sản phẩm đã hết hàng', { type: 'error' });
      return;
    }
    
    // Chỉ check số lượng đang thêm có <= stock hiện tại không
    if (quantityToAdd > availableStock) {
      toast.show(`Không đủ hàng trong kho. Chỉ còn ${availableStock} sản phẩm`, { type: 'error' });
      return;
    }
    
    // Đã đăng nhập: thêm vào giỏ hàng của user
    if (token) {
      try {
        await addItemToCart(api, { productId: p.id, quantity: quantityToAdd, priceCents: finalPrice })
        await refreshCart()
        toast.show(VI.products.addedToCart, { type: 'success' })
      } catch (e) {
        const errorMsg = e?.response?.data?.error || e?.message || VI.errors.somethingWentWrong;
        toast.show(errorMsg, { type: 'error' })
      }
      return
    }

    // Khách chưa đăng nhập: thêm vào guest cart
    try {
      let guestCartId = sessionStorage.getItem('guestCartId')
      const { guestCartId: newGuestCartId, items } = await addGuestItemToCart({
        guestCartId,
        productId: p.id,
        quantity: quantityToAdd,
        priceCents: finalPrice
      })
      sessionStorage.setItem('guestCartId', newGuestCartId)
      sessionStorage.setItem('guestCartItems', JSON.stringify(items))
      await refreshCart() // Refresh cart count (sẽ load từ sessionStorage)
      toast.show('✓ Đã thêm vào giỏ hàng (khách)', { type: 'success' })
    } catch (e) {
      const errorMsg = e?.response?.data?.error || e?.message || 'Lỗi khi thêm vào giỏ hàng khách';
      toast.show(errorMsg, { type: 'error' })
    }
  }

  async function buyNow(p) {
    // Calculate final price with discount (same as displayed price)
    const originalPrice = Number(p.price_cents || 0);
    const discountPercent = Number(p.discount_percent || 0);
    const finalPrice = Math.round(originalPrice * (100 - discountPercent) / 100);
    
    const availableStock = p.stock || 0;
    const quantityToBuy = 1;
    
    if (availableStock === 0) {
      toast.show('Sản phẩm đã hết hàng', { type: 'error' });
      return;
    }
    
    // Check current cart quantity + quantity to buy
    let currentQuantityInCart = 0;
    if (token) {
      try {
        const cartData = await api.get('/cart').then(r => r.data);
        const existingItem = cartData?.items?.find(item => item.product_id === p.id);
        currentQuantityInCart = existingItem ? existingItem.quantity : 0;
      } catch (e) {
        // If cart fetch fails, continue (backend will validate)
        console.warn('Could not fetch cart for validation:', e);
      }
    } else {
      // Guest cart: check sessionStorage
      const storedGuestCartItems = JSON.parse(sessionStorage.getItem('guestCartItems') || '[]');
      const existingItem = storedGuestCartItems.find(item => (item.product_id || item.productId) === p.id);
      currentQuantityInCart = existingItem ? (existingItem.quantity || 0) : 0;
    }
    
    const requestedTotalQuantity = currentQuantityInCart + quantityToBuy;
    if (requestedTotalQuantity > availableStock) {
      toast.show(`Không đủ hàng trong kho. Chỉ còn ${availableStock} sản phẩm${currentQuantityInCart > 0 ? ` (bạn đã có ${currentQuantityInCart} trong giỏ)` : ''}`, { type: 'error' });
      return;
    }
    
    if (token) {
      try {
        // Thêm vào giỏ để có item trong cart
        await addItemToCart(api, { productId: p.id, quantity: quantityToBuy, priceCents: finalPrice })
        await refreshCart()
        
        // Lấy cart mới để có item vừa thêm
        const cartData = await api.get('/cart').then(r => r.data)
        const addedItem = cartData?.items?.find(item => item.product_id === p.id)
        
        if (addedItem) {
          // Chuyển đến checkout với item vừa thêm được chọn
          navigate('/checkout', {
            state: {
              selectedItems: [addedItem],
              selectedItemIds: [addedItem.id]
            }
          })
        } else {
          // Fallback: chuyển đến cart nếu không tìm thấy item
          navigate('/cart')
        }
      } catch (e) {
        const errorMsg = e?.response?.data?.error || e?.message || VI.errors.somethingWentWrong;
        toast.show(errorMsg, { type: 'error' })
      }
      return
    }

    // Khách chưa đăng nhập: chuyển thẳng tới trang thanh toán với thông tin sản phẩm
    navigate('/checkout', {
      state: {
        guestItems: [
          {
            productId: p.id,
            quantity: quantityToBuy,
            priceCents: finalPrice
          }
        ]
      }
    })
  }
  
  const newProducts = products.slice(0, 8)

  // - Bán chạy: ưu tiên sản phẩm có giảm giá cao, nếu bằng nhau thì giá cao hơn trước
  const bestSellerProducts = [...products]
    .sort((a, b) => {
      const da = a.discount_percent || 0
      const db = b.discount_percent || 0
      if (db !== da) return db - da
      const pa = a.price_cents || 0
      const pb = b.price_cents || 0
      return pb - pa
    })
    .slice(0, 8)

  return (
    <>
      {/* Banner Section - Managed from AdminApp */}
      <div className="pt-16 sm:pt-20">
        <Banner />
      </div>
      
      {/* Divider */}
      <div className="w-full border-t border-slate-200 dark:border-slate-800 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-50"></div>
      
      {/* New Products */}
      <section id="new-products" className="w-full flex items-center justify-center py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 w-full">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-primary" />
            </div>
          ) : (
            <ProductCarousel
              products={newProducts}
              title="Sản phẩm mới"
              showViewAll
              viewAllLink="/products?sort=newest"
              onAdd={add}
              onBuyNow={buyNow}
            />
          )}
        </div>
      </section>

      {/* Divider */}
      <div className="w-full border-t border-slate-200 dark:border-slate-800 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-50"></div>

      {/* Best Sellers */}
      <section id="best-sellers" className="w-full flex items-center justify-center py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 w-full">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-primary" />
            </div>
          ) : (
            <ProductCarousel
              products={bestSellerProducts}
              title="Bán chạy"
              showViewAll
              viewAllLink="/products?sort=best-seller"
              onAdd={add}
              onBuyNow={buyNow}
            />
          )}
        </div>
      </section>

      {/* PC Builder Interactive CTA Section */}
      <section className="w-full py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-slate-900 via-slate-950 to-primary/20 p-8 sm:p-12 text-white shadow-xl">
            {/* Background decorative glow */}
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> Tính năng độc quyền GearUp
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-bitcount text-white">
                  Tự Xây Dựng Cấu Hình PC Gaming & Đồ Họa
                </h2>
                <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                  Tự do lựa chọn linh kiện theo ý thích. Hệ thống tự động tính toán công suất tiêu thụ (Watt) và kiểm tra tương thích linh kiện 100%.
                </p>

                <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>Miễn phí lắp ráp & cài đặt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>Bảo hành tận nơi 12 tháng</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>Hỗ trợ trả góp 0%</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center">
                <Link to="/build-pc">
                  <Button
                    size="lg"
                    className="h-14 px-8 text-base font-bold gap-3 rounded-2xl shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Cpu className="h-5 w-5" />
                    <span>Bắt Đầu Xây PC</span>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <p className="text-xs text-slate-400 mt-3">
                  Đã có hơn 1,200 cấu hình được tạo tháng này
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products (giữ lại block cũ làm “Gợi ý cho bạn”) */}
      <section id="featured" className="w-full flex items-center justify-center py-20">
        <div className="mx-auto max-w-7xl px-4 w-full">
          {/* Product Info Header - Fixed at top */}
          <div className="mb-8 flex items-end justify-between border-b-2 border-slate-200 dark:border-slate-700 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-bitcount text-gray-900 dark:text-white">
                {VI.products.featuredProducts}
              </h2>
              <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                {loading ? 'Đang tải...' : `${products.length} ${VI.units.items}`}
              </p>
            </div>
            <a 
              href="/products"
              className="text-base text-primary hover:text-primary/80 font-semibold underline transition-colors"
            >
              Xem tất cả →
            </a>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-primary"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <svg className="h-24 w-24 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-slate-700 dark:text-slate-300">{VI.products.noProductsFound}</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map(p => (
                <ProductCard key={p.id} product={p} onAdd={add} onBuyNow={buyNow} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Category - Moved below Featured Products */}
      <section className="w-full flex items-center justify-center py-20">
        <div className="mx-auto max-w-7xl px-4 w-full">
          <div className="mb-8 text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bitcount font-bold text-gray-900 dark:text-white mb-2">
              {VI.footer.categories}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {VI.home.categoriesDescription}
            </p>
          </div>
          <Category onNavigateToProduct={(id) => navigate(`/product/${id}`)} />
        </div>
      </section>

      {/* Divider */}
      <div className="w-full border-t border-slate-200 dark:border-slate-800 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-50"></div>

      {/* Footer */}
      <footer className="w-full flex items-end pb-8">
        <div className="w-full">
          <Footer />
        </div>
      </footer>
    </>
  )
}

