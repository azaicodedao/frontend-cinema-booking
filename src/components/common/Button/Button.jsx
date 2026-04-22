import React from 'react';
import './Button.css';

/**
 * Component Button (Nút bấm) dùng chung cho toàn bộ ứng dụng.
 * Có thể tùy chỉnh màu sắc (variant), kích cỡ (size), trạng thái loading, v.v.
 *
 * @param {Object} props - Dữ liệu truyền vào từ component cha.
 * @param {React.ReactNode} props.children - Chữ hoặc icon hiển thị bên trong nút.
 * @param {Function} [props.onClick] - Hàm xử lý khi nút được click.
 * @param {string} [props.type='button'] - Kiểu của nút (button, submit, reset).
 * @param {string} [props.variant='primary'] - Biến thể CSS định dạng màu sắc (primary, secondary, danger, ghost).
 * @param {string} [props.size='medium'] - Kích thước của nút (small, medium, large).
 * @param {boolean} [props.disabled=false] - Trạng thái vô hiệu hóa (không cho bấm).
 * @param {boolean} [props.loading=false] - Trạng thái đang tải (hiện vòng xoay).
 * @param {boolean} [props.fullWidth=false] - Nút có chiều rộng 100% hay không.
 * @param {string} [props.className=''] - Các class CSS bổ sung.
 * @returns {JSX.Element} Nút bấm.
 */
const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const classNames = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--full-width' : '',
    loading ? 'btn--loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="btn__spinner" />}
      <span className={loading ? 'btn__text--hidden' : 'btn__text'}>
        {children}
      </span>
    </button>
  );
};

export default Button;
