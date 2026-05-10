import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import MainLayout from '../../layouts/MainLayout';
import AdminLayout from '../../layouts/AdminLayout';
import PrivateRoute from '../guards/PrivateRoute';
import AdminRoute from '../guards/AdminRoute';

// Loading component
const LoadingScreen = () => (
  <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', background: '#09090f' }}>
    <div className="admin-spinner"></div>
  </div>
);

// Lazy load Customer pages
const Home = lazy(() => import('../../features/movie/pages/Home'));
const Movies = lazy(() => import('../../features/movie/pages/Movies'));
const Login = lazy(() => import('../../features/auth/pages/Login'));
const Register = lazy(() => import('../../features/auth/pages/Register'));
const Profile = lazy(() => import('../../features/auth/pages/Profile'));
const MovieDetails = lazy(() => import('../../features/movie/pages/MovieDetails'));
const SeatSelection = lazy(() => import('../../features/booking/pages/SeatSelection'));
const Booking = lazy(() => import('../../features/booking/pages/Booking'));
const Pay = lazy(() => import('../../features/payment/pages/Pay'));
const TicketView = lazy(() => import('../../features/user/pages/TicketView'));
const MovieReview = lazy(() => import('../../features/user/pages/MovieReview'));

// Lazy load Admin pages
const AdminDashboard = lazy(() => import('../../features/admin/pages/AdminDashboard'));
const UsersPage = lazy(() => import('../../features/admin/pages/UsersPage'));
const GenresPage = lazy(() => import('../../features/admin/pages/GenresPage'));
const MoviesPage = lazy(() => import('../../features/admin/pages/MoviesPage'));
const RoomsPage = lazy(() => import('../../features/admin/pages/RoomsPage'));
const ShowtimesPage = lazy(() => import('../../features/admin/pages/ShowtimesPage'));
const AdminProfilePage = lazy(() => import('../../features/admin/pages/AdminProfilePage'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Customer / Public routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          
          {/* Protected customer routes */}
          <Route path="/booking/seats/:showtimeId" element={<PrivateRoute><SeatSelection /></PrivateRoute>} />
          <Route path="/book/:id" element={<PrivateRoute><Booking /></PrivateRoute>} />
          <Route path="/pay/:id" element={<PrivateRoute><Pay /></PrivateRoute>} />
          <Route path="/tickets/:id" element={<PrivateRoute><TicketView /></PrivateRoute>} />
          <Route path="/review/booking/:id" element={<PrivateRoute><MovieReview /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="genres" element={<GenresPage />} />
          <Route path="movies" element={<MoviesPage />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="showtimes" element={<ShowtimesPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
