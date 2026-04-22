import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TicketApi from '../services/ticket.api';
import ReviewApi from '../services/review.api';
import Spinner from '../../../components/common/Spinner/Spinner';
import './MovieReview.css';

/**
 * Trang Đánh giá phim chuyên dụng (Movie Review Page).
 * Chỉ dành cho các tài khoản đã mua vé thành công. Cho phép kéo sao, viết bình luận và xem các thống kê sao đánh giá của những người khác cùng lúc.
 *
 * @returns {JSX.Element} Giao diện trang Viết Đánh giá Phim.
 */
const MovieReview = () => {
    const { id } = useParams(); // bookingId
    const navigate = useNavigate();
    
    const [booking, setBooking] = useState(null);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    
    // Form state
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await TicketApi.getBookingById(id);
                const bookingData = res.data;
                setBooking(bookingData);
                
                // Fetch summary for the movie
                if (bookingData.movieId) {
                    const sumRes = await ReviewApi.getReviewSummary(bookingData.movieId);
                    setSummary(sumRes.data);
                }
            } catch (err) {
                console.error("Error fetching review data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = async () => {
        if (rating === 0) return;
        
        setSubmitting(true);
        try {
            await ReviewApi.addReview({
                movieId: booking.movieId,
                bookingId: parseInt(id),
                rating,
                comment
            });
            setSuccess(true);
        } catch (err) {
            alert(err.response?.data?.message || "Đã có lỗi xảy ra khi gửi đánh giá.");
        } finally {
            setSubmitting(false);
        }
    };

    const getStarLabel = (r) => {
        switch (r) {
            case 1: return "Tệ";
            case 2: return "Tạm được";
            case 3: return "Bình thường";
            case 4: return "Rất hay";
            case 5: return "Tuyệt phẩm";
            default: return "Chọn số sao để đánh giá";
        }
    };

    if (loading) return <Spinner />;
    if (!booking) return <div className="screen"><div className="inner">Không tìm thấy thông tin đặt vé.</div></div>;

    if (success) {
        return (
            <div className="screen">
                <div className="inner">
                    <div className="review-success-card">
                        <div className="review-success-icon">🎉</div>
                        <h2 className="review-success-title">Cảm ơn bạn đã đánh giá!</h2>
                        <p className="review-success-sub">Đánh giá của bạn đã được ghi nhận và sẽ giúp các khán giả khác đưa ra quyết định tốt hơn.</p>
                        
                        <div style={{ background: 'var(--bg3)', borderRadius: 'var(--rsm)', padding: '16px 20px', marginBottom: '24px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontFamily: 'var(--fh)', fontSize: '15px', fontWeight: '700', color: 'var(--t1)' }}>{booking.movieTitle}</div>
                                <div style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '4px' }}>Đánh giá của bạn</div>
                            </div>
                            <div style={{ color: 'var(--gold)', fontSize: '24px', letterSpacing: '4px' }}>
                                {"★".repeat(rating)}{"☆".repeat(5-rating)}
                            </div>
                        </div>

                        {comment && (
                            <div style={{ background: 'var(--bg3)', borderRadius: 'var(--rsm)', padding: '16px 20px', marginBottom: '32px', textAlign: 'left' }}>
                                <div style={{ fontSize: '12px', color: 'var(--t3)', marginBottom: '8px' }}>Nhận xét của bạn</div>
                                <div style={{ fontSize: '14px', color: 'var(--t2)', fontStyle: 'italic', lineHeight: '1.5' }}>"{comment}"</div>
                            </div>
                        )}

                        <div className="gap10" style={{ justifyContent: 'center' }}>
                            <button className="btn-cta" onClick={() => navigate('/profile', { state: { activeTab: 'history' } })}>Đánh giá phim khác</button>
                            <button className="btn-sec" onClick={() => navigate('/')}>Về trang chủ</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="screen">
            <div className="inner">
                <button className="back" onClick={() => navigate(-1)}>← Quay lại</button>
                <h1 className="ptitle">Đánh giá phim</h1>
                <p className="psub">Chia sẻ trải nghiệm của bạn về bộ phim <strong>{booking.movieTitle}</strong></p>

                <div className="review-layout">
                    {/* LEFT: Form */}
                    <div className="review-main">
                        <div className="review-movie-card">
                            <div className="review-movie-poster">
                                <img src={booking.posterUrl || 'https://via.placeholder.com/300x450'} alt={booking.movieTitle} />
                            </div>
                            <div className="review-movie-info">
                                <h2 className="review-movie-title">{booking.movieTitle}</h2>
                                <div className="review-movie-meta">
                                    <span>{new Date(booking.showtimeStart).toLocaleString('vi-VN')}</span>
                                    <span>{booking.roomName}</span>
                                    <span>Ghế {booking.seatLabels?.join(', ')}</span>
                                </div>
                                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                                    <span className="tag g" style={{ fontSize: '11px', padding: '2px 8px' }}>CineBook Verified</span>
                                </div>
                            </div>
                        </div>

                        <div className="review-form-card">
                            <h3 className="review-section-title">Bạn thấy phim này thế nào?</h3>
                            <div className="star-row">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <div
                                        key={s}
                                        className={`star-btn ${ (hover || rating) >= s ? 'active' : '' }`}
                                        onClick={() => setRating(s)}
                                        onMouseEnter={() => setHover(s)}
                                        onMouseLeave={() => setHover(0)}
                                    >
                                        ★
                                    </div>
                                ))}
                            </div>
                            <div className="star-label">{getStarLabel(hover || rating)}</div>

                            <h3 className="review-section-title">Nhận xét chi tiết (tuỳ chọn)</h3>
                            <textarea
                                className="rta"
                                rows="5"
                                placeholder="Chia sẻ cảm nhận của bạn để giúp mọi người nhé..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value.substring(0, 500))}
                                maxLength={500}
                            />
                            <div className="cct"><span>{comment.length}</span>/500 ký tự</div>

                            <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                                <button 
                                    className="btn-cta" 
                                    disabled={rating === 0 || submitting}
                                    onClick={handleSubmit}
                                    style={{ minWidth: '160px' }}
                                >
                                    {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                                </button>
                                <button className="btn-sec" onClick={() => navigate(-1)}>Hủy bỏ</button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Sidebar */}
                    <div className="review-sidebar">
                        <div className="review-sidebar-card" style={{ marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px', fontFamily: 'var(--fh)' }}>Thống kê đánh giá</h3>
                            {summary ? (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                                        <div style={{ fontSize: '42px', fontWeight: '800', color: 'var(--gold)', fontFamily: 'var(--fh)', lineHeight: '1' }}>
                                            {summary.averageRating.toFixed(1)}
                                        </div>
                                        <div>
                                            <div style={{ color: 'var(--gold)', letterSpacing: '2px', fontSize: '16px' }}>
                                                {"★".repeat(Math.round(summary.averageRating))}{"☆".repeat(5-Math.round(summary.averageRating))}
                                            </div>
                                            <div style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '4px' }}>{summary.totalReviews} đánh giá</div>
                                        </div>
                                    </div>

                                    {/* Distribution bars */}
                                    <div style={{ display: 'grid', gap: '8px' }}>
                                        {[5, 4, 3, 2, 1].map((s) => {
                                            const count = summary.ratingDistribution[s] || 0;
                                            const pct = summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;
                                            return (
                                                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
                                                    <span style={{ width: '15px', color: 'var(--t2)' }}>{s}★</span>
                                                    <div style={{ flex: 1, height: '6px', background: 'var(--bg3)', borderRadius: '3px', overflow: 'hidden' }}>
                                                        <div style={{ width: `${pct}%`, height: '100%', background: s === 1 ? 'var(--red)' : 'var(--gold)', opacity: 0.5 + (s * 0.1) }}></div>
                                                    </div>
                                                    <span style={{ width: '30px', textAlign: 'right', color: 'var(--t3)' }}>{Math.round(pct)}%</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : (
                                <div style={{ color: 'var(--t3)', fontSize: '13px' }}>Chưa có đánh giá nào cho phim này. Hãy là người đầu tiên!</div>
                            )}
                        </div>

                        <div className="review-sidebar-card">
                            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px', fontFamily: 'var(--fh)' }}>💡 Gợi ý</h3>
                            <div className="review-tip-item">
                                <span className="review-tip-icon">⭐</span>
                                <div>Phim <strong>hay</strong>? Đừng ngần ngại cho 5 sao nhé!</div>
                            </div>
                            <div className="review-tip-item">
                                <span className="review-tip-icon">🔒</span>
                                <div>Đánh giá của bạn là <strong>xác thực</strong> vì bạn đã mua vé xem phim này.</div>
                            </div>
                            <div className="review-tip-item" style={{ marginBottom: 0 }}>
                                <span className="review-tip-icon">📝</span>
                                <div>Chia sẻ cảm nhận về diễn viên, kỹ xảo hoặc cốt truyện để bài viết hữu ích hơn.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieReview;
