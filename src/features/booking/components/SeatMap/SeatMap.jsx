import React from 'react';
import './SeatMap.css';

const SEAT_STATUS = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  HOLDING: 'holding',
  SELECTED: 'selected',
};

/**
 * Component Bản đồ ghế ngồi chính trong rạp chiếu.
 * Tính toán mảng dữ liệu ghế, chia thành từng hàng và cột biểu diễn dạng lưới.
 *
 * @param {Object} props - Tham số đầu vào.
 * @param {Array} props.seats - Dữ liệu danh sách tất cả các ghế trả về từ máy chủ.
 * @param {Array} props.selectedSeats - Mảng ID các chố ngồi mà người dùng đang tạm chọn.
 * @param {Function} props.onToggleSeat - Hàm phát lại khi người dùng bấm chọn/hủy chọn một ghế.
 * @param {number} [props.maxSeats=8] - Số lượng ghế tối đa được mua trên 1 giao dịch.
 * @returns {JSX.Element} Giao diện sơ đồ mặt bằng chiếu.
 */
const SeatMap = ({ seats = [], selectedSeats = [], onToggleSeat, maxSeats = 8 }) => {
  // Nhóm ghế theo dòng (A, B, C,...) thành một Object: { A: [...], B: [...] }
  const rows = {};
  seats.forEach((seat) => {
    const row = seat.rowLetter || seat.row || 'A';//  
    if (!rows[row]) rows[row] = [];
    rows[row].push(seat);
  });

  Object.values(rows).forEach((row) =>
    row.sort((a, b) => (a.seatNumber || a.col) - (b.seatNumber || b.col))
  );

  /** Hàm rà soát tình trạng thực của ghế. Ưu tiên: Selected -> Booked -> Holding -> Available */
  const getSeatStatus = (seat) => {
    if (selectedSeats.includes(seat.id)) return SEAT_STATUS.SELECTED;
    if (seat.status === 'BOOKED' || seat.booked) return SEAT_STATUS.BOOKED;
    if (seat.status === 'HOLDING' || seat.holding) return SEAT_STATUS.HOLDING;
    return SEAT_STATUS.AVAILABLE;
  };

  /** Xử lý khi nhấn click vào 1 ghế: Chặn chọn nếu đã bán hoặc đang lấn chiếm giới hạn số lượng ghế */
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
          .map(([rowLetter, rowSeats]) => ( // rowLetter = "A" rowSeats = [ghế A1, ghế A2]
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
