import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as adminApi from '../services/admin.api';
import '../../../layouts/AdminLayout.css';

// Helper to get current ISO week (YYYY-Www)
const getCurrentISOWeek = () => {
  const today = new Date();
  const target = new Date(today.valueOf());
  const dayNr = (today.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  const weekNum = 1 + Math.ceil((firstThursday - target) / 604800000);
  const y = target.getFullYear();
  const w = String(weekNum).padStart(2, '0');
  return `${y}-W${w}`;
};

// Helper to get current month (YYYY-MM)
const getCurrentMonth = () => {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
};

// Helper to parse ISO week into Date Range (startDate, endDate)
const getWeekRange = (weekStr) => {
  if (!weekStr) return { startDate: '', endDate: '' };
  const parts = weekStr.split('-W');
  if (parts.length !== 2) return { startDate: '', endDate: '' };
  
  const year = parseInt(parts[0], 10);
  const week = parseInt(parts[1], 10);
  
  const jan4 = new Date(year, 0, 4);
  const dayOfJan4 = jan4.getDay();
  const dayDiff = dayOfJan4 === 0 ? 6 : dayOfJan4 - 1;
  const mondayOfWeek1 = new Date(jan4.getTime() - dayDiff * 24 * 60 * 60 * 1000);
  
  const targetMonday = new Date(mondayOfWeek1.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000);
  const targetSunday = new Date(targetMonday.getTime() + 6 * 24 * 60 * 60 * 1000);
  
  const format = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  
  return {
    startDate: format(targetMonday),
    endDate: format(targetSunday)
  };
};

// Helper to get month range
const getMonthRange = (monthStr) => {
  if (!monthStr) return { startDate: '', endDate: '' };
  const firstDay = `${monthStr}-01`;
  const dateObj = new Date(firstDay);
  const lastDayObj = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);
  const lastDay = `${lastDayObj.getFullYear()}-${String(lastDayObj.getMonth() + 1).padStart(2, '0')}-${String(lastDayObj.getDate()).padStart(2, '0')}`;
  return { startDate: firstDay, endDate: lastDay };
};

// Chart period options
const CHART_PERIODS = [
  { value: '7_days', label: '7 ngày qua' },
  { value: '30_days', label: '30 ngày qua' },
  { value: '12_weeks', label: '12 tuần qua' },
  { value: '12_months', label: '12 tháng qua' },
];

