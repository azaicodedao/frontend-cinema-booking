import React, { useState, useContext, useEffect, useRef } from 'react';
import AuthContext from '../../../context/AuthContext';
import UserApi from '../../auth/services/user.api';
import ProfileForm from '../../auth/components/ProfileForm/ProfileForm';
import ChangePasswordForm from '../../auth/components/ChangePasswordForm/ChangePasswordForm';
import '../../../layouts/AdminLayout.css';

/**
 * Trang Hồ sơ cá nhân dành cho Quản trị viên (Admin Profile Page).
 * Đã được đồng bộ hóa giao diện và tính năng với trang Hồ sơ khách hàng.
 */
const AdminProfilePage = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('info'); // 'info' hoặc 'password'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const messageTimeoutRef = useRef(null);
  const errorTimeoutRef = useRef(null);

  const clearMessages = () => {
    setMessage('');
    setError('');
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
  };

  const showSuccess = (msg) => {
    clearMessages();
    setMessage(msg);
    messageTimeoutRef.current = setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const showError = (msg) => {
    clearMessages();
    setError(msg);
    errorTimeoutRef.current = setTimeout(() => {
      setError('');
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    };
  }, []);

  /**
   * Tự động lấy dữ liệu hồ sơ mới nhất từ server khi vào trang.
   */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await UserApi.getProfile();
        const userData = res.data?.data || res.data;
        setCurrentUser(prev => ({ ...prev, ...userData }));
      } catch (err) {
        console.error("Failed to load latest admin profile:", err);
      }
    };
    loadProfile();
    clearMessages();
  }, []);

  const handleUpdateProfile = async (data) => {
    setLoading(true);
    clearMessages();
    try {
      const res = await UserApi.updateProfile(data);
      const userData = res.data?.data || res.data;
      setCurrentUser({ ...currentUser, ...userData });
      showSuccess('Cập nhật hồ sơ thành công!');
    } catch (err) {
      showError(err.response?.data?.message || 'Cập nhật thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (data) => {
    setLoading(true);
    clearMessages();
    try {
      await UserApi.changePassword(data);
      showSuccess('Đổi mật khẩu thành công!');
    } catch (err) {
      showError(err.response?.data?.message || 'Đổi mật khẩu thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const userDisplayName = currentUser?.fullName || currentUser?.user?.fullName || 'Administrator';
  const userAvatar = currentUser?.avatarUrl || currentUser?.user?.avatarUrl;
  const joinDate = new Date((currentUser?.createdAt || currentUser?.user?.createdAt) || Date.now())
    .toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' });

  return (
    <div className="admin-profile-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Hồ sơ cá nhân</h1>
      </div>

      <div style={{ maxWidth: '800px' }}>
        {/* Tab Navigation - Đồng bộ style với Admin Layout */}
        <div className="admin-filters" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 8, background: 'var(--bg2)', padding: 4, borderRadius: 10, width: 'fit-content' }}>
            <button
              onClick={() => { setActiveTab('info'); clearMessages(); }}
              style={{
                padding: '8px 20px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
                background: activeTab === 'info' ? 'var(--gold)' : 'transparent',
                color: activeTab === 'info' ? '#000' : 'var(--t2)',
              }}
            >
              Thông tin tài khoản
            </button>
            <button
              onClick={() => { setActiveTab('password'); clearMessages(); }}
              style={{
                padding: '8px 20px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
                background: activeTab === 'password' ? 'var(--gold)' : 'transparent',
                color: activeTab === 'password' ? '#000' : 'var(--t2)',
              }}
            >
              Đổi mật khẩu
            </button>
          </div>
        </div>

        {message && <div className="admin-alert admin-alert-success">{message}</div>}
        {error && <div className="admin-alert admin-alert-error">{error}</div>}

        <div style={{
          background: 'var(--bg1)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          animation: 'fadeIn 0.4s ease-out'
        }}>
          {activeTab === 'info' && (
            <>
              {/* Avatar & Info Row - Đồng bộ với Profile khách hàng */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%', background: 'var(--gold-dim)',
                  border: '2px solid var(--gold)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 32, fontWeight: 800, color: 'var(--gold)',
                  overflow: 'hidden', boxShadow: '0 0 15px rgba(232, 160, 32, 0.2)'
                }}>
                  {userAvatar ? (
                    <img src={userAvatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    userDisplayName.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>{userDisplayName}</div>
                  <div style={{ fontSize: 13, color: 'var(--t3)' }}>
                    <span className="badge badge-admin" style={{ marginRight: 10 }}>Administrator</span>
                    Thành viên từ {joinDate}
                  </div>
                </div>
              </div>

              <div style={{ maxWidth: '600px' }}>
                <ProfileForm
                  user={currentUser}
                  onSubmit={handleUpdateProfile}
                  onResetMessages={clearMessages}
                  loading={loading}
                />
              </div>
            </>
          )}

          {activeTab === 'password' && (
            <div style={{ maxWidth: '500px' }}>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--t1)', marginBottom: 8 }}>Đổi mật khẩu</h2>
                <p style={{ fontSize: 13, color: 'var(--t2)' }}>Cập nhật mật khẩu để bảo mật tài khoản quản trị</p>
              </div>
              <ChangePasswordForm
                onSubmit={handleChangePassword}
                onResetMessages={clearMessages}
                loading={loading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
