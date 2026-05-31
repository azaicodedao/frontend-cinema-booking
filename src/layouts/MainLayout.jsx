import React, { useContext, useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import AuthModalContext from '../context/AuthModalContext';
import AuthModal from '../features/auth/components/AuthModal/AuthModal';
import { ROUTES } from '../config/routes';
import './MainLayout.css';

const MainLayout = () => {
    const { currentUser, logout, isAuthenticated } = useContext(AuthContext);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
      logout();
      navigate(ROUTES.HOME, { replace: true });
    };

    const openLogin = () => {
        setAuthMode('login');
        setAuthModalOpen(true);
    };

    const openRegister = () => {
        setAuthMode('register');
        setAuthModalOpen(true);
    };

    // Lắng nghe sự kiện từ auth interceptor khi token hết hạn
    useEffect(() => {
        const handleRequireLogin = () => openLogin();
        window.addEventListener('auth:require-login', handleRequireLogin);
        return () => window.removeEventListener('auth:require-login', handleRequireLogin);
    }, []);

    // Tự động mở modal đăng nhập khi được chuyển hướng từ các Guard bảo vệ với state.openLogin
    useEffect(() => {
        if (location.state?.openLogin) {
            openLogin();
            // Xóa state để tránh việc tự động mở lại khi F5 trang
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate]);

  return (
    <AuthModalContext.Provider value={{ openLogin, openRegister }}>
      <div className="app-container">
        <nav className="navbar">
          <Link to={ROUTES.HOME} className="nav-logo">
            <svg viewBox="0 0 22 22" fill="none">
              <rect x="1" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8 9l5 3-5 3V9z" fill="currentColor" />
              <path d="M1 9h3M1 13h3M18 9h3M18 13h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            CineBook
          </Link>



          <div className="nav-links">
            <Link to={ROUTES.HOME} className="nav-link">Trang chủ</Link>
            <Link to={ROUTES.MOVIES} className="nav-link">Lịch chiếu</Link>
          </div>

          <div className="nav-flex" />

          {isAuthenticated ? (
            <div className="nav-actions">
              <div className="nav-link" onClick={handleLogout} style={{ cursor: 'pointer' }}>Đăng xuất</div>
              <Link to={ROUTES.PROFILE} className="nav-avatar-link" title="Hồ sơ">
                <div className="nav-avatar">
                  {(currentUser?.avatarUrl || currentUser?.user?.avatarUrl) ? (
                    <img src={currentUser?.avatarUrl || currentUser?.user?.avatarUrl} alt="Avatar" className="nav-avatar-img" />
                  ) : (
                    (currentUser?.fullName || currentUser?.user?.fullName)?.charAt(0)?.toUpperCase() || 'U'
                  )}
                </div>
              </Link>
            </div>
          ) : (
            <div className="nav-actions">
              <button className="btn-outline" onClick={openLogin}>Đăng nhập</button>
              <button className="btn-gold" onClick={openRegister}>Đăng ký</button>
            </div>
          )}
        </nav>

        {/* Auth Modal Popup - dùng chung cho toàn bộ ứng dụng */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authMode}
        />

        <main className="main-content">
          <Outlet />
        </main>
        <footer className="footer-modern">
          <div className="footer-content">
            <div className="footer-links-row">
              <Link to={ROUTES.HOME} className="footer-link">Rạp Phim</Link>
              <span className="footer-link-dot">•</span>
              <span className="footer-link">Điều khoản sử dụng</span>
              <span className="footer-link-dot">•</span>
              <span className="footer-link">Chính sách bảo mật</span>
            </div>

            <div className="footer-contact-row">
              <div className="footer-contact-reveal">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <span>Hotline</span>
                <span className="footer-contact-phone">: 036 696 9696</span>
              </div>
              <div className="footer-contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <span>support@cinebook.vn</span>
              </div>
            </div>
            
            <div className="footer-socials">
              <div className="social-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></div>
              <div className="social-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></div>
              <div className="social-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg></div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="footer-copyright">© 2025 CineBook. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </AuthModalContext.Provider>
  );
};

export default MainLayout;
