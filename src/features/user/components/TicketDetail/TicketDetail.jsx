import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './TicketDetail.css';

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
