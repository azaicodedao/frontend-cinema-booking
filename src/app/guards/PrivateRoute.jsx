import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

/**
 * Lớp bảo vệ trang riêng tư (PrivateRoute Guard).
 * Nhiệm vụ: Yêu cầu người dùng phải ĐĂNG NHẬP để truy cập.
 * Thường dùng cho trang: Profile, Đặt vé, Thanh toán, Lịch sử vé.
 */
const PrivateRoute = ({ children }) => {
  // Lấy trạng thái đăng nhập và trạng thái khởi tạo từ Context
  const { isAuthenticated, isInitialized } = useContext(AuthContext);
  
  // Lưu lại vị trí hiện tại của người dùng để sau khi đăng nhập xong có thể quay lại đúng trang này
  const location = useLocation();

  // Chờ cho đến khi ứng dụng xác định xong trạng thái đăng nhập từ bộ nhớ
  if (!isInitialized) return null;

  // Nếu người dùng chưa đăng nhập -> Đẩy sang trang Login 
  // kèm theo thông tin trang đang định truy cập (state.from)
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu đã đăng nhập -> Cho phép xem nội dung trang
  return children;
};

export default PrivateRoute;
