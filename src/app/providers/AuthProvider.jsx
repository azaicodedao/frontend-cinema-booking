import React, { useState, useEffect, useCallback } from 'react';
import AuthContext from '../../context/AuthContext';
import AuthService from '../../features/auth/services/auth.api';

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setIsInitialized(true);
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
  
  // Kiểm tra quyền Admin linh hoạt (hỗ trợ cả cấu trúc phẳng và cấu trúc lồng)
  const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.user?.role === 'ADMIN';

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
