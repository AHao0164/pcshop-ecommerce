import React, { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../ui/ThemeProvider'
import {
  LayoutDashboard,
  Package,
  Layers,
  Tag,
  Image as ImageIcon,
  ShoppingCart,
  Star,
  Users,
  TicketPercent,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Store,
  Sun,
  Moon,
  ShieldCheck
} from 'lucide-react'

const menuItems = [
  { text: 'Tổng Quan', icon: LayoutDashboard, path: '/admin/dashboard' },
  {
    text: 'Quản Lý Hàng Hóa',
    icon: Package,
    subItems: [
      { text: 'Sản phẩm', icon: Package, path: '/admin/products' },
      { text: 'Danh mục', icon: Layers, path: '/admin/categories' },
      { text: 'Thương hiệu', icon: Tag, path: '/admin/brands' },
      { text: 'Banner quảng cáo', icon: ImageIcon, path: '/admin/banners' },
    ],
  },
  { text: 'Đơn Hàng', icon: ShoppingCart, path: '/admin/orders' },
  { text: 'Đánh Giá & Nhận Xét', icon: Star, path: '/admin/reviews' },
  { text: 'Khách Hàng', icon: Users, path: '/admin/customers' },
  { text: 'Khuyến Mãi & Voucher', icon: TicketPercent, path: '/admin/promotions' },
  { text: 'Thông Tin Quản Trị', icon: User, path: '/admin/profile' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const { theme, toggle: toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [expandedCatalog, setExpandedCatalog] = useState(true)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isPathActive = (path) => {
    if (path === '/admin/dashboard' && (location.pathname === '/admin' || location.pathname === '/admin/dashboard')) {
      return true
    }
    return location.pathname === path
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
      {/* Topbar */}
      <header className="sticky top-0 z-40 h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
            aria-label="Toggle navigation"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo & Portal title */}
          <Link to="/admin/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-rose-400 text-white flex items-center justify-center font-bold shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                GearUp
              </span>
              <span className="ml-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                ADMIN
              </span>
            </div>
          </Link>
        </div>

        {/* Right action group */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Back to Storefront Link */}
          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium border border-border bg-card hover:bg-muted text-foreground transition shadow-sm"
          >
            <Store className="w-4 h-4 text-primary" />
            <span>Xem Cửa Hàng</span>
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition shadow-sm"
            title={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-muted transition border border-transparent hover:border-border"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm border border-primary/30">
                {user?.fullname?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-semibold leading-tight truncate max-w-[120px]">
                  {user?.fullname || user?.email?.split('@')[0]}
                </div>
                <div className="text-[10px] text-muted-foreground">Quản trị viên</div>
              </div>
              <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-muted-foreground" />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-xs font-semibold text-foreground truncate">{user?.fullname || 'Admin'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>

                  <Link
                    to="/"
                    onClick={() => setDropdownOpen(false)}
                    className="flex sm:hidden items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-muted transition"
                  >
                    <Store className="w-4 h-4 text-primary" />
                    Về Trang Bán Hàng
                  </Link>

                  <Link
                    to="/admin/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-muted transition"
                  >
                    <User className="w-4 h-4 text-muted-foreground" />
                    Hồ sơ cá nhân
                  </Link>

                  <div className="border-t border-border my-1" />

                  <button
                    onClick={() => {
                      setDropdownOpen(false)
                      setShowLogoutConfirm(true)
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main wrapper: Sidebar + Main Content */}
      <div className="flex-1 flex">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-16 bottom-0 left-0 z-30 w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } flex flex-col justify-between`}
        >
          <div className="p-3 space-y-1 overflow-y-auto flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon

              if (item.subItems) {
                const isAnySubActive = item.subItems.some((sub) => location.pathname === sub.path)

                return (
                  <div key={item.text} className="space-y-1">
                    <button
                      onClick={() => setExpandedCatalog(!expandedCatalog)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                        isAnySubActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.text}</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          expandedCatalog ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {expandedCatalog && (
                      <div className="ml-4 pl-3 border-l border-border space-y-1">
                        {item.subItems.map((sub) => {
                          const SubIcon = sub.icon
                          const isActive = location.pathname === sub.path

                          return (
                            <Link
                              key={sub.path}
                              to={sub.path}
                              onClick={() => setSidebarOpen(false)}
                              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                                isActive
                                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                              }`}
                            >
                              <SubIcon className="w-3.5 h-3.5" />
                              <span>{sub.text}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              }

              const active = isPathActive(item.path)

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    active
                      ? 'bg-primary text-primary-foreground font-semibold shadow-sm shadow-primary/25'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.text}</span>
                </Link>
              )
            })}
          </div>

          {/* Bottom Storefront Banner */}
          <div className="p-3 border-t border-border">
            <Link
              to="/"
              className="flex items-center justify-between p-3 rounded-xl bg-muted/60 hover:bg-muted border border-border/80 transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">Trang Mua Hàng</div>
                  <div className="text-[11px] text-muted-foreground">Chuyển sang người dùng</div>
                </div>
              </div>
              <span className="text-muted-foreground group-hover:translate-x-0.5 transition-transform text-xs">→</span>
            </Link>
          </div>
        </aside>

        {/* Content Outlet */}
        <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)] bg-muted/20">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold mb-2">Xác nhận đăng xuất</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Bạn có chắc chắn muốn đăng xuất khỏi phiên làm việc quản trị?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition"
              >
                Hủy
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90 transition shadow-sm"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
