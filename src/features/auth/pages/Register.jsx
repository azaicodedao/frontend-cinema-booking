import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../../context/AuthContext';
import Input from '../../../components/common/Input/Input';
import './Login.css';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) { setError('Vui lòng nhập đầy đủ thông tin.'); return; }
    if (password.length < 8) { setError('Mật khẩu phải có ít nhất 8 ký tự.'); return; }
    setLoading(true);
    setError('');
    try {
      await register(fullName, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__card">
        <h1 className="auth-page__title">Tạo tài khoản mới</h1>
        <p className="auth-page__subtitle">Đăng ký để bắt đầu đặt vé điện tử</p>
        {error && <div className="auth-page__error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <Input label="Họ và tên" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nguyễn Văn A" required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" hint="Email không thể thay đổi sau khi đăng ký" required />
          <Input label="Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" hint="Tối thiểu 8 ký tự, có ít nhất 1 hoa, 1 thường, 1 số" required />
          <button className="btn btn--primary btn--large btn--full-width" type="submit" disabled={loading} style={{ marginTop: 16 }}>
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>
        <div className="auth-page__footer">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
