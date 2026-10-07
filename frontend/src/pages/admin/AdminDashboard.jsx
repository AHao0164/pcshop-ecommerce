import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { exportToCSV, formatRevenueForExport } from '../../utils/exportCSV'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  Download,
  ArrowRight,
  RefreshCw,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
} from 'lucide-react'

export default function AdminDashboard() {
  const { api } = useAuth()
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])

  const loadData = async () => {
    try {
      setLoading(true)
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        api.get('/admin/orders', { params: { page: '1', pageSize: '200' } }).catch(() => ({ data: { items: [] } })),
        api.get('/admin/catalog/products', { params: { pageSize: 100 } }).catch(() => ({ data: { items: [] } })),
        api.get('/admin/users', { params: { limit: 100 } }).catch(() => ({ data: [] })),
      ])

      const fetchedOrders = Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data?.items || []
      const fetchedProducts = productsRes.data?.items || []
      const fetchedCustomers = Array.isArray(usersRes.data) ? usersRes.data : []

      setOrders(fetchedOrders)
      setProducts(fetchedProducts)
      setCustomers(fetchedCustomers)
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Calculations
  const stats = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const lastMonthDate = new Date(currentYear, currentMonth - 1, 1)
    const lastMonth = lastMonthDate.getMonth()
    const lastMonthYear = lastMonthDate.getFullYear()

    const currentMonthOrders = orders.filter((o) => {
      const d = new Date(o.created_at)
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })

    const lastMonthOrders = orders.filter((o) => {
      const d = new Date(o.created_at)
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear
    })

    const currentMonthRevenue = currentMonthOrders
      .filter((o) => o.status === 'DELIVERED')
      .reduce((sum, o) => sum + (o.total_cents || 0), 0)

    const lastMonthRevenue = lastMonthOrders
      .filter((o) => o.status === 'DELIVERED')
      .reduce((sum, o) => sum + (o.total_cents || 0), 0)

    const totalRevenue = orders
      .filter((o) => o.status === 'DELIVERED')
      .reduce((sum, o) => sum + (o.total_cents || 0), 0)

    const revenueTrend =
      lastMonthRevenue === 0
        ? null
        : (((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1)

    const ordersTrend =
      lastMonthOrders.length === 0
        ? null
        : (((currentMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100).toFixed(1)

    const lowStock = products
      .filter((p) => (p.stock || 0) < 10)
      .sort((a, b) => (a.stock || 0) - (b.stock || 0))
      .slice(0, 5)

    const recent = orders.slice(0, 6)

    // 7-day revenue and order counts
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return d.toISOString().split('T')[0]
    })

    const dailyStats = last7Days.map((dateStr) => {
      const dayOrders = orders.filter((o) => o.created_at?.startsWith(dateStr))
      const dayRevenue = dayOrders
        .filter((o) => o.status === 'DELIVERED')
        .reduce((sum, o) => sum + (o.total_cents || 0), 0)

      const label = new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
      return {
        dateStr,
        label,
        revenue: dayRevenue / 100, // into VND
        orders: dayOrders.length,
      }
    })

    // Category distribution
    const categoryCount = {}
    products.forEach((p) => {
      const cat = p.category_name || p.category || 'Khác'
      categoryCount[cat] = (categoryCount[cat] || 0) + 1
    })

    const categoryList = Object.entries(categoryCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      totalRevenue: totalRevenue / 100,
      totalOrders: orders.length,
      totalProducts: products.length,
      totalCustomers: customers.length,
      revenueTrend,
      ordersTrend,
      lowStock,
      recent,
      dailyStats,
      categoryList,
    }
  }, [orders, products, customers])

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <Clock className="w-3 h-3" /> Chờ duyệt
          </span>
        )
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">
            <CheckCircle2 className="w-3 h-3" /> Đã xác nhận
          </span>
        )
      case 'SHIPPING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
            <Truck className="w-3 h-3" /> Đang giao
          </span>
        )
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Đã giao
          </span>
        )
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">
            <XCircle className="w-3 h-3" /> Đã hủy
          </span>
        )
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
            {status}
          </span>
        )
    }
  }

  // Max value for SVG chart scaling
  const maxRevenue = Math.max(...stats.dailyStats.map((d) => d.revenue), 1000000)
  const maxOrdersCount = Math.max(...stats.dailyStats.map((d) => d.orders), 5)

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Tổng Quan Hệ Thống</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Báo cáo hiệu suất kinh doanh, tồn kho và các đơn hàng gần đây
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border border-border bg-card hover:bg-muted text-foreground transition shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
          <button
            onClick={() => exportToCSV(formatRevenueForExport(orders), 'BaoCaoDoanhThu')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Báo Cáo</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Doanh Thu Đã Thu
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold tracking-tight text-foreground">
              {formatVND(stats.totalRevenue)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              {stats.revenueTrend !== null ? (
                <>
                  {stats.revenueTrend >= 0 ? (
                    <span className="text-emerald-600 flex items-center font-bold">
                      <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +{stats.revenueTrend}%
                    </span>
                  ) : (
                    <span className="text-destructive flex items-center font-bold">
                      <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> {stats.revenueTrend}%
                    </span>
                  )}
                  <span className="text-muted-foreground">so với tháng trước</span>
                </>
              ) : (
                <span className="text-muted-foreground">Chưa có dữ liệu so sánh</span>
              )}
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tổng Đơn Hàng
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold tracking-tight text-foreground">
              {stats.totalOrders}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              {stats.ordersTrend !== null ? (
                <>
                  {stats.ordersTrend >= 0 ? (
                    <span className="text-emerald-600 flex items-center font-bold">
                      <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +{stats.ordersTrend}%
                    </span>
                  ) : (
                    <span className="text-destructive flex items-center font-bold">
                      <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> {stats.ordersTrend}%
                    </span>
                  )}
                  <span className="text-muted-foreground">so với tháng trước</span>
                </>
              ) : (
                <span className="text-muted-foreground">Toàn bộ thời gian</span>
              )}
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tổng Sản Phẩm
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold tracking-tight text-foreground">
              {stats.totalProducts}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Đang kinh doanh trong kho
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Khách Hàng Đăng Ký
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold tracking-tight text-foreground">
              {stats.totalCustomers}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Tài khoản người dùng
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section: 7-Day Revenue & Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue SVG Chart (2 columns) */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-foreground">Doanh Thu 7 Ngày Gần Nhất</h2>
              <p className="text-xs text-muted-foreground">Đơn hàng hoàn tất (DELIVERED)</p>
            </div>
            <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-lg">
              VNĐ
            </span>
          </div>

          <div className="h-64 flex items-end gap-3 sm:gap-6 pt-6 px-2 border-b border-border">
            {stats.dailyStats.map((item, index) => {
              const heightPercent = Math.max(8, Math.round((item.revenue / maxRevenue) * 100))
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-semibold bg-foreground text-background px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap">
                    {formatVND(item.revenue)}
                  </div>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[42px] bg-gradient-to-t from-primary/80 to-primary rounded-t-lg transition-all duration-300 group-hover:brightness-110 shadow-xs"
                  />
                  <span className="text-[11px] font-medium text-muted-foreground pt-1">
                    {item.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Category Breakdown (1 column) */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground mb-1">Cơ Cấu Danh Mục</h2>
            <p className="text-xs text-muted-foreground mb-5">Phân bổ sản phẩm theo danh mục chính</p>

            <div className="space-y-4">
              {stats.categoryList.map((cat, i) => {
                const percent = stats.totalProducts > 0 ? Math.round((cat.count / stats.totalProducts) * 100) : 0
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-foreground truncate">{cat.name}</span>
                      <span className="text-muted-foreground font-medium">
                        {cat.count} ({percent}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className="h-full bg-primary rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <Link
            to="/admin/categories"
            className="mt-6 flex items-center justify-between text-xs font-semibold text-primary hover:underline"
          >
            <span>Quản lý tất cả danh mục</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Bottom Grid: Recent Orders & Low Stock Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 columns) */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Đơn Hàng Gần Đây</h2>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                <tr>
                  <th className="py-3 px-4">Mã Đơn</th>
                  <th className="py-3 px-4">Khách Hàng</th>
                  <th className="py-3 px-4">Tổng Tiền</th>
                  <th className="py-3 px-4">Trạng Thái</th>
                  <th className="py-3 px-4">Thời Gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stats.recent.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      Chưa có đơn hàng nào
                    </td>
                  </tr>
                ) : (
                  stats.recent.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/30 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                        #{order.id}
                      </td>
                      <td className="py-3.5 px-4 text-foreground truncate max-w-[150px]">
                        {order.shipping_name || order.user_email || 'Khách vãng lai'}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground">
                        {formatVND((order.total_cents || 0) / 100)}
                      </td>
                      <td className="py-3.5 px-4">{getStatusBadge(order.status)}</td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString('vi-VN') : ''}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Warning (1 column) */}
        <div className="bg-card border border-border rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-border flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              <h2 className="text-base font-bold text-foreground">Cảnh Báo Tồn Kho Thấp</h2>
            </div>

            <div className="p-4 space-y-3">
              {stats.lowStock.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-xs">
                  Tất cả sản phẩm đều có số lượng an toàn (&gt;= 10).
                </div>
              ) : (
                stats.lowStock.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/15"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-semibold text-foreground truncate">{prod.name}</p>
                      <p className="text-[10px] text-muted-foreground">SKU: {prod.sku || 'N/A'}</p>
                    </div>
                    <span className="shrink-0 px-2 py-0.5 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-700">
                      Còn {prod.stock || 0}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-4 border-t border-border">
            <Link
              to="/admin/products"
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold border border-border bg-card hover:bg-muted text-foreground transition"
            >
              <span>Xem Quản Lý Sản Phẩm</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
