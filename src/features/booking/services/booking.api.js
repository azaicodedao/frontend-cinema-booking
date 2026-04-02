import api from '../../../services/apiClient';

const BOOKING_URL = 'bookings/';

class BookingService {
    createBooking(showtimeId, seatIds) {
        return api.post(BOOKING_URL, { showtimeId, seatIds });
    }

    payBooking(bookingId) {
        return api.post(BOOKING_URL + bookingId + '/pay', {});
    }
}

export default new BookingService();
