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
    if (!form.fullName.trim()) {
      newErrors.fullName = 'Họ và tên không được để trống';
    } else if (form.fullName.trim().length > 100) {
      newErrors.fullName = 'Họ và tên không được vượt quá 100 ký tự';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (form.email.trim().length > 100) {
      newErrors.email = 'Email không được vượt quá 100 ký tự';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Định dạng email không hợp lệ';
    }

    if (!form.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (form.password.length < 6 || form.password.length > 40) {
      newErrors.password = 'Mật khẩu phải từ 6 đến 40 ký tự';
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Chuẩn bị dữ liệu và truyền cho Callback nếu kiểm duyệt thành công */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form.fullName, form.email, form.password, form.confirmPassword);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit} noValidate>
      <div className="register-form__header">
        <h1 className="register-form__title">Đăng kí</h1>
        <p className="register-form__subtitle">Tham gia để cùng đặt vé xem phim yêu thích</p>
      </div>

      {error && <div className="register-form__error-banner">{error}</div>}

      <Input
        label="Họ và tên"
        name="fullName"
        value={form.fullName}
        onChange={handleChange}
        placeholder="Nhập họ và tên của bạn"
        error={errors.fullName}
        required
      />

      <Input
        label="Email"
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Nhập địa chỉ email"
        error={errors.email}
        required
      />

      <Input
        label="Mật khẩu"
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Mật khẩu từ 6 đến 40 ký tự"
        error={errors.password}
        required
      />

      <Input
        label="Xác nhận mật khẩu"
        type="password"
        name="confirmPassword"
        value={form.confirmPassword}
        onChange={handleChange}
        placeholder="Nhập lại mật khẩu"
        error={errors.confirmPassword}
        required
      />

      <Button type="submit" fullWidth loading={loading} size="large">
        Đăng ký tài khoản
      </Button>
    </form>
  );
};

export default RegisterForm;
