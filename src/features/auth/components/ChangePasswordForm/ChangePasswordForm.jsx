import React, { useState } from 'react';
import Input from '../../../../components/common/Input/Input';
import Button from '../../../../components/common/Button/Button';
import './ChangePasswordForm.css';

const ChangePasswordForm = ({ onSubmit, loading = false, error = '' }) => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!form.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (form.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (form.newPassword === form.currentPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }
    if (form.newPassword !== form.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
    }
  };

  return (
    <form className="change-password-form" onSubmit={handleSubmit} noValidate>
      {error && <div className="change-password-form__error-banner">{error}</div>}

      <Input
        label="Current Password"
        type="password"
        name="currentPassword"
        value={form.currentPassword}
        onChange={handleChange}
        placeholder="Enter current password"
        error={errors.currentPassword}
        required
      />

      <Input
        label="New Password"
        type="password"
        name="newPassword"
        value={form.newPassword}
        onChange={handleChange}
        placeholder="Enter new password"
        error={errors.newPassword}
        required
      />

      <Input
        label="Confirm New Password"
        type="password"
        name="confirmNewPassword"
        value={form.confirmNewPassword}
        onChange={handleChange}
        placeholder="Re-enter new password"
        error={errors.confirmNewPassword}
        required
      />

      <Button type="submit" loading={loading}>
        Change Password
      </Button>
    </form>
  );
};

export default ChangePasswordForm;
