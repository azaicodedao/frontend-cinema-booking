import React, { useState, useEffect } from 'react';
import * as adminApi from '../services/admin.api';
import AdminModal from '../components/AdminModal/AdminModal';
import AdminConfirmModal from '../components/AdminConfirmModal/AdminConfirmModal';
import '../../../layouts/AdminLayout.css';

const GenresPage = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editGenre, setEditGenre] = useState(null);
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
  const openEdit = (genre) => { setEditGenre(genre); setFormName(genre.name); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditGenre(null); setFormName(''); };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      showError(e.response?.data?.message || 'Thể loại đã tồn tại');
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
      showError(e.response?.data?.message || 'Không thể xóa thể loại đang được sử dụng');
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
            ) : genres.map((genre) => (
              <tr key={genre.id}>
                <td style={{ color: 'var(--t3)', fontSize: 12 }}>#{genre.id}</td>
                <td style={{ fontWeight: 600 }}>{genre.name}</td>
                <td>
                  <div className="admin-actions-group">
                    <button className="btn-admin-secondary" onClick={() => openEdit(genre)}>Sửa</button>
                    <button className="btn-admin-danger" onClick={() => setDeleteConfirm(genre)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal
        isOpen={showModal}
        onClose={closeModal}
        title={editGenre ? 'Sửa thể loại' : 'Thêm thể loại mới'}
        size="small"
      >
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-form-label">Tên thể loại *</label>
            <input
              className="admin-form-input"
              placeholder="Nhập tên thể loại..."
              value={formName}
              onChange={(event) => setFormName(event.target.value)}
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
      </AdminModal>

      <AdminConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Xóa thể loại"
        confirmText="Xóa"
        onConfirm={handleDelete}
      >
        Bạn có chắc muốn xóa thể loại <strong>"{deleteConfirm?.name}"</strong>? Thao tác này không thể hoàn tác.
      </AdminConfirmModal>
    </div>
  );
};

export default GenresPage;
