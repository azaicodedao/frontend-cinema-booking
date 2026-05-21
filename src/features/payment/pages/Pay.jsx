import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PaymentApi from '../services/payment.api';
import OrderSummary from '../components/OrderSummary/OrderSummary';
import PaymentMethodPicker from '../components/PaymentMethodPicker/PaymentMethodPicker';
import Spinner from '../../../components/common/Spinner/Spinner';
import './Pay.css';

/**
 * Trang Thanh toán (Pay Page)
 * Hiển thị tóm tắt đơn hàng, bộ đếm ngược thời gian giữ chỗ và lựa chọn phương thức thanh toán.
 */
const Pay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('vnpay');
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    PaymentApi.getBookingById(id)
      .then((res) => {
        const data = res.data?.data || res.data;
        setBooking(data);
        if (data.paymentCountdownSeconds) {
          setTimeLeft(data.paymentCountdownSeconds);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading booking:', err);
        setError('Không thể tải thông tin đặt vé.');
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handlePayment = async () => {
    if (timeLeft === 0) {
      setError('Thời gian giữ chỗ đã hết hạn. Vui lòng đặt lại ghế.');
      return;
    }

    setPaying(true);
    setError('');
    try {
      await PaymentApi.pay(id, paymentMethod);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Thanh toán thất bại. Vui lòng thử lại.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div className="inner"><Spinner size="large" /></div>;

  if (success) {
    return (
      <div className="inner">
        <div className="review-success-card" style={{display: 'block', maxWidth: '520px', margin: '100px auto', textAlign: 'center'}}>
           <div className="review-success-icon">🎉</div>
           <div className="review-success-title">Thanh toán thành công!</div>
           <div className="review-success-sub">Vé điện tử của bạn đã sẵn sàng. Hãy vào xem ngay!</div>
           <button className="btn-cta" onClick={() => navigate('/tickets/' + id)}>Xem vé của tôi</button>
        </div>
      </div>
    );
  }

  return (
    <div className="inner">
      <button className="back" onClick={() => {
        if (booking?.showtimeId) {
          navigate(`/booking/seats/${booking.showtimeId}`);
        } else {
          navigate(-1);
        }
      }}>← Chọn lại ghế</button>
      <div className="ptitle">Xác nhận đặt vé</div>
      <div className="psub">Kiểm tra thông tin và chọn phương thức thanh toán</div>

      {error && <div className="error-message" style={{marginBottom: '20px', color: '#ff4e4e'}}>{error}</div>}

      <div className="playout">
        <div>
          <OrderSummary booking={booking} />
          <div className="cwarn">
            ⏱ Thời gian giữ chỗ còn lại: <strong>{formatTime(timeLeft || 0)}</strong> – Hoàn tất thanh toán trước khi hết giờ.
          </div>
        </div>
        <div>
          <PaymentMethodPicker selected={paymentMethod} onSelect={setPaymentMethod} />
          <button 
            className="btn-primary" 
            style={{marginTop: '24px', width: '100%'}} 
            disabled={paying || timeLeft === 0}
            onClick={handlePayment}
          >
            {paying ? 'Đang xử lý...' : `Thanh toán ${new Intl.NumberFormat('vi-VN').format(booking?.totalPrice || 0)} đ`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pay;