// Custom tooltip for chart
const ChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg1)', border: '1px solid var(--border)',
        borderRadius: 8, padding: '10px 14px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--t2)', marginBottom: 4 }}>{label}</p>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--gold)' }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const BookingStatsPage = () => {
  const [stats, setStats] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [filterType, setFilterType] = useState('all'); // all, week, month
  const [week, setWeek] = useState(getCurrentISOWeek());
  const [month, setMonth] = useState('');
  
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState('');

  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState('');
  const [sortBy, setSortBy] = useState('revenue'); // 'revenue' | 'views'

  // Chart states
  const [chartPeriod, setChartPeriod] = useState('7_days');
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);

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
  }, [filterType, week, month, selectedMovieId]);

  const fetchStats = async () => {
    setDateError('');
    setLoading(true);
    try {
      let params = {};
      if (filterType === 'week' && week) {
        const range = getWeekRange(week);
        params.startDate = range.startDate;
        params.endDate = range.endDate;
      } else if (filterType === 'month' && month) {
        const range = getMonthRange(month);
        params.startDate = range.startDate;
        params.endDate = range.endDate;
      }
      
      if (selectedMovieId) {
        params.movieId = selectedMovieId;
      }

      const res = await adminApi.getMovieBookingStats(params);
      if (res.data.success) {
        setStats(res.data.data.stats || []);
        setTotalBookings(res.data.data.totalBookings || 0);
        setTotalRevenue(res.data.data.totalRevenue || 0);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu thống kê", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch chart data
  const fetchChartData = useCallback(async () => {
    setChartLoading(true);
    try {
      const res = await adminApi.getRevenueChart({ period: chartPeriod });
      if (res.data.success) {
        const formatted = (res.data.data || []).map(item => ({
          label: item.label,
          revenue: Number(item.revenue) || 0
        }));
        setChartData(formatted);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu biểu đồ", error);
      setChartData([]);
    } finally {
      setChartLoading(false);
    }
  }, [chartPeriod]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  const sortedStats = useMemo(() => {
    const sorted = [...stats];
    if (sortBy === 'views') {
      sorted.sort((a, b) => (b.totalBookings || 0) - (a.totalBookings || 0));
    } else {
      sorted.sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0));
    }
    return sorted;
  }, [stats, sortBy]);

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Thống kê Lượt xem & Doanh thu</h1>
      </div>

      <div className="admin-filters" style={{ marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <select 
          className="admin-select" 
          value={selectedMovieId} 
          onChange={e => {
            setSelectedMovieId(e.target.value);
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
          }}
        >
          <option value="all">Tất cả thời gian</option>
          <option value="week">Theo tuần</option>
          <option value="month">Theo tháng</option>
        </select>

        {filterType === 'week' && (
          <input type="week" className="admin-input" value={week} onChange={e => setWeek(e.target.value)} />
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
          <div style={{ color: 'var(--t2)', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>TỔNG LƯỢT ĐẶT VÉ</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--t1)' }}>
            {totalBookings.toLocaleString('vi-VN')} <span style={{ fontSize: 14, color: 'var(--t3)', fontWeight: 400 }}>lượt</span>
          </div>
        </div>
        
        <div className="dashboard-card" style={{ background: 'var(--bg1)', padding: 24, borderRadius: 12, border: '1px solid var(--border)', flex: 1, maxWidth: 300 }}>
          <div style={{ color: 'var(--t2)', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>TỔNG DOANH THU</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--gold)' }}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue)}
          </div>
        </div>
      </div>

      {/* Biểu đồ Doanh thu */}
      <div className="admin-table-wrap" style={{ marginBottom: 32 }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--t1)', margin: 0 }}>Biểu đồ Doanh thu</h2>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select className="admin-select" value={chartPeriod} onChange={e => setChartPeriod(e.target.value)} style={{ minWidth: 160 }}>
              {CHART_PERIODS.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ padding: '24px 16px 16px 0' }}>
          {chartLoading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--t2)' }}>Đang tải biểu đồ...</div>
          ) : chartData.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>Không có dữ liệu doanh thu trong khoảng thời gian này.</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4a843" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#d4a843" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fill: 'var(--t2)', fontSize: 12 }} axisLine={{ stroke: 'var(--border)' }} />
                <YAxis tick={{ fill: 'var(--t2)', fontSize: 11 }} axisLine={{ stroke: 'var(--border)' }} tickFormatter={v => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#d4a843" strokeWidth={2.5} fill="url(#revenueGradient)" activeDot={{ r: 6, fill: '#d4a843', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bảng xếp hạng */}
      <div className="admin-table-wrap">
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--t1)' }}>Bảng xếp hạng</h2>
          <select className="admin-select" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ minWidth: 180 }}>
            <option value="revenue">Xếp theo Doanh thu</option>
            <option value="views">Xếp theo Lượt xem</option>
          </select>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--t2)' }}>Đang tải dữ liệu...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Top</th>
                <th>Tên Phim</th>
                <th>Thể loại</th>
                <th>Tổng Số Lượt Xem</th>
                <th>Doanh Thu (VNĐ)</th>
              </tr>
            </thead>
            <tbody>
              {sortedStats.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: 24, color: 'var(--t3)' }}>
                    Không có dữ liệu trong khoảng thời gian này.
                  </td>
                </tr>
              ) : (
                sortedStats.map((movie, index) => {
                  const rank = index + 1;
                  const movieInfo = movies.find(m => m.id === movie.movieId);
                  const genresLabel = movieInfo && movieInfo.genres && movieInfo.genres.length > 0
                    ? movieInfo.genres.map(g => g.name).join(', ')
                    : '—';
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
                      <td style={{ color: 'var(--t2)', fontSize: 13 }}>{genresLabel}</td>
                      <td style={{ fontWeight: 600 }}>{movie.totalBookings.toLocaleString('vi-VN')} lượt xem</td>
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
      </div>
    </div>
  );
};

export default BookingStatsPage;
