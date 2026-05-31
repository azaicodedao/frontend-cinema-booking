import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as adminApi from '../services/admin.api';
import AdminPagination from '../components/AdminPagination/AdminPagination';
import '../../../layouts/AdminLayout.css';

const ROLE_OPTIONS = ['', 'CUSTOMER', 'ADMIN'];
const STATUS_OPTIONS = ['', 'ACTIVE', 'LOCKED'];

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const errorTimeoutRef = useRef(null);
  const successTimeoutRef = useRef(null);

  const [keyword, setKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [detailUser, setDetailUser] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null); // { type, user }
  const [roleModal, setRoleModal] = useState(null); // { user, newRole }

  const SIZE = 10;

  const showSuccess = (msg) => {
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }
    setSuccess(msg);
    successTimeoutRef.current = setTimeout(() => {
      setSuccess('');
      successTimeoutRef.current = null;
    }, 3000);
  };

  const showError = (msg) => {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    setError(msg);
    errorTimeoutRef.current = setTimeout(() => {
      setError('');
      errorTimeoutRef.current = null;
    }, 3000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, size: SIZE };
      if (keyword) params.keyword = keyword;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;
      const res = await adminApi.getUsers(params);
      const data = res.data.data;
      setUsers(data.content || []);
      setTotal(data.totalElements || 0);
    } catch (e) {
      showError(e.response?.data?.message || 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, [page, keyword, roleFilter, statusFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSearch = (e) => { e.preventDefault(); setPage(0); fetchUsers(); };

  const handleChangeRole = async () => {
    if (!roleModal) return;
    try {
      await adminApi.changeUserRole(roleModal.user.id, roleModal.newRole);
      showSuccess('Cập nhật quyền thành công');
      setRoleModal(null);
      fetchUsers();
    } catch (e) {
      showError(e.response?.data?.message || 'Lỗi khi thay đổi quyền');
    }
  };

  const handleLockUnlock = async () => {
    if (!confirmModal) return;
    try {
      if (confirmModal.type === 'lock') {
        await adminApi.lockUser(confirmModal.user.id);
        showSuccess('Khoá tài khoản thành công');
      } else {
        await adminApi.unlockUser(confirmModal.user.id);
        showSuccess('Mở khóa tài khoản thành công');
      }
      setConfirmModal(null);
      fetchUsers();
    } catch (e) {
      showError(e.response?.data?.message || 'Lỗi thao tác');
    }
  };

  const totalPages = Math.ceil(total / SIZE);

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Quản lý Người dùng <span>{total} người dùng</span></h1>
      </div>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}
      {success && <div className="admin-alert admin-alert-success">{success}</div>}

      {/* Filters */}
      <form className="admin-filters" onSubmit={handleSearch}>
        <input
          className="admin-input"
          placeholder="Tìm theo tên, email..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          style={{ flex: 1, minWidth: 220 }}
        />
        <select className="admin-select" value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(0); }}>
          <option value="">Tất cả quyền</option>
          <option value="CUSTOMER">Customer</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select className="admin-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(0); }}>
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVE">Đang hoạt động</option>
          <option value="BLOCKED">Đã khóa</option>
        </select>
        <button type="submit" className="btn-admin-primary">Tìm kiếm</button>
      </form>

      {/* Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Quyền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7}><div className="admin-loading"><div className="admin-spinner" /></div></td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={7}><div className="admin-empty">Không tìm thấy tài khoản nào</div></td></tr>
            ) : users.map(u => (
              <tr key={u.id}>
                <td style={{ color: 'var(--t3)', fontSize: 12 }}>#{u.id}</td>
                <td style={{ fontWeight: 600 }}>{u.fullName}</td>
                <td style={{ color: 'var(--t2)' }}>{u.email}</td>
                <td style={{ color: 'var(--t2)' }}>{u.phone || '—'}</td>
                <td>
                  <span className={`badge ${u.role === 'ADMIN' ? 'badge-admin' : 'badge-customer'}`}>
                    {u.role}
                  </span>
                </td>
                <td>
                  <span className={`badge ${u.status === 'ACTIVE' ? 'badge-active' : 'badge-locked'}`}>
                    {u.status === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}
                  </span>
                </td>
                <td>
                  <div className="admin-actions-group">
                    <button className="btn-admin-secondary" onClick={() => setDetailUser(u)}>Chi tiết</button>
                    <button
                      className="btn-admin-secondary"
                      onClick={() => setRoleModal({ user: u, newRole: u.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN' })}
                    >
                      Cập nhật quyền
                    </button>
                    {u.status === 'ACTIVE' ? (
                      <button className="btn-admin-danger" onClick={() => setConfirmModal({ type: 'lock', user: u })}>Khóa tài khoản</button>
                    ) : (
                      <button className="btn-admin-success" onClick={() => setConfirmModal({ type: 'unlock', user: u })}>Mở khóa</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <AdminPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      {false && totalPages > 1 && (
        <div className="admin-pagination">
          <button className="admin-page-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>‹</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} className={`admin-page-btn ${i === page ? 'active' : ''}`} onClick={() => setPage(i)}>{i + 1}</button>
          ))}
          <button className="admin-page-btn" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>›</button>
        </div>
      )}

      {/* Detail Modal */}
      {detailUser && (
        <div className="admin-modal-overlay" onClick={() => setDetailUser(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setDetailUser(null)}>×</button>
            <h2 className="admin-modal-title">Chi tiết tài khoản</h2>
            <div style={{ display: 'grid', gap: 14 }}>
              {[
                ['ID', `#${detailUser.id}`],
                ['Họ tên', detailUser.fullName],
                ['Email', detailUser.email],
                ['Số điện thoại', detailUser.phone || '—'],
                ['Giới tính', detailUser.gender || '—'],
                ['Ngày sinh', detailUser.dateOfBirth || '—'],
                ['Quyền hạn', detailUser.role],
                ['Trạng thái', detailUser.status],
                ['Ngày tạo', detailUser.createdAt ? new Date(detailUser.createdAt).toLocaleString('vi-VN') : '—'],
                ['Lần đăng nhập gần nhất', detailUser.lastLoginAt ? new Date(detailUser.lastLoginAt).toLocaleString('vi-VN') : 'Chưa đăng nhập'],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', gap: 12 }}>
                  <span style={{ minWidth: 130, color: 'var(--t3)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', paddingTop: 2 }}>{label}</span>
                  <span style={{ color: 'var(--t1)', fontSize: 14 }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Role Change Modal */}
      {roleModal && (
        <div className="admin-modal-overlay" onClick={() => setRoleModal(null)}>
          <div className="admin-modal admin-confirm-modal" onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setRoleModal(null)}>×</button>
            <h2 className="admin-modal-title">Thay đổi quyền hạn</h2>
            <p className="admin-confirm-text">
              Bạn muốn đổi quyền của <strong>{roleModal.user.fullName}</strong> từ{' '}
              <strong>{roleModal.user.role}</strong> thành{' '}
              <strong>{roleModal.newRole}</strong>?
            </p>
            <div className="admin-modal-footer">
              <button className="btn-admin-secondary" onClick={() => setRoleModal(null)}>Hủy</button>
              <button className="btn-admin-primary" onClick={handleChangeRole}>Xác nhận</button>
            </div>
          </div>
        </div>
      )}

      {/* Lock/Unlock Confirm Modal */}
      {confirmModal && (
        <div className="admin-modal-overlay" onClick={() => setConfirmModal(null)}>
          <div className="admin-modal admin-confirm-modal" onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setConfirmModal(null)}>×</button>
            <h2 className="admin-modal-title">{confirmModal.type === 'lock' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}</h2>
            <p className="admin-confirm-text">
              Bạn có chắc muốn{' '}
              {confirmModal.type === 'lock' ? 'khóa' : 'mở khóa'} tài khoản của{' '}
              <strong>{confirmModal.user.fullName}</strong>?
              {confirmModal.type === 'lock' && ' Token đăng nhập hiện tại của người dùng sẽ bị thu hồi ngay lập tức.'}
            </p>
            <div className="admin-modal-footer">
              <button className="btn-admin-secondary" onClick={() => setConfirmModal(null)}>Hủy</button>
              <button
                className={confirmModal.type === 'lock' ? 'btn-admin-danger' : 'btn-admin-success'}
                onClick={handleLockUnlock}
              >
                {confirmModal.type === 'lock' ? 'Khóa tài khoản' : 'Mở khóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
