import React, { useContext, useEffect } from 'react';
import AuthContext from '../../context/AuthContext';
import AuthModalContext from '../../context/AuthModalContext';

/**
 * Lớp bảo vệ trang riêng tư (PrivateRoute Guard).
 * Nhiệm vụ: Yêu cầu người dùng phải ĐĂNG NHẬP để truy cập.
 * Thay vì chuyển trang, sẽ mở AuthModal ngay tại trang hiện tại.
 */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isInitialized } = useContext(AuthContext);
  const { openLogin } = useContext(AuthModalContext);

  // Mở Modal đăng nhập nếu chưa xác thực (sau khi app đã khởi tạo xong)
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      openLogin();
    }
  }, [isInitialized, isAuthenticated, openLogin]);

  // Chờ cho đến khi ứng dụng xác định xong trạng thái đăng nhập từ bộ nhớ
  if (!isInitialized) return null;

  // Nếu chưa đăng nhập -> không render nội dung (Modal sẽ tự mở)
  if (!isAuthenticated) return null;

  // Nếu đã đăng nhập -> cho phép xem nội dung trang
  return children;
};

export default PrivateRoute;
