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
                {currentUser?.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt="Avatar" className="nav-avatar-img" />
                ) : (
                  currentUser?.fullName?.charAt(0)?.toUpperCase() || 'U'
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
