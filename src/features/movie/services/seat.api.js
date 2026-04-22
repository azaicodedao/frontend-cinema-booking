import api from '../../../services/apiClient';

const SeatApi = {
  getSeatSelection: (showtimeId) => {
    return api.get(`/seats/showtime/${showtimeId}`);
  },

  holdSeat: (seatId, showtimeId) => {
    return api.post('/seats/hold', { seatIds: [seatId], showtimeId });
  },

  releaseSeat: (seatId, showtimeId) => {
    return api.post('/seats/release', { seatIds: [seatId], showtimeId });
  }
};

export default SeatApi;
