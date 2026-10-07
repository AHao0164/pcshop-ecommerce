import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../ui/Toast'
import { resolveImageUrl } from '../../api/client'
import { exportToCSV, formatOrdersForExport } from '../../utils/exportCSV'
import {
  Search,
  Download,
  RefreshCw,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Package,
  X,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  MapPin,
  Phone,
  User,
} from 'lucide-react'

const STATUS_TABS = [
  { key: 'ALL', label: 'Tất Cả' },
  { key: 'PENDING', label: 'Chờ Xác Nhận' },
  { key: 'CONFIRMED', label: 'Đã Xác Nhận' },
  { key: 'SHIPPING', label: 'Đang Giao' },
  { key: 'DELIVERED', label: 'Đã Giao' },
  { key: 'CANCELLED', label: 'Đã Hủy' },
]

export default function AdminOrders() {
  const { api } = useAuth()
  const { show: toast } = useToast()

  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  // Filters & Pagination
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true)
      const params = {
        page: page.toString(),
        pageSize: pageSize.toString(),
      }
      if (statusFilter !== 'ALL') params.status = statusFilter
      if (search.trim()) params.search = search.trim()

      const res = await api.get('/admin/orders', { params })
      const data = res.data

      if (Array.isArray(data)) {
        setOrders(data)
        setTotal(data.length)
      } else {
        setOrders(data?.items || [])
        setTotal(data?.pagination?.total || 0)
      }
    } catch (err) {
      console.error('Failed to load orders:', err)
      toast('Không thể tải danh sách đơn hàng', { type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [api, statusFilter, search, page, pageSize])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  // Update order status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus })
      toast(`Cập nhật trạng thái sang "${newStatus}" thành công`, { type: 'success' })

      // Update in selected order if modal is open
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }))
      }
      loadOrders()
    } catch (err) {
      console.error('Update status failed:', err)
      toast('Không thể cập nhật trạng thái đơn hàng', { type: 'error' })
    }
  }

  // Delete order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Bạn có chắc muốn xóa đơn hàng #${orderId}?`)) return
    try {
      await api.delete(`/admin/orders/${orderId}`)
      toast(`Đã xóa đơn hàng #${orderId}`, { type: 'success' })
      if (detailModalOpen && selectedOrder?.id === orderId) {
        setDetailModalOpen(false)
      }
      loadOrders()
    } catch (err) {
      console.error('Delete order failed:', err)
      toast('Lỗi khi xóa đơn hàng', { type: 'error' })
    }
  }

  // View order detail
  const handleViewDetail = async (order) => {
    try {
      setLoadingDetail(true)
      setDetailModalOpen(true)
      const res = await api.get(`/admin/orders/${order.id}`)
      setSelectedOrder(res.data)
    } catch (err) {
      console.error('Failed to load order detail:', err)
      setSelectedOrder(order)
    } finally {
      setLoadingDetail(false)
    }
  }

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <Clock className="w-3 h-3" /> Chờ xác nhận
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
            <Truck className="w-3 h-3" /> Đang giao hàng
          </span>
        )
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Đã giao thành công
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

  const totalPages = Math.ceil(total / pageSize) || 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Quản Lý Đơn Hàng</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Theo dõi, xử lý và cập nhật tiến độ giao nhận đơn hàng
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={loadOrders}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border border-border bg-card hover:bg-muted text-foreground transition shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
          <button
            onClick={() => exportToCSV(formatOrdersForExport(orders), 'DanhSachDonHang')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Danh Sách</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-xs space-y-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setStatusFilter(tab.key)
                setPage(1)
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === tab.key
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn, email, người nhận hoặc số điện thoại..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/60 text-muted-foreground font-semibold border-b border-border">
              <tr>
                <th className="py-3.5 px-4">Mã Đơn</th>
                <th className="py-3.5 px-4">Khách Hàng</th>
                <th className="py-3.5 px-4">Tổng Tiền</th>
                <th className="py-3.5 px-4">Thanh Toán</th>
                <th className="py-3.5 px-4">Trạng Thái</th>
                <th className="py-3.5 px-4">Thời Gian</th>
                <th className="py-3.5 px-4 text-right">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                    Đang tải danh sách đơn hàng...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    Không có đơn hàng nào
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  return (
                    <tr key={order.id} className="hover:bg-muted/40 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                        #{order.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-foreground">
                          {order.shipping_name || order.user_email || 'Khách vãng lai'}
                        </div>
                        {order.shipping_phone && (
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {order.shipping_phone}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-foreground">
                        {formatVND((order.total_cents || 0) / 100)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-muted text-foreground">
                          {order.payment_method || 'COD'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">{getStatusBadge(order.status)}</td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {order.created_at ? new Date(order.created_at).toLocaleString('vi-VN') : ''}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleViewDetail(order)}
                            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition"
                            title="Xem chi tiết đơn hàng"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"
                            title="Xóa đơn hàng"
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

        {/* Pagination */}
        <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>
            Trang <span className="font-semibold text-foreground">{page}</span> /{' '}
            <span className="font-semibold text-foreground">{totalPages}</span> (Tổng {total} đơn hàng)
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

      {/* Order Detail Modal */}
      {detailModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <span>Chi Tiết Đơn Hàng #{selectedOrder?.id}</span>
                  {selectedOrder && getStatusBadge(selectedOrder.status)}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Ngày tạo: {selectedOrder?.created_at ? new Date(selectedOrder.created_at).toLocaleString('vi-VN') : ''}
                </p>
              </div>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingDetail ? (
              <div className="py-12 text-center text-muted-foreground">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                Đang tải dữ liệu chi tiết...
              </div>
            ) : selectedOrder ? (
              <div className="mt-5 space-y-6 text-xs">
                {/* Shipping & Customer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl border border-border">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <User className="w-4 h-4 text-primary" />
                      <span>Thông tin người nhận</span>
                    </div>
                    <p className="text-foreground font-semibold">
                      {selectedOrder.shipping_name || selectedOrder.user_email || 'Không có tên'}
                    </p>
                    {selectedOrder.shipping_phone && (
                      <p className="flex items-center gap-1.5 text-muted-foreground">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{selectedOrder.shipping_phone}</span>
                      </p>
                    )}
                    <p className="flex items-start gap-1.5 text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <span>
                        {selectedOrder.shipping_address}, {selectedOrder.shipping_ward},{' '}
                        {selectedOrder.shipping_province}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <CreditCard className="w-4 h-4 text-primary" />
                      <span>Thanh toán & Giao dịch</span>
                    </div>
                    <p className="text-muted-foreground">
                      Phương thức:{' '}
                      <span className="font-semibold text-foreground">
                        {selectedOrder.payment_method || 'COD'}
                      </span>
                    </p>
                    <p className="text-muted-foreground">
                      Tổng thanh toán:{' '}
                      <span className="font-extrabold text-foreground text-sm">
                        {formatVND((selectedOrder.total_cents || 0) / 100)}
                      </span>
                    </p>
                    {selectedOrder.note && (
                      <p className="text-muted-foreground">
                        Ghi chú: <span className="italic">"{selectedOrder.note}"</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Items List */}
                <div>
                  <h4 className="font-bold text-foreground mb-2">Danh sách sản phẩm trong đơn</h4>
                  <div className="border border-border rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                        <tr>
                          <th className="py-2.5 px-3">Sản Phẩm</th>
                          <th className="py-2.5 px-3 text-center">Đơn Giá</th>
                          <th className="py-2.5 px-3 text-center">Số Lượng</th>
                          <th className="py-2.5 px-3 text-right">Thành Tiền</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {(selectedOrder.items || []).map((item, idx) => {
                          const itemPrice = (item.price_cents || 0) / 100
                          const subtotal = itemPrice * (item.quantity || 1)
                          return (
                            <tr key={idx} className="hover:bg-muted/20">
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-2.5">
                                  {item.image_url && (
                                    <img
                                      src={resolveImageUrl(item.image_url)}
                                      alt={item.name}
                                      className="w-9 h-9 object-contain rounded border border-border p-0.5 shrink-0"
                                    />
                                  )}
                                  <div>
                                    <p className="font-semibold text-foreground line-clamp-1">
                                      {item.name || item.product_name}
                                    </p>
                                    {item.sku && (
                                      <p className="text-[10px] text-muted-foreground font-mono">
                                        SKU: {item.sku}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-center font-medium">
                                {formatVND(itemPrice)}
                              </td>
                              <td className="py-2.5 px-3 text-center font-bold">
                                {item.quantity}
                              </td>
                              <td className="py-2.5 px-3 text-right font-extrabold text-foreground">
                                {formatVND(subtotal)}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Quick Status Update Bar */}
                <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs font-semibold text-muted-foreground">
                    Cập nhật trạng thái đơn:
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedOrder.status !== 'CONFIRMED' && selectedOrder.status !== 'DELIVERED' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'CONFIRMED')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500/15 text-blue-600 hover:bg-blue-500/25 transition"
                      >
                        Xác Nhận Đơn
                      </button>
                    )}
                    {selectedOrder.status !== 'SHIPPING' && selectedOrder.status !== 'DELIVERED' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'SHIPPING')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/15 text-indigo-600 hover:bg-indigo-500/25 transition"
                      >
                        Giao Hàng
                      </button>
                    )}
                    {selectedOrder.status !== 'DELIVERED' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'DELIVERED')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 transition"
                      >
                        Đã Giao Thành Công
                      </button>
                    )}
                    {selectedOrder.status !== 'CANCELLED' && selectedOrder.status !== 'DELIVERED' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'CANCELLED')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-destructive/15 text-destructive hover:bg-destructive/25 transition"
                      >
                        Hủy Đơn Hàng
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
