import api from '../../../services/apiClient';

const USER_URL = 'users/';

/**
 * Object chức năng Chứa toàn bộ các phương thức gọi Server liên quan đến Hồ Sơ Người Dùng.
 * Dùng axios (apiClient) để truy vấn tài nguyên bằng Token bảo vệ.
 */
const UserApi = {
  /** Lấy thông tin chi tiết của người hiện tại đang đăng nhập */
  getProfile() {
    return api.get(USER_URL + 'profile');
  },

  /** 
   * Đẩy yêu cầu chỉnh sửa Thông tin Hồ Sơ.
   * @param {Object} data - Mã json chứa { fullName, phone, gender, address }
   */
  updateProfile(data) {
    return api.put(USER_URL + 'profile', data);
  },

  changePassword(data) {
    return api.put(USER_URL + 'password', data);
  },
};

export default UserApi;
