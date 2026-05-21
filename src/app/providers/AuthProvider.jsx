import React, { useState, useEffect, useCallback } from 'react';
import AuthContext from '../../context/AuthContext';
import AuthService from '../../features/auth/services/auth.api';

/**
 * Provider quản lý trạng thái xác thực toàn cục cho ứng dụng.
 * Kết hợp khởi tạo đồng bộ để tránh flicker và trạng thái khởi tạo để hỗ trợ Guards.
 */
const AuthProvider = ({ children }) => {
  // Khởi tạo currentUser đồng bộ từ localStorage để tránh tình trạng "chưa đăng nhập" tạm thời khi F5 trang
  const [currentUser, setCurrentUser] = useState(() => AuthService.getCurrentUser());
  
  // Trạng thái đánh dấu ứng dụng đã kiểm tra xong session (Quan trọng cho AdminRedirectGuard)
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Đánh dấu đã khởi tạo xong sau khi component mount
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    const handleSessionExpired = (event) => {
      if (event?.type === 'storage' && event.key !== 'user') {
        return;
      }
      setCurrentUser(null);
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);
    window.addEventListener('storage', handleSessionExpired);
    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired);
      window.removeEventListener('storage', handleSessionExpired);
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const userData = await AuthService.login(email, password);
    setCurrentUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (fullName, email, password) => {
    return await AuthService.register(fullName, email, password);
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    setCurrentUser(null);
  }, []);

  const isAuthenticated = !!currentUser;
  
  /**
   * Kiểm tra quyền Admin cực kỳ linh hoạt (hỗ trợ mọi định dạng: string, array, nested).
   * Đảm bảo Admin luôn được nhận diện đúng dù dữ liệu trả về từ Backend có thay đổi cấu trúc.
   */
  const isAdmin = 
    currentUser?.role === 'ADMIN' || 
    currentUser?.user?.role === 'ADMIN' ||
    (Array.isArray(currentUser?.roles) && currentUser.roles.includes('ADMIN')) ||
    (Array.isArray(currentUser?.user?.roles) && currentUser.user.roles.includes('ADMIN'));

  if (import.meta.env.DEV && currentUser) {
    console.log('[AuthProvider] Auth state:', {
      id: currentUser?.id || currentUser?.user?.id,
      email: currentUser?.email || currentUser?.user?.email,
      role: currentUser?.role || currentUser?.user?.role,
      isAdmin,
    });
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
        isInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
