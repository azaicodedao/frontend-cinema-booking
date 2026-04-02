export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/';

export const ROUTE_PATHS = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    MOVIE_DETAILS: '/movie/:id',
    BOOKING: '/book/:id',
    PAY: '/pay/:id',
    TICKETS: '/tickets',
};
