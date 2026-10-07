import React from 'react'
import { Navigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

export default function AdminRoute({ children }) {
  const { token, user } = useAuth()
  const location = useLocation()

  if (!token) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  if (user && user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Không Có Quyền Truy Cập</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Tài khoản <span className="font-semibold text-foreground">{user.email}</span> không thuộc nhóm Quản trị viên (ADMIN). Vui lòng đăng nhập bằng tài khoản quản trị để tiếp tục.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Về Trang Chủ Cửa Hàng
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return children
}
