import React from 'react'

export const SLOT_WARRANTY = {
  cpu: '36 Tháng',
  mainboard: '36 Tháng',
  ram: '36 Tháng',
  ssd: '36 Tháng',
  gpu: '36 Tháng',
  psu: '36 Tháng',
  case: '12 Tháng',
  cooling: '24 Tháng',
  monitor: '24 Tháng',
  keyboard: '12 Tháng',
  mouse: '12 Tháng',
  headset: '12 Tháng',
}

function readThreeDigits(n, isLeading) {
  const digits = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín']
  const h = Math.floor(n / 100)
  const t = Math.floor((n % 100) / 10)
  const o = n % 10

  let res = ''
  if (h > 0 || !isLeading) {
    res += digits[h] + ' trăm '
  }

  if (t > 1) {
    res += digits[t] + ' mươi '
    if (o === 1) res += 'mốt '
    else if (o === 5) res += 'lăm '
    else if (o > 0) res += digits[o] + ' '
  } else if (t === 1) {
    res += 'mười '
    if (o === 5) res += 'lăm '
    else if (o > 0) res += digits[o] + ' '
  } else if (t === 0 && o > 0) {
    if (h > 0 || !isLeading) res += 'lẻ '
    res += digits[o] + ' '
  }

  return res.trim()
}

export function numberToVietnameseWords(amount) {
  if (!amount || isNaN(amount) || amount <= 0) return 'Không đồng'
  const scales = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ']
  let num = Math.floor(amount)
  const groups = []

  while (num > 0) {
    groups.push(num % 1000)
    num = Math.floor(num / 1000)
  }

  const parts = []
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i]
    if (g > 0) {
      const isLeading = i === groups.length - 1
      const gText = readThreeDigits(g, isLeading)
      const scale = scales[i]
      parts.push(gText + (scale ? ' ' + scale : ''))
    }
  }

  let text = parts.join(' ').trim()
  if (!text) return 'Không đồng'
  text = text.charAt(0).toUpperCase() + text.slice(1) + ' đồng chẵn.'
  return text.replace(/\s+/g, ' ')
}

