import React from 'react';

const CustomerSeatMap = ({ rows, selectedSeats, currentUserId, onSeatClick }) => (
  <div className="seat-grid-container">
    <div className="seat-grid">
      {Object.keys(rows).sort().map((rowLabel) => (
        <div key={rowLabel} className="seat-row">
          <div className="row-label">{rowLabel}</div>
          {[...(rows[rowLabel] || [])].sort((a, b) => a.colNumber - b.colNumber).map((seat) => {
            const isSelected = selectedSeats.some((selectedSeat) => selectedSeat.seatId === seat.seatId);
            const isMyHold = Number(seat.holdByUserId) === currentUserId;
            const statusClass = (isSelected || isMyHold) ? 'selected' : seat.status.toLowerCase();
            const typeClass = seat.seatType.toLowerCase();

            return (
              <button
                key={seat.seatId}
                className={`seat-btn ${statusClass} ${typeClass}`}
                onClick={() => onSeatClick(seat)}
                disabled={seat.status === 'BOOKED' || (seat.status === 'HOLDING' && !isSelected && !isMyHold)}
                title={`${seat.rowLabel}${seat.colNumber} · ${seat.seatType} · ${seat.price.toLocaleString()}đ`}
              >
                {seat.colNumber}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  </div>
);

export default CustomerSeatMap;
