import React from 'react';
import './OrderSummary.css';

/**
 * Component hiển thị tóm tắt thông tin đơn hàng (Order Summary).
 * Hiển thị các thông tin như: Phim, Suất chiếu, Phòng, Ghế đã chọn và Tổng tiền.
 */
const OrderSummary = ({ booking }) => {
  if (!booking) return null;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    return `${dayNames[d.getDay()]} ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')} · ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const unitPrice = booking.totalPrice / (booking.numberOfTickets || 1);

  return (
    <div className="ocard">
      <h3>Thông tin vé</h3>
      <div className="orow">
        <span className="c2">Phim</span>
        <span>{booking.movieTitle}</span>
      </div>
      <div className="orow">
        <span className="c2">Suất chiếu</span>
        <span>{formatDate(booking.showtimeStart)}</span>
      </div>
      <div className="orow">
        <span className="c2">Phòng</span>
        <span>{booking.roomName}</span>
      </div>
      <div className="orow">
        <span className="c2">Ghế đã chọn</span>
        <span>{booking.seatLabels?.join(', ')}</span>
      </div>
      <div className="orow">
        <span className="c2">Đơn giá</span>
        <span>
          {new Intl.NumberFormat('vi-VN').format(unitPrice)} đ × {booking.numberOfTickets || 0}
        </span>
      </div>
      <div className="orow tot">
        <span>Tổng thanh toán</span>
        <span className="pb">{new Intl.NumberFormat('vi-VN').format(booking.totalPrice)} đ</span>
      </div>
    </div>
  );
};

export default OrderSummary;
