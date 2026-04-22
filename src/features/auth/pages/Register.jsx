import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../../context/AuthContext';
import './Login.css';

/**
 * Giao diện chính của Trang Đăng ký người dùng mới (Register Page).
 * Đây là phần bọc (Wrap) hiển thị nền web và Form mẫu Đăng Ký phục vụ cho App.
 * Gọi ra component con `RegisterContext` để kết nối server.
 *
 * @returns {JSX.Element} Toàn bộ trang đăng ký HTML.
 */
const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    /**
     * Bắt lấy hành động khi ấn nút 'Đăng ký' do Form đẩy lên.
     * Chặn form reset trang màn hình (`e.preventDefault()`), gọi Logic xác thực cục bộ.
     * 
     * @param {React.FormEvent} e - Sự kiện form web
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fullName || !email || !password) {
            setError('Vui lòng nhập đầy đủ thông tin.');
            return;
        }
        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }
        setLoading(true);
        setError('');
        try {
             await register(fullName, email, password);
             navigate('/login', { state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' } });
         } catch (err) {
            console.error('Registration error:', err);
            const serverMessage = err.response?.data?.message || err.message;
            setError(serverMessage || 'Đăng ký thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="awrap">
            <div className="acard">
                <h1 className="ahead">Tạo tài khoản mới</h1>
                <p className="asub">Đăng ký để bắt đầu đặt vé điện tử</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="ff">
                        <label className="fl">Họ và tên</label>
                        <input
                            className="fi"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Nguyễn Văn A"
                            required
                        />
                    </div>
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
                        <div className="fhint" style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '5px' }}>
                            Email không thể thay đổi sau khi đăng ký
                        </div>
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
                        <div className="fhint" style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '5px' }}>
                            Tối thiểu 6 ký tự
                        </div>
                    </div>
                    <button
                        className="btn-primary"
                        type="submit"
                        disabled={loading}
                        style={{ marginTop: '10px' }}
                    >
                        {loading ? 'Đang xử lý...' : 'Đăng ký'}
                    </button>
                </form>

                <div className="alink">
                    Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
