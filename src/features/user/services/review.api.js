import api from '../../../services/apiClient';

const ReviewApi = {
    getReviewsByMovie: (movieId) => api.get(`/reviews/movie/${movieId}`).then(res => res.data),
    getReviewSummary: (movieId) => api.get(`/reviews/movie/${movieId}/summary`).then(res => res.data),
    addReview: (reviewData) => api.post('/reviews', reviewData).then(res => res.data),
    getReviewByBooking: (bookingId) => api.get(`/reviews/booking/${bookingId}`).then(res => res.data)
};

export default ReviewApi;
