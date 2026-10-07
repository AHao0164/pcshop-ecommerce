import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Zap, Star, ShieldCheck, Check } from 'lucide-react'
import { resolveImageUrl } from '../api/client'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'

export default function ProductCard({
  product,
  onAdd,
  onBuyNow,
  isAdding = false,
  viewMode = 'grid',
  className = '',
}) {
  if (!product) return null

  const originalPrice = Number(product.price_cents || 0)
  const discountPercent = Number(product.discount_percent || 0)
  const finalPrice = Math.round(originalPrice * (100 - discountPercent) / 100)
  const image = product.image_url
    ? resolveImageUrl(product.image_url)
    : 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800&auto=format&fit=crop'
  const stock = Number(product.stock ?? 10)
  const outOfStock = stock <= 0
  const rating = Number(product.rating || product.average_rating || 5.0)

  // List View Layout
  if (viewMode === 'list') {
    return (
      <div
        className={cn(
          "group relative flex flex-col sm:flex-row items-center gap-4 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/40",
          className
        )}
      >
        {/* Product Image */}
        <Link
          to={`/product/${product.id}`}
          className="relative h-44 w-full sm:w-48 shrink-0 overflow-hidden rounded-lg bg-muted/40"
        >
          {outOfStock && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
              <Badge variant="destructive" className="font-semibold text-xs">
                Tạm hết hàng
              </Badge>
            </div>
          )}
          {!outOfStock && discountPercent > 0 && (
            <div className="absolute top-2 left-2 z-10">
              <Badge variant="default" className="bg-primary text-primary-foreground font-bold">
                -{discountPercent}%
              </Badge>
            </div>
          )}
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className={cn(
              "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105",
              outOfStock && "opacity-40 grayscale"
            )}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800&auto=format&fit=crop'
            }}
          />
        </Link>

        {/* Info & Meta */}
        <div className="flex flex-1 flex-col justify-between w-full h-full">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {product.brand && (
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {product.brand}
                </span>
              )}
              {product.category && (
                <span className="text-xs text-muted-foreground">
                  • {product.category}
                </span>
              )}
              <div className="ml-auto flex items-center gap-1 text-xs text-amber-500 font-medium">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{rating.toFixed(1)}</span>
              </div>
            </div>

            <Link
              to={`/product/${product.id}`}
              className="line-clamp-2 text-base font-semibold text-foreground transition-colors hover:text-primary"
            >
              {product.name}
            </Link>

            {product.description && (
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {product.description}
              </p>
            )}

            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" /> Bảo hành 36 tháng
              </span>
              <span>•</span>
              <span>{outOfStock ? 'Hết hàng' : `Còn ${stock} sản phẩm`}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-primary font-sans">
                  {finalPrice.toLocaleString('vi-VN')} ₫
                </span>
                {discountPercent > 0 && (
                  <span className="text-xs text-muted-foreground line-through">
                    {originalPrice.toLocaleString('vi-VN')} ₫
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={outOfStock || isAdding}
                onClick={() => onAdd?.(product)}
                className="gap-1.5"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>{isAdding ? 'Đang thêm...' : 'Thêm giỏ'}</span>
              </Button>
              <Button
                size="sm"
                disabled={outOfStock}
                onClick={() => onBuyNow?.(product)}
                className="gap-1"
              >
                <Zap className="h-4 w-4" />
                <span>Mua ngay</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid View Layout (Default)
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/40 hover:-translate-y-0.5",
        className
      )}
    >
      <div>
        {/* Product Image Container */}
        <Link
          to={`/product/${product.id}`}
          className="relative block aspect-square w-full overflow-hidden bg-muted/40 p-3"
        >
          {outOfStock && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
              <Badge variant="destructive" className="font-semibold text-xs">
                Tạm hết hàng
              </Badge>
            </div>
          )}

          {!outOfStock && discountPercent > 0 && (
            <div className="absolute top-2.5 left-2.5 z-10">
              <Badge variant="default" className="bg-primary text-primary-foreground font-bold shadow-sm">
                -{discountPercent}%
              </Badge>
            </div>
          )}

          {/* Top-right brand chip or guarantee */}
          <div className="absolute top-2.5 right-2.5 z-10">
            <span className="inline-flex items-center gap-1 rounded-md bg-background/80 backdrop-blur-sm px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground border border-border/50">
              <ShieldCheck className="h-3 w-3 text-emerald-500" /> Chính hãng
            </span>
          </div>

          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className={cn(
              "h-full w-full object-contain transition-transform duration-300 group-hover:scale-105",
              outOfStock && "opacity-40 grayscale"
            )}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800&auto=format&fit=crop'
            }}
          />
        </Link>

        {/* Product Content */}
        <div className="p-4 space-y-2">
          {/* Brand & Category & Rating */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-primary truncate max-w-[120px]">
              {product.brand || product.category || 'GearUp'}
            </span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-medium text-muted-foreground">{rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Title */}
          <Link
            to={`/product/${product.id}`}
            className="block text-sm font-semibold text-foreground leading-snug line-clamp-2 min-h-[2.5rem] transition-colors group-hover:text-primary"
            title={product.name}
          >
            {product.name}
          </Link>
        </div>
      </div>

      {/* Pricing & Actions (Sticky to bottom) */}
      <div className="p-4 pt-0 space-y-3">
        {/* Price Row */}
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary font-sans">
              {finalPrice.toLocaleString('vi-VN')} ₫
            </span>
            {discountPercent > 0 && (
              <span className="text-xs text-muted-foreground line-through">
                {originalPrice.toLocaleString('vi-VN')} ₫
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {outOfStock ? 'Tạm hết hàng' : 'Bảo hành 36 tháng chính hãng'}
          </p>
        </div>

        {/* Action Buttons */}
        {outOfStock ? (
          <Button variant="secondary" disabled className="w-full text-xs h-9">
            Sản phẩm tạm hết hàng
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isAdding}
              onClick={() => onAdd?.(product)}
              className="h-9 px-2 text-xs font-medium gap-1 hover:border-primary hover:text-primary"
              title="Thêm vào giỏ"
            >
              <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{isAdding ? 'Đang thêm' : 'Thêm giỏ'}</span>
            </Button>
            <Button
              size="sm"
              onClick={() => onBuyNow?.(product)}
              className="h-9 px-2 text-xs font-semibold gap-1"
              title="Mua ngay"
            >
              <Zap className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Mua ngay</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
