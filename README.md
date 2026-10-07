# ⚡ GearUp - PC & Gaming Gear E-Commerce Platform

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://www.docker.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)](https://www.mysql.com/)
[![Redis](https://img.shields.io/badge/Redis-7.0-DC382D?logo=redis)](https://redis.io/)

Nền tảng thương mại điện tử chuyên biệt cho thiết bị máy tính, linh kiện PC và phụ kiện gaming cao cấp. Hệ thống được xây dựng trên kiến trúc **Microservices** phân tán, kết hợp giao diện tích hợp thông minh giữa Cửa hàng (Storefront) và Cổng Quản Trị (Admin Portal) chung trên một nền tảng duy nhất theo chuẩn Design System (shadcn/ui & Tailwind CSS).

---

## ✨ Tính Năng Nổi Bật

- 🛒 **Giao diện Storefront hiện đại**:
  - Giao diện cao cấp hỗ trợ Dark/Light mode, tối ưu trải nghiệm người dùng trên mọi thiết bị.
  - **Mega Menu thông minh** (phong cách Phong Vũ / GearVN): Thu gọn danh mục chính, tự động mở rộng các ngách nhỏ khi rê chuột, kèm hình ảnh minh họa trực quan.
  - Bộ lọc đa tiêu chí (Faceted Search): lọc theo thương hiệu, khoảng giá, phân loại sản phẩm.

- 🛠️ **Xây dựng cấu hình PC (PC Builder)**:
  - Tự do tùy biến 12 linh kiện máy tính (CPU, Mainboard, RAM, SSD, Card đồ họa VGA, Nguồn PSU, Vỏ Case, Tản nhiệt...).
  - **Tính toán điện năng tự động**: Ước tính công suất tiêu thụ (~Watt) và tự động đưa ra khuyến nghị công suất nguồn PSU an toàn.
  - **Kiểm tra tương thích**: Đánh giá độ đồng bộ và nhắc nhở các linh kiện bắt buộc trước khi lắp ráp.
  - **1-Click thêm vào giỏ**: Đưa toàn bộ cấu hình vào giỏ hàng hoặc thanh toán nhanh.

- 🖨️ **In bảng báo giá chuẩn Showroom**:
  - Xem trước & in bảng báo giá A4 chuyên nghiệp ngay trên trình duyệt.
  - Tự động hiển thị linh kiện đã chọn, tính chiết khấu, miễn phí lắp ráp/giao hàng.
  - Tự động chuyển đổi số tiền thành chữ tiếng Việt chuẩn xác (VD: *"Hai mươi lăm triệu sáu trăm nghìn đồng chẵn"*).
  - Xuất file PDF hoặc in trực tiếp với định dạng khổ giấy A4 sắc nét.

- 🔍 **Tìm kiếm & Trợ lý thông minh**:
  - Tích hợp Elasticsearch cho tốc độ tìm kiếm sản phẩm tức thì.
  - AI Assistant hỗ trợ giải đáp thắc mắc và gợi ý cấu hình phù hợp nhu cầu.

- 💳 **Thanh toán & Đơn hàng**:
  - Hỗ trợ giỏ hàng độc lập cho cả khách vãng lai (Guest) và thành viên đã đăng nhập.
  - Thanh toán linh hoạt: Tiền mặt khi nhận hàng (COD) và Cổng thanh toán trực tuyến **VNPay**.
  - Hệ thống tích điểm thành viên (Loyalty Points) và áp dụng mã giảm giá khuyến mãi.

- 🛡️ **Cổng Quản Trị Hợp Nhất (Admin Portal - `/admin`)**:
  - **Đồng bộ phiên đăng nhập**: Đăng nhập chung tại `/login`, hệ thống tự nhận diện vai trò `ADMIN` và cấp quyền truy cập `/admin/*`.
  - **Chuyển đổi tức thì**: Nút bấm "Trang Quản Trị" trên Navbar cho Admin và nút "Xem Cửa Hàng" tại trang Admin giúp chuyển đổi mượt mà.
  - **Báo cáo & Thống kê**: Biểu đồ doanh thu 7 ngày, tổng số đơn, xuất file CSV/Excel UTF-8 có dấu tiếng Việt.
  - **Quản lý toàn diện**: Sản phẩm, danh mục, thương hiệu, banner trang chủ, duyệt đơn hàng, kiểm duyệt đánh giá, khách hàng và voucher khuyến mãi.

---

## 🛠️ Công Nghệ Sử Dụng

| Tầng hệ thống | Công nghệ chính |
|---------------|-----------------|
| **Frontend & Admin Unified** | React 19, Vite, Tailwind CSS, shadcn/ui, Radix UI, Lucide Icons |
| **API Gateway** | Express Gateway, JWT Authentication, Role-Based Access Control (RBAC), Rate Limiting, CORS |
| **Microservices Backend** | Node.js, Express (Auth, Catalog, Cart, Order, Payment Services) |
| **Cơ sở dữ liệu & Cache** | MySQL 8.0, Redis 7 (Session & Cart Cache), Elasticsearch 8.x |
| **Triển khai & Vận hành** | Docker, Docker Compose |

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Yêu cầu hệ thống
- Đã cài đặt [Docker Desktop](https://www.docker.com/products/docker-desktop/).
- Đảm bảo Docker Desktop đang chạy.

### 2. Khởi chạy toàn bộ hệ thống bằng Docker (Khuyên dùng)

Mở terminal tại thư mục gốc của dự án và chạy:

```bash
docker compose up -d --build
```

Lệnh này sẽ tự động:
1. Khởi tạo cơ sở dữ liệu MySQL, Redis và Elasticsearch.
2. Nạp dữ liệu mẫu ban đầu (`init-unified.sql`).
3. Khởi chạy API Gateway cùng 5 microservices backend.
4. Đóng gói và chạy ứng dụng Frontend hợp nhất trên cổng `:5173`.

### 3. Địa chỉ truy cập các dịch vụ

Sau khi các container khởi động:

| Dịch vụ | Địa chỉ URL | Mô tả |
|---------|-------------|-------|
| 🛒 **Cửa Hàng (Storefront)** | [http://localhost:5173](http://localhost:5173) | Trang mua sắm, danh mục, PC Builder |
| 🛡️ **Trang Quản Trị (Admin Portal)** | [http://localhost:5173/admin](http://localhost:5173/admin) | Quản lý sản phẩm, đơn hàng, thống kê doanh thu |
| 🌐 **API Gateway** | [http://localhost:8080](http://localhost:8080) | Cổng API tập trung |
| 🗄️ **MySQL Database** | `localhost:3306` | User: `root` / Pass: `rootpw` |

### 4. Dừng hệ thống

Khi muốn dừng toàn bộ các container:

```bash
docker compose down
```

---

## 👥 Tài Khoản Trải Nghiệm

| Vai trò | Email đăng nhập | Mật khẩu | Quyền hạn |
|---------|-----------------|----------|-----------|
| **Quản trị viên (Admin)** | `tenho051512@gmail.com` | `admin123456` | Tự động mở quyền truy cập Cổng Quản Trị tại [http://localhost:5173/admin](http://localhost:5173/admin) |
| **Khách hàng (User)** | Tùy ý đăng ký mới | Tự chọn | Mua hàng, xây dựng cấu hình PC, thanh toán |