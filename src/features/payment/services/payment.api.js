import api from '../../../services/apiClient';

const PaymentApi = {
  getBookingById(bookingId) {
    return api.get('bookings/' + bookingId);
  },

  pay(bookingId) {
    return api.post('bookings/' + bookingId + '/pay', {});
  },
};

export default PaymentApi;
