import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../ui/Toast'
import {
  Star,
  Trash2,
  RefreshCw,
  MessageSquare,
  Filter,
} from 'lucide-react'

export default function AdminReviews() {
  const { api } = useAuth()
  const { show: toast } = useToast()

  const [reviews, setReviews] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [ratingFilter, setRatingFilter] = useState('')
  const [replyFilter, setReplyFilter] = useState('')

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (ratingFilter) params.append('rating', ratingFilter)
      if (replyFilter) params.append('hasReply', replyFilter)
      params.append('limit', '100')

      const res = await api.get(`/admin/reviews?${params.toString()}`)
      setReviews(res.data?.reviews || [])
      setTotal(res.data?.total || 0)
    } catch (err) {
      console.error('Failed to load reviews:', err)
      toast('Không thể tải danh sách đánh giá', { type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [api, ratingFilter, replyFilter])

  useEffect(() => {
    loadReviews()
  }, [loadReviews])

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa nhận xét đánh giá này?')) return
    try {
      await api.delete(`/admin/reviews/${id}`)
      toast('Đã xóa đánh giá', { type: 'success' })
      loadReviews()
    } catch (err) {
      console.error('Delete review failed:', err)
      toast('Lỗi khi xóa đánh giá', { type: 'error' })
    }
  }

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : 0

  const withReplyCount = reviews.filter((r) => r.admin_reply || (r.comments && r.comments.length > 0)).length
  const withoutReplyCount = reviews.length - withReplyCount

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Quản Lý Đánh Giá</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Kiểm duyệt nhận xét và trải nghiệm của khách hàng về sản phẩm
          </p>
        </div>
        <div>
          <button
            onClick={loadReviews}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border border-border bg-card hover:bg-muted text-foreground transition shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-semibold text-muted-foreground uppercase">Điểm Trung Bình</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-3xl font-extrabold text-foreground">{averageRating}</span>
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(Number(averageRating))
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-semibold text-muted-foreground uppercase">Tổng Số Đánh Giá</div>
          <div className="text-3xl font-extrabold text-foreground mt-2">{total}</div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-semibold text-muted-foreground uppercase">Tình Trạng Phản Hồi</div>
          <div className="flex items-center gap-4 mt-2">
            <div>
              <span className="text-xl font-bold text-emerald-600">{withReplyCount}</span>
              <span className="text-xs text-muted-foreground ml-1">Đã trả lời</span>
            </div>
            <div>
              <span className="text-xl font-bold text-amber-600">{withoutReplyCount}</span>
              <span className="text-xs text-muted-foreground ml-1">Chưa trả lời</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold shrink-0">
          <Filter className="w-4 h-4" />
          <span>Bộ lọc:</span>
        </div>

        <div className="w-full sm:w-48">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">Tất cả số sao</option>
            <option value="5">5 sao ⭐⭐⭐⭐⭐</option>
            <option value="4">4 sao ⭐⭐⭐⭐</option>
            <option value="3">3 sao ⭐⭐⭐</option>
            <option value="2">2 sao ⭐⭐</option>
            <option value="1">1 sao ⭐</option>
          </select>
        </div>

        <div className="w-full sm:w-48">
          <select
            value={replyFilter}
            onChange={(e) => setReplyFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="false">Chưa phản hồi</option>
            <option value="true">Đã phản hồi</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/60 text-muted-foreground font-semibold border-b border-border">
              <tr>
                <th className="py-3.5 px-4 w-16">ID</th>
                <th className="py-3.5 px-4">Sản Phẩm</th>
                <th className="py-3.5 px-4">Khách Hàng</th>
                <th className="py-3.5 px-4">Đánh Giá</th>
                <th className="py-3.5 px-4">Nội Dung Nhận Xét</th>
                <th className="py-3.5 px-4">Ngày Đăng</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                    Đang tải đánh giá...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    Không tìm thấy đánh giá nào
                  </td>
                </tr>
              ) : (
                reviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-muted/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      #{rev.id}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-foreground max-w-[180px] truncate">
                      {rev.product_name || `Sản phẩm #${rev.product_id}`}
                    </td>
                    <td className="py-3.5 px-4 text-foreground">
                      <div className="font-semibold">{rev.user_name || 'Khách hàng'}</div>
                      <div className="text-[11px] text-muted-foreground">{rev.user_email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < (rev.rating || 0)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-muted-foreground/30'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-foreground line-clamp-2">
                        {rev.comment || <span className="italic text-muted-foreground">(Không có lời nhắn)</span>}
                      </p>
                      {rev.admin_reply && (
                        <p className="text-[11px] text-primary mt-1 bg-primary/5 p-1 rounded">
                          Admin phản hồi: {rev.admin_reply}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {rev.created_at ? new Date(rev.created_at).toLocaleDateString('vi-VN') : ''}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(rev.id)}
                        className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"
                        title="Xóa đánh giá này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
