import React, { useState } from 'react';
import './ChangePasswordForm.css';

/**
 * Component form thay đổi mật khẩu người dùng.
 * 
 * @param {Object} props - Các thuộc tính của component.
 * @param {Function} props.onSubmit - Hàm được gọi khi submit form hợp lệ.
 * @param {Function} [props.onResetMessages] - Hàm được gọi để reset thông báo lỗi.
 * @param {boolean} [props.loading=false] - Trạng thái đang tải.
 * @param {string} [props.error=''] - Thông báo lỗi từ server để hiển thị.
 * @returns {JSX.Element} Form thay đổi mật khẩu.
 */
const ChangePasswordForm = ({ onSubmit, onResetMessages, loading = false, error = '' }) => {
  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [errors, setErrors] = useState({});

  /**
   * Xử lý khi giá trị của các input thay đổi.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Sự kiện thay đổi của input.
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Kiểm tra tính hợp lệ của dữ liệu mật khẩu.
   * 
   * @param {Object} data - Dữ liệu cần kiểm tra (mật khẩu cũ, mới, xác nhận).
   * @returns {boolean} True nếu hợp lệ.
   */
  const validate = (data) => {
    const newErrors = {};
    if (!data.oldPassword) newErrors.oldPassword = 'Vui lòng nhập mật khẩu hiện tại';
    if (!data.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (data.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    } else if (data.newPassword === data.oldPassword) {
      newErrors.newPassword = 'Mật khẩu mới không được trùng với mật khẩu hiện tại';
    }
    
    if (data.newPassword !== data.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Mật khẩu xác nhận không khớp';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Xử lý sự kiện submit form.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onResetMessages) onResetMessages();
    
    // Lưu lại dữ liệu hiện tại để xử lý trước khi reset UI
    const currentForm = { ...form };
    
    // Reset form ngay lập tức (xóa trắng các ô input)
    setForm({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });

    // Thực hiện kiểm tra lỗi với dữ liệu đã lưu
    if (validate(currentForm)) {
      onSubmit(currentForm);
    }
  };

  return (
    <form className="change-password-form" onSubmit={handleSubmit} noValidate>
      <div className="ff">
        <label className="fl">Mật khẩu hiện tại</label>
        <input 
          className="fi" 
          type="password" 
          name="oldPassword"
          value={form.oldPassword} 
          onChange={handleChange}
          placeholder="••••••••"
          required
        />
        {errors.oldPassword && <div className="fhint" style={{color: 'var(--red)'}}>{errors.oldPassword}</div>}
      </div>

      <div className="ff">
        <label className="fl">Mật khẩu mới</label>
        <input 
          className="fi" 
          type="password" 
          name="newPassword"
          value={form.newPassword} 
          onChange={handleChange}
          placeholder="••••••••"
          required
        />
        <div className="fhint">Tối thiểu 6 ký tự</div>
        {errors.newPassword && <div className="fhint" style={{color: 'var(--red)'}}>{errors.newPassword}</div>}
      </div>

      <div className="ff">
        <label className="fl">Xác nhận mật khẩu mới</label>
        <input 
          className="fi" 
          type="password" 
          name="confirmNewPassword"
          value={form.confirmNewPassword} 
          onChange={handleChange}
          placeholder="••••••••"
          required
        />
        {errors.confirmNewPassword && <div className="fhint" style={{color: 'var(--red)'}}>{errors.confirmNewPassword}</div>}
      </div>

      {error && <div className="fhint" style={{color: 'var(--red)', marginBottom: '15px'}}>{error}</div>}

      <div style={{ marginTop: '30px' }}>
        <button className="btn-cta" type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Đang cập nhật...' : 'Lưu mật khẩu mới'}
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
