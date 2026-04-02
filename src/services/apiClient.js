import axios from 'axios';
import { API_URL } from '../config/env';
import { authInterceptor, errorInterceptor } from './interceptors/auth.interceptor';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(authInterceptor, errorInterceptor);

export default api;
