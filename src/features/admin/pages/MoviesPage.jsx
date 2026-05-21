import React, { useState, useEffect, useCallback } from 'react';
import * as adminApi from '../services/admin.api';
import '../../../layouts/AdminLayout.css';

const STATUS_OPTIONS = ['SHOWING', 'COMING', 'HIDDEN'];
const STATUS_LABELS = { SHOWING: 'Đang chiếu', COMING: 'Sắp chiếu', HIDDEN: 'Đã kết thúc' };

const EMPTY_FORM = {
  title: '', description: '', duration: '', ageRating: '',
  posterUrl: '', trailerUrl: '', isFeatured: false, status: 'COMING', genreIds: [],
  country: '', director: '', actors: '', releaseDate: '',
};

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [titleFilter, setTitleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editMovie, setEditMovie] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (titleFilter) params.title = titleFilter;
      if (statusFilter) params.status = statusFilter;
      const res = await adminApi.getMovies(params);
      setMovies(res.data.data || []);
    } catch (e) {
      setError('Không thể tải danh sách phim');
    } finally {
      setLoading(false);
    }
  }, [titleFilter, statusFilter]);

  useEffect(() => { fetchMovies(); }, [fetchMovies]);

  useEffect(() => {
    adminApi.getGenres().then(r => setGenres(r.data.data || [])).catch(() => {});
  }, []);

  const showSuccess = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };
  const showError = (msg) => { setError(msg); setTimeout(() => setError(''), 3000); };

  const openCreate = () => {
    setEditMovie(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (m) => {
    setEditMovie(m);
    setForm({
      title: m.title || '',
      description: m.description || '',
      duration: m.duration || '',
      ageRating: m.ageRating || '',
      posterUrl: m.posterUrl || '',
      trailerUrl: m.trailerUrl || '',
      isFeatured: m.isFeatured || false,
      status: m.status || 'COMING',
      genreIds: (m.genres || []).map(g => g.id),
      country: m.country || '',
      director: m.director || '',
      actors: m.actors || '',
      releaseDate: m.releaseDate || '',
    });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditMovie(null); setForm(EMPTY_FORM); };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleGenre = (id) => {
    setForm(prev => ({
      ...prev,
      genreIds: prev.genreIds.includes(id)
        ? prev.genreIds.filter(g => g !== id)
        : [...prev.genreIds, id],
    }));
  };

  const buildPayload = () => ({
    title: form.title,
    description: form.description,
    duration: form.duration ? parseInt(form.duration) : null,
    ageRating: form.ageRating ? parseInt(form.ageRating) : null,
    posterUrl: form.posterUrl,
    trailerUrl: form.trailerUrl,
    isFeatured: form.isFeatured,
    status: form.status,
    genres: form.genreIds.map(id => ({ id })),
    country: form.country || null,
    director: form.director || null,
    actors: form.actors || null,
    releaseDate: form.releaseDate || null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    try {
      if (editMovie) {
        await adminApi.updateMovie(editMovie.id, buildPayload());
        showSuccess('Đã cập nhật phim thành công');
      } else {
        await adminApi.createMovie(buildPayload());
        showSuccess('Đã thêm phim thành công');
      }
      closeModal();
      fetchMovies();
    } catch (e) {
      setError(e.response?.data?.message || 'Lỗi khi lưu phim');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await adminApi.deleteMovie(deleteConfirm.id);
      showSuccess('Đã xóa phim');
      setDeleteConfirm(null);
      fetchMovies();
    } catch (e) {
      showError(e.response?.data?.message || 'Không thể xóa phim. Phim có thể đang có suất chiếu trong tương lai.');
      setDeleteConfirm(null);
    }
  };

  const badgeClass = (s) => ({ SHOWING: 'badge-showing', COMING: 'badge-coming', HIDDEN: 'badge-ended' }[s] || 'badge-ended');

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Quản lý Phim <span>{movies.length} phim</span></h1>
        <button className="btn-admin-primary" onClick={openCreate}>
          <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Thêm phim
        </button>
      </div>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}
      {success && <div className="admin-alert admin-alert-success">{success}</div>}

      <div className="admin-filters">
        <input
          className="admin-input"
          placeholder="Tìm theo tên phim..."
          value={titleFilter}
          onChange={e => setTitleFilter(e.target.value)}
          style={{ flex: 1, minWidth: 220 }}
        />
        <select className="admin-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Poster</th>
              <th>Tên phim</th>
              <th>Thời lượng</th>
              <th>Độ tuổi</th>
              <th>Thể loại</th>
              <th>Trạng thái</th>
              <th>Nổi bật</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8}><div className="admin-loading"><div className="admin-spinner" /></div></td></tr>
            ) : movies.length === 0 ? (
              <tr><td colSpan={8}><div className="admin-empty">Không tìm thấy phim nào</div></td></tr>
            ) : movies.map(m => (
              <tr key={m.id}>
                <td>
                  {m.posterUrl
                    ? <img src={m.posterUrl} alt={m.title} className="admin-poster-preview" />
                    : <div className="admin-poster-preview" style={{ background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t3)', fontSize: 10 }}>N/A</div>
                  }
                </td>
                <td style={{ fontWeight: 600, maxWidth: 220 }}>{m.title}</td>
                <td style={{ color: 'var(--t2)' }}>{m.duration ? `${m.duration} phút` : '—'}</td>
                <td style={{ color: 'var(--t2)' }}>{m.ageRating ? `${m.ageRating}+` : '—'}</td>
                <td style={{ maxWidth: 160 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {(m.genres || []).map(g => (
                      <span key={g.id} className="badge badge-customer" style={{ fontSize: 10 }}>{g.name}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <span className={`badge ${badgeClass(m.status)}`}>{STATUS_LABELS[m.status] || m.status}</span>
                </td>
                <td>
                  {m.isFeatured
                    ? <span style={{ color: 'var(--gold)' }}>★ Có</span>
                    : <span style={{ color: 'var(--t3)' }}>—</span>
                  }
                </td>
                <td>
                  <div className="admin-actions-group">
                    <button className="btn-admin-secondary" onClick={() => openEdit(m)}>Sửa</button>
                    <button className="btn-admin-danger" onClick={() => setDeleteConfirm(m)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" style={{ maxWidth: 620 }} onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={closeModal}>×</button>
            <h2 className="admin-modal-title">{editMovie ? 'Sửa thông tin phim' : 'Thêm phim mới'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label className="admin-form-label">Tên phim *</label>
                <input className="admin-form-input" name="title" value={form.title} onChange={handleFormChange} required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Mô tả</label>
                <textarea className="admin-form-textarea" name="description" value={form.description} onChange={handleFormChange} rows={3} />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Thời lượng (phút)</label>
                  <input className="admin-form-input" name="duration" type="number" min="1" value={form.duration} onChange={handleFormChange} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Giới hạn độ tuổi</label>
                  <input className="admin-form-input" name="ageRating" type="number" min="0" value={form.ageRating} onChange={handleFormChange} placeholder="VD: 13, 16, 18" />
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">URL Poster</label>
                <input className="admin-form-input" name="posterUrl" value={form.posterUrl} onChange={handleFormChange} placeholder="https://..." />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">URL Trailer</label>
                <input className="admin-form-input" name="trailerUrl" value={form.trailerUrl} onChange={handleFormChange} placeholder="https://youtube.com/..." />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Đạo diễn</label>
                  <input className="admin-form-input" name="director" value={form.director} onChange={handleFormChange} placeholder="Tên đạo diễn" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Quốc gia</label>
                  <input className="admin-form-input" name="country" value={form.country} onChange={handleFormChange} placeholder="VD: Mỹ, Hàn Quốc, Việt Nam" />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Diễn viên</label>
                  <input className="admin-form-input" name="actors" value={form.actors} onChange={handleFormChange} placeholder="Dàn diễn viên, cách nhau bởi dấu phẩy" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Ngày phát hành</label>
                  <input className="admin-form-input" name="releaseDate" type="date" value={form.releaseDate} onChange={handleFormChange} />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Trạng thái</label>
                  <select className="admin-form-select" name="status" value={form.status} onChange={handleFormChange}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                </div>
                <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 22 }}>
                  <input type="checkbox" id="isFeatured" name="isFeatured" checked={form.isFeatured} onChange={handleFormChange} style={{ width: 16, height: 16, accentColor: 'var(--gold)', cursor: 'pointer' }} />
                  <label htmlFor="isFeatured" style={{ fontSize: 13, color: 'var(--t1)', cursor: 'pointer' }}>Phim nổi bật (hiển thị Carousel)</label>
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Thể loại</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {genres.map(g => (
                    <label key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '5px 10px', background: form.genreIds.includes(g.id) ? 'var(--gold-dim)' : 'var(--bg3)', borderRadius: 20, border: `1px solid ${form.genreIds.includes(g.id) ? 'rgba(232,160,32,0.4)' : 'var(--border)'}`, fontSize: 12, color: form.genreIds.includes(g.id) ? 'var(--gold)' : 'var(--t2)', transition: 'all 0.12s' }}>
                      <input type="checkbox" checked={form.genreIds.includes(g.id)} onChange={() => toggleGenre(g.id)} style={{ display: 'none' }} />
                      {g.name}
                    </label>
                  ))}
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn-admin-secondary" onClick={closeModal}>Hủy</button>
                <button type="submit" className="btn-admin-primary" disabled={formLoading}>
                  {formLoading ? 'Đang lưu...' : editMovie ? 'Cập nhật' : 'Lưu'}
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
            <h2 className="admin-modal-title">Xóa phim</h2>
            <p className="admin-confirm-text">
              Bạn có chắc muốn xóa phim <strong>"{deleteConfirm.title}"</strong>?
              Phim chỉ có thể xóa nếu không có suất chiếu nào trong tương lai.
            </p>
            <div className="admin-modal-footer">
              <button className="btn-admin-secondary" onClick={() => setDeleteConfirm(null)}>Hủy</button>
              <button className="btn-admin-danger" onClick={handleDelete}>Xóa phim</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviesPage;
