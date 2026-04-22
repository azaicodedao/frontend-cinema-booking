import api from '../../../services/apiClient';

/** Dịch vụ giao tiếp với hệ thống Đánh giá và Bình luận */
const ReviewApi = {
  getReviewsByMovie: (movieId) => api.get(`/reviews/movie/${movieId}`).then(res => res.data),
  getReviewSummary: (movieId) => api.get(`/reviews/movie/${movieId}/summary`).then(res => res.data),
  addReview: (reviewData) => api.post('/reviews', reviewData).then(res => res.data),
  
  // Alias for backward compatibility
  getByMovie(movieId) {
    return this.getReviewsByMovie(movieId);
  }
};

export default ReviewApi;