export default function PCQuotationDocument({
  customerName = '',
  customerPhone = '',
  customerAddress = '',
  customerNote = '',
  selections = {},
  totalPrice = 0,
  totalWatts = 0,
  recommendedPsuWatts = 500,
  quotationCode = '',
  quotationDate = '',
  builderSlots = [],
}) {
  // Filter only selected components
  const selectedItems = builderSlots
    .filter((slot) => selections[slot.id]?.product)
    .map((slot) => {
      const sel = selections[slot.id]
      const p = sel.product
      const qty = sel.quantity || 1
      const originalPrice = Number(p.price_cents || 0)
      const discountPercent = Number(p.discount_percent || 0)
      const unitPrice = Math.round((originalPrice * (100 - discountPercent)) / 100)
      const itemTotal = unitPrice * qty
      return {
        slot,
        product: p,
        quantity: qty,
        unitPrice,
        itemTotal,
        warranty: SLOT_WARRANTY[slot.id] || '36 Tháng',
      }
    })

  return (
    <div className="quotation-document text-gray-900 bg-white font-sans text-xs leading-normal">
      {/* Store Header Letterhead */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-3 border-b-2 border-gray-900">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-gray-900 text-white flex items-center justify-center font-black text-sm tracking-tighter">
              GU
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-gray-900 uppercase">
                GEARUP PC & GAMING STORE
              </h1>
              <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">
                Hệ Thống Bán Lẻ Máy Tính & Linh Kiện Chính Hãng
              </p>
            </div>
          </div>
          <div className="text-[11px] text-gray-600 pt-1 space-y-0.5">
            <p><strong>Showroom:</strong> Số 123 Đường Công Nghệ, Quận Cầu Giấy, TP. Hà Nội</p>
            <p><strong>Hotline:</strong> 1900 8888 - 0988.123.456 | <strong>Email:</strong> kinhdoanh@gearup.vn</p>
            <p><strong>Website:</strong> www.gearup.vn | <strong>Mã số thuế:</strong> 0108988999</p>
          </div>
        </div>

        {/* Quotation Metadata Box */}
        <div className="w-full sm:w-auto sm:min-w-[210px] border border-gray-300 rounded p-2.5 bg-gray-50/60 text-[11px] space-y-1 shrink-0">
          <div className="font-bold text-gray-900 uppercase text-xs border-b border-gray-200 pb-1 text-center">
            Báo Giá Cấu Hình PC
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-gray-600">Mã phiếu:</span>
            <span className="font-mono font-bold text-gray-900">{quotationCode}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-gray-600">Ngày lập:</span>
            <span className="font-medium text-gray-800">{quotationDate}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-gray-600">Hiệu lực:</span>
            <span className="text-amber-700 font-semibold italic">07 ngày</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center my-3.5">
        <h2 className="text-base sm:text-lg font-black tracking-tight uppercase text-gray-900">
          BẢNG BÁO GIÁ CẤU HÌNH MÁY TÍNH
        </h2>
        <p className="text-[10px] text-gray-500 italic mt-0.5">
          (Áp dụng cho khách hàng cá nhân & dự án - Cam kết 100% linh kiện chính hãng mới)
        </p>
      </div>

      {/* Customer & Advisor Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded border border-gray-300 bg-gray-50/40 text-[11px] mb-3.5">
        <div className="space-y-1">
          <p className="font-bold text-gray-800 uppercase text-[10px] tracking-wider border-b border-gray-200 pb-0.5 mb-1">
            Thông Tin Khách Hàng
          </p>
          <p>
            <span className="text-gray-600 inline-block w-24">Họ và tên:</span>
            <strong className="text-gray-900">{customerName || 'Quý khách hàng'}</strong>
          </p>
          <p>
            <span className="text-gray-600 inline-block w-24">Số điện thoại:</span>
            <strong className="text-gray-900">{customerPhone || 'Theo thông tin liên hệ'}</strong>
          </p>
          <p>
            <span className="text-gray-600 inline-block w-24">Địa chỉ giao:</span>
            <span className="text-gray-800">{customerAddress || 'Nhận trực tiếp tại Showroom GearUp'}</span>
          </p>
          <p>
            <span className="text-gray-600 inline-block w-24">Ghi chú:</span>
            <span className="text-gray-800 italic">{customerNote || 'Lắp ráp hoàn chỉnh, test game, cài Windows 11 & phần mềm cơ bản.'}</span>
          </p>
        </div>

        <div className="space-y-1 sm:border-l sm:border-gray-200 sm:pl-3">
          <p className="font-bold text-gray-800 uppercase text-[10px] tracking-wider border-b border-gray-200 pb-0.5 mb-1">
            Đơn Vị Tư Vấn & Kỹ Thuật
          </p>
          <p>
            <span className="text-gray-600 inline-block w-28">Đơn vị tư vấn:</span>
            <span className="text-gray-800 font-medium">Showroom GearUp Cầu Giấy</span>
          </p>
          <p>
            <span className="text-gray-600 inline-block w-28">Chuyên viên tư vấn:</span>
            <span className="text-gray-800 font-medium">Nguyễn Văn Hoàng (Bộ phận PC)</span>
          </p>
          <p>
            <span className="text-gray-600 inline-block w-28">Tình trạng linh kiện:</span>
            <span className="text-emerald-700 font-semibold">Mới 100% Fullbox Chính hãng</span>
          </p>
          <p>
            <span className="text-gray-600 inline-block w-28">Thời gian xử lý:</span>
            <span className="text-gray-800 font-medium">Lắp ráp & giao hàng trong 2 giờ</span>
          </p>
        </div>
      </div>

      {/* Selected Components Table */}
      <table className="w-full border-collapse border border-gray-400 text-[11px] mb-2">
        <thead>
          <tr className="bg-gray-100 text-gray-900 font-bold border-b border-gray-400">
            <th className="border border-gray-300 px-2 py-1.5 text-center w-8">STT</th>
            <th className="border border-gray-300 px-2 py-1.5 text-left w-28">Danh mục</th>
            <th className="border border-gray-300 px-2 py-1.5 text-left">Tên sản phẩm & Thông số kỹ thuật</th>
            <th className="border border-gray-300 px-2 py-1.5 text-center w-28">Hãng / BH</th>
            <th className="border border-gray-300 px-2 py-1.5 text-center w-10">SL</th>
            <th className="border border-gray-300 px-2 py-1.5 text-right w-24">Đơn giá</th>
            <th className="border border-gray-300 px-2 py-1.5 text-right w-28">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {selectedItems.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-6 text-gray-500 italic">
                Chưa có linh kiện nào được chọn trong cấu hình.
              </td>
            </tr>
          ) : (
            selectedItems.map((item, idx) => {
              const categoryTitle = item.slot.name.includes(' (')
                ? item.slot.name.split(' (')[0]
                : item.slot.name

              return (
                <tr key={item.slot.id} className="border-b border-gray-200">
                  <td className="border border-gray-300 px-2 py-1.5 text-center font-medium">
                    {idx + 1}
                  </td>
                  <td className="border border-gray-300 px-2 py-1.5 font-semibold text-gray-800">
                    {categoryTitle}
                  </td>
                  <td className="border border-gray-300 px-2 py-1.5 text-gray-900 font-medium">
                    {item.product.name}
                  </td>
                  <td className="border border-gray-300 px-2 py-1.5 text-center text-gray-700">
                    {item.product.brand ? `${item.product.brand} - ` : ''}{item.warranty}
                  </td>
                  <td className="border border-gray-300 px-2 py-1.5 text-center font-bold text-gray-900">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-300 px-2 py-1.5 text-right text-gray-800 font-mono">
                    {item.unitPrice.toLocaleString('vi-VN')} ₫
                  </td>
                  <td className="border border-gray-300 px-2 py-1.5 text-right font-bold text-gray-900 font-mono">
                    {item.itemTotal.toLocaleString('vi-VN')} ₫
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
        <tfoot>
          <tr className="bg-gray-50/80">
            <td colSpan={5} className="border border-gray-300 px-2 py-1 text-right text-gray-600 font-medium">
              Tổng tiền linh kiện:
            </td>
            <td colSpan={2} className="border border-gray-300 px-2 py-1 text-right font-semibold text-gray-900 font-mono">
              {totalPrice.toLocaleString('vi-VN')} ₫
            </td>
          </tr>
          <tr className="bg-gray-50/80">
            <td colSpan={5} className="border border-gray-300 px-2 py-1 text-right text-gray-600 font-medium">
              Chi phí lắp ráp & Tối ưu luồng gió:
            </td>
            <td colSpan={2} className="border border-gray-300 px-2 py-1 text-right font-semibold text-emerald-700">
              Miễn phí (200.000₫)
            </td>
          </tr>
          <tr className="bg-gray-50/80">
            <td colSpan={5} className="border border-gray-300 px-2 py-1 text-right text-gray-600 font-medium">
              Cài đặt hệ điều hành & phần mềm cơ bản:
            </td>
            <td colSpan={2} className="border border-gray-300 px-2 py-1 text-right font-semibold text-emerald-700">
              Miễn phí
            </td>
          </tr>
          <tr className="bg-gray-50/80">
            <td colSpan={5} className="border border-gray-300 px-2 py-1 text-right text-gray-600 font-medium">
              Giao hàng tận nơi nội thành & hướng dẫn:
            </td>
            <td colSpan={2} className="border border-gray-300 px-2 py-1 text-right font-semibold text-emerald-700">
              Miễn phí
            </td>
          </tr>
          <tr className="bg-gray-100 font-bold">
            <td colSpan={5} className="border border-gray-300 px-2 py-2 text-right uppercase text-gray-900 text-xs">
              TỔNG CỘNG THANH TOÁN (ĐÃ GỒM VAT):
            </td>
            <td colSpan={2} className="border border-gray-300 px-2 py-2 text-right text-sm text-red-600 font-black font-mono">
              {totalPrice.toLocaleString('vi-VN')} ₫
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Amount in words */}
      <div className="flex justify-between items-center text-[11px] mb-3 px-1">
        <span className="text-gray-500 italic">* Bảng giá có giá trị tham khảo và đặt cọc trong thời gian hiệu lực.</span>
        <div className="text-right">
          <span className="text-gray-600">Số tiền viết bằng chữ: </span>
          <strong className="text-gray-900 italic font-semibold">
            {numberToVietnameseWords(totalPrice)}
          </strong>
        </div>
      </div>

      {/* Technical Summary Bar */}
      <div className="border border-gray-300 bg-gray-50 rounded p-2 text-[10.5px] grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
        <div>
          <span className="text-gray-600">⚡ Công suất tiêu thụ ước tính: </span>
          <strong className="text-gray-900">~{totalWatts} W</strong>
        </div>
        <div>
          <span className="text-gray-600">🔌 Khuyến nghị nguồn (PSU): </span>
          <strong className="text-blue-800">&gt;= {recommendedPsuWatts}W (Chuẩn 80 Plus)</strong>
        </div>
        <div>
          <span className="text-gray-600">🛡️ Đánh giá tương thích: </span>
          <strong className="text-emerald-700">Đạt chuẩn 100% vận hành</strong>
        </div>
      </div>

      {/* Warranty Commitments & Policies */}
      <div className="border border-gray-200 rounded p-2.5 text-[10px] text-gray-600 space-y-1 mb-4 bg-white">
        <p className="font-bold text-gray-800 uppercase tracking-wider text-[10px] mb-0.5">
          Chính Sách & Cam Kết Dịch Vụ Tại GearUp Store:
        </p>
        <p>1. Cam kết 100% linh kiện chính hãng, mới 100%, bảo hành theo đúng tiêu chuẩn của nhà phân phối tại Việt Nam.</p>
        <p>2. Đổi mới ngay trong 30 ngày đầu tiên nếu linh kiện phát sinh lỗi phần cứng từ nhà sản xuất.</p>
        <p>3. Tặng gói dịch vụ &quot;GearUp Care&quot; trọn đời: Miễn phí vệ sinh máy tính định kỳ, tra keo tản nhiệt cao cấp trọn đời máy.</p>
        <p>4. Hỗ trợ xử lý sự cố phần mềm từ xa qua Ultraview / Teamviewer 24/7. Hotline kỹ thuật: 1900 8888 (Phím 2).</p>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-3 gap-4 text-center text-[11px] pt-1 pb-4 print-avoid-break">
        <div className="space-y-1">
          <p className="font-bold text-gray-800 uppercase text-[10px]">Người Lập Báo Giá</p>
          <p className="text-[10px] text-gray-500 italic">(Ký và ghi rõ họ tên)</p>
          <div className="h-12" />
          <p className="font-semibold text-gray-900">Nguyễn Văn Hoàng</p>
        </div>

        <div className="space-y-1">
          <p className="font-bold text-gray-800 uppercase text-[10px]">Trưởng Bộ Phận Kỹ Thuật</p>
          <p className="text-[10px] text-gray-500 italic">(Ký duyệt tương thích)</p>
          <div className="h-12" />
          <p className="font-semibold text-gray-900">Lê Minh Tuấn</p>
        </div>

        <div className="space-y-1">
          <p className="font-bold text-gray-800 uppercase text-[10px]">Khách Hàng Xác Nhận</p>
          <p className="text-[10px] text-gray-500 italic">(Ký và ghi rõ họ tên)</p>
          <div className="h-12" />
          <p className="font-semibold text-gray-900">{customerName || 'Quý khách hàng'}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-300 pt-2 text-center text-[10px] text-gray-500">
        GearUp Store xin chân thành cảm ơn Quý khách! Chúc Quý khách có trải nghiệm làm việc & chơi game tuyệt vời nhất.
      </div>
    </div>
  )
}
