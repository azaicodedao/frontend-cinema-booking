import React, { useState, useEffect, useCallback } from 'react';
import * as adminApi from '../services/admin.api';
import '../../../layouts/AdminLayout.css';

const STATUS_LABELS = { SCHEDULED: 'Lên lịch', ONGOING: 'Đang chiếu', FINISHED: 'Đã chiếu', CANCELLED: 'Hủy', OPEN: 'Mở bán', CLOSED: 'Đã đóng/Xoá' };
const STATUS_BADGE = { SCHEDULED: 'badge-coming', ONGOING: 'badge-showing', FINISHED: 'badge-ended', CANCELLED: 'badge-locked', OPEN: 'badge-coming', CLOSED: 'badge-locked' };

const EMPTY_FORM = { movieId: '', roomId: '', startTime: '', basePrice: '' };

const ShowtimesPage = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [page, setPage] = useState(0);
  const SIZE = 10;
  const [movies, setMovies] = useState([]);
  const [showingMovies, setShowingMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [movieFilter, setMovieFilter] = useState('');
  const [roomFilter, setRoomFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('OPEN');
  const [dateFilter, setDateFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editShowtime, setEditShowtime] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchShowtimes = useCallback(async () => {
    setLoading(true);
    try {
      let res;
      if (movieFilter) {
        res = await adminApi.getShowtimesByMovie(movieFilter);
      } else {
        res = await adminApi.getShowtimes();
      }
      let data = res.data.data || [];

      // Lọc theo phim
      if (movieFilter) {
        data = data.filter(s => String(s.movieId) === String(movieFilter));
      }
      // Lọc theo phòng chiếu
      if (roomFilter) {
        data = data.filter(s => String(s.roomId) === String(roomFilter));
      }
      // Lọc theo trạng thái
      if (statusFilter) {
        data = data.filter(s => String(s.status) === String(statusFilter));
      }
      // Lọc theo ngày chiếu
      if (dateFilter) {
        data = data.filter(s => {
          const showDate = s.showDate || (s.startTime ? s.startTime.substring(0, 10) : '');
          return showDate === dateFilter;
        });
      }

      // Sắp xếp theo thời gian bắt đầu giảm dần (mới nhất lên đầu)
      data.sort((a, b) => {
        const dateA = new Date(a.startTime || 0);
        const dateB = new Date(b.startTime || 0);
        return dateB - dateA;
      });

      setShowtimes(data);
      setPage(0);
    } catch (e) {
      showError('Không thể tải danh sách suất chiếu');
    } finally {
      setLoading(false);
    }
  }, [movieFilter, roomFilter, statusFilter, dateFilter]);

  useEffect(() => { fetchShowtimes(); }, [fetchShowtimes]);

  useEffect(() => {
    adminApi.getMovies({}).then(r => setMovies(r.data.data || [])).catch(() => { });
    adminApi.getMovies({ status: 'SHOWING', size: 1000 }).then(r => setShowingMovies(r.data.data || [])).catch(() => { });
    adminApi.getRooms().then(r => setRooms(r.data.data || [])).catch(() => { });
  }, []);

  const showSuccess = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };
  const showError = (msg) => { setError(msg); setTimeout(() => setError(''), 3000); };

  const openCreate = () => { setEditShowtime(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (s) => {
    setEditShowtime(s);
    const dt = s.startTime ? new Date(s.startTime) : null;
    const local = dt ? new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '';
    setForm({ movieId: s.movieId || '', roomId: s.roomId || '', startTime: local, basePrice: s.basePrice || '' });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditShowtime(null); setForm(EMPTY_FORM); };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    try {
      const payload = {
        movieId: parseInt(form.movieId),
        roomId: parseInt(form.roomId),
        startTime: form.startTime,
        basePrice: parseFloat(form.basePrice),
      };
      if (editShowtime) {
        await adminApi.updateShowtime(editShowtime.id, payload);
        showSuccess('Đã cập nhật suất chiếu');
      } else {
        await adminApi.createShowtime(payload);
        showSuccess('Đã thêm suất chiếu mới');
      }
      closeModal();
      fetchShowtimes();
    } catch (e) {
      setError(e.response?.data?.message || 'Lỗi khi lưu suất chiếu. Kiểm tra xem phòng đã có suất chiếu trùng giờ chưa.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await adminApi.deleteShowtime(deleteConfirm.id);
      showSuccess('Đã xóa suất chiếu');
      setDeleteConfirm(null);
      fetchShowtimes();
    } catch (e) {
      setError(e.response?.data?.message || 'Không thể xóa. Suất chiếu đã có vé được đặt thành công.');
      setDeleteConfirm(null);
    }
  };

  const formatDT = (dt) => {
    if (!dt) return '—';
    const d = new Date(dt);
    return d.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const paginatedShowtimes = showtimes.slice(page * SIZE, (page + 1) * SIZE);
  const totalPages = Math.ceil(showtimes.length / SIZE);

  // Tính danh sách phim cho dropdown modal (chỉ phim đang chiếu, nhưng khi sửa thì bao gồm cả phim hiện tại)
  const dropdownMovies = editShowtime
    ? (showingMovies.some(m => m.id === editShowtime.movieId)
        ? showingMovies
        : [...showingMovies, { id: editShowtime.movieId, title: editShowtime.movieTitle }])
    : showingMovies;

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Quản lý Suất chiếu <span>{showtimes.length} suất</span></h1>
        <button className="btn-admin-primary" onClick={openCreate}>
          <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Thêm suất chiếu
        </button>
      </div>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}
      {success && <div className="admin-alert admin-alert-success">{success}</div>}

      <div className="admin-filters" style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <select className="admin-select" value={movieFilter} onChange={e => setMovieFilter(e.target.value)} style={{ flex: 1, minWidth: 200 }}>
          <option value="">Tất cả phim</option>
          {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
        </select>

        <select className="admin-select" value={roomFilter} onChange={e => setRoomFilter(e.target.value)} style={{ flex: 1, minWidth: 200 }}>
          <option value="">Tất cả phòng</option>
          {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>

        <select className="admin-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ flex: 1, minWidth: 200 }}>
          <option value="">Tất cả trạng thái</option>
          <option value="OPEN">Mở bán</option>
          <option value="CLOSED">Đã đóng/Xoá</option>
        </select>

        <input
          type="date"
          className="admin-input"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          style={{ flex: 1, minWidth: 160 }}
        />

        <button
          className="btn-admin-secondary"
          onClick={() => { setMovieFilter(''); setRoomFilter(''); setStatusFilter('OPEN'); setDateFilter(''); }}
          style={{ whiteSpace: 'nowrap' }}
        >
          Xóa bộ lọc
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Phim</th>
              <th>Phòng chiếu</th>
              <th>Ngày chiếu</th>
              <th>Giờ bắt đầu</th>
              <th>Giờ kết thúc</th>
              <th>Giá vé gốc</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9}><div className="admin-loading"><div className="admin-spinner" /></div></td></tr>
            ) : paginatedShowtimes.length === 0 ? (
              <tr><td colSpan={9}><div className="admin-empty">Không có suất chiếu nào</div></td></tr>
            ) : paginatedShowtimes.map(s => (
              <tr key={s.id}>
                <td style={{ color: 'var(--t3)', fontSize: 12 }}>#{s.id}</td>
                <td style={{ fontWeight: 600, maxWidth: 180 }}>{s.movieTitle}</td>
                <td style={{ color: 'var(--t2)' }}>{s.roomName}</td>
                <td style={{ color: 'var(--t2)', whiteSpace: 'nowrap' }}>
                  {s.showDate ? new Date(s.showDate).toLocaleDateString('vi-VN') : '—'}
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{formatDT(s.startTime)}</td>
                <td style={{ color: 'var(--t2)', whiteSpace: 'nowrap' }}>{formatDT(s.endTime)}</td>
                <td style={{ color: 'var(--gold)', fontWeight: 600 }}>
                  {s.basePrice ? `${Number(s.basePrice).toLocaleString('vi-VN')}đ` : '—'}
                </td>
                <td>
                  <span className={`badge ${STATUS_BADGE[s.status] || 'badge-ended'}`}>
                    {STATUS_LABELS[s.status] || s.status || '—'}
                  </span>
                </td>
                <td>
                  <div className="admin-actions-group">
                    <button className="btn-admin-secondary" onClick={() => openEdit(s)}>Sửa</button>
                    <button className="btn-admin-danger" onClick={() => setDeleteConfirm(s)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="admin-pagination">
          <button className="admin-page-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>‹</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} className={`admin-page-btn ${i === page ? 'active' : ''}`} onClick={() => setPage(i)}>{i + 1}</button>
          ))}
          <button className="admin-page-btn" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>›</button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={closeModal}>×</button>
            <h2 className="admin-modal-title">{editShowtime ? 'Sửa suất chiếu' : 'Thêm suất chiếu mới'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label className="admin-form-label">Phim *</label>
                <select className="admin-form-select" name="movieId" value={form.movieId} onChange={handleFormChange} required>
                  <option value="">-- Chọn phim --</option>
                  {dropdownMovies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Phòng chiếu *</label>
                <select className="admin-form-select" name="roomId" value={form.roomId} onChange={handleFormChange} required>
                  <option value="">-- Chọn phòng --</option>
                  {rooms.map(r => <option key={r.id} value={r.id}>{r.name} ({r.totalSeats} ghế)</option>)}
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Thời gian bắt đầu *</label>
                <input className="admin-form-input" name="startTime" type="datetime-local" value={form.startTime} onChange={handleFormChange} required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Giá vé gốc (VNĐ) *</label>
                <input className="admin-form-input" name="basePrice" type="number" min="0" step="1000" value={form.basePrice} onChange={handleFormChange} required placeholder="VD: 75000" />
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn-admin-secondary" onClick={closeModal}>Hủy</button>
                <button type="submit" className="btn-admin-primary" disabled={formLoading}>
                  {formLoading ? 'Đang lưu...' : editShowtime ? 'Cập nhật' : 'Thêm suất chiếu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal admin-confirm-modal" onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setDeleteConfirm(null)}>×</button>
            <h2 className="admin-modal-title">Xóa suất chiếu</h2>
            <p className="admin-confirm-text">
              Bạn có chắc muốn xóa suất chiếu phim <strong>{deleteConfirm.movieTitle}</strong>{' '}
              lúc <strong>{formatDT(deleteConfirm.startTime)}</strong>?
              Suất chiếu chỉ có thể xóa khi chưa có vé nào được đặt thành công.
            </p>
            <div className="admin-modal-footer">
              <button className="btn-admin-secondary" onClick={() => setDeleteConfirm(null)}>Hủy</button>
              <button className="btn-admin-danger" onClick={handleDelete}>Xóa suất chiếu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowtimesPage;
