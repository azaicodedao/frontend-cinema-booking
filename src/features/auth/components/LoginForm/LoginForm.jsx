import React, { useState } from 'react';
import Input from '../../../../components/common/Input/Input';
import Button from '../../../../components/common/Button/Button';
import './LoginForm.css';

/**
 * Component Hiển thị Biểu mẫu Đăng Nhập (Login Form).
 * Chứa logic kiểm tra tính hợp lệ của email và password tại Frontend trước khi gọi API.
 *
 * @param {Object} props - Thuộc tính truyền vào cho biểu mẫu.
 * @param {Function} props.onSubmit - Hàm được gọi khi form submit và validate thành công.
 * @param {boolean} [props.loading=false] - Trạng thái API đang xử lý để hiển thị Spinner.
 * @param {string} [props.error=''] - Thông báo lỗi từ server trả về (nếu sai tài khoản/mật khẩu).
 * @returns {JSX.Element} Biểu mẫu đăng nhập.
 */
const LoginForm = ({ onSubmit, loading = false, error = '' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  /**
   * Hàm kiểm tra (Validate) dữ liệu đã điền trên Form.
   * Cập nhật lỗi báo đỏ tại thẻ state `errors` tương ứng nếu có.
   * 
   * @returns {boolean} `true` nếu toàn bộ trường phím hợp lệ, ngược lại `false`.
   */
  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Hàm chặn biểu diễn mặt định của form HTML và gọi hàm validate. 
   * Chỉ `onSubmit` (gọi về thẻ cha) nếu mọi thứ đã chuẩn xác.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(email, password);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <div className="login-form__header">
        <h1 className="login-form__title">Welcome Back</h1>
        <p className="login-form__subtitle">Sign in to your account</p>
      </div>

      {error && <div className="login-form__error-banner">{error}</div>}

      <Input
        label="Email"
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        error={errors.email}
        required
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        error={errors.password}
        required
      />

      <Button type="submit" fullWidth loading={loading} size="large">
        Đăng Nhập
      </Button>
    </form>
  );
};

export default LoginForm;
