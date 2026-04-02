import api from '../../../services/apiClient';

const SHOWTIME_URL = 'showtimes/';

const ShowtimeApi = {
  getByMovie(movieId) {
    return api.get(SHOWTIME_URL + 'movie/' + movieId).then((res) => res.data);
  },

  getById(id) {
    return api.get(SHOWTIME_URL + id).then((res) => res.data);
  },

  getAll() {
    return api.get(SHOWTIME_URL).then((res) => res.data);
  },
};

export default ShowtimeApi;
