import axios from 'axios'; //  thư viện HTTP client
import { API_URL } from '../config/env';
import { authInterceptor, errorInterceptor } from './interceptors/auth.interceptor';

const api = axios.create({
    baseURL: API_URL, // URL của backend
    withCredentials: true, // gửi cookie kèm request
    headers: {
        'Content-Type': 'application/json', // định dạng dữ liệu gửi đi là json
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
