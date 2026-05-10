import axios from 'axios';
import { API_URL } from '../../config/env';

export const authInterceptor = (config) => {
    // Tự động bỏ qua việc thêm Token cho các API đăng nhập/đăng ký/refresh
    if (config.url.includes('/auth/signin') || config.url.includes('/auth/signup') || config.url.includes('/auth/refreshtoken')) {
        return config;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    // Hỗ trợ cả .accessToken (chuẩn mới) và .token (phòng hờ dữ liệu cũ)
    const token = user?.accessToken || user?.token;
    
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

export const errorInterceptor = async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
            return new Promise(function(resolve, reject) {
                failedQueue.push({ resolve, reject });
            }).then(token => {
                originalRequest.headers['Authorization'] = 'Bearer ' + token;
                return axios(originalRequest);
            }).catch(err => {
                return Promise.reject(err);
            });
        }

        const user = JSON.parse(localStorage.getItem('user'));
        // Nếu là yêu cầu login hoặc không có refresh token, không thực hiện refresh
        const isAuthRequest = originalRequest.url.includes('/auth/signin') || originalRequest.url.includes('/auth/signup');
        
        if (user && user.refreshToken && !isAuthRequest) {
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const rs = await axios.post(`${API_URL}auth/refreshtoken`, {
                    refreshToken: user.refreshToken
                });

                const { accessToken, refreshToken: newRefreshToken } = rs.data.data;
                user.accessToken = accessToken;
                if (newRefreshToken) {
                    user.refreshToken = newRefreshToken;
                }
                localStorage.setItem('user', JSON.stringify(user));
                
                originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
                processQueue(null, accessToken);
                
                return axios(originalRequest);
            } catch (_error) {
                processQueue(_error, null);
                localStorage.removeItem('user');
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                return Promise.reject(_error);
            } finally {
                isRefreshing = false;
            }
        } else {
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
            return Promise.reject(error); // Trả lỗi ngay lập tức mà không chặn các request sau
        }
    }
    
    return Promise.reject(error);
};
