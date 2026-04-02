import api from '../../../services/apiClient';

const MOVIE_URL = 'movies';

class MovieService {
    getAllMovies() {
        return api.get(MOVIE_URL).then(res => res.data.data);
    }

    getMovieById(id) {
        return api.get(`movies/${id}`).then(res => res.data.data);
    }

    getMovieDetail(id) {
        return api.get(`movies/${id}/detail`).then(res => res.data.data);
    }

    getSchedule(date) {
        const url = 'showtimes/schedule' + (date ? `?date=${date}` : '');
        return api.get(url).then(res => res.data.data);
    }
}

export default new MovieService();
