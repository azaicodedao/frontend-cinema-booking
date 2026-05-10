import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../../../context/AuthContext';
import './Login.css';

/**
 * Component trang đăng nhập (Login Page).
 * Cho phép người dùng điền thông tin email và mật khẩu để xác thực tài khoản.
 */
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Lấy đường dẫn trước đó người dùng định truy cập, mặc định là trang chủ
    const from = location.state?.from || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Vui lòng nhập đầy đủ thông tin.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const userData = await login(email, password);
            
            // Ép Admin vào Dashboard, các role khác về trang trước đó
            const role = userData?.role || userData?.user?.role;
            if (role === 'ADMIN') {
                navigate('/admin', { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Email hoặc mật khẩu không chính xác.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="awrap">
            <div className="acard">
                <h1 className="ahead">Chào mừng trở lại</h1>
                <p className="asub">Đăng nhập để tiếp tục đặt vé</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="ff">
                        <label className="fl">Email</label>
                        <input
                            className="fi"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@example.com"
                            required
                        />
                    </div>
                    <div className="ff">
                        <label className="fl">Mật khẩu</label>
                        <input
                            className="fi"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        className="btn-cta"
                        type="submit"
                        disabled={loading}
                        style={{ marginTop: '10px', width: '100%' }}
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>

                <div className="alink">
                    Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
