import React, { useContext, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { ROUTES } from '../config/routes';
import './AdminLayout.css';

const AdminLayout = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate(ROUTES.HOME, { replace: true });
    };

    const navItems = [
        {
            key: 'users',
            label: 'Quản lý Người dùng',
            icon: (
                <svg viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            ),
            links: [
                { to: ROUTES.ADMIN_USERS, label: 'Danh sách tài khoản' },
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
                { to: ROUTES.ADMIN_GENRES, label: 'Quản lý Thể loại' },
                { to: ROUTES.ADMIN_MOVIES, label: 'Quản lý Phim' },
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
                { to: ROUTES.ADMIN_ROOMS, label: 'Quản lý Phòng chiếu' },
                { to: ROUTES.ADMIN_SURCHARGES, label: 'Quản lý Phụ phí' },
                { to: ROUTES.ADMIN_SHOWTIMES, label: 'Quản lý Suất chiếu' },
            ],
        },
        {
            key: 'stats',
            label: 'Thống kê',
            icon: (
                <svg viewBox="0 0 20 20" fill="none">
                    <path d="M3 17h14M5 13l3-3 3 3 4-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="13" y="4" width="4" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="8" y="8" width="4" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="3" y="11" width="4" height="2" rx="1" stroke="currentColor" strokeWidth="1.5" />
                </svg>
            ),
            links: [
                { to: ROUTES.ADMIN_STATS_BOOKINGS, label: 'Thống kê Lượt đặt vé & Doanh thu' },
                { to: ROUTES.ADMIN_STATS_SHOWTIMES, label: 'Thống kê Suất chiếu' },
            ],
        },
    ];

    const toggleMenu = (key) => setOpenMenu(openMenu === key ? null : key);

    return (
        <div className="admin-container">
            {/* Top navbar */}
            <nav className="admin-navbar">
                {/* Mobile menu toggle button */}
                <button 
                     className={`admin-mobile-toggle ${mobileOpen ? 'open' : ''}`}
                     onClick={() => setMobileOpen(!mobileOpen)}
                     aria-label="Toggle navigation"
                >
                    {mobileOpen ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    )}
                </button>

                <Link to={ROUTES.ADMIN_DASHBOARD} className="admin-nav-logo" onClick={() => setMobileOpen(false)}>
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
                    <button onClick={handleLogout} className="admin-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        Đăng xuất
                    </button>
                    <Link to={ROUTES.ADMIN_PROFILE} className="admin-nav-avatar" title="Xem hồ sơ" onClick={() => setMobileOpen(false)}>
                        {currentUser?.fullName?.charAt(0)?.toUpperCase() || 'A'}
                    </Link>
                </div>
            </nav>

            {/* Mobile Drawer (Outside Navbar to avoid stacking context issues due to backdrop-filter) */}
            <div className={`admin-mobile-drawer ${mobileOpen ? 'open' : ''}`}>
                {navItems.map((item) => (
                    <div key={item.key} className="admin-mobile-menu-group">
                        <button
                            className={`admin-mobile-menu-btn ${item.links.some(l => location.pathname.startsWith(l.to)) ? 'active' : ''}`}
                            onClick={() => toggleMenu(item.key)}
                        >
                            <span className="admin-mobile-menu-btn-content">
                                {item.icon}
                                {item.label}
                            </span>
                            <svg className={`chevron ${openMenu === item.key ? 'open' : ''}`} viewBox="0 0 12 12" fill="none">
                                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                        {openMenu === item.key && (
                            <div className="admin-mobile-submenu">
                                {item.links.map((l) => (
                                    <Link
                                        key={l.to}
                                        to={l.to}
                                        className={`admin-mobile-submenu-item ${location.pathname === l.to ? 'active' : ''}`}
                                        onClick={() => {
                                            setOpenMenu(null);
                                            setMobileOpen(false);
                                        }}
                                    >
                                        {l.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Overlay to close dropdown / mobile menu */}
            {openMenu && <div className="admin-overlay" onClick={() => setOpenMenu(null)} />}
            {mobileOpen && <div className="admin-mobile-overlay" onClick={() => setMobileOpen(false)} />}

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
