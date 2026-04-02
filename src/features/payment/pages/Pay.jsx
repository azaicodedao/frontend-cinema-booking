import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PaymentApi from '../services/payment.api';
import OrderSummary from '../components/OrderSummary/OrderSummary';
import PaymentMethodPicker from '../components/PaymentMethodPicker/PaymentMethodPicker';
import Button from '../../../components/common/Button/Button';
import Spinner from '../../../components/common/Spinner/Spinner';
import './Pay.css';

const Pay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    PaymentApi.getBookingById(id)
      .then((res) => {
        setBooking(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load booking.');
        setLoading(false);
      });
  }, [id]);

  const handlePayment = async () => {
    setPaying(true);
    setError('');
    try {
      await PaymentApi.pay(id);
      setSuccess(true);
      setTimeout(() => navigate('/tickets'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Payment failed.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <Spinner size="large" />;

  if (success) {
    return (
      <div className="pay-page__success">
        <div className="pay-page__success-icon">✓</div>
        <h2>Payment Successful!</h2>
        <p>Redirecting to your tickets...</p>
      </div>
    );
  }

  return (
    <div className="pay-page">
      <h1 className="pay-page__title">Complete Payment</h1>
      <p className="pay-page__ref">Booking Reference: #{id}</p>

      {error && <div className="pay-page__error">{error}</div>}

      <div className="pay-page__grid">
        <div className="pay-page__left">
          <OrderSummary booking={booking} />
        </div>
        <div className="pay-page__right">
          <PaymentMethodPicker selected={paymentMethod} onSelect={setPaymentMethod} />
          <Button onClick={handlePayment} fullWidth loading={paying} size="large">
            Pay Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pay;
