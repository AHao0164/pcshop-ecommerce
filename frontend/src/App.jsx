import React from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import ThemeProvider from './ui/ThemeProvider'
import { ToastProvider } from './ui/Toast'
import Navbar from './components/Header/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetailPage'
import BuildPC from './pages/BuildPC'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import OTPVerification from './components/Auth/OTPVerification'
import GoogleCallback from './components/Auth/GoogleCallback'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'
import VNPayReturn from './pages/VNPayReturn'
import AIChatbot from './components/AIChatbot'

// Admin Portal Components
import AdminRoute from './components/Admin/AdminRoute'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCategories from './pages/admin/AdminCategories'
import AdminBrands from './pages/admin/AdminBrands'
import AdminBanners from './pages/admin/AdminBanners'
import AdminPromotions from './pages/admin/AdminPromotions'
import AdminReviews from './pages/admin/AdminReviews'
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminProfile from './pages/admin/AdminProfile'

const App = () => {
  const location = useLocation()

  const isAuthPage = [
    '/login',
    '/register',
    '/signup',
    '/verify-otp',
    '/forgot-password',
    '/reset-password',
    '/auth/callback',
  ].includes(location.pathname)

  const isAdminPage = location.pathname.startsWith('/admin')
  const showStorefrontChrome = !isAuthPage && !isAdminPage

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="bg-background text-foreground transition-colors duration-200 min-h-screen flex flex-col font-sans">
          {showStorefrontChrome && <Navbar />}
          <main className="flex-1">
            <Routes>
              {/* Storefront Customer Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/build-pc" element={<BuildPC />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/signup" element={<Register />} />
              <Route path="/verify-otp" element={<OTPVerification />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/auth/callback" element={<GoogleCallback />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/payment/vnpay-return" element={<VNPayReturn />} />

              {/* Admin Portal Protected Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="brands" element={<AdminBrands />} />
                <Route path="banners" element={<AdminBanners />} />
                <Route path="promotions" element={<AdminPromotions />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="profile" element={<AdminProfile />} />
              </Route>
            </Routes>
          </main>
          {showStorefrontChrome && location.pathname !== '/' && <Footer />}
          {showStorefrontChrome && <AIChatbot />}
        </div>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App