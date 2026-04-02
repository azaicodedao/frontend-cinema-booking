import React, { useState } from 'react';
import Input from '../../../../components/common/Input/Input';
import Button from '../../../../components/common/Button/Button';
import './RegisterForm.css';

const RegisterForm = ({ onSubmit, loading = false, error = '' }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email format';
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = 'Password must contain at least 1 uppercase letter';
    } else if (!/[a-z]/.test(form.password)) {
      newErrors.password = 'Password must contain at least 1 lowercase letter';
    } else if (!/[0-9]/.test(form.password)) {
      newErrors.password = 'Password must contain at least 1 number';
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form.fullName, form.email, form.password);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit} noValidate>
      <div className="register-form__header">
        <h1 className="register-form__title">Create Account</h1>
        <p className="register-form__subtitle">Join us and start booking</p>
      </div>

      {error && <div className="register-form__error-banner">{error}</div>}

      <Input
        label="Full Name"
        name="fullName"
        value={form.fullName}
        onChange={handleChange}
        placeholder="Enter your full name"
        error={errors.fullName}
        required
      />

      <Input
        label="Email"
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Enter your email"
        error={errors.email}
        required
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Min 8 chars, 1 uppercase, 1 number"
        error={errors.password}
        required
      />

      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={form.confirmPassword}
        onChange={handleChange}
        placeholder="Re-enter your password"
        error={errors.confirmPassword}
        required
      />

      <Button type="submit" fullWidth loading={loading} size="large">
        Create Account
      </Button>
    </form>
  );
};

export default RegisterForm;
