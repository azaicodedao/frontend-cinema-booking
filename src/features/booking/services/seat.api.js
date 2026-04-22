import api from '../../../services/apiClient';

const SeatApi = {
  getSeatSelection: (showtimeId) => {
    return api.get(`/seats/showtime/${showtimeId}`);
  },

  /**
   * Giữ một hoặc nhiều ghế.
   * @param {number[]} seatIds 
   * @param {number} showtimeId 
   */
  holdSeats: (seatIds, showtimeId) => {
    return api.post('/seats/hold', { seatIds: Array.isArray(seatIds) ? seatIds : [seatIds], showtimeId });
  },

  /**
   * Giải phóng một hoặc nhiều ghế.
   * @param {number[]} seatIds 
   * @param {number} showtimeId 
   */
  releaseSeats: (seatIds, showtimeId) => {
    return api.post('/seats/release', { seatIds: Array.isArray(seatIds) ? seatIds : [seatIds], showtimeId });
  }
};

export default SeatApi;
