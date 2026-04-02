import React from 'react';
import './OrderSummary.css';

const OrderSummary = ({ booking }) => {
  if (!booking) return null;

  return (
    <div className="order-summary">
      <h3 className="order-summary__title">Order Summary</h3>
      <div className="order-summary__row">
        <span className="order-summary__label">Movie</span>
        <span className="order-summary__value">{booking.showtime?.movie?.title || booking.movieTitle || '—'}</span>
      </div>
      <div className="order-summary__row">
        <span className="order-summary__label">Date & Time</span>
        <span className="order-summary__value">
          {booking.showtime?.startTime
            ? new Date(booking.showtime.startTime).toLocaleString()
            : '—'}
        </span>
      </div>
      <div className="order-summary__row">
        <span className="order-summary__label">Room</span>
        <span className="order-summary__value">{booking.showtime?.room?.name || '—'}</span>
      </div>
      <div className="order-summary__row">
        <span className="order-summary__label">Seats</span>
        <span className="order-summary__value">
          {booking.tickets?.map((t) => t.seatName || `${t.rowLetter}${t.seatNumber}`).join(', ') || `${booking.seatCount || 0} seats`}
        </span>
      </div>
      <div className="order-summary__divider" />
      <div className="order-summary__row order-summary__row--total">
        <span className="order-summary__label">Total</span>
        <span className="order-summary__value">${booking.totalPrice || 0}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
