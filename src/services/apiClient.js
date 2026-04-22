import axios from 'axios';
import { API_URL } from '../config/env';
import { authInterceptor, errorInterceptor } from './interceptors/auth.interceptor';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thêm token vào header cho mỗi request
api.interceptors.request.use(authInterceptor);

// Xử lý các lỗi trả về từ server (ví dụ: 401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    errorInterceptor
);

export default api;
