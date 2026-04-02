import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TicketApi from '../services/ticket.api';
import TicketDetail from '../components/TicketDetail/TicketDetail';
import Spinner from '../../../components/common/Spinner/Spinner';
import './TicketView.css';

const TicketView = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    TicketApi.getBookingById(id)
      .then((data) => setBooking(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner size="large" />;
  if (!booking) return <div className="ticket-view__error">Booking not found.</div>;

  const tickets = booking.tickets || [];
  const movieTitle = booking.showtime?.movie?.title || 'Movie';
  const showtimeInfo = booking.showtime?.startTime
    ? `${new Date(booking.showtime.startTime).toLocaleString()} • Room: ${booking.showtime?.room?.name || '—'}`
    : '';

  return (
    <div className="ticket-view">
      <h1 className="ticket-view__title">E-Tickets</h1>
      <div className="ticket-view__meta">
        <span>Transaction: #{booking.id}</span>
        <span className="ticket-view__status">{booking.status}</span>
      </div>

      {tickets.length > 1 && (
        <div className="ticket-view__tabs">
          {tickets.map((_, i) => (
            <button
              key={i}
              className={`ticket-view__tab ${activeTab === i ? 'ticket-view__tab--active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              Ticket {i + 1}
            </button>
          ))}
        </div>
      )}

      {tickets.length > 0 ? (
        <TicketDetail
          ticket={tickets[activeTab]}
          movieTitle={movieTitle}
          showtimeInfo={showtimeInfo}
        />
      ) : (
        <p className="ticket-view__empty">No ticket details available.</p>
      )}

      <div className="ticket-view__payment-info">
        <h3>Payment Details</h3>
        <div className="ticket-view__payment-row">
          <span>Payment Method</span>
          <span>{booking.paymentMethod || 'N/A'}</span>
        </div>
        <div className="ticket-view__payment-row ticket-view__payment-row--total">
          <span>Total Paid</span>
          <span>${booking.totalPrice || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default TicketView;
