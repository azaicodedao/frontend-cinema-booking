import React, { useContext, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        {
            key: 'users',
            label: 'Quản lý Tài khoản',
            icon: (
                <svg viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            ),
            links: [
                { to: '/admin/users', label: 'Danh sách tài khoản' },
            ],
        },
        {
            key: 'catalog',
            label: 'Thể loại & Phim',
            icon: (
                <svg viewBox="0 0 20 20" fill="none">
                    <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 8l5 2-5 2V8z" fill="currentColor" />
                </svg>
            ),
            links: [
                { to: '/admin/genres', label: 'Quản lý Thể loại' },
                { to: '/admin/movies', label: 'Quản lý Phim' },
            ],
        },
        {
            key: 'schedule',
            label: 'Phòng & Suất chiếu',
            icon: (
                <svg viewBox="0 0 20 20" fill="none">
                    <rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M6 2v2M14 2v2M2 8h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            ),
            links: [
                { to: '/admin/rooms', label: 'Quản lý Phòng chiếu' },
                { to: '/admin/showtimes', label: 'Quản lý Suất chiếu' },
            ],
        },
    ];

    const toggleMenu = (key) => setOpenMenu(openMenu === key ? null : key);

    return (
        <div className="admin-container">
            {/* Top navbar */}
            <nav className="admin-navbar">
                <Link to="/admin" className="admin-nav-logo">
                    <svg viewBox="0 0 22 22" fill="none">
                        <rect x="1" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.6" />
                        <path d="M8 9l5 3-5 3V9z" fill="currentColor" />
                        <path d="M1 9h3M1 13h3M18 9h3M18 13h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                    CineBook <span className="admin-badge">Admin</span>
                </Link>

                <div className="admin-nav-links">
                    {navItems.map((item) => (
                        <div key={item.key} className="admin-dropdown-wrap">
                            <button
                                className={`admin-nav-btn ${item.links.some(l => location.pathname.startsWith(l.to)) ? 'active' : ''}`}
                                onClick={() => toggleMenu(item.key)}
                            >
                                {item.icon}
                                {item.label}
                                <svg className={`chevron ${openMenu === item.key ? 'open' : ''}`} viewBox="0 0 12 12" fill="none">
                                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </button>
                            {openMenu === item.key && (
                                <div className="admin-dropdown">
                                    {item.links.map((l) => (
                                        <Link
                                            key={l.to}
                                            to={l.to}
                                            className={`admin-dropdown-item ${location.pathname === l.to ? 'active' : ''}`}
                                            onClick={() => setOpenMenu(null)}
                                        >
                                            {l.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="admin-nav-flex" />

                <div className="admin-nav-actions">
                    <Link to="/" className="admin-nav-link" title="Về trang khách hàng">
                        <svg viewBox="0 0 20 20" fill="none" style={{ width: 16, height: 16 }}>
                            <path d="M10 2L2 9h2v9h5v-5h2v5h5V9h2L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        </svg>
                        Trang khách
                    </Link>
                    <Link to="/admin/profile" className="admin-nav-link">Hồ sơ</Link>
                    <div className="admin-nav-avatar" onClick={handleLogout} title="Đăng xuất">
                        {currentUser?.fullName?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                </div>
            </nav>

            {/* Overlay to close dropdown */}
            {openMenu && <div className="admin-overlay" onClick={() => setOpenMenu(null)} />}

            <main className="admin-main">
                <Outlet />
            </main>

            <footer className="admin-footer">
                <span>© 2025 CineBook Admin Panel</span>
            </footer>
        </div>
    );
};

export default AdminLayout;
