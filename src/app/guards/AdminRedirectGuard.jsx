import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import AuthService from '../../features/auth/services/auth.api';

/**
 * Lớp điều hướng Admin (AdminRedirectGuard).
 * Nhiệm vụ: Ngăn chặn Admin truy cập vào giao diện của khách hàng (Home, Booking...).
 * Nếu phát hiện Admin đang ở trang khách, hệ thống sẽ tự động đẩy sang /admin.
 */
const AdminRedirectGuard = ({ children }) => {
    // Chờ hệ thống khởi tạo thông tin người dùng từ bộ nhớ
    const { isInitialized } = useContext(AuthContext);
    
    // Lấy thông tin người dùng hiện tại
    const storedUser = AuthService.getCurrentUser();
    
    /**
     * Logic kiểm tra quyền Admin: 
     * Đảm bảo nhận diện đúng Admin dù cấu trúc dữ liệu Backend có thay đổi.
     */
    const isAdmin = 
        storedUser?.role === 'ADMIN' || 
        storedUser?.user?.role === 'ADMIN' ||
        (Array.isArray(storedUser?.roles) && storedUser.roles.includes('ADMIN')) ||
        (Array.isArray(storedUser?.user?.roles) && storedUser.user.roles.includes('ADMIN'));

    // Nếu chưa load xong dữ liệu, tạm dừng render
    if (!isInitialized) return null;

    // Nếu người dùng hiện tại là ADMIN, điều hướng ngay lập tức về trang quản trị
    if (isAdmin) {
        return <Navigate to="/admin" replace />;
    }

    // Nếu không phải Admin (Khách hoặc Guest), cho phép truy cập giao diện khách hàng
    return children;
};

export default AdminRedirectGuard;
