import React from 'react';
import { Routes, Route } from 'react-router-dom';

import MainLayout from '../../layouts/MainLayout';
import PrivateRoute from '../guards/PrivateRoute';

import Home from '../../features/movie/pages/Home';
import Movies from '../../features/movie/pages/Movies';
import Login from '../../features/auth/pages/Login';
import Register from '../../features/auth/pages/Register';
import Profile from '../../features/auth/pages/Profile';
import MovieDetails from '../../features/movie/pages/MovieDetails';
import SeatSelection from '../../features/booking/pages/SeatSelection';
import Booking from '../../features/booking/pages/Booking';
import Pay from '../../features/payment/pages/Pay';
import TicketView from '../../features/user/pages/TicketView';
import MovieReview from '../../features/user/pages/MovieReview';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movie/:id" element={<MovieDetails />} />

        {/* Protected customer routes */}
        <Route
          path="/booking/seats/:showtimeId"
          element={
            <PrivateRoute>
              <SeatSelection />
            </PrivateRoute>
          }
        />
        <Route
          path="/book/:id"
          element={
            <PrivateRoute>
              <Booking />
            </PrivateRoute>
          }
        />
        <Route
          path="/pay/:id"
          element={
            <PrivateRoute>
              <Pay />
            </PrivateRoute>
          }
        />
        <Route
          path="/tickets/:id"
          element={
            <PrivateRoute>
              <TicketView />
            </PrivateRoute>
          }
        />
        <Route
          path="/review/booking/:id"
          element={
            <PrivateRoute>
              <MovieReview />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <div style={{ padding: '20px', color: 'white' }}>
                <h1>Admin Dashboard</h1>
                <p>Giao diện Admin đang được phát triển...</p>
              </div>
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
