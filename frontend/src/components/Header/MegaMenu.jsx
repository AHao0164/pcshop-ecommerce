import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Laptop,
  Cpu,
  Monitor,
  Headphones,
  Box,
  Layers,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Grid
} from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

export const MEGA_MENU_DATA = [
  {
    id: 'laptop',
    name: 'Laptop & Máy Tính Xách Tay',
    shortName: 'Laptop',
    icon: Laptop,
    badge: 'Hot Deal',
    image: '/images/category/category-5.png',
    bannerText: 'Laptop Gaming & AI Thế Hệ Mới - Giảm Đến 25%',
    bannerCta: 'Xem ưu đãi',
    bannerLink: '/products?q=Laptop',
    subcategories: [
      {
        name: 'Laptop Gaming',
        keyword: 'Laptop Gaming',
        desc: 'RTX 40-series, Màn hình 165Hz - 240Hz',
        image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=120&q=80',
        tags: ['Asus ROG', 'Acer Predator', 'Lenovo Legion']
      },
      {
        name: 'Laptop Văn phòng',
        keyword: 'Laptop Văn phòng',
        desc: 'Mỏng nhẹ, pin trâu, bảo mật vân tay',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=120&q=80',
        tags: ['Dell Inspiron', 'HP Pavilion', 'Zenbook']
      },
      {
        name: 'Laptop Đồ họa',
        keyword: 'Laptop Đồ họa',
        desc: 'Màn hình chuẩn màu 100% sRGB / DCI-P3',
        image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=120&q=80',
        tags: ['Dell XPS', 'MacBook Pro', 'MSI Creator']
      },
      {
        name: 'Laptop Sinh viên',
        keyword: 'Laptop Sinh viên',
        desc: 'Giá rẻ, hiệu năng ổn định, bảo hành 24T',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=120&q=80',
        tags: ['Acer Aspire', 'Lenovo IdeaPad', 'HP 15s']
      },
    ]
  },
  {
    id: 'components',
    name: 'Linh Kiện Máy Tính',
    shortName: 'Linh Kiện PC',
    icon: Cpu,
    badge: 'Chính Hãng',
    image: '/images/category/category-2.png',
    bannerText: 'Tự Xây Dựng Cấu Hình PC - Kiểm tra tương thích & điện năng tự động',
    bannerCta: 'Xây dựng PC ngay',
    bannerLink: '/build-pc',
    subcategories: [
      {
        name: 'CPU - Bộ vi xử lý',
        keyword: 'CPU',
        desc: 'Intel Core Gen 13/14, AMD Ryzen 7000/8000',
        image: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=120&q=80',
        tags: ['Intel i5/i7/i9', 'Ryzen 5/7/9']
      },
      {
        name: 'GPU - Card đồ họa',
        keyword: 'GPU',
        desc: 'GeForce RTX 4060, 4070, 4080, RX 7000',
        image: '/images/category/category-2.png',
        tags: ['ASUS TUF', 'MSI Gaming X', 'Gigabyte']
      },
      {
        name: 'Mainboard - Bo mạch chủ',
        keyword: 'Mainboard',
        desc: 'Socket LGA1700, AM5, Chipset B760, Z790',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=120&q=80',
        tags: ['ASUS', 'MSI', 'Gigabyte']
      },
      {
        name: 'RAM - Bộ nhớ',
        keyword: 'RAM',
        desc: 'DDR4, DDR5 tản nhiệt thép, LED RGB',
        image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=120&q=80',
        tags: ['Corsair', 'Kingston Fury', 'G.Skill']
      },
      {
        name: 'SSD - Ổ cứng',
        keyword: 'SSD',
        desc: 'NVMe M.2 PCIe 4.0 tốc độ tới 7400MB/s',
        image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=120&q=80',
        tags: ['Samsung 990 Pro', 'Kingston NV2']
      },
      {
        name: 'PSU - Nguồn máy tính',
        keyword: 'PSU',
        desc: 'Chuẩn 80 Plus Bronze/Gold, ATX 3.0 PCIe 5.0',
        image: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=120&q=80',
        tags: ['Corsair RM', 'MSI MAG', 'Cooler Master']
      },
      {
        name: 'Case - Vỏ máy tính',
        keyword: 'Case',
        desc: 'Kính cường lực bể cá, LED ARGB, tối ưu khí',
        image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=120&q=80',
        tags: ['NZXT', 'Lian Li', 'Montech']
      },
      {
        name: 'Cooling - Tản nhiệt',
        keyword: 'Cooling',
        desc: 'Tản nước AIO 240/360mm, Tản tháp khí kép',
        image: 'https://images.unsplash.com/photo-1587202372583-49330a15584d?w=120&q=80',
        tags: ['DeepCool', 'Thermalright', 'Corsair']
      },
    ]
  },
  {
    id: 'monitors',
    name: 'Màn Hình Máy Tính',
    shortName: 'Màn Hình',
    icon: Monitor,
    badge: 'Mới Nhất',
    image: '/images/category/category-1.png',
    bannerText: 'Màn hình Gaming 144Hz - 240Hz, Tấm nền Fast IPS & OLED',
    bannerCta: 'Xem màn hình',
    bannerLink: '/products?q=Monitor',
    subcategories: [
      {
        name: 'Monitor - Màn hình Gaming',
        keyword: 'Monitor',
        desc: 'Tần số quét 144Hz - 240Hz, 1ms, G-Sync / FreeSync',
        image: '/images/category/category-1.png',
        tags: ['24 inch', '27 inch', '32 inch cong']
      },
      {
        name: 'Màn hình Đồ họa & Thiết kế',
        keyword: 'Monitor',
        desc: 'Độ phân giải 2K / 4K UHD, 100% sRGB, IPS sắc nét',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=120&q=80',
        tags: ['Dell UltraSharp', 'Asus ProArt']
      },
      {
        name: 'Màn hình Văn phòng & Giải trí',
        keyword: 'Monitor',
        desc: 'Thiết kế tràn viền, công nghệ Eye Care bảo vệ mắt',
        image: 'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=120&q=80',
        tags: ['ViewSonic', 'Samsung', 'LG 24-27"']
      },
    ]
  },
  {
    id: 'gear',
    name: 'Bàn Phím, Chuột & Gaming Gear',
    shortName: 'Gaming Gear',
    icon: Headphones,
    badge: 'Bán Chạy',
    image: '/images/category/category-3.png',
    bannerText: 'Gear Gaming Cao Cấp - Bàn phím cơ, Chuột không dây siêu nhẹ',
    bannerCta: 'Khám phá Gear',
    bannerLink: '/products?q=Gear',
    subcategories: [
      {
        name: 'Keyboard - Bàn phím',
        keyword: 'Keyboard',
        desc: 'Bàn phím cơ Custom, Switch cơ học, Hotswap RGB',
        image: '/images/category/category-3.png',
        tags: ['Logitech G', 'Razer', 'Akko', 'Corsair']
      },
      {
        name: 'Mouse - Chuột',
        keyword: 'Mouse',
        desc: 'Chuột Gaming siêu nhẹ <60g, Cảm biến Focus Pro',
        image: '/images/category/category-4.png',
        tags: ['Logitech G Pro', 'Razer DeathAdder']
      },
      {
        name: 'Headset - Tai nghe',
        keyword: 'Headset',
        desc: 'Tai nghe gaming âm thanh vòm 7.1, mic lọc tiếng ồn',
        image: '/images/category/category-6.png',
        tags: ['HyperX Cloud', 'Logitech G733', 'Razer']
      },
    ]
  },
  {
    id: 'pc',
    name: 'PC Đồng Bộ & Cấu Hình Sẵn',
    shortName: 'PC Gaming',
    icon: Box,
    badge: 'Tối Ưu',
    image: '/images/category/category-7.png',
    bannerText: 'PC ráp sẵn tối ưu hóa hiệu năng - Tặng gói quà tặng 2.000.000₫',
    bannerCta: 'Khám phá PC',
    bannerLink: '/products?q=PC',
    subcategories: [
      {
        name: 'PC Gaming Chiến Mượt Game',
        keyword: 'PC',
        desc: 'Cấu hình test sẵn GTA V, Cyberpunk 2077, Valorant',
        image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=120&q=80',
        tags: ['Core i5 RTX 4060', 'Ryzen 5 7600']
      },
      {
        name: 'PC Đồ Họa & Render 3D',
        keyword: 'PC',
        desc: 'Workstation chuyên render Blender, Premiere, AutoCAD',
        image: 'https://images.unsplash.com/photo-1587202372583-49330a15584d?w=120&q=80',
        tags: ['Core i7 / i9', 'RAM 32GB - 64GB']
      },
      {
        name: 'Xây Dựng Cấu Hình PC (Tùy chọn)',
        link: '/build-pc',
        desc: 'Tự build bộ máy theo ý thích, tính toán công suất W',
        image: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=120&q=80',
        tags: ['Kiểm tra tương thích', 'In báo giá A4']
      },
    ]
  }
]

