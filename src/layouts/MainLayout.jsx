import React, { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './MainLayout.css';

const MainLayout = () => {
    const { currentUser, logout, isAuthenticated } = useContext(AuthContext);

  return (
    <div className="app-container">
      <nav className="navbar">
        <Link to="/" className="nav-logo">
          <svg viewBox="0 0 22 22" fill="none">
            <rect x="1" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8 9l5 3-5 3V9z" fill="currentColor" />
            <path d="M1 9h3M1 13h3M18 9h3M18 13h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          CineBook
        </Link>

        <div className="nav-contact">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          <span>0366969696</span>
        </div>

        <div className="nav-links">
          <Link to="/" className="nav-link">Trang chủ</Link>
          <Link to="/movies" className="nav-link">Lịch chiếu</Link>
        </div>

        <div className="nav-flex" />

        {isAuthenticated ? (
          <div className="nav-actions">
            <div className="nav-link" onClick={logout} style={{ cursor: 'pointer' }}>Đăng xuất</div>
            <Link to="/profile" className="nav-avatar-link" title="Hồ sơ">
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
            <Link to="/login"><button className="btn-outline">Đăng nhập</button></Link>
            <Link to="/register"><button className="btn-gold">Đăng ký</button></Link>
          </div>
        )}
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="sfooter">
        <div className="flinks"><span>Về chúng tôi</span><span>Liên hệ</span><span>Điều khoản</span></div>
        <div>© 2025 CineBook</div>
      </footer>
    </div>
  );
};

export default MainLayout;
