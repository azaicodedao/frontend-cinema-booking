import React, { useState } from 'react';
import Input from '../../../../components/common/Input/Input';
import Button from '../../../../components/common/Button/Button';
import './ProfileForm.css';

const ProfileForm = ({ user, onSubmit, loading = false }) => {
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Full name is required');
      return;
    }
    setError('');
    onSubmit({ fullName });
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <Input
        label="Email"
        type="email"
        name="email"
        value={user?.email || ''}
        readOnly
        disabled
      />
      <Input
        label="Full Name"
        name="fullName"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Your full name"
        error={error}
        required
      />
      <Button type="submit" loading={loading}>
        Save Changes
      </Button>
    </form>
  );
};

export default ProfileForm;
