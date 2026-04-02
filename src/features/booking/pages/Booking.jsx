import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/apiClient';
import BookingService from '../services/booking.api';
import SeatMap from '../components/SeatMap/SeatMap';
import SeatLegend from '../components/SeatLegend/SeatLegend';
import CountdownTimer from '../components/CountdownTimer/CountdownTimer';
import useCountdown from '../hooks/useCountdown';
import Button from '../../../components/common/Button/Button';
import Spinner from '../../../components/common/Spinner/Spinner';
import './Booking.css';

const HOLDING_TIME_SECONDS = 10 * 60;

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showtime, setShowtime] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { formatted, isExpired, secondsLeft } = useCountdown(HOLDING_TIME_SECONDS);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stRes = await api.get(`showtimes/${id}`);
        const st = stRes.data;
        setShowtime(st);

        const seatRes = await api.get(`rooms/${st.roomId}/seats`);
        setSeats(Array.isArray(seatRes.data) ? seatRes.data : []);
      } catch (err) {
        setError('Failed to load booking details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const toggleSeat = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat.');
      return;
    }
    if (isExpired) {
      setError('Time expired. Please start over.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const response = await BookingService.createBooking(showtime.id || parseInt(id), selectedSeats);
      navigate(`/pay/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Booking failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner size="large" />;

  return (
    <div className="booking-page">
      <div className="booking-page__header">
        <h1 className="booking-page__title">Select Your Seats</h1>
        {showtime && (
          <p className="booking-page__info">
            {showtime.movieTitle} • Room: {showtime.roomName}
          </p>
        )}
      </div>

      <CountdownTimer formatted={formatted} isExpired={isExpired} secondsLeft={secondsLeft} />

      {error && <div className="booking-page__error">{error}</div>}

      <div className="booking-page__map-container">
        <SeatMap
          seats={seats}
          selectedSeats={selectedSeats}
          onToggleSeat={toggleSeat}
          maxSeats={8}
        />
        <SeatLegend />
      </div>

      <div className="booking-page__footer">
        <div className="booking-page__summary">
          <span className="booking-page__total-label">
            {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} selected
          </span>
          {showtime?.price && (
            <span className="booking-page__total-price">
              Total: ${showtime.price * selectedSeats.length}
            </span>
          )}
        </div>
        <Button
          onClick={handleBooking}
          loading={submitting}
          disabled={selectedSeats.length === 0 || isExpired}
          size="large"
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
};

export default Booking;
