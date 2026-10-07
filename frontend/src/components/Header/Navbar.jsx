import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Search,
  ShoppingCart,
  User,
  Sun,
  Moon,
  Cpu,
  Menu,
  X,
  ChevronDown,
  Package,
  Bell,
  LogOut,
  Sparkles,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useTheme } from '../../ui/ThemeProvider'
import { listCategories } from '../../services/catalog'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import { Separator } from '../ui/separator'
import MegaMenu, { MEGA_MENU_DATA } from './MegaMenu'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, token, logout } = useAuth()
  const { cartCount, showBadge, dismissBadge } = useCart()
  const { theme, toggle: toggleTheme } = useTheme()

  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState([])
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const searchInputRef = useRef(null)

  // Fetch categories for dropdown
  useEffect(() => {
    let isMounted = true
    const fetchCats = async () => {
      try {
        const data = await listCategories({ limit: 20 })
        if (isMounted) setCategories(data)
      } catch (err) {
        console.error('Navbar category fetch error:', err)
      }
    }
    fetchCats()
    return () => {
      isMounted = false
    }
  }, [])

  // Sync search input with URL params if on /products
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('q')
    if (q) {
      setSearchQuery(q)
    } else if (location.pathname !== '/products') {
      setSearchQuery('')
    }
  }, [location.pathname, location.search])

  const handleSearchSubmit = (e) => {
    e?.preventDefault()
    const query = searchQuery.trim()
    if (query) {
      navigate(`/products?q=${encodeURIComponent(query)}`)
    } else {
      navigate('/products')
    }
    setMobileMenuOpen(false)
  }

  const handleCartClick = () => {
    dismissBadge()
    navigate('/cart')
    setMobileMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-md transition-colors duration-200">
      {/* Top micro announcement bar */}
      <div className="hidden border-b border-border/40 bg-muted/40 py-1.5 text-xs text-muted-foreground sm:block">
        <div className="container mx-auto flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-medium text-primary">
              <Sparkles className="h-3 w-3" /> Siêu ưu đãi PC Gaming & Linh kiện 2026
            </span>
            <span>•</span>
            <span>Miễn phí giao hàng toàn quốc từ 1.000.000đ</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/products?sort=discount" className="hover:text-primary transition-colors">
              Khuyến Mãi Hot
            </Link>
            <span>•</span>
            <Link to="/build-pc" className="hover:text-primary transition-colors font-medium">
              Xây dựng cấu hình
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="container mx-auto flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
        {/* Left: Mobile Menu Trigger + Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Mở menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] max-w-sm p-0 flex flex-col justify-between">
              <div className="p-6 overflow-y-auto">
                <SheetHeader className="text-left mb-6">
                  <SheetTitle className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight font-bitcount">
                      Gear<span className="text-primary">Up</span>
                    </span>
                    <Badge variant="outline" className="text-[10px]">PC Store</Badge>
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Search */}
                <form onSubmit={handleSearchSubmit} className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Tìm CPU, VGA, bàn phím..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-lg border border-input bg-muted/50 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </form>

                {/* PC Builder Highlight Banner */}
                <div className="mb-6 rounded-xl border border-primary/30 bg-primary/5 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Xây Dựng Cấu Hình PC</h4>
                      <p className="text-xs text-muted-foreground">Tự chọn linh kiện & kiểm tra tương thích</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => {
                      navigate('/build-pc')
                      setMobileMenuOpen(false)
                    }}
                  >
                    Bắt đầu xây dựng <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                {/* Nav Links */}
                <div className="space-y-1 mb-6">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    Trang chủ
                  </Link>
                  <Link
                    to="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    Tất cả sản phẩm
                  </Link>
                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    Giỏ hàng
                    {cartCount > 0 && <Badge variant="default">{cartCount}</Badge>}
                  </Link>
                  {token && (
                    <Link
                      to="/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                    >
                      Đơn hàng của tôi
                    </Link>
                  )}
                  {token && user?.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-bold text-primary bg-primary/10 border border-primary/20"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Trang Quản Trị</span>
                      </div>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>

                <Separator className="my-4" />

                {/* Categories Grouped */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-3 mb-2.5 flex items-center justify-between">
                    <span>Danh mục sản phẩm</span>
                    <Sparkles className="h-3 w-3 text-primary" />
                  </h4>
                  <div className="space-y-2">
                    {MEGA_MENU_DATA.map((group) => {
                      const Icon = group.icon
                      return (
                        <div key={group.id} className="rounded-xl border border-border/60 overflow-hidden">
                          <div className="flex items-center justify-between px-3 py-2 bg-muted/30">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                                <Icon className="h-3.5 w-3.5" />
                              </div>
                              <span className="text-xs font-bold text-foreground">{group.name}</span>
                            </div>
                            <Link
                              to={group.bannerLink}
                              onClick={() => setMobileMenuOpen(false)}
                              className="text-[10px] text-primary font-semibold hover:underline"
                            >
                              Tất cả
                            </Link>
                          </div>
                          <div className="p-2 grid grid-cols-2 gap-1.5 bg-background">
                            {group.subcategories.map((sub, sidx) => {
                              const matched = categories.find(
                                (c) =>
                                  c.name.toLowerCase() === sub.name.toLowerCase() ||
                                  (sub.keyword && c.name.toLowerCase().includes(sub.keyword.toLowerCase())) ||
                                  sub.name.toLowerCase().includes(c.name.toLowerCase())
                              )
                              const targetLink =
                                sub.link ||
                                (matched
                                  ? `/products?categoryId=${matched.id}`
                                  : `/products?q=${encodeURIComponent(sub.keyword || sub.name)}`)

                              return (
                                <Link
                                  key={sidx}
                                  to={targetLink}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted text-xs text-foreground min-w-0"
                                >
                                  <img
                                    src={sub.image}
                                    alt={sub.name}
                                    className="h-6 w-6 object-contain rounded bg-muted/60 p-0.5 shrink-0"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                    }}
                                  />
                                  <span className="truncate text-[11px] font-medium">{sub.name}</span>
                                </Link>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Mobile Account Footer */}
              <div className="border-t border-border p-4 bg-muted/30">
                {token ? (
                  <div className="flex items-center justify-between">
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <User className="h-4 w-4" />
                      <span>{user?.fullName || user?.email || 'Tài khoản'}</span>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive">
                      <LogOut className="h-4 w-4 mr-1" /> Thoát
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigate('/login')
                        setMobileMenuOpen(false)
                      }}
                    >
                      Đăng nhập
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        navigate('/register')
                        setMobileMenuOpen(false)
                      }}
                    >
                      Đăng ký
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-rose-600 text-white font-extrabold shadow-md shadow-primary/25 transition-transform group-hover:scale-105">
              GU
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight leading-none font-bitcount text-foreground">
                Gear<span className="text-primary">Up</span>
              </span>
              <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                PC & Hardware
              </span>
            </div>
          </Link>

          {/* Desktop MegaMenu Dropdown */}
          <div className="hidden lg:block ml-2">
            <MegaMenu
              categories={categories}
              isOpen={categoriesOpen}
              onOpenChange={setCategoriesOpen}
              onClose={() => setCategoriesOpen(false)}
            />
          </div>
        </div>

        {/* Center: Search input */}
        <div className="flex-1 max-w-xl mx-2 sm:mx-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Tìm kiếm CPU, VGA, màn hình, tai nghe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 rounded-full border border-input bg-muted/40 pl-10 pr-10 text-sm ring-offset-background transition-all placeholder:text-muted-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Xóa tìm kiếm"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>
        </div>

        {/* Right: PC Builder CTA, Theme, Cart, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Highlight PC Builder CTA on desktop */}
          <Link to="/build-pc" className="hidden sm:inline-flex">
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 border-primary/40 bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 shadow-sm"
            >
              <Cpu className="h-4 w-4" />
              <span className="font-semibold">Xây Dựng PC</span>
            </Button>
          </Link>

          {/* Admin Portal quick link for ADMIN role */}
          {token && user?.role === 'ADMIN' && (
            <Link to="/admin" className="hidden sm:inline-flex">
              <Button
                variant="default"
                size="sm"
                className="h-9 gap-1.5 bg-gradient-to-r from-red-600 to-rose-600 text-white hover:opacity-90 transition-all duration-200 shadow-sm"
              >
                <ShieldCheck className="h-4 w-4" />
                <span className="font-bold">Quản Trị</span>
              </Button>
            </Link>
          )}

          {/* Theme switcher */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            aria-label="Đổi giao diện sáng/tối"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Notifications (logged in) */}
          {token && (
            <Link to="/notifications">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-foreground relative"
                aria-label="Thông báo"
              >
                <Bell className="h-4 w-4" />
              </Button>
            </Link>
          )}

          {/* Shopping Cart Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCartClick}
            className="h-9 w-9 text-muted-foreground hover:text-foreground relative"
            aria-label="Giỏ hàng"
          >
            <ShoppingCart className="h-4 w-4" />
            {cartCount > 0 && (
              <span
                className={`absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-sm ${
                  showBadge ? 'animate-bounce' : ''
                }`}
              >
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Button>

          {/* User Account Dropdown */}
          {token ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full border border-border bg-muted/60"
                  aria-label="Menu tài khoản"
                >
                  <User className="h-4 w-4 text-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1.5">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none text-foreground">
                      {user?.fullName || 'Khách hàng'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user?.email || ''}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user?.role === 'ADMIN' && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center gap-2 cursor-pointer font-bold text-primary focus:text-primary">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      <span>Trang Quản Trị</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Hồ sơ cá nhân</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders" className="flex items-center gap-2 cursor-pointer">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>Lịch sử đơn hàng</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/notifications" className="flex items-center gap-2 cursor-pointer">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span>Thông báo</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-destructive cursor-pointer focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="h-9 font-medium">
                  Đăng nhập
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="h-9 font-medium">
                  Đăng ký
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
