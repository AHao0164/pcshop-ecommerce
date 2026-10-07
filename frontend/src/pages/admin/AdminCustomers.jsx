import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../ui/Toast'
import { exportToCSV, formatCustomersForExport } from '../../utils/exportCSV'
import {
  Users,
  Search,
  Download,
  RefreshCw,
  Mail,
  Phone,
  Shield,
  UserCheck,
} from 'lucide-react'

export default function AdminCustomers() {
  const { api } = useAuth()
  const { show: toast } = useToast()

  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/users', { params: { limit: 200 } })
      setCustomers(res.data || [])
    } catch (err) {
      console.error('Failed to load customers:', err)
      toast('Không thể tải danh sách người dùng', { type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [api])

  useEffect(() => {
    loadCustomers()
  }, [loadCustomers])

  const filteredCustomers = customers.filter(
    (c) =>
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Quản Lý Khách Hàng</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Danh sách tài khoản khách hàng và quản trị viên trong hệ thống
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={loadCustomers}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border border-border bg-card hover:bg-muted text-foreground transition shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
          <button
            onClick={() => exportToCSV(formatCustomersForExport(filteredCustomers), 'DanhSachKhachHang')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Xuất CSV</span>
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo email, họ tên hoặc số điện thoại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/60 text-muted-foreground font-semibold border-b border-border">
              <tr>
                <th className="py-3.5 px-4">Khách Hàng</th>
                <th className="py-3.5 px-4">Liên Hệ</th>
                <th className="py-3.5 px-4">Địa Chỉ</th>
                <th className="py-3.5 px-4">Vai Trò</th>
                <th className="py-3.5 px-4">Ngày Đăng Ký</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                    Đang tải danh sách người dùng...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    Không tìm thấy người dùng nào
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => {
                  const initial =
                    c.full_name?.[0]?.toUpperCase() || c.email?.[0]?.toUpperCase() || 'U'
                  const isAdmin = c.role === 'ADMIN'

                  return (
                    <tr key={c.id} className="hover:bg-muted/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              isAdmin
                                ? 'bg-primary/20 text-primary border border-primary/30'
                                : 'bg-muted text-foreground'
                            }`}
                          >
                            {initial}
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-xs">
                              {c.full_name || 'Khách vãng lai'}
                            </p>
                            <p className="text-[11px] text-muted-foreground font-mono">
                              ID: #{c.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-foreground">
                          <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>{c.email}</span>
                        </div>
                        {c.phone && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{c.phone}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground max-w-xs truncate">
                        {[c.address_detail || c.address, c.ward, c.province || c.city]
                          .filter(Boolean)
                          .join(', ') || '(Chưa cập nhật)'}
                      </td>
                      <td className="py-3.5 px-4">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                            <Shield className="w-3 h-3" /> Quản trị viên
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground">
                            <UserCheck className="w-3 h-3" /> Khách hàng
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {c.created_at ? new Date(c.created_at).toLocaleDateString('vi-VN') : ''}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
