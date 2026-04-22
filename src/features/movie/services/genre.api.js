import api from '../../../services/apiClient';

const GENRE_URL = 'genres';

/** Object gọi API Quản lý Thể Loại Phim (Hành động, Hài,...) */
const GenreApi = {
  /** Lấy tất cả thể loại từ server */
  getAll() {
    return api.get(GENRE_URL).then((res) => res.data.data);
  },

  create(data) {
    return api.post(GENRE_URL, data);
  },

  update(id, data) {
    return api.put(GENRE_URL + id, data);
  },

  remove(id) {
    return api.delete(GENRE_URL + id);
  },
};

export default GenreApi;
