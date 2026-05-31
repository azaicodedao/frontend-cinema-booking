import React from 'react';
import AdminModal from '../AdminModal/AdminModal';

const AdminConfirmModal = ({ // Màn hình modal dùng để hiển thị thông tin xác nhận
  isOpen,
  onClose,
  title,
  children,
  confirmText = 'Xóa',
  cancelText = 'Hủy',
  variant = 'danger',
  onConfirm,
  loading = false,
}) => (
  <AdminModal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    className="admin-confirm-modal"
    size="small"
    footer={(
      <>
        <button className="btn-admin-secondary" onClick={onClose} disabled={loading}>
          {cancelText}
        </button>
        <button
          className={variant === 'success' ? 'btn-admin-success' : variant === 'primary' ? 'btn-admin-primary' : 'btn-admin-danger'}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Đang xử lý...' : confirmText}
        </button>
      </>
    )}
  >
    <p className="admin-confirm-text">{children}</p>
  </AdminModal>
);

export default AdminConfirmModal;
