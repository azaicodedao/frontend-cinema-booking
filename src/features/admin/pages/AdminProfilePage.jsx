import React, { useState, useContext } from 'react';
import AuthContext from '../../../context/AuthContext';
import UserApi from '../../auth/services/user.api';
import ProfileForm from '../../auth/components/ProfileForm/ProfileForm';
import ChangePasswordForm from '../../auth/components/ChangePasswordForm/ChangePasswordForm';
import '../../../layouts/AdminLayout.css';

const AdminProfilePage = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const clearMessages = () => { setMessage(''); setError(''); };

  const handleUpdateProfile = async (data) => {
    setLoading(true);
    clearMessages();
    try {
      const res = await UserApi.updateProfile(data);
      setCurrentUser({ ...currentUser, ...res.data.data });
      setMessage('Cập nhật hồ sơ thành công!');
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (data) => {
    setLoading(true);
    clearMessages();
    try {
      await UserApi.changePassword(data);
      setMessage('Đổi mật khẩu thành công!');
    } catch (err) {
      setError(err.response?.data?.message || 'Đổi mật khẩu thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Hồ sơ cá nhân</h1>
      </div>

      <div style={{ maxWidth: 600 }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--bg2)', padding: 4, borderRadius: 10, width: 'fit-content' }}>
          {[['profile', 'Thông tin cá nhân'], ['password', 'Đổi mật khẩu']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); clearMessages(); }}
              style={{
                padding: '8px 18px', borderRadius: 7, border: 'none', fontSize: 13, fontWeight: 500,
                fontFamily: 'var(--fb)', cursor: 'pointer', transition: 'all 0.14s',
                background: activeTab === key ? 'var(--bg4)' : 'transparent',
                color: activeTab === key ? 'var(--t1)' : 'var(--t2)',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {message && <div className="admin-alert admin-alert-success">{message}</div>}
        {error && <div className="admin-alert admin-alert-error">{error}</div>}

        <div style={{ background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: 28 }}>
          {activeTab === 'profile' ? (
            <ProfileForm currentUser={currentUser} onSubmit={handleUpdateProfile} loading={loading} />
          ) : (
            <ChangePasswordForm onSubmit={handleChangePassword} loading={loading} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
