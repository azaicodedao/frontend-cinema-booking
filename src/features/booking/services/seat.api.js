import api from '../../../services/apiClient';

const SeatApi = {
  getSeatSelection: (showtimeId) => {
    return api.get(`/seats/showtime/${showtimeId}`);
  },

  holdSeat: (seatId, showtimeId) => {
    return api.post('/seats/hold', { seatId, showtimeId });
  },

  releaseSeat: (seatId, showtimeId) => {
    return api.post('/seats/release', { seatId, showtimeId });
  }
};

export default SeatApi;
