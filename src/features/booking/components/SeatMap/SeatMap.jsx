import React from 'react';
import './SeatMap.css';

const SEAT_STATUS = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  HOLDING: 'holding',
  SELECTED: 'selected',
};

const SeatMap = ({ seats = [], selectedSeats = [], onToggleSeat, maxSeats = 8 }) => {
  const rows = {};
  seats.forEach((seat) => {
    const row = seat.rowLetter || seat.row || 'A';
    if (!rows[row]) rows[row] = [];
    rows[row].push(seat);
  });

  Object.values(rows).forEach((row) =>
    row.sort((a, b) => (a.seatNumber || a.col) - (b.seatNumber || b.col))
  );

  const getSeatStatus = (seat) => {
    if (selectedSeats.includes(seat.id)) return SEAT_STATUS.SELECTED;
    if (seat.status === 'BOOKED' || seat.booked) return SEAT_STATUS.BOOKED;
    if (seat.status === 'HOLDING' || seat.holding) return SEAT_STATUS.HOLDING;
    return SEAT_STATUS.AVAILABLE;
  };

  const handleClick = (seat) => {
    const status = getSeatStatus(seat);
    if (status === SEAT_STATUS.BOOKED || status === SEAT_STATUS.HOLDING) return;
    if (status === SEAT_STATUS.AVAILABLE && selectedSeats.length >= maxSeats) return;
    onToggleSeat(seat.id);
  };

  return (
    <div className="seat-map">
      <div className="seat-map__screen">SCREEN</div>
      <div className="seat-map__grid">
        {Object.entries(rows)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([rowLetter, rowSeats]) => (
            <div key={rowLetter} className="seat-map__row">
              <span className="seat-map__row-label">{rowLetter}</span>
              <div className="seat-map__seats">
                {rowSeats.map((seat) => {
                  const status = getSeatStatus(seat);
                  return (
                    <button
                      key={seat.id}
                      className={`seat-map__seat seat-map__seat--${status}`}
                      onClick={() => handleClick(seat)}
                      disabled={status === SEAT_STATUS.BOOKED || status === SEAT_STATUS.HOLDING}
                      title={`${rowLetter}${seat.seatNumber || seat.col}`}
                    >
                      {seat.seatNumber || seat.col}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SeatMap;
