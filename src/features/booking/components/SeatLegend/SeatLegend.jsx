import React from 'react';
import './SeatLegend.css';

/**
 * Component Hiển thị Chú giải các loại Ghế ngồi.
 * Nằm bên dưới màn hình chọn, chú thích các màu sắc: Trống, Đang chọn, Đã bán, Đang giữ...
 *
 * @returns {JSX.Element} Thanh chú giải trạng thái ghế.
 */
const SeatLegend = () => {
  const items = [
    { label: 'Available', className: 'seat-legend__dot--available' },
    { label: 'Selected', className: 'seat-legend__dot--selected' },
    { label: 'Booked', className: 'seat-legend__dot--booked' },
    { label: 'Holding', className: 'seat-legend__dot--holding' },
  ];

  return (
    <div className="seat-legend">
      {items.map((item) => (
        <div key={item.label} className="seat-legend__item">
          <span className={`seat-legend__dot ${item.className}`} />
          <span className="seat-legend__label">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default SeatLegend;
