import api from '../../../services/apiClient';

// ── User Management ──────────────────────────────────────────────
export const getUsers = (params) => api.get('/admin/users', { params });
export const getUserDetail = (id) => api.get(`/admin/users/${id}`);
export const changeUserRole = (id, role) => api.put(`/admin/users/${id}/role`, null, { params: { role } });
export const lockUser = (id) => api.put(`/admin/users/${id}/lock`);
export const unlockUser = (id) => api.put(`/admin/users/${id}/unlock`);

// ── Genre Management ─────────────────────────────────────────────
export const getGenres = () => api.get('/genres');
export const createGenre = (data) => api.post('/genres', data);
export const updateGenre = (id, data) => api.put(`/genres/${id}`, data);
export const deleteGenre = (id) => api.delete(`/genres/${id}`);

// ── Movie Management ─────────────────────────────────────────────
export const getMovies = (params) => api.get('/movies/search', { params });
export const getMovieById = (id) => api.get(`/movies/${id}`);
export const createMovie = (data) => api.post('/movies', data);
export const updateMovie = (id, data) => api.put(`/movies/${id}`, data);
export const deleteMovie = (id) => api.delete(`/movies/${id}`);

// ── Room Management ──────────────────────────────────────────────
export const getRooms = () => api.get('/rooms');
export const getRoomSeats = (id) => api.get(`/rooms/${id}/seats`);
export const updateRoomSeats = (id, data) => api.put(`/rooms/${id}/seats`, data);
export const createRoom = (data) => api.post('/rooms', data);
export const updateRoom = (id, data) => api.put(`/rooms/${id}`, data);
export const deleteRoom = (id) => api.delete(`/rooms/${id}`);

// ── Showtime Management ──────────────────────────────────────────
export const getShowtimes = () => api.get('/showtimes');
export const getShowtimesByMovie = (movieId) => api.get(`/showtimes/movie/${movieId}`);
export const createShowtime = (data) => api.post('/showtimes', data);
export const updateShowtime = (id, data) => api.put(`/showtimes/${id}`, data);
export const deleteShowtime = (id) => api.delete(`/showtimes/${id}`);

// ── Statistics Management ────────────────────────────────────────
export const getMovieBookingStats = (params) => api.get('/statistics/movies/bookings', { params });
export const getShowtimeStats = (params) => api.get('/statistics/showtimes', { params });
export const getShowtimeSeatStats = (id) => api.get(`/statistics/showtimes/${id}/seats`);
