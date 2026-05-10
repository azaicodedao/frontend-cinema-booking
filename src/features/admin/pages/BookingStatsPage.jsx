import React, { useState, useEffect } from 'react';
import * as adminApi from '../services/admin.api';
import '../../../layouts/AdminLayout.css';

const BookingStatsPage = () => {
  const [stats, setStats] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [filterType, setFilterType] = useState('all'); // all, date, dateRange, month
  const [singleDate, setSingleDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [month, setMonth] = useState('');
  
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState('');

  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await adminApi.getMovies({ size: 1000 });
      if (res.data?.statusCode === 200 || res.data?.success) {
        setMovies(res.data.data.content || res.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách phim", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [page, filterType, singleDate, startDate, endDate, month, selectedMovieId]);

  const fetchStats = async () => {
    setDateError('');
    setLoading(true);
    try {
      let params = { page, size: 5 };
      if (filterType === 'date' && singleDate) {
        params.startDate = singleDate;
        params.endDate = singleDate;
      } else if (filterType === 'dateRange' && startDate && endDate) {
        if (new Date(startDate) > new Date(endDate)) {
          setDateError('Khoảng thời gian không hợp lệ.');
          setTimeout(() => setDateError(''), 3000);
          setStats([]);
          setTotalPages(0);
          setLoading(false);
          return;
        }
        params.startDate = startDate;
        params.endDate = endDate;
      } else if (filterType === 'month' && month) {
        const firstDay = `${month}-01`;
        const dateObj = new Date(firstDay);
        const lastDayObj = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);
        const lastDay = `${lastDayObj.getFullYear()}-${String(lastDayObj.getMonth() + 1).padStart(2, '0')}-${String(lastDayObj.getDate()).padStart(2, '0')}`;
        params.startDate = firstDay;
        params.endDate = lastDay;
      }
      
      if (selectedMovieId) {
        params.movieId = selectedMovieId;
      }

      const res = await adminApi.getMovieBookingStats(params);
      if (res.data.success) {
        setStats(res.data.data.content);
        setTotalPages(res.data.data.totalPages);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu thống kê", error);
    } finally {
      setLoading(false);
    }
  };

  // Tính tổng lượt đặt của trang hiện tại để hiển thị 
  const currentPageTotalBookings = stats.reduce((sum, item) => sum + item.totalBookings, 0);
  const currentPageTotalRevenue = stats.reduce((sum, item) => sum + item.totalRevenue, 0);

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Thống kê Lượt đặt vé & Doanh thu</h1>
      </div>

      <div className="admin-filters" style={{ marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <select 
          className="admin-select" 
          value={selectedMovieId} 
          onChange={e => {
            setSelectedMovieId(e.target.value);
            setPage(0); // Reset page
          }}
        >
          <option value="">-- Tất cả các phim --</option>
          {Array.isArray(movies) && movies.map(m => (
            <option key={m.id} value={m.id}>{m.title}</option>
          ))}
        </select>

        <select
          className="admin-select"
          value={filterType}
          onChange={e => {
            setFilterType(e.target.value);
            setPage(0); // Reset page when filter changes
          }}
        >
          <option value="all">Tất cả thời gian</option>
          <option value="date">Theo một ngày cụ thể</option>
          <option value="dateRange">Từ ngày - Đến ngày</option>
          <option value="month">Theo tháng</option>
        </select>

        {filterType === 'date' && (
          <input type="date" className="admin-input" value={singleDate} onChange={e => setSingleDate(e.target.value)} />
        )}

        {filterType === 'dateRange' && (
          <>
            <input type="date" className="admin-input" value={startDate} onChange={e => setStartDate(e.target.value)} placeholder="Từ ngày" />
            <span style={{ color: 'var(--t2)', alignSelf: 'center' }}>-</span>
            <input type="date" className="admin-input" value={endDate} onChange={e => setEndDate(e.target.value)} placeholder="Đến ngày" />
          </>
        )}

        {filterType === 'month' && (
          <input type="month" className="admin-input" value={month} onChange={e => setMonth(e.target.value)} />
        )}
      </div>

      {dateError && (
        <div style={{ color: '#ff4d4f', background: 'rgba(255,77,79,0.1)', padding: '12px 16px', borderRadius: 8, marginBottom: 24, fontWeight: 500 }}>
          {dateError}
        </div>
      )}

      <div className="dashboard-cards" style={{ marginBottom: 32, display: 'flex', gap: 16 }}>
        <div className="dashboard-card" style={{ background: 'var(--bg1)', padding: 24, borderRadius: 12, border: '1px solid var(--border)', flex: 1, maxWidth: 300 }}>
          <div style={{ color: 'var(--t2)', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>TỔNG LƯỢT ĐẶT VÉ TRONG TRANG HIỆN TẠI</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--t1)' }}>
            {currentPageTotalBookings.toLocaleString('vi-VN')} <span style={{ fontSize: 14, color: 'var(--t3)', fontWeight: 400 }}>lượt</span>
          </div>
        </div>
        
        <div className="dashboard-card" style={{ background: 'var(--bg1)', padding: 24, borderRadius: 12, border: '1px solid var(--border)', flex: 1, maxWidth: 300 }}>
          <div style={{ color: 'var(--t2)', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>TỔNG DOANH THU TRANG HIỆN TẠI</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--gold)' }}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentPageTotalRevenue)}
          </div>
        </div>
      </div>

      <div className="admin-table-wrap">
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--t1)' }}>Bảng xếp hạng</h2>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--t2)' }}>Đang tải dữ liệu...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Top</th>
                <th>Tên Phim</th>
                <th>Tổng Số Lượt Đặt (Đơn)</th>
                <th>Doanh Thu (VNĐ)</th>
              </tr>
            </thead>
            <tbody>
              {stats.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: 24, color: 'var(--t3)' }}>
                    Không có dữ liệu trong khoảng thời gian này.
                  </td>
                </tr>
              ) : (
                stats.map((movie, index) => {
                  const rank = page * 5 + index + 1;
                  return (
                    <tr key={movie.movieId || index}>
                      <td>
                        <div style={{
                          width: 24, height: 24, borderRadius: '50%',
                          background: rank <= 3 ? 'var(--gold)' : 'var(--bg3)',
                          color: rank <= 3 ? '#000' : 'var(--t2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: 12
                        }}>
                          {rank}
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--t1)' }}>{movie.title}</td>
                      <td style={{ fontWeight: 600 }}>{movie.totalBookings.toLocaleString('vi-VN')} lượt</td>
                      <td style={{ fontWeight: 700, color: 'var(--gold)' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(movie.totalRevenue)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}

        {/* Phân trang */}
        {!loading && totalPages > 1 && (
          <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)' }}>
            <button
              className="btn-admin-secondary"
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
            >
              Trang trước
            </button>
            <span style={{ color: 'var(--t2)', fontSize: 14 }}>Trang {page + 1} / {totalPages}</span>
            <button
              className="btn-admin-secondary"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
            >
              Trang sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingStatsPage;
