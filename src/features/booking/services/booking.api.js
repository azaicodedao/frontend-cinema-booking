import api from '../../../services/apiClient';

const BOOKING_URL = 'bookings';

class BookingService {
    createBooking(showtimeId, seatIds, totalPrice) {
        return api.post(BOOKING_URL, { showtimeId, seatIds, totalPrice });
    }

    payBooking(bookingId) {
        return api.post(BOOKING_URL + bookingId + '/pay', {});
    }
}

export default new BookingService();
