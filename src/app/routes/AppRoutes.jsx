import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from '../../layouts/MainLayout';
import AdminLayout from '../../layouts/AdminLayout';
import PrivateRoute from '../guards/PrivateRoute';
import AdminRoute from '../guards/AdminRoute';
import AdminRedirectGuard from '../guards/AdminRedirectGuard';
import { ROUTES, ADMIN_CHILD_ROUTES } from '../../config/routes';

// Loading component
const LoadingScreen = () => (
  <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', background: '#09090f' }}>
    <div className="admin-spinner"></div>
  </div>
);

// Lazy load Customer pages
const Home = lazy(() => import('../../features/movie/pages/Home'));
const Movies = lazy(() => import('../../features/movie/pages/Movies'));
// Login và Register đã được chuyển sang AuthModal - không còn là trang riêng biệt
const Profile = lazy(() => import('../../features/auth/pages/Profile'));
const MovieDetails = lazy(() => import('../../features/movie/pages/MovieDetails'));
const SeatSelection = lazy(() => import('../../features/booking/pages/SeatSelection'));
const Pay = lazy(() => import('../../features/payment/pages/Pay'));
const TicketView = lazy(() => import('../../features/user/pages/TicketView'));
const MovieReview = lazy(() => import('../../features/user/pages/MovieReview'));

// Lazy load Admin pages
const UsersPage = lazy(() => import('../../features/admin/pages/UsersPage'));
const GenresPage = lazy(() => import('../../features/admin/pages/GenresPage'));
const MoviesPage = lazy(() => import('../../features/admin/pages/MoviesPage'));
const RoomsPage = lazy(() => import('../../features/admin/pages/RoomsPage'));
const RoomSeatTypePage = lazy(() => import('../../features/admin/pages/RoomSeatTypePage'));
const ShowtimesPage = lazy(() => import('../../features/admin/pages/ShowtimesPage'));
const AdminProfilePage = lazy(() => import('../../features/admin/pages/AdminProfilePage'));
const BookingStatsPage = lazy(() => import('../../features/admin/pages/BookingStatsPage'));
const ShowtimeStatsPage = lazy(() => import('../../features/admin/pages/ShowtimeStatsPage'));

/**
 * Cấu hình định tuyến (Routing) toàn bộ ứng dụng.
 * Kết hợp Lazy Loading cho hiệu năng vượt trội và các Guards bảo mật đa lớp.
 */
const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Customer / Public routes */}
        <Route element={<AdminRedirectGuard><MainLayout /></AdminRedirectGuard>}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.MOVIES} element={<Movies />} />
          {/* /login và /register redirect về trang chủ - dùng AuthModal thay thế */}
          <Route path={ROUTES.LOGIN} element={<Navigate to={ROUTES.HOME} state={{ openLogin: true }} replace />} />
          <Route path={ROUTES.REGISTER} element={<Navigate to={ROUTES.HOME} replace />} />
          <Route path={ROUTES.MOVIE_DETAILS} element={<MovieDetails />} />
          
          {/* Protected customer routes */}
          <Route path={ROUTES.SEAT_SELECTION} element={<PrivateRoute><SeatSelection /></PrivateRoute>} />
          <Route path={ROUTES.PAY} element={<PrivateRoute><Pay /></PrivateRoute>} />
          <Route path={ROUTES.TICKETS} element={<PrivateRoute><TicketView /></PrivateRoute>} />
          <Route path={ROUTES.REVIEW} element={<PrivateRoute><MovieReview /></PrivateRoute>} />
          <Route path={ROUTES.PROFILE} element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Route>

        {/* Admin routes */}
        <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminRoute><AdminLayout /></AdminRoute>}>
          {/* Mặc định chuyển hướng Admin vào trang thống kê đặt vé */}
          <Route index element={<Navigate to={ADMIN_CHILD_ROUTES.STATS_BOOKINGS} replace />} />
          
          <Route path={ADMIN_CHILD_ROUTES.USERS} element={<UsersPage />} />
          <Route path={ADMIN_CHILD_ROUTES.GENRES} element={<GenresPage />} />
          <Route path={ADMIN_CHILD_ROUTES.MOVIES} element={<MoviesPage />} />
          <Route path={ADMIN_CHILD_ROUTES.ROOMS} element={<RoomsPage />} />
          <Route path={ADMIN_CHILD_ROUTES.SURCHARGES} element={<RoomSeatTypePage />} />
          <Route path={ADMIN_CHILD_ROUTES.SHOWTIMES} element={<ShowtimesPage />} />
          <Route path={ADMIN_CHILD_ROUTES.PROFILE} element={<AdminProfilePage />} />
          <Route path={ADMIN_CHILD_ROUTES.STATS_BOOKINGS} element={<BookingStatsPage />} />
          <Route path={ADMIN_CHILD_ROUTES.STATS_SHOWTIMES} element={<ShowtimeStatsPage />} />
          
          {/* Dashboard tổng quan đã được thay thế bằng các trang thống kê */}
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

