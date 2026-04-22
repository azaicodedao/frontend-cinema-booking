import React, { useEffect } from 'react';
import './Modal.css';

/**
 * Component Hiển thị hộp thoại nổi (Modal).
 * Dùng để cảnh báo, xác nhận hoặc chứa form điền thông tin mà không cần chuyển trang.
 *
 * @param {Object} props - Dữ liệu truyền từ component cha.
 * @param {boolean} props.isOpen - Trạng thái cho biết Modal có đang bật (hiển thị) không.
 * @param {Function} props.onClose - Hàm gọi khi muốn đóng Modal (bấm dấu x hoặc bấm ra viền ngoài).
 * @param {string} props.title - Tiêu đề của hộp thoại modal.
 * @param {React.ReactNode} props.children - Khối nội dung chính ở giữa modal (ví dụ: chú thích hoặc form).
 * @param {React.ReactNode} props.footer - Nút bấm ở chân dạng thanh cài (Footer).
 * @param {string} [props.size='medium'] - Kích thước hộp thoại (có thể là small, medium, large).
 * @returns {JSX.Element|null} Hộp thoại nổi Modal.
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
}) => {
  /**
   * Theo dõi sự thay đổi của trạng thái isOpen.
   * Khi bật Modal lên thì tắt tính năng cuộn (scroll) của trang nền phía sau đi.
   */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  /**
   * Theo dõi và Bắt sự kiện khi bàn phím được bấm.
   * Đóng hộp thoại nếu người dùng nhấn phím Escape (Esc).
   */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal modal--${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <h3 className="modal__title">{title}</h3>
          <button className="modal__close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
