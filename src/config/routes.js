// 1. Hệ thống đường dẫn tuyệt đối (Static Routes & Route Patterns)
export const ROUTES = {
  // --- Khách hàng / Public ---
  HOME: '/',
  MOVIES: '/movies',
  LOGIN: '/login',
  REGISTER: '/register',
  MOVIE_DETAILS: '/movie/:id', // Chỉ dùng định nghĩa trong AppRoutes.jsx
  
  // --- Khách hàng / Riêng tư ---
  SEAT_SELECTION: '/booking/seats/:showtimeId', // Chỉ dùng định nghĩa trong AppRoutes.jsx
  PAY: '/pay/:id', // Chỉ dùng định nghĩa trong AppRoutes.jsx
  TICKETS: '/tickets/:id', // Chỉ dùng định nghĩa trong AppRoutes.jsx
  REVIEW: '/review/booking/:id', // Chỉ dùng định nghĩa trong AppRoutes.jsx
  PROFILE: '/profile',

  // --- Quản trị viên (Admin) ---
  ADMIN_DASHBOARD: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_GENRES: '/admin/genres',
  ADMIN_MOVIES: '/admin/movies',
  ADMIN_ROOMS: '/admin/rooms',
  ADMIN_SURCHARGES: '/admin/surcharges',
  ADMIN_SHOWTIMES: '/admin/showtimes',
  ADMIN_PROFILE: '/admin/profile',
  ADMIN_STATS_BOOKINGS: '/admin/stats/bookings',
  ADMIN_STATS_SHOWTIMES: '/admin/stats/showtimes',
};

// 2. Hệ thống đường dẫn tương đối (dành riêng cho cấu hình định tuyến con trong AppRoutes.jsx)
export const ADMIN_CHILD_ROUTES = {
  USERS: 'users',
  GENRES: 'genres',
  MOVIES: 'movies',
  ROOMS: 'rooms',
  SURCHARGES: 'surcharges',
  SHOWTIMES: 'showtimes',
  PROFILE: 'profile',
  STATS_BOOKINGS: 'stats/bookings',
  STATS_SHOWTIMES: 'stats/showtimes',
};

// 3. Hàm hỗ trợ tạo đường dẫn động (Dùng cho điều hướng và Link)
export const PATH_GENERATORS = {
  // Hỗ trợ truyền thêm cờ book để sinh ra ?book=true một cách tự động
  movieDetails: (id, book = false) => `/movie/${id}${book ? '?book=true' : ''}`,
  seatSelection: (showtimeId) => `/booking/seats/${showtimeId}`,
  pay: (id) => `/pay/${id}`,
  tickets: (id) => `/tickets/${id}`,
  review: (id) => `/review/booking/${id}`,
};
