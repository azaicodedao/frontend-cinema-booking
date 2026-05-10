import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../../../context/AuthContext';
import './Login.css';

/**
 * Trang Đăng nhập (Login Page).
 * Cung cấp giao diện xác thực người dùng với các hiệu ứng Premium.
 * Hỗ trợ điều hướng thông minh dựa trên vai trò (Role) sau khi đăng nhập thành công.
 *
 * @returns {JSX.Element} Giao diện trang đăng nhập chuẩn Premium.
 */
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Lưu lại trang đích trước đó (phòng trường hợp bị redirect từ trang yêu cầu đăng nhập)
    const from = location.state?.from?.pathname || '/';

    /**
     * Xử lý gửi form đăng nhập.
     * @param {React.FormEvent} e - Sự kiện Submit của Form.
     */
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
            
            // Xử lý điều hướng dựa trên Role
            // Ưu tiên chuyển Admin về Dashboard
            const userRole = userData?.role || 'CUSTOMER';
            if (userRole === 'ADMIN') {
                navigate('/admin', { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        } catch (err) {
            console.error('[Login] Error during sign in:', err);
            // Lấy thông báo lỗi từ server nếu có, ngược lại dùng tin nhắn mặc định
            const errorMsg = err.response?.data?.message || 'Email hoặc mật khẩu không chính xác.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="awrap">
            <div className="acard">
                {/* Nút đóng cho phép người dùng quay lại trang trước đó */}
                <button 
                    className="aclose" 
                    onClick={() => navigate(-1)} 
                    title="Quay lại"
                >
                    ×
                </button>

                <div className="aheader-group">
                    <h1 className="ahead">Chào mừng trở lại</h1>
                    <p className="asub">Đăng nhập để tận hưởng trải nghiệm điện ảnh tuyệt vời nhất</p>
                </div>

                {error && (
                    <div className="auth-error animate-shake">
                        <i className="fas fa-exclamation-circle"></i>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="ff">
                        <label className="fl" htmlFor="login-email">Email</label>
                        <input
                            id="login-email"
                            className="fi"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@cinema.com"
                            required
                        />
                    </div>
                    
                    <div className="ff">
                        <label className="fl" htmlFor="login-password">Mật khẩu</label>
                        <input
                            id="login-password"
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
                    >
                        {loading ? (
                            <span className="loading-content">
                                <i className="fas fa-circle-notch fa-spin"></i> Đang xử lý...
                            </span>
                        ) : 'Đăng nhập'}
                    </button>
                </form>

                <div className="alink">
                    Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
