// Utility for exporting data to CSV with UTF-8 BOM (compatible with Microsoft Excel)
export function exportToCSV(data, filename = 'export') {
  if (!data || !data.length) {
    alert('Không có dữ liệu để xuất!');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
    ...data.map(row =>
      headers
        .map(header => {
          const val = row[header] !== undefined && row[header] !== null ? String(row[header]) : '';
          return `"${val.replace(/"/g, '""')}"`;
        })
        .join(',')
    ),
  ];

  // \uFEFF is UTF-8 Byte Order Mark (BOM), needed for Excel to display Vietnamese characters correctly
  const csvString = '\uFEFF' + csvRows.join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function formatProductsForExport(products) {
  return products.map((p, index) => ({
    'STT': index + 1,
    'Mã SKU': p.sku || '',
    'Tên sản phẩm': p.name || '',
    'Thương hiệu': p.brand_name || p.brand || '',
    'Danh mục': p.category_name || p.category || '',
    'Giá gốc (VNĐ)': ((p.price_cents || 0) / 100).toLocaleString('vi-VN'),
    'Giảm giá (%)': p.discount_percent || 0,
    'Giá bán (VNĐ)': ((p.final_price_cents || p.price_cents || 0) / 100).toLocaleString('vi-VN'),
    'Tồn kho': p.stock || 0,
    'Mô tả': p.description || '',
  }));
}

export function formatOrdersForExport(orders) {
  const getStatusText = (status) => {
    const map = {
      PENDING: 'Chờ xác nhận',
      CONFIRMED: 'Đã xác nhận',
      SHIPPING: 'Đang giao',
      DELIVERED: 'Đã giao hàng',
      CANCELLED: 'Đã hủy',
      PAID: 'Đã thanh toán',
    };
    return map[status] || status;
  };

  return orders.map((o, index) => ({
    'STT': index + 1,
    'Mã đơn': o.id,
    'Khách hàng': o.user_email || o.shipping_name || '',
    'Số điện thoại': o.shipping_phone || '',
    'Địa chỉ nhận hàng': `${o.shipping_address || ''}, ${o.shipping_ward || ''}, ${o.shipping_province || ''}`,
    'Tổng tiền (VNĐ)': ((o.total_cents || 0) / 100).toLocaleString('vi-VN'),
    'Phương thức thanh toán': o.payment_method || 'COD',
    'Trạng thái': getStatusText(o.status),
    'Ngày tạo': o.created_at ? new Date(o.created_at).toLocaleString('vi-VN') : '',
  }));
}

export function formatCustomersForExport(customers) {
  return customers.map((c, index) => ({
    'STT': index + 1,
    'Email': c.email || '',
    'Họ tên': c.full_name || '',
    'Số điện thoại': c.phone || '',
    'Tỉnh/TP': c.province || c.city || '',
    'Quận/Huyện': c.ward || '',
    'Địa chỉ chi tiết': c.address_detail || c.address || '',
    'Vai trò': c.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng',
    'Ngày đăng ký': c.created_at ? new Date(c.created_at).toLocaleString('vi-VN') : '',
  }));
}

export function formatBrandsForExport(brands) {
  return brands.map((b, index) => ({
    'STT': index + 1,
    'Mã': b.id,
    'Tên thương hiệu': b.name || '',
    'Số sản phẩm': b.product_count || 0,
  }));
}

export function formatCategoriesForExport(categories) {
  return categories.map((c, index) => ({
    'STT': index + 1,
    'Mã': c.id,
    'Tên danh mục': c.name || '',
    'Số sản phẩm': c.product_count || 0,
  }));
}

export function formatRevenueForExport(orders) {
  const deliveredOrders = orders.filter(o => o.status === 'DELIVERED');
  return deliveredOrders.map((o, index) => ({
    'STT': index + 1,
    'Mã đơn': o.id,
    'Ngày hoàn thành': new Date(o.updated_at || o.created_at).toLocaleString('vi-VN'),
    'Khách hàng': o.user_email || '',
    'Doanh thu (VNĐ)': ((o.total_cents || 0) / 100).toLocaleString('vi-VN'),
    'Phương thức': o.payment_method || 'COD',
  }));
}
