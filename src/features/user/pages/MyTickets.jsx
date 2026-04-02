import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TicketApi from '../services/ticket.api';
import TicketCard from '../components/TicketCard/TicketCard';
import Spinner from '../../../components/common/Spinner/Spinner';
import EmptyState from '../../../components/common/EmptyState/EmptyState';
import Button from '../../../components/common/Button/Button';
import './MyTickets.css';

const MyTickets = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    TicketApi.getMyBookings()
      .then((data) => {
        const sorted = (Array.isArray(data) ? data : []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBookings(sorted);
      })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner size="large" />;

  return (
    <div className="my-tickets">
      <h1 className="my-tickets__title">My Tickets</h1>

      {bookings.length === 0 ? (
        <EmptyState
          icon="🎟️"
          title="No bookings yet"
          description="Start exploring movies and book your first ticket!"
          action={
            <Link to="/">
              <Button>Explore Movies</Button>
            </Link>
          }
        />
      ) : (
        <div className="my-tickets__list">
          {bookings.map((booking) => (
            <TicketCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;
