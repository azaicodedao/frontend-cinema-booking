import React, { useState } from 'react';
import './Input.css';

/**
 * Component Input tái sử dụng (Reusable Input Component).
 * Cung cấp một thẻ input có kèm nhãn (label), nút ẩn/hiện mật khẩu và hiển thị lỗi.
 * 
 * @param {Object} props - Danh sách các thuộc tính truyền từ component cha.
 * @param {string} props.label - Chữ hiển thị bên trên ô nhập (Tên trường dữ liệu).
 * @param {string} [props.type='text'] - Loại của ô nhập (text, password, email...).
 * @param {string} props.name - Tên (name attribute) của thẻ input để phân biệt khi submit.
 * @param {any} props.value - Giá trị hiện tại của ô nhập.
 * @param {Function} props.onChange - Hàm được gọi khi người dùng gõ phím.
 * @param {string} [props.placeholder] - Chữ in mờ làm gợi ý trong ô.
 * @param {string} [props.error] - Dòng chữ lỗi hiển thị bên dưới ô nhập màu đỏ.
 * @returns {JSX.Element} Khối giao diện của trường nhập liệu.
 */
const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  readOnly = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className={`input-group ${error ? 'input-group--error' : ''} ${className}`}>
      {label && (
        <label className="input-group__label" htmlFor={name}>
          {label}
          {required && <span className="input-group__required">*</span>}
        </label>
      )}
      <div className="input-group__wrapper">
        <input
          id={name}
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={`input-group__input ${readOnly ? 'input-group__input--readonly' : ''}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="input-group__toggle"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        )}
      </div>
      {error && <span className="input-group__error">{error}</span>}
    </div>
  );
};

export default Input;
