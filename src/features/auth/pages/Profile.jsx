import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../../../context/AuthContext';
import UserApi from '../services/user.api';
import TicketApi from '../../user/services/ticket.api';
import ProfileForm from '../components/ProfileForm/ProfileForm';
import ChangePasswordForm from '../components/ChangePasswordForm/ChangePasswordForm';
import { PATH_GENERATORS } from '../../../config/routes';
import './Profile.css';

/**
 * Trang Trang cá nhân của người dùng (Profile Page).
 * Bao gồm các tab/phân mục: Thông tin tài khoản, Đổi Mật Khẩu, Lịch sử Mua vé.
 * Tích hợp điều hướng dựa theo kết quả API lấy về.
 *
 * @returns {JSX.Element} Trang cài đặt cho người dùng (User Dashboard).
 */
const Profile = () => {
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'info'); // info, password, history
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [bookings, setBookings] = useState([]);
    const [fetchingHistory, setFetchingHistory] = useState(false);

    const messageTimeoutRef = useRef(null);
    const errorTimeoutRef = useRef(null);

    const clearMessages = () => {
        setMessage('');
        setError('');
        if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
        if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    };

    const showSuccess = (msg) => {
        clearMessages();
        setMessage(msg);
        messageTimeoutRef.current = setTimeout(() => {
            setMessage('');
        }, 3000);
    };

    const showError = (msg) => {
        clearMessages();
        setError(msg);
        errorTimeoutRef.current = setTimeout(() => {
            setError('');
        }, 3000);
    };

    useEffect(() => {
        return () => {
            if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
            if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
        };
    }, []);

    /**
     * Hàm tự động chạy 1 LẦN duy nhất khi người dùng lúc nào mở trang Trang cá nhân lên.
     * Ở đây, nó sẽ cập nhật (Refresh) toàn bộ Dữ liệu từ cơ sở dữ liệu để chống lỗi dữ liệu cũ.
     */
    useEffect(() => {
        // Luôn lấy thông tin mới nhất từ server khi vào trang Profile
        const loadProfile = async () => {
            try {
                const res = await UserApi.getProfile();
                // res.data có thể là RestResponse wrapper chứa thông tin user ở thuộc tính .data
                const userData = res.data?.data || res.data;
                setCurrentUser(prev => ({ ...prev, ...userData }));
            } catch (err) {
                console.error("Failed to load latest profile:", err);
            }
        };

        loadProfile();
        clearMessages();

        if (activeTab === 'history') {
            fetchBookingHistory();
        }
    }, [activeTab]);

    /**
     * Đồng bộ Tab khi location state thay đổi (trường hợp user đang ở Profile nhưng bấm vào link điều hướng lại)
     */
    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
            // Xóa state để tránh việc refresh trang lại nhảy về tab đó
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    /** 
     * Gọi API Lấy chi tiết toàn bộ các lần mua vé cũ.
     * Sắp xếp ưu tiên các vé mới mua lên đầu.
     */
    const fetchBookingHistory = async () => {
        setFetchingHistory(true);
        try {
            const res = await TicketApi.getMyBookings();
            const data = res.data?.data || res.data || res;
            const sorted = (Array.isArray(data) ? data : []).sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setBookings(sorted);
        } catch (err) {
            console.error("Failed to fetch history:", err);
        } finally {
            setFetchingHistory(false);
        }
    };

    const handleUpdateProfile = async (data) => {
        setLoading(true);
        clearMessages();
        try {
            const res = await UserApi.updateProfile(data);
            const userData = res.data?.data || res.data;
            setCurrentUser({ ...currentUser, ...userData });
            showSuccess('Cập nhật hồ sơ thành công!');
        } catch (err) {
            showError(err.response?.data?.message || 'Cập nhật thất bại.');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (data) => {
        setLoading(true);
        clearMessages();
        try {
            await UserApi.changePassword(data);
            showSuccess('Đổi mật khẩu thành công!');
        } catch (err) {
            showError(err.response?.data?.message || 'Đổi mật khẩu thất bại.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'CONFIRMED': return 'ĐÃ XÁC NHẬN';
            case 'CANCELLED': return 'ĐÃ HỦY';
            case 'PENDING': return 'CHỜ THANH TOÁN';
            default: return status;
        }
    };

    return (
        <div className="profile-container screen">
            <div className="inner">
                <div className="ptitle">Hồ sơ cá nhân</div>
                <div className="psub">Quản lý thông tin tài khoản và lịch sử giao dịch</div>

                <div className="ttabs">
                    <div
                        className={`ttab ${activeTab === 'info' ? 'on' : ''}`}
                        onClick={() => setActiveTab('info')}
                    >
                        Thông tin tài khoản
                    </div>
                    <div
                        className={`ttab ${activeTab === 'history' ? 'on' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        Lịch sử mua vé
                    </div>
                    <div
                        className={`ttab ${activeTab === 'password' ? 'on' : ''}`}
                        onClick={() => setActiveTab('password')}
                    >
                        Đổi mật khẩu
                    </div>
                </div>

                {message && <div className="profile-msg success">{message}</div>}
                {error && <div className="profile-msg error">{error}</div>}

                <div className="tab-content" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                    {activeTab === 'info' && (
                        <div className="pgrid">
                            <div className="psec full">
                                <div className="pavrow">
                                    <div className="pav" style={{ overflow: 'hidden' }}>
                                        {(currentUser?.avatarUrl || currentUser?.user?.avatarUrl) ? (
                                            <img src={currentUser?.avatarUrl || currentUser?.user?.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            (currentUser?.fullName || currentUser?.user?.fullName)?.charAt(0)?.toUpperCase() || 'U'
                                        )}
                                    </div>
                                    <div>
                                        <div className="pname">{currentUser?.fullName || currentUser?.user?.fullName}</div>
                                        <div className="pmeta">Customer · Thành viên từ {new Date((currentUser?.createdAt || currentUser?.user?.createdAt) || Date.now()).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })}</div>
                                    </div>
                                </div>
                                <div style={{ maxWidth: '600px' }}>
                                    <ProfileForm
                                        user={currentUser}
                                        onSubmit={handleUpdateProfile}
                                        onResetMessages={clearMessages}
                                        loading={loading}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'password' && (
                        <div className="psec" style={{ maxWidth: '500px' }}>
                            <div className="h3-title">Đổi mật khẩu</div>
                            <div className="psub" style={{ marginBottom: '20px' }}>Cập nhật mật khẩu để bảo vệ tài khoản của bạn</div>
                            <ChangePasswordForm
                                onSubmit={handleChangePassword}
                                onResetMessages={clearMessages}
                                loading={loading}
                            />
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="history-list" style={{ maxWidth: '800px' }}>
                            {fetchingHistory ? (
                                <div className="hloading">Đang tải lịch sử giao dịch...</div>
                            ) : bookings.length === 0 ? (
                                <div className="hempty">Bạn chưa có giao dịch nào gần đây.</div>
                            ) : (
                                bookings.map(booking => (
                                    <div
                                        key={booking.bookingId}
                                        className="hit"
                                        onClick={() => {
                                            if (booking.status === 'PENDING') {
                                                navigate(PATH_GENERATORS.pay(booking.bookingId));
                                            } else {
                                                navigate(PATH_GENERATORS.tickets(booking.bookingId));
                                            }
                                        }}
                                    >
                                        <div>
                                            <div className="htitle">{booking.movieTitle}</div>
                                            <div className="hmeta">
                                                <span>{new Date(booking.showtimeStart).toLocaleDateString('vi-VN')} · {new Date(booking.showtimeStart).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                                <span>{booking.numberOfTickets} vé · {booking.roomName}</span>
                                                <span>Ghế {booking.seatLabels?.join(', ')}</span>
                                            </div>
                                        </div>
                                        <div className="hit-status-col">
                                            <span className={`status-badge ${booking.status === 'CONFIRMED' ? 'sconf' : booking.status === 'CANCELLED' ? 'scanc' : 'spen'}`}>
                                                {getStatusText(booking.status)}
                                            </span>
                                            <div className="hprice">{booking.totalPrice?.toLocaleString()} đ</div>

                                            {booking.hasReviewed ? (
                                                <span className="reviewed-badge">✓ Đã đánh giá</span>
                                            ) : booking.status === 'CONFIRMED' ? (
                                                <button
                                                    className="btn-sec review-btn-small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(PATH_GENERATORS.review(booking.bookingId));
                                                    }}
                                                >
                                                    ⭐ Đánh giá phim
                                                </button>
                                            ) : booking.status === 'PENDING' && (
                                                <button
                                                    className="btn-sec review-btn-small"
                                                    style={{ borderColor: '#2980b9', color: '#2980b9' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(PATH_GENERATORS.pay(booking.bookingId));
                                                    }}
                                                >
                                                    💳 Tiếp tục thanh toán
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
