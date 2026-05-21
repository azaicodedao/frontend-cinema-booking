import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

/**
 * Lớp bảo vệ tuyến đường Admin (AdminRoute Guard).
 * Nhiệm vụ: Chỉ cho phép người dùng có quyền ADMIN truy cập vào các trang quản trị.
 * Nếu không phải Admin, sẽ bị đẩy về trang chủ hoặc trang đăng nhập.
 */
const AdminRoute = ({ children }) => {
    // isInitialized: Trạng thái chờ đợi khi ứng dụng đang đọc dữ liệu từ localStorage
    const { currentUser, isAuthenticated, isInitialized } = useContext(AuthContext);
    
    /**
     * Logic kiểm tra quyền Admin linh hoạt (Robust Check):
     * Hỗ trợ nhiều định dạng dữ liệu trả về từ Backend (flat, nested, hoặc roles array).
     */
    const isAdmin = 
        currentUser?.role === 'ADMIN' || 
        currentUser?.user?.role === 'ADMIN' ||
        (Array.isArray(currentUser?.roles) && currentUser.roles.includes('ADMIN')) ||
        (Array.isArray(currentUser?.user?.roles) && currentUser.user.roles.includes('ADMIN'));

    // 1. Nếu chưa khởi tạo xong dữ liệu xác thực, hiển thị trạng thái trống (hoặc loading) 
    // để tránh việc redirect nhầm khi dữ liệu chưa kịp load.
    if (!isInitialized) return null;

    // 2. Nếu chưa đăng nhập, điều hướng người dùng về trang chủ và hiển thị modal đăng nhập
    if (!isAuthenticated) return <Navigate to="/" state={{ openLogin: true }} replace />;

    // 3. Nếu đã đăng nhập nhưng KHÔNG PHẢI ADMIN, điều hướng về trang chủ khách hàng
    if (!isAdmin) return <Navigate to="/" replace />;

    // 4. Nếu thỏa mãn tất cả điều kiện, cho phép render các trang quản trị (children)
    return children;
};

export default AdminRoute;