export default function MegaMenu({ categories = [], isOpen = false, onOpenChange, onClose }) {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState(MEGA_MENU_DATA[1].id) // Default to Linh Kiện Máy Tính
  const containerRef = useRef(null)
  const timeoutRef = useRef(null)

  // Handle open/close with slight delay for smooth hover
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    onOpenChange?.(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      onOpenChange?.(false)
    }, 180)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Resolve category link to matching API categoryId
  const getSubcategoryLink = (sub) => {
    if (sub.link) return sub.link
    const matched = categories.find(
      (c) =>
        c.name.toLowerCase() === sub.name.toLowerCase() ||
        (sub.keyword && c.name.toLowerCase().includes(sub.keyword.toLowerCase())) ||
        sub.name.toLowerCase().includes(c.name.toLowerCase())
    )
    if (matched) {
      return `/products?categoryId=${matched.id}`
    }
    return `/products?q=${encodeURIComponent(sub.keyword || sub.name)}`
  }

  const currentCat = MEGA_MENU_DATA.find((c) => c.id === activeCategory) || MEGA_MENU_DATA[0]
  const CurrentIcon = currentCat.icon

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onOpenChange?.(!isOpen)}
        className={`gap-1.5 h-9 rounded-lg transition-colors ${
          isOpen ? 'bg-primary/10 border-primary text-primary' : ''
        }`}
      >
        <Layers className="h-4 w-4 text-primary" />
        <span className="font-semibold text-xs sm:text-sm">Danh Mục</span>
        <ChevronDown
          className={`h-3.5 w-3.5 opacity-60 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-primary' : ''
          }`}
        />
      </Button>

      {/* Mega Flyout Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute left-0 top-full mt-2 w-[820px] rounded-2xl border border-border bg-card text-card-foreground shadow-2xl overflow-hidden z-50 flex animate-in fade-in-0 zoom-in-95 duration-150"
          style={{ maxHeight: 'calc(100vh - 90px)' }}
        >
          {/* Left Column: Parent Categories (Làm gọn thành các nhóm lớn) */}
          <div className="w-64 border-r border-border/80 bg-muted/20 p-2.5 flex flex-col justify-between shrink-0">
            <div className="space-y-1">
              <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>Nhóm Sản Phẩm</span>
                <Sparkles className="h-3 w-3 text-primary" />
              </div>

              {/* All products link */}
              <Link
                to="/products"
                onClick={onClose}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Grid className="h-4 w-4" />
                  </div>
                  <span>Tất cả sản phẩm</span>
                </div>
                <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                  All
                </Badge>
              </Link>

              <div className="h-px bg-border/60 my-1.5" />

              {/* Parent category rows */}
              {MEGA_MENU_DATA.map((cat) => {
                const Icon = cat.icon
                const isActive = activeCategory === cat.id

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onMouseEnter={() => setActiveCategory(cat.id)}
                    onClick={() => {
                      navigate(cat.bannerLink)
                      onClose?.()
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all duration-150 text-left ${
                      isActive
                        ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                        : 'text-foreground hover:bg-muted/70 hover:text-foreground font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                          isActive
                            ? 'bg-primary-foreground/20 text-primary-foreground'
                            : 'bg-muted text-primary'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="truncate">{cat.name}</span>
                    </div>
                    <ChevronRight
                      className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                        isActive ? 'opacity-100 translate-x-0.5' : 'opacity-30'
                      }`}
                    />
                  </button>
                )
              })}
            </div>

            {/* Special Builder CTA */}
            <div className="pt-2 border-t border-border/60">
              <Link
                to="/build-pc"
                onClick={onClose}
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/15 border border-primary/20 text-xs font-semibold transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 shrink-0" />
                  <span className="truncate">Xây Dựng Cấu Hình PC</span>
                </div>
                <ArrowRight className="h-3 w-3 shrink-0" />
              </Link>
            </div>
          </div>

          {/* Right Flyout Panel: Sub-niches & Visual Thumbnails (Ngách nhỏ khi kéo chuột đến) */}
          <div className="flex-1 p-5 flex flex-col justify-between bg-card overflow-y-auto">
            <div>
              {/* Category Sub-panel Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border/80">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <CurrentIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <span>{currentCat.name}</span>
                      <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-medium">
                        {currentCat.badge}
                      </Badge>
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Lựa chọn các dòng sản phẩm và linh kiện tương thích
                    </p>
                  </div>
                </div>

                <Link
                  to={currentCat.bannerLink}
                  onClick={onClose}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>Xem tất cả</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Subcategory Grid with Visual Thumbnails */}
              <div
                className={`grid gap-2.5 pt-3.5 ${
                  currentCat.subcategories.length > 4 ? 'grid-cols-2' : 'grid-cols-2'
                }`}
              >
                {currentCat.subcategories.map((sub, idx) => {
                  const targetLink = getSubcategoryLink(sub)

                  return (
                    <Link
                      key={idx}
                      to={targetLink}
                      onClick={onClose}
                      className="group flex items-start gap-3 p-2.5 rounded-xl border border-border/60 hover:border-primary/50 hover:bg-muted/40 transition-all duration-150"
                    >
                      {/* Product Thumbnail / Image */}
                      <div className="h-12 w-12 rounded-lg bg-muted/60 p-1 shrink-0 border border-border/40 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
                        <img
                          src={sub.image}
                          alt={sub.name}
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            // Fallback to default icon if image fails
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>

                      {/* Subcategory Details */}
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 flex items-center gap-1">
                          <span className="truncate">{sub.name}</span>
                          <ChevronRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0 text-primary" />
                        </h4>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                          {sub.desc}
                        </p>
                        {sub.tags && (
                          <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                            {sub.tags.slice(0, 2).map((t, tidx) => (
                              <span
                                key={tidx}
                                className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground font-medium"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Bottom Promo Visual Banner (Giống Phong Vũ) */}
            <div className="mt-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-muted/50 border border-primary/20 p-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={currentCat.image}
                  alt={currentCat.name}
                  className="h-12 w-16 object-contain drop-shadow-md shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground line-clamp-1">
                    {currentCat.bannerText}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                    Cam kết chính hãng 100% • Bảo hành tận nơi 12 - 36 Tháng
                  </p>
                </div>
              </div>
              <Link
                to={currentCat.bannerLink}
                onClick={onClose}
                className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
              >
                {currentCat.bannerCta}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
