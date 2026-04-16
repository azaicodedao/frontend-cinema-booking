import React from 'react';
import { Routes, Route } from 'react-router-dom';

import MainLayout from '../../layouts/MainLayout';
import AdminLayout from '../../layouts/AdminLayout';
import PrivateRoute from '../guards/PrivateRoute';
import AdminRoute from '../guards/AdminRoute';

// Customer pages
import Home from '../../features/movie/pages/Home';
import Movies from '../../features/movie/pages/Movies';
import Login from '../../features/auth/pages/Login';
import Register from '../../features/auth/pages/Register';
import Profile from '../../features/auth/pages/Profile';
import MovieDetails from '../../features/movie/pages/MovieDetails';
import SeatSelection from '../../features/booking/pages/SeatSelection';
import Booking from '../../features/booking/pages/Booking';
import Pay from '../../features/payment/pages/Pay';
import MyTickets from '../../features/user/pages/MyTickets';
import TicketView from '../../features/user/pages/TicketView';

// Admin pages
import AdminDashboard from '../../features/admin/pages/AdminDashboard';
import UsersPage from '../../features/admin/pages/UsersPage';
import GenresPage from '../../features/admin/pages/GenresPage';
import MoviesPage from '../../features/admin/pages/MoviesPage';
import RoomsPage from '../../features/admin/pages/RoomsPage';
import ShowtimesPage from '../../features/admin/pages/ShowtimesPage';
import AdminProfilePage from '../../features/admin/pages/AdminProfilePage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Customer / Public routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/booking/seats/:showtimeId" element={<PrivateRoute><SeatSelection /></PrivateRoute>} />
        <Route path="/book/:id" element={<PrivateRoute><Booking /></PrivateRoute>} />
        <Route path="/pay/:id" element={<PrivateRoute><Pay /></PrivateRoute>} />
        <Route path="/tickets" element={<PrivateRoute><MyTickets /></PrivateRoute>} />
        <Route path="/tickets/:id" element={<PrivateRoute><TicketView /></PrivateRoute>} />
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
  );
};

export default AppRoutes;
