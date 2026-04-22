import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './TicketDetail.css';

/**
 * Component Hiển thị MỘT CHUYẾN Đi / 1 Ghế ngồi chứa phần chữ và Mã vạch QR Code.
 * Chức năng: Xuất trình quét mã QR cửa VÀO Rạp.
 *
 * @param {Object} props - Cấu hình thẻ vé trực quan.
 * @param {Object} props.ticket - Thông tin riêng của thẻ vé (vd: Ghế A1, Hàng F...)
 * @param {string} props.movieTitle - Tên phim truyền từ Lệnh vé lớn xuống.
 * @param {string} props.showtimeInfo - Chuỗi giờ chiếu truyền từ trên xuống.
 * @returns {JSX.Element} Tấm vé điện tử đơn.
 */
const TicketDetail = ({ ticket, movieTitle, showtimeInfo }) => {
  return (
    <div className="ticket-detail">
      <div className="ticket-detail__left">
        <h4 className="ticket-detail__movie">{movieTitle}</h4>
        <p className="ticket-detail__info">{showtimeInfo}</p>
        <div className="ticket-detail__seat-info">
          <span className="ticket-detail__label">Seat</span>
          <span className="ticket-detail__seat-name">
            {ticket.rowLetter || ticket.row}{ticket.seatNumber || ticket.col}
          </span>
        </div>
        {ticket.guestName && (
          <p className="ticket-detail__guest">Guest: {ticket.guestName}</p>
        )}
      </div>
      <div className="ticket-detail__qr">
        <QRCodeSVG
          value={ticket.qrCode || `TICKET-${ticket.id}`}
          size={200}
          bgColor="transparent"
          fgColor="#ffffff"
          level="M"
        />
      </div>
    </div>
  );
};

export default TicketDetail;
