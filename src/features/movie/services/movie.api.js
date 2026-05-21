import api from '../../../services/apiClient';

const MOVIE_URL = 'movies';

/** Dịch vụ giao tiếp với Backend cho các tính năng liên quan đến Phim và Lịch Chiếu */
class MovieService {
    /** Lấy toàn bộ danh sách phim */
    getAllMovies() {
        return api.get(MOVIE_URL).then(res => res.data.data);
    }

    /** Lấy danh sách phim nổi bật để hiển thị lên Banner cỡ lớn */
    getFeaturedMovies() {
        return api.get(`${MOVIE_URL}/featured`).then(res => res.data.data);
    }

    /** Lấy danh sách phim đang chiếu (có kèm rating) */
    getShowingMovies() {
        return api.get(`${MOVIE_URL}/showing`).then(res => res.data.data);
    }

    /** Lấy danh sách phim sắp chiếu (có kèm rating) */
    getComingSoonMovies() {
        return api.get(`${MOVIE_URL}/coming-soon`).then(res => res.data.data);
    }

    getMovieById(id) {
        return api.get(`movies/${id}`).then(res => res.data.data);
    }

    getMovieDetail(id) {
        return api.get(`movies/${id}/detail`).then(res => res.data.data);
    }

    /** 
     * Lấy danh sách lịch các bộ phim có suất chiếu theo một ngày nhất định.
     * Dùng cho trang Movies `/movies`
     * @param {string} date - Ngày (YYYY-MM-DD)
     */
    getSchedule(date) {
        const url = 'showtimes/schedule' + (date ? `?date=${date}` : '');
        return api.get(url).then(res => res.data.data);
    }
}

export default new MovieService();
