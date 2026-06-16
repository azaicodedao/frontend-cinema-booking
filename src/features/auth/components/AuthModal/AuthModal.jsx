import React, { useState, useContext, useEffect } from 'react';
import Modal from '../../../../components/common/Modal/Modal';
import LoginForm from '../LoginForm/LoginForm';
import RegisterForm from '../RegisterForm/RegisterForm';
import AuthContext from '../../../../context/AuthContext';
import './AuthModal.css';

/**
 * AuthModal - Hộp thoại xác thực đa năng.
 * Cho phép người dùng Đăng nhập hoặc Đăng ký mà không cần chuyển trang.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Trạng thái mở của modal.
 * @param {Function} props.onClose - Hàm đóng modal.
 * @param {string} props.initialMode - Chế độ ban đầu ('login' hoặc 'register').
 */
const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
    const [mode, setMode] = useState(initialMode);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useContext(AuthContext);

    useEffect(() => {
        setMode(initialMode);
        setError('');
    }, [initialMode, isOpen]);

    // Reset lỗi khi chuyển đổi giữa Đăng nhập và Đăng ký
    const toggleMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        setError('');
    };

    const handleLogin = async (email, password) => {
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            onClose(); // Đóng modal sau khi đăng nhập thành công
        } catch (err) {
            setError(err.response?.data?.message || 'Email hoặc mật khẩu không chính xác.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (fullName, email, password, confirmPassword) => {
        setLoading(true);
        setError('');
        try {
            await register(fullName, email, password, confirmPassword);
            setMode('login'); // Chuyển sang đăng nhập sau khi đăng ký thành công
            // Hoặc có thể tự động đăng nhập luôn tùy vào logic của register trong AuthContext
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể đăng ký tài khoản. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={mode === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'}
            size="small"
        >
            <div className="auth-modal-content">
                {mode === 'login' ? (
                    <>
                        <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
                        <p className="auth-modal-switch">
                            Chưa có tài khoản? <span onClick={toggleMode}>Đăng ký ngay</span>
                        </p>
                    </>
                ) : (
                    <>
                        <RegisterForm onSubmit={handleRegister} loading={loading} error={error} />
                        <p className="auth-modal-switch">
                            Đã có tài khoản? <span onClick={toggleMode}>Đăng nhập ngay</span>
                        </p>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default AuthModal;
