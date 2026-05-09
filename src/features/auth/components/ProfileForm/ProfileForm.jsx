import React, { useState, useEffect } from 'react';
import './ProfileForm.css';

/**
 * Component Biểu mẫu Cập nhật Thông tin Hồ sơ (Profile Form).
 * Cho phép người dùng chỉnh sửa thông tin cá nhân. Sẽ tự động đổ dữ liệu (bind data) từ đối tượng `user`.
 *
 * @param {Object} props - Tham số cấp vào component.
 * @param {Object} props.user - Thông tin User lấy xuống từ Context/API.
 * @param {Function} props.onSubmit - Gọi khi người dùng nhấn "Lưu thay đổi".
 * @param {Function} props.onResetMessages - Gọi khi người dùng nhấn "Lưu thay đổi" để reset thông báo.
 * @param {boolean} [props.loading=false] - Trạng thái lưu API.
 * @returns {JSX.Element} Form hồ sơ.
 */
const ProfileForm = ({ user, onSubmit, onResetMessages, loading = false }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    gender: 'Male',
    address: ''
  });
  const [error, setError] = useState('');

  /**
   * Tự động phản ứng (hook) khi object `user` thay đổi.
   * Đồng bộ dữ liệu người dùng vào `formData` để hiển thị trên ô nhập liệu.
   */
  useEffect(() => {
    if (user) {
      const actualUser = user.user || user;
      setFormData({
        fullName: actualUser.fullName || '',
        phone: actualUser.phone || '',
        gender: actualUser.gender || 'Male',
        address: actualUser.address || ''
      });
    }
  }, [user]);

  /**
   * Cập nhật các ô input vào State (Dynamic handler cho nhiều input).
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Logic kiểm tra trước khi Lưu: chặn nếu tên bỏ trống.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setError('Họ và tên không được để trống');
      return;
    }
    setError('');
    onSubmit(formData);
  };

  const displayEmail = user?.email || user?.user?.email || '';

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="ff">
        <label className="fl">Địa chỉ Email</label>
        <input 
          className="fi" 
          type="email" 
          value={displayEmail} 
          disabled 
        />
        <div className="fhint">Email không thể thay đổi</div>
      </div>

      <div className="ff">
        <label className="fl">Họ và tên</label>
        <input 
          className="fi" 
          type="text" 
          name="fullName"
          value={formData.fullName} 
          onChange={handleChange}
          placeholder="Nhập họ tên đầy đủ"
          required
        />
        {error && <div className="fhint" style={{color: 'var(--red)'}}>{error}</div>}
      </div>

      <div className="pgrid2">
        <div className="ff">
          <label className="fl">Số điện thoại</label>
          <input 
            className="fi" 
            type="tel" 
            name="phone"
            value={formData.phone} 
            onChange={handleChange}
            placeholder="09xx.xxx.xxx"
          />
        </div>

        <div className="ff">
          <label className="fl">Giới tính</label>
          <select 
            className="fi" 
            name="gender"
            value={formData.gender} 
            onChange={handleChange}
          >
            <option value="Male">Nam</option>
            <option value="Female">Nữ</option>
          </select>
        </div>
      </div>

      <div className="ff">
        <label className="fl">Địa chỉ</label>
        <input 
          className="fi" 
          type="text" 
          name="address"
          value={formData.address} 
          onChange={handleChange}
          placeholder="Số nhà, đường, phường/xã..."
        />
      </div>

      <div style={{ marginTop: '30px' }}>
        <button className="btn-cta" type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
