import React, { useState } from 'react';
import Input from '../../../../components/common/Input/Input';
import Button from '../../../../components/common/Button/Button';
import './LoginForm.css';

const LoginForm = ({ onSubmit, loading = false, error = '' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(email, password);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <div className="login-form__header">
        <h1 className="login-form__title">Welcome Back</h1>
        <p className="login-form__subtitle">Sign in to your account</p>
      </div>

      {error && <div className="login-form__error-banner">{error}</div>}

      <Input
        label="Email"
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        error={errors.email}
        required
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        error={errors.password}
        required
      />

      <Button type="submit" fullWidth loading={loading} size="large">
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;
