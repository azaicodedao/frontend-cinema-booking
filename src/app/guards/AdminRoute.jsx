import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { ROUTES } from '../../config/routes';

const AdminRoute = ({ children }) => { // Kiểm tra xem người dùng có quyền truy cập trang admin không
    const { isAuthenticated, isAdmin, isInitialized } = useContext(AuthContext);

    if (!isInitialized) return null; // Nếu chưa khởi tạo thì không render gì cả
    if (!isAuthenticated) return <Navigate to={ROUTES.HOME} state={{ openLogin: true }} replace />; // Nếu chưa đăng nhập thì chuyển về trang chủ
    if (!isAdmin) return <Navigate to={ROUTES.HOME} replace />;// Nếu không phải admin thì chuyển về trang chủ

    return children; // Nếu là admin thì cho phép truy cập
};

export default AdminRoute;
