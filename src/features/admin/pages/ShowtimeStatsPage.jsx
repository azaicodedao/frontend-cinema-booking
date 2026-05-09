import React, { useState } from 'react';
import '../../../layouts/AdminLayout.css';

const MOCK_SHOWTIMES = [
  { id: 1, movie: 'Quỷ nhập tràng 2', room: 'Phòng 101 (IMAX)', time: '09:00 - 10-05-2026', totalSeats: 169, soldSeats: 95, revenue: 14250000 },
  { id: 2, movie: 'Thỏ ơi', room: 'Phòng 102 (3D)', time: '14:30 - 10-05-2026', totalSeats: 169, soldSeats: 82, revenue: 9840000 },
  { id: 3, movie: 'Mùi phở', room: 'Phòng 105 (2D)', time: '19:00 - 10-05-2026', totalSeats: 169, soldSeats: 101, revenue: 9090000 },
  { id: 4, movie: 'TỨ HỔ ĐẠI NÁO', room: 'Phòng 103 (2D)', time: '08:30 - 09-05-2026', totalSeats: 169, soldSeats: 65, revenue: 5850000 },
  { id: 5, movie: 'Chúng sẽ đoạt mạng', room: 'Phòng 105 (2D)', time: '21:15 - 09-05-2026', totalSeats: 169, soldSeats: 78, revenue: 7020000 },
];

const ShowtimeStatsPage = () => {
  const [filterMovie, setFilterMovie] = useState('all');
  const [filterRoom, setFilterRoom] = useState('all');
  const [dateRange, setDateRange] = useState('7days');
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  // Tính tỷ lệ lấp đầy
  const calculateFillRate = (sold, total) => {
    return ((sold / total) * 100).toFixed(1);
  };

  const openDetail = (st) => {
    setSelectedShowtime(st);
  };

  const closeDetail = () => {
    setSelectedShowtime(null);
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Thống kê Suất chiếu</h1>
      </div>

      {/* Bộ lọc (Basic Flow 2) */}
      <div className="admin-filters" style={{ marginBottom: 24 }}>
        <select className="admin-select" value={dateRange} onChange={e => setDateRange(e.target.value)}>
          <option value="7days">7 ngày qua</option>
          <option value="30days">30 ngày qua</option>
          <option value="thisMonth">Tháng này</option>
        </select>
        <select className="admin-select" value={filterMovie} onChange={e => setFilterMovie(e.target.value)}>
          <option value="all">-- Tất cả Phim --</option>
          <option value="Thỏ ơi">Thỏ ơi</option>
          <option value="Mùi phở">Mùi phở</option>
          <option value="Quỷ nhập tràng 2">Quỷ nhập tràng 2</option>
          <option value="TỨ HỔ ĐẠI NÁO">TỨ HỔ ĐẠI NÁO</option>
          <option value="Vùng đất luân hồi">Vùng đất luân hồi</option>
          <option value="Cú nhảy kỳ diệu">Cú nhảy kỳ diệu</option>
          <option value="Chúng sẽ đoạt mạng">Chúng sẽ đoạt mạng</option>
        </select>
        <select className="admin-select" value={filterRoom} onChange={e => setFilterRoom(e.target.value)}>
          <option value="all">-- Tất cả Phòng --</option>
          <option value="Phòng 101">Phòng 101 (IMAX)</option>
          <option value="Phòng 102">Phòng 102 (3D)</option>
          <option value="Phòng 103">Phòng 103 (2D)</option>
          <option value="Phòng 104">Phòng 104 (3D)</option>
          <option value="Phòng 105">Phòng 105 (2D)</option>
        </select>
      </div>

      {/* Bảng danh sách suất chiếu (Basic Flow 1) */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên Phim</th>
              <th>Phòng chiếu</th>
              <th>Giờ chiếu (Đã qua)</th>
              <th>Tổng ghế</th>
              <th>Ghế đã bán</th>
              <th>Tỷ lệ lấp đầy</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_SHOWTIMES.length === 0 ? (
              <tr><td colSpan={8}><div className="admin-empty">Không có dữ liệu trong khoảng thời gian này.</div></td></tr>
            ) : (
              MOCK_SHOWTIMES.map(st => {
                const fillRate = calculateFillRate(st.soldSeats, st.totalSeats);
                let rateColor = 'var(--red)';
                if (fillRate > 50) rateColor = 'var(--gold)';
                if (fillRate > 80) rateColor = 'var(--green)';

                return (
                  <tr key={st.id}>
                    <td style={{ color: 'var(--t3)', fontSize: 12 }}>#{st.id}</td>
                    <td style={{ fontWeight: 600 }}>{st.movie}</td>
                    <td><span className="badge badge-admin">{st.room}</span></td>
                    <td style={{ color: 'var(--t2)' }}>{st.time}</td>
                    <td>{st.totalSeats}</td>
                    <td style={{ fontWeight: 600 }}>{st.soldSeats}</td>
                    <td>
                      <span style={{ color: rateColor, fontWeight: 700 }}>{fillRate}%</span>
                    </td>
                    <td>
                      <button className="btn-admin-secondary" onClick={() => openDetail(st)}>Chi tiết</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Chi tiết Suất chiếu (Basic Flow 3) */}
      {selectedShowtime && (
        <div className="admin-modal-overlay" onClick={closeDetail}>
          <div className="admin-modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={closeDetail}>×</button>
            <h2 className="admin-modal-title">Chi tiết Suất chiếu #{selectedShowtime.id}</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24, background: 'var(--bg2)', padding: 16, borderRadius: 8 }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 4 }}>Phim</div>
                <div style={{ fontWeight: 600, color: 'var(--t1)' }}>{selectedShowtime.movie}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 4 }}>Doanh thu suất chiếu</div>
                <div style={{ fontWeight: 700, color: 'var(--gold)', fontSize: 18 }}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedShowtime.revenue)}
                </div>
              </div>
            </div>


            <div style={{ background: 'var(--bg3)', padding: 24, borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '80%', height: 20, background: 'var(--border)', borderRadius: '10px 10px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, color: 'var(--t2)', fontSize: 10 }}>MÀN HÌNH</div>

              {/* Mock Seat Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[...Array(13)].map((_, rowIndex) => (
                  <div key={rowIndex} style={{ display: 'flex', gap: 4 }}>
                    {[...Array(13)].map((_, colIndex) => {
                      // Randomly mark seats as booked based on fill rate (roughly)
                      const isBooked = Math.random() * 100 < calculateFillRate(selectedShowtime.soldSeats, selectedShowtime.totalSeats);
                      return (
                        <div
                          key={colIndex}
                          style={{
                            width: 18, height: 18, borderRadius: '3px 3px 4px 4px',
                            background: isBooked ? 'var(--red)' : 'var(--bg2)',
                            border: `1px solid ${isBooked ? 'var(--red)' : 'var(--border)'}`,
                            opacity: isBooked ? 0.7 : 1
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 16, marginTop: 24, fontSize: 12, color: 'var(--t2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 12, height: 12, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 2 }}></div> Ghế trống
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 12, height: 12, background: 'var(--red)', opacity: 0.7, borderRadius: 2 }}></div> Ghế đã bán
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ShowtimeStatsPage;
