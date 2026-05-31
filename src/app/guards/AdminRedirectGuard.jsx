import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { ROUTES } from '../../config/routes';

const AdminRedirectGuard = ({ children }) => { // Kiểm tra xem người dùng có quyền truy cập trang admin không
    const { isInitialized, isAdmin } = useContext(AuthContext); 

    if (!isInitialized) return null; // Nếu chưa khởi tạo thì không render gì cả
    if (isAdmin) return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />; // Nếu là admin thì chuyển về trang admin

    return children; // Nếu không phải admin thì cho phép truy cập
};

export default AdminRedirectGuard;
