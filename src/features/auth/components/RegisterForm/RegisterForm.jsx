import React, { useState } from 'react';
import Input from '../../../../components/common/Input/Input';
import Button from '../../../../components/common/Button/Button';
import './RegisterForm.css';

/**
 * Component Hiển thị Biểu mẫu Đăng ký Tài khoản (Register Form).
 *
 * @param {Object} props - Dữ kiện truyền từ component bọc (cha).
 * @param {Function} props.onSubmit - Nơi xử lý gửi thông tin lên backend.
 * @param {boolean} [props.loading=false] - Trạng thái tải của API.
 * @param {string} [props.error=''] - Lỗi hệ thống nếu có.
 * @returns {JSX.Element} Khung html đăng ký.
 */
const RegisterForm = ({ onSubmit, loading = false, error = '' }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  /** Lắng nghe việc người dùng gõ vào bàn phím */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Validate dữ liệu đầu vào.
   * Ghi chú: Chứa logic password cực khắt khe (chữ hoa, chữ thường, số, độ dài min 8).
   */
  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email format';
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = 'Password must contain at least 1 uppercase letter';
    } else if (!/[a-z]/.test(form.password)) {
      newErrors.password = 'Password must contain at least 1 lowercase letter';
    } else if (!/[0-9]/.test(form.password)) {
      newErrors.password = 'Password must contain at least 1 number';
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Chuẩn bị dữ liệu và truyền cho Callback nếu kiểm duyệt thành công */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form.fullName, form.email, form.password);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit} noValidate>
      <div className="register-form__header">
        <h1 className="register-form__title">Create Account</h1>
        <p className="register-form__subtitle">Join us and start booking</p>
      </div>

      {error && <div className="register-form__error-banner">{error}</div>}

      <Input
        label="Full Name"
        name="fullName"
        value={form.fullName}
        onChange={handleChange}
        placeholder="Enter your full name"
        error={errors.fullName}
        required
      />

      <Input
        label="Email"
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Enter your email"
        error={errors.email}
        required
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Min 8 chars, 1 uppercase, 1 number"
        error={errors.password}
        required
      />

      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={form.confirmPassword}
        onChange={handleChange}
        placeholder="Re-enter your password"
        error={errors.confirmPassword}
        required
      />

      <Button type="submit" fullWidth loading={loading} size="large">
        Create Account
      </Button>
    </form>
  );
};

export default RegisterForm;
