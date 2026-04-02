import api from '../../../services/apiClient';

const TicketApi = {
  getMyBookings() {
    return api.get('bookings/my').then((res) => res.data);
  },

  getBookingById(id) {
    return api.get('bookings/' + id).then((res) => res.data);
  },
};

export default TicketApi;
