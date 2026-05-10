import React, { useState, useEffect } from 'react';
import * as adminApi from '../services/admin.api';
import '../../../layouts/AdminLayout.css';

const ShowtimeStatsPage = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Filter states
  const [filterMovie, setFilterMovie] = useState('');
  const [filterRoom, setFilterRoom] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);

  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Detail Modal
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [seatMatrix, setSeatMatrix] = useState({});
  const [seatLoading, setSeatLoading] = useState(false);

  useEffect(() => {
    // Fetch dropdown options
    const fetchOptions = async () => {
      try {
        const [moviesRes, roomsRes] = await Promise.all([
          adminApi.getMovies({ page: 0, size: 100 }),
          adminApi.getRooms()
        ]);
        setMovies(moviesRes.data.data?.content || moviesRes.data.data || []);
        setRooms(roomsRes.data.data || []);
      } catch (e) {
        console.error("Failed to load options");
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    fetchStats();
  }, [page, filterMovie, filterRoom, dateRange]);

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, size: 10 };

      if (filterMovie) params.movieId = filterMovie;
      if (filterRoom) params.roomId = filterRoom;

      // Handle DateRange
      const now = new Date();
      if (dateRange === '7days') {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        params.startDate = d.toISOString().split('T')[0];
        params.endDate = now.toISOString().split('T')[0];
      } else if (dateRange === '30days') {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        params.startDate = d.toISOString().split('T')[0];
        params.endDate = now.toISOString().split('T')[0];
      } else if (dateRange === 'thisMonth') {
        params.startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        params.endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
      }

      const res = await adminApi.getShowtimeStats(params);
      setStats(res.data.data?.content || []);
      setTotalPages(res.data.data?.totalPages || 0);
    } catch (e) {
      setError('Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  const calculateFillRate = (sold, total) => {
    if (!total || total === 0) return 0;
    return ((sold / total) * 100).toFixed(1);
  };

  const openDetail = async (st) => {
    setSelectedShowtime(st);
    setSeatLoading(true);
    try {
      const res = await adminApi.getShowtimeSeatStats(st.showtimeId);
      const seats = res.data.data || [];

      // Group by rowLetter
      const grouped = {};
      seats.forEach(s => {
        if (!grouped[s.rowLetter]) grouped[s.rowLetter] = [];
        grouped[s.rowLetter].push(s);
      });
      setSeatMatrix(grouped);
    } catch (e) {
      console.error("Failed to load seat matrix");
    } finally {
      setSeatLoading(false);
    }
  };

  const closeDetail = () => {
    setSelectedShowtime(null);
    setSeatMatrix({});
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Thống kê Suất chiếu</h1>
      </div>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      {/* Bộ lọc */}
      <div className="admin-filters" style={{ marginBottom: 24 }}>
        <select className="admin-select" value={dateRange} onChange={e => { setDateRange(e.target.value); setPage(0); }}>
          <option value="all">Tất cả thời gian</option>
          <option value="7days">7 ngày qua</option>
          <option value="30days">30 ngày qua</option>
          <option value="thisMonth">Tháng này</option>
        </select>

        <select className="admin-select" value={filterMovie} onChange={e => { setFilterMovie(e.target.value); setPage(0); }}>
          <option value="">Tất cả Phim</option>
          {movies.map(m => (
            <option key={m.id} value={m.id}>{m.title}</option>
          ))}
        </select>

        <select className="admin-select" value={filterRoom} onChange={e => { setFilterRoom(e.target.value); setPage(0); }}>
          <option value="">Tất cả Phòng</option>
          {rooms.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      {/* Bảng danh sách suất chiếu */}
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
            {loading ? (
              <tr><td colSpan={8}><div className="admin-loading"><div className="admin-spinner" /></div></td></tr>
            ) : stats.length === 0 ? (
              <tr><td colSpan={8}><div className="admin-empty">Không có dữ liệu trong khoảng thời gian này.</div></td></tr>
            ) : (
              stats.map(st => {
                const fillRate = calculateFillRate(st.soldSeats, st.totalSeats);
                let rateColor = 'var(--red)';
                if (fillRate > 50) rateColor = 'var(--gold)';
                if (fillRate > 80) rateColor = 'var(--green)';

                return (
                  <tr key={st.showtimeId}>
                    <td style={{ color: 'var(--t3)', fontSize: 12 }}>#{st.showtimeId}</td>
                    <td style={{ fontWeight: 600 }}>{st.movieTitle}</td>
                    <td><span className="badge badge-admin">{st.roomName}</span></td>
                    <td style={{ color: 'var(--t2)' }}>
                      {new Date(st.showTime).toLocaleString('vi-VN')}
                    </td>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="admin-pagination">
          <button className="btn-admin-outline" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
            Trang trước
          </button>
          <span style={{ color: 'var(--t2)', fontSize: 13 }}>
            Trang {page + 1} / {totalPages}
          </span>
          <button className="btn-admin-outline" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
            Trang sau
          </button>
        </div>
      )}

      {/* Modal Chi tiết Suất chiếu */}
      {selectedShowtime && (
        <div className="admin-modal-overlay" onClick={closeDetail}>
          <div className="admin-modal" style={{ maxWidth: 800, width: '90%' }} onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={closeDetail}>×</button>
            <h2 className="admin-modal-title">Chi tiết Suất chiếu #{selectedShowtime.showtimeId}</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24, background: 'var(--bg2)', padding: 16, borderRadius: 8 }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 4 }}>Phim</div>
                <div style={{ fontWeight: 600, color: 'var(--t1)' }}>{selectedShowtime.movieTitle}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 4 }}>Doanh thu suất chiếu</div>
                <div style={{ fontWeight: 700, color: 'var(--gold)', fontSize: 18 }}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedShowtime.revenue)}
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg3)', padding: 24, borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', overflowX: 'auto' }}>
              {seatLoading ? (
                <div className="admin-loading"><div className="admin-spinner" /></div>
              ) : (
                <>
                  <div style={{ width: '80%', height: 30, background: 'var(--border)', borderRadius: '20px 20px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 30, color: 'var(--t2)', fontSize: 12, fontWeight: 600 }}>MÀN HÌNH</div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', minWidth: 'max-content' }}>
                    {Object.entries(seatMatrix).map(([row, seats]) => (
                      <div key={row} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <div style={{ width: 24, fontWeight: 600, color: 'var(--t2)' }}>{row}</div>
                        {seats.sort((a, b) => a.seatNumber - b.seatNumber).map(seat => {
                          const isBooked = seat.status === 'BOOKED';
                          const isHolding = seat.status === 'HOLDING';
                          const bgColor = isBooked ? 'var(--red)' : isHolding ? 'var(--gold)' : 'var(--bg2)';
                          const borderColor = isBooked ? 'var(--red)' : isHolding ? 'var(--gold)' : 'var(--border)';
                          let textColor = (isBooked || isHolding) ? '#000' : 'var(--t2)';
                          if (isBooked) textColor = '#fff'; // Red background needs white text

                          return (
                            <div
                              key={seat.seatId}
                              style={{
                                width: 32, height: 32,
                                borderRadius: '4px 4px 8px 8px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 11, fontWeight: 600,
                                userSelect: 'none',
                                background: bgColor,
                                color: textColor,
                                border: `1px solid ${borderColor}`,
                              }}
                              title={`Ghế ${row}${seat.seatNumber} - ${seat.status}`}
                            >
                              {seat.seatNumber}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 16, marginTop: 24, fontSize: 12, color: 'var(--t2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 12, height: 12, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 2 }}></div> Ghế trống
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 12, height: 12, background: 'var(--gold)', borderRadius: 2 }}></div> Ghế đang giữ (Chưa thanh toán)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 12, height: 12, background: 'var(--red)', borderRadius: 2 }}></div> Ghế đã bán
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ShowtimeStatsPage;
