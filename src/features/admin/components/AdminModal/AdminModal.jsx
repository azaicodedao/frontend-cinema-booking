import React, { useEffect } from 'react';

const SIZE_WIDTH = {
  small: 400,
  medium: 520,
  large: 720,
  xlarge: 900,
};

const AdminModal = ({ // Màn hình modal dùng để hiển thị thông tin hoặc form nhập
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  className = '',
  style,
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEsc = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className={`admin-modal ${className}`}
        style={{ maxWidth: SIZE_WIDTH[size] || size, ...style }}
        onClick={(event) => event.stopPropagation()}
      >
        <button className="admin-modal-close" onClick={onClose}>×</button>
        {title && <h2 className="admin-modal-title">{title}</h2>}
        {children}
        {footer && <div className="admin-modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default AdminModal;
