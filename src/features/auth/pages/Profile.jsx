import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../../../context/AuthContext';
import UserApi from '../services/user.api';
import ProfileForm from '../components/ProfileForm/ProfileForm';
import ChangePasswordForm from '../components/ChangePasswordForm/ChangePasswordForm';
import './Profile.css';

const Profile = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdateProfile = async (data) => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await UserApi.updateProfile(data);
      setCurrentUser({ ...currentUser, ...res.data.data });
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (data) => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await UserApi.changePassword(data);
      setMessage('Password changed successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Password change failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <h1 className="profile-page__title">My Account</h1>

      <div className="profile-page__tabs">
        <button
          className={`profile-page__tab ${activeTab === 'profile' ? 'profile-page__tab--active' : ''}`}
          onClick={() => { setActiveTab('profile'); setMessage(''); setError(''); }}
        >
          Edit Profile
        </button>
        <button
          className={`profile-page__tab ${activeTab === 'password' ? 'profile-page__tab--active' : ''}`}
          onClick={() => { setActiveTab('password'); setMessage(''); setError(''); }}
        >
          Change Password
        </button>
      </div>

      {message && <div className="profile-page__success">{message}</div>}
      {error && <div className="profile-page__error">{error}</div>}

      <div className="profile-page__content">
        {activeTab === 'profile' && (
          <ProfileForm
            user={currentUser}
            onSubmit={handleUpdateProfile}
            loading={loading}
          />
        )}
        {activeTab === 'password' && (
          <ChangePasswordForm
            onSubmit={handleChangePassword}
            loading={loading}
            error=""
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
