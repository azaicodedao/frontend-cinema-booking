import React, { useState } from 'react';
import '../../../layouts/AdminLayout.css';

const MOCK_STATS = {
  totalRevenue: 125400000, // 125.4 triệu VNĐ
  totalTickets: 1450,
  totalBookings: 856,
};

const MOCK_TOP_MOVIES = [
  { id: 1, title: 'Quỷ nhập tràng 2', tickets: 450, revenue: 40500000 },
  { id: 2, title: 'Thỏ ơi', tickets: 320, revenue: 25600000 },
  { id: 3, title: 'Mùi phở', tickets: 280, revenue: 28000000 },
  { id: 4, title: 'Vùng đất luân hồi', tickets: 210, revenue: 16800000 },
  { id: 5, title: 'TỨ HỔ ĐẠI NÁO', tickets: 190, revenue: 14500000 },
];

const BookingStatsPage = () => {
  const [filter, setFilter] = useState('month');

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Thống kê Lượt đặt vé & Doanh thu</h1>
        <div className="admin-filters" style={{ marginBottom: 0 }}>
          <select 
            className="admin-select" 
            value={filter} 
            onChange={e => setFilter(e.target.value)}
          >
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="year">Năm nay</option>
          </select>
        </div>
      </div>

      <div className="dashboard-cards" style={{ marginBottom: 32, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {/* Card Doanh thu */}
        <div className="dashboard-card" style={{ background: 'var(--bg1)', padding: 24, borderRadius: 12, border: '1px solid var(--border)' }}>
          <div style={{ color: 'var(--t2)', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Tổng Doanh Thu</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--gold)' }}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(MOCK_STATS.totalRevenue)}
          </div>
        </div>

        {/* Card Vé */}
        <div className="dashboard-card" style={{ background: 'var(--bg1)', padding: 24, borderRadius: 12, border: '1px solid var(--border)' }}>
          <div style={{ color: 'var(--t2)', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Tổng Vé Đã Bán</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--t1)' }}>
            {MOCK_STATS.totalTickets.toLocaleString('vi-VN')} <span style={{ fontSize: 14, color: 'var(--t3)', fontWeight: 400 }}>vé</span>
          </div>
        </div>

        {/* Card Đơn hàng */}
        <div className="dashboard-card" style={{ background: 'var(--bg1)', padding: 24, borderRadius: 12, border: '1px solid var(--border)' }}>
          <div style={{ color: 'var(--t2)', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Tổng Số Đơn Đặt</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--t1)' }}>
            {MOCK_STATS.totalBookings.toLocaleString('vi-VN')} <span style={{ fontSize: 14, color: 'var(--t3)', fontWeight: 400 }}>đơn</span>
          </div>
        </div>
      </div>

      <div className="admin-table-wrap">
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--t1)' }}>Top 5 Phim Có Doanh Thu Cao Nhất</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Top</th>
              <th>Tên Phim</th>
              <th>Số Vé Đã Bán</th>
              <th>Doanh Thu</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_TOP_MOVIES.map((movie, index) => (
              <tr key={movie.id}>
                <td>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: index < 3 ? 'var(--gold)' : 'var(--bg3)',
                    color: index < 3 ? '#000' : 'var(--t2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 12
                  }}>
                    {index + 1}
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{movie.title}</td>
                <td>{movie.tickets.toLocaleString('vi-VN')} vé</td>
                <td style={{ color: 'var(--gold)', fontWeight: 600 }}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(movie.revenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingStatsPage;
