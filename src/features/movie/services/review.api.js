import api from '../../../services/apiClient';

const REVIEW_URL = 'reviews/';

const ReviewApi = {
  getByMovie(movieId) {
    return api.get(REVIEW_URL + 'movie/' + movieId).then((res) => res.data);
  },

  create(data) {
    return api.post(REVIEW_URL, data);
  },

  getMyReviewForBooking(bookingId) {
    return api.get(REVIEW_URL + 'booking/' + bookingId).then((res) => res.data);
  },
};

export default ReviewApi;
