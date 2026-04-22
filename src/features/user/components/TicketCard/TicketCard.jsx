import React from 'react';
import { Link } from 'react-router-dom';
import './TicketCard.css';

/**
 * Component Thẻ tóm tắt một Lệnh Đặt Vé (Ticket Card).
 * Hiển thị dạng chữ nhật nhỏ gọn trong danh sách "Lịch sử mua vé" ở trang Cá Nhân (Profile).
 * Trang thái đơn: PENDING (Chưa thanh toán), CONFIRMED (Đã thanh toán), CANCELLED (Bị hủy).
 *
 * @param {Object} props - Dữ liệu cấp vào.
 * @param {Object} props.booking - Thông tin lệnh vé thu nhỏ từ API Lịch sử giao dịch.
 * @returns {JSX.Element} Khối thẻ giao dịch.
 */
const TicketCard = ({ booking }) => {
  const statusClass = {
    CONFIRMED: 'ticket-card__status--confirmed',
    PENDING: 'ticket-card__status--pending',
    CANCELLED: 'ticket-card__status--cancelled',
  }[booking.status] || '';

  return (
    <div className="ticket-card">
      <div className="ticket-card__info">
        <h3 className="ticket-card__movie">{booking.showtime?.movie?.title || booking.movieTitle || 'Movie'}</h3>
        <p className="ticket-card__details">
          {booking.showtime?.startTime
            ? new Date(booking.showtime.startTime).toLocaleString()
            : '—'}
          {booking.showtime?.room?.name && ` • Room: ${booking.showtime.room.name}`}
        </p>
        <span className={`ticket-card__status ${statusClass}`}>{booking.status}</span>
      </div>
      <div className="ticket-card__actions">
        <span className="ticket-card__price">${booking.totalPrice || 0}</span>
        {booking.status === 'PENDING' && (
          <Link to={`/pay/${booking.id}`} className="ticket-card__pay-btn">
            Pay Now
          </Link>
        )}
        {booking.status === 'CONFIRMED' && (
          <Link to={`/tickets/${booking.id}`} className="ticket-card__view-btn">
            View Tickets
          </Link>
        )}
      </div>
    </div>
  );
};

export default TicketCard;
