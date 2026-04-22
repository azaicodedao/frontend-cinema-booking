import React, { useState, useEffect } from 'react';
import * as adminApi from '../services/admin.api';
import '../../../layouts/AdminLayout.css';

const GenresPage = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editGenre, setEditGenre] = useState(null); // null = create, object = edit
  const [formName, setFormName] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchGenres = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getGenres();
      setGenres(res.data.data || []);
    } catch (e) {
      setError('Không thể tải danh sách thể loại');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGenres(); }, []);

  const showSuccess = (msg) => { 
    setSuccess(msg); 
    setTimeout(() => setSuccess(''), 3000); 
  };
  const showError = (msg) => { 
    setError(msg); 
    setTimeout(() => setError(''), 3000); 
  };

  const openCreate = () => { setEditGenre(null); setFormName(''); setShowModal(true); };
  const openEdit = (g) => { setEditGenre(g); setFormName(g.name); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditGenre(null); setFormName(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim()) return;
    setFormLoading(true);
    setError('');
    try {
      if (editGenre) {
        await adminApi.updateGenre(editGenre.id, { name: formName.trim() });
        showSuccess('Đã cập nhật thể loại thành công');
      } else {
        await adminApi.createGenre({ name: formName.trim() });
        showSuccess('Đã thêm thể loại thành công');
      }
      closeModal();
      fetchGenres();
    } catch (e) {
      showError(e.response?.data?.message || 'Lỗi khi lưu thể loại');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await adminApi.deleteGenre(deleteConfirm.id);
      showSuccess('Đã xóa thể loại thành công');
      setDeleteConfirm(null);
      fetchGenres();
    } catch (e) {
      const emsg = e.response?.data?.message || 'Không thể xoá thể loại đang được sử dụng. Vui lòng gỡ khỏi các phim liên quan trước.';
      showError(emsg);
      setDeleteConfirm(null);
    }
  };
  

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Quản lý Thể loại <span>{genres.length} thể loại</span></h1>
        <button className="btn-admin-primary" onClick={openCreate}>
          <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Thêm thể loại
        </button>
      </div>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}
      {success && <div className="admin-alert admin-alert-success">{success}</div>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên thể loại</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3}><div className="admin-loading"><div className="admin-spinner" /></div></td></tr>
            ) : genres.length === 0 ? (
              <tr><td colSpan={3}><div className="admin-empty">Chưa có thể loại nào</div></td></tr>
            ) : genres.map(g => (
              <tr key={g.id}>
                <td style={{ color: 'var(--t3)', fontSize: 12 }}>#{g.id}</td>
                <td style={{ fontWeight: 600 }}>{g.name}</td>
                <td>
                  <div className="admin-actions-group">
                    <button className="btn-admin-secondary" onClick={() => openEdit(g)}>
                      <svg viewBox="0 0 14 14" fill="none" style={{ width: 12, height: 12 }}>
                        <path d="M9.5 1.5l3 3L4 13H1v-3L9.5 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                      </svg>
                      Sửa
                    </button>
                    <button className="btn-admin-danger" onClick={() => setDeleteConfirm(g)}>
                      <svg viewBox="0 0 14 14" fill="none" style={{ width: 12, height: 12 }}>
                        <path d="M2 3.5h10M5 3.5V2.5h4v1M5.5 6v4M8.5 6v4M3 3.5l.7 8h6.6l.7-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Xóa
                    </button>
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
          <div className="admin-modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={closeModal}>×</button>
            <h2 className="admin-modal-title">{editGenre ? 'Sửa thể loại' : 'Thêm thể loại mới'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label className="admin-form-label">Tên thể loại *</label>
                <input
                  className="admin-form-input"
                  placeholder="Nhập tên thể loại..."
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn-admin-secondary" onClick={closeModal}>Hủy</button>
                <button type="submit" className="btn-admin-primary" disabled={formLoading}>
                  {formLoading ? 'Đang lưu...' : editGenre ? 'Cập nhật' : 'Thêm mới'}
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
            <h2 className="admin-modal-title">Xóa thể loại</h2>
            <p className="admin-confirm-text">
              Bạn có chắc muốn xóa thể loại <strong>"{deleteConfirm.name}"</strong>?
              Thao tác này không thể hoàn tác. Thể loại chỉ có thể xóa nếu chưa được gán cho phim nào.
            </p>
            <div className="admin-modal-footer">
              <button className="btn-admin-secondary" onClick={() => setDeleteConfirm(null)}>Hủy</button>
              <button className="btn-admin-danger" onClick={handleDelete}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenresPage;
