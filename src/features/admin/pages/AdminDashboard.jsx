import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../../context/AuthContext';
import './AdminDashboard.css';

const cards = [
  {
    to: '/admin/users',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4 21c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    title: 'Quản lý Tài khoản',
    desc: 'Tra cứu, phân quyền, khóa/mở tài khoản người dùng',
    color: 'var(--blue)',
    bg: 'rgba(78,143,255,0.1)',
  },
  {
    to: '/admin/genres',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M4 6h16M4 10h12M4 14h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    title: 'Quản lý Thể loại',
    desc: 'Thêm, sửa, xóa thể loại phim trong hệ thống',
    color: 'var(--gold)',
    bg: 'var(--gold-dim)',
  },
  {
    to: '/admin/movies',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="20" height="15" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 10l6 2.5-6 2.5V10z" fill="currentColor" />
        <path d="M2 10h3M2 14h3M19 10h3M19 14h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    title: 'Quản lý Phim',
    desc: 'Thêm phim mới, chỉnh sửa thông tin, quản lý trạng thái',
    color: '#b884ff',
    bg: 'rgba(184,132,255,0.1)',
  },
  {
    to: '/admin/rooms',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M7 6V4M17 6V4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M7 10h2M11 10h2M15 10h2M7 14h2M11 14h2M15 14h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    title: 'Quản lý Phòng chiếu',
    desc: 'Tạo phòng mới, tự động sinh sơ đồ ghế ngồi',
    color: 'var(--green)',
    bg: 'rgba(46,200,122,0.1)',
  },
  {
    to: '/admin/showtimes',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 9h18M8 2v3M16 2v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M7 13h2M11 13h2M15 13h2M7 17h2M11 17h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    title: 'Quản lý Suất chiếu',
    desc: 'Lên lịch suất chiếu mới, chỉnh sửa, hủy suất chiếu',
    color: '#ff8f4e',
    bg: 'rgba(255,143,78,0.1)',
  },
];

const AdminDashboard = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-welcome">
        <div>
          <h1 className="dashboard-title">Quản trị viên</h1>
          <p className="dashboard-subtitle">Trang quản trị CineBook</p>
        </div>
      </div>

      <div className="dashboard-cards">
        {cards.map((c) => (
          <Link to={c.to} key={c.to} className="dashboard-card">
            <div className="dashboard-card-icon" style={{ background: c.bg, color: c.color }}>
              {c.icon}
            </div>
            <div>
              <div className="dashboard-card-title">{c.title}</div>
              <div className="dashboard-card-desc">{c.desc}</div>
            </div>
            <svg className="dashboard-card-arrow" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
