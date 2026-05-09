import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TicketApi from '../services/ticket.api';
import ReviewApi from '../services/review.api';
import Spinner from '../../../components/common/Spinner/Spinner';
import ViewReviewModal from '../../../components/common/ViewReviewModal/ViewReviewModal';
import './TicketView.css';

/**
 * Màn hình Tổng kết một Phiên giao dịch (Ticket View Page).
 * Đóng vai trò 2 trong 1 (Chuyển đổi giao diện qua biến state `showTicket`):
 * - State False: Hiển thị Tổng quan Lệnh Vé (chưa dùng QR) - Nút chuyển tiếp.
 * - State True: Hiển thị cụ thể Vé điện tử có Mã QR Code để đem vào rạp.
 *
 * @returns {JSX.Element} Giao diện Chi tiết vé điện tử / Hóa đơn điện tử.
 */
const TicketView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [activeTicketIdx, setActiveTicketIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showTicket, setShowTicket] = useState(false); // UC12b vs UC11 toggle
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewData, setReviewData] = useState(null);

    useEffect(() => {
        TicketApi.getBookingById(id)
            .then((res) => {
                setBooking(res.data);
            })
            .catch((err) => {
                console.error("Failed to fetch booking details", err);
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="p-loading"><Spinner size="large" /></div>;
    if (!booking) return <div className="p-error">Không tìm thấy thông tin giao dịch.</div>;

    const handleViewReview = async () => {
        if (!reviewData) {
            try {
                const res = await ReviewApi.getReviewByBooking(id);
                // Extract unwrapped data if RestResponse
                setReviewData(res?.data || res); 
            } catch (err) {
                console.error("Failed to load review", err);
            }
        }
        setReviewModalOpen(true);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    // UC12b: Transaction Detail Summary
    const renderSummary = () => (
        <div className="inner">
            <button className="back" onClick={() => navigate('/profile', { state: { activeTab: 'history' } })}>← Lịch sử mua vé</button>
            <div className="ptitle">Chi tiết giao dịch</div>
            
            <div className="ocard" style={{ maxWidth: '580px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '13px' }}>
                    <h3 style={{ margin: 0 }}>Thông tin giao dịch</h3>
                    <span className={`status-badge ${booking.status === 'CONFIRMED' ? 'sconf' : booking.status === 'CANCELLED' ? 'scanc' : 'spen'}`}>
                        {booking.status}
                    </span>
                </div>
                <div className="orow">
                    <span className="c2">Mã đặt vé</span>
                    <span style={{ fontFamily: 'var(--fh)', fontSize: '12px', fontWeight: 600 }}>#{booking.bookingCode}</span>
                </div>
                <div className="orow">
                    <span className="c2">Phim</span>
                    <span style={{ fontWeight: 600 }}>{booking.movieTitle}</span>
                </div>
                <div className="orow">
                    <span className="c2">Thời gian</span>
                    <span>{formatDate(booking.showtimeStart)} · {formatTime(booking.showtimeStart)}</span>
                </div>
                <div className="orow">
                    <span className="c2">Phòng chiếu</span>
                    <span style={{ fontWeight: 600 }}>{booking.roomName} <span style={{fontWeight: 400, color: 'var(--t2)', fontSize: '13px'}}>({booking.roomType})</span></span>
                </div>
                <div className="orow">
                    <span className="c2">Ghế</span>
                    <span>{booking.seatLabels?.join(', ')}</span>
                </div>
                <div className="orow tot">
                    <span>Tổng tiền</span>
                    <span className="pb">{booking.totalPrice?.toLocaleString()} đ</span>
                </div>
            </div>

            {/* --- Khối Biên lai thanh toán: Chỉ hiển nếu đơn đã thanh toán và có dữ liệu Payment --- */}
            {booking.paymentMethod && (
                <div className="ocard" style={{ maxWidth: '580px', marginBottom: '16px' }}>
                    <h3 style={{ margin: '0 0 13px 0' }}>📋 Biên lai thanh toán</h3>
                    <div className="orow">
                        <span className="c2">Phương thức</span>
                        <span style={{ fontWeight: 600 }}>
                            {booking.paymentMethod === 'VNPAY' ? '🏦 VNPAY' : booking.paymentMethod === 'MOMO' ? '📱 MoMo' : '💳 Thẻ ngân hàng'}
                        </span>
                    </div>
                    <div className="orow">
                        <span className="c2">Mã giao dịch</span>
                        <span style={{ fontFamily: 'var(--fh)', fontSize: '12px', fontWeight: 600 }}>#{booking.transactionCode}</span>
                    </div>
                    <div className="orow">
                        <span className="c2">Ngày thanh toán</span>
                        <span>{booking.paidAt ? formatDate(booking.paidAt) + ' · ' + formatTime(booking.paidAt) : '—'}</span>
                    </div>
                </div>
            )}

            <div className="gap10">
                {booking.status === 'CONFIRMED' && (
                    <button className="btn-cta" onClick={() => setShowTicket(true)}>Xem vé điện tử</button>
                )}
                {booking.status === 'CONFIRMED' && !booking.hasReviewed && (
                    <button className="btn-sec" onClick={() => navigate(`/review/booking/${id}`)}>Đánh giá phim</button>
                )}
                {booking.hasReviewed && (
                    <button className="btn-sec" onClick={handleViewReview}>Xem đánh giá</button>
                )}
            </div>
        </div>
    );

    // UC11: E-Ticket View
    const renderTicket = () => {
        const ticket = booking.tickets?.[activeTicketIdx];
        if (!ticket) return null;

        return (
            <div className="inner">
                <button className="back" onClick={() => setShowTicket(false)}>← Chi tiết giao dịch</button>
                <div className="ptitle">{booking.status === 'CANCELLED' ? '🚫 Vé đã hủy' : '🎉 Vé điện tử'}</div>
                <div className="psub">
                    {booking.status === 'CONFIRMED' 
                        ? 'Vé đã sẵn sàng. Xuất trình mã QR khi check-in tại rạp.' 
                        : booking.status === 'CANCELLED' 
                            ? 'Giao dịch này đã bị hủy. Vé không còn giá trị sử dụng.' 
                            : 'Đang chờ thanh toán để kích hoạt vé.'}
                </div>
                
                <div className={`twrap ${booking.status === 'CANCELLED' ? 'invalid-ticket' : ''}`}>
                    <div className="thd">
                        <div>
                            <div className="tfilm">{booking.movieTitle}</div>
                            <div style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '4px' }}>Mã GD: #{booking.bookingCode}</div>
                        </div>
                        <span className={`status-badge ${booking.status === 'CONFIRMED' ? 'sconf' : booking.status === 'CANCELLED' ? 'scanc' : 'spen'}`}>
                            {booking.status}
                        </span>
                    </div>

                    {booking.tickets?.length > 1 && (
                        <div className="ttabs">
                            {booking.tickets.map((t, idx) => (
                                <div 
                                    key={t.ticketId} 
                                    className={`ttab ${activeTicketIdx === idx ? 'on' : ''}`}
                                    onClick={() => setActiveTicketIdx(idx)}
                                >
                                    Ghế {t.seatLabel}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="tbody">
                        <div className="tinfo-col">
                            <div className="trow2"><span className="tlbl">Phim</span><span>{booking.movieTitle}</span></div>
                            <div className="trow2"><span className="tlbl">Ngày chiếu</span><span>{formatDate(booking.showtimeStart)}</span></div>
                            <div className="trow2"><span className="tlbl">Giờ chiếu</span><span>{formatTime(booking.showtimeStart)}</span></div>
                            <div className="trow2"><span className="tlbl">Phòng</span><span>{booking.roomName}</span></div>
                            <div className="trow2">
                                <span className="tlbl">Ghế</span>
                                <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{ticket.seatLabel}</span>
                            </div>
                            <div className="trow2"><span className="tlbl">Loại ghế</span><span>{ticket.seatType}</span></div>
                            <div className="trow2">
                                <span className="tlbl">Giá vé</span>
                                <span>{(booking.totalPrice / booking.numberOfTickets).toLocaleString()} đ</span>
                            </div>
                            <div className="trow2"><span className="tlbl">Khách hàng</span><span>{booking.customerName}</span></div>
                        </div>
                        
                        <div className="qrbox">
                            <div className="qr-container">
                                {/* Placeholder for QR Code - In a real app we'd use a QR library */}
                                <div className="qr-code-mock">
                                    <svg viewBox="0 0 100 100">
                                        <path d="M10,10 h20 v5 h-15 v15 h-5 z" fill="var(--gold)" />
                                        <path d="M90,10 h-20 v5 h15 v15 h5 z" fill="var(--gold)" />
                                        <path d="M10,90 h20 v-5 h-15 v-15 h-5 z" fill="var(--gold)" />
                                        <path d="M90,90 h-20 v-5 h15 v-15 h5 z" fill="var(--gold)" />
                                        <rect x="25" y="25" width="50" height="50" fill="var(--gold)" opacity="0.1" />
                                        <text x="50" y="55" fontSize="10" textAnchor="middle" fill="var(--gold)" fontWeight="bold">QR CODE</text>
                                    </svg>
                                </div>
                            </div>
                            <div className="qr-label">Mã QR vé</div>
                            <div className="qr-id">#VE-{ticket.qrCode}</div>
                        </div>
                    </div>
                </div>

                <div className="gap10" style={{ marginTop: '30px' }}>
                    <button className="btn-sec" onClick={() => navigate('/profile', { state: { activeTab: 'history' } })}>Lịch sử mua vé</button>
                    <button className="btn-cta" onClick={() => navigate('/')}>Đặt vé khác</button>
                </div>
            </div>
        );
    };

    return (
        <div className="screen-ticket-page">
            {showTicket ? renderTicket() : renderSummary()}
            
            <ViewReviewModal 
                isOpen={reviewModalOpen} 
                onClose={() => setReviewModalOpen(false)} 
                review={reviewData} 
            />
        </div>
    );
};

export default TicketView;
