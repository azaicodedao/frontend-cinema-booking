import axios from 'axios';
import { API_URL } from '../../config/env';

// Đọc thông tin người dùng từ localStorage
const getStoredUser = () => {
    try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch {
        localStorage.removeItem('user');
        return null;
    }
};

// Xử lý khi token hết hạn
const expireSession = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new CustomEvent('auth:session-expired')); // 
    window.dispatchEvent(new CustomEvent('auth:require-login'));
};

export const authInterceptor = (config) => {
    // Tự động bỏ qua việc thêm Token cho các API đăng nhập/đăng ký/refresh
    if (config.url.includes('/auth/signin') || config.url.includes('/auth/signup') || config.url.includes('/auth/refreshtoken')) {
        return config;
    }

    const user = getStoredUser();
    // Hỗ trợ cả .accessToken (chuẩn mới) và .token (phòng hờ dữ liệu cũ)
    const token = user?.accessToken || user?.token;
    
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
};

let isRefreshing = false;
let failedQueue = []; // hàng đợi các request bị lỗi do hết hạn 

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error); // Thất bại -> từ chối toàn bộ hàng đợi
        } else {
            prom.resolve(token); // Thành công -> gửi lại toàn bộ hàng đợi với token mới
        }
    });
    failedQueue = [];
};

// Xử lý các lỗi trả về từ server (ví dụ: 401 Unauthorized)
export const errorInterceptor = async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) { // 401: không có quyền truy cập (User đã đăng nhập, có refresh token, và request lỗi không phải login/register)
        if (isRefreshing) { // Nếu đang refresh -> thêm vào hàng đợi
            return new Promise(function(resolve, reject) {
                failedQueue.push({ resolve, reject });
            }).then(token => {
                originalRequest.headers['Authorization'] = 'Bearer ' + token;
                return axios(originalRequest); // Gửi lại request cũ với token mới
            }).catch(err => {
                return Promise.reject(err);
            });
        } 
        // Lấy token trong localStorage
        const user = getStoredUser();
        // Kiểm tra có phải login/register không.
        const isAuthRequest = originalRequest.url.includes('/auth/signin') || originalRequest.url.includes('/auth/signup');
        // Chỉ refresh khi user có refresh token.
        if (user && user.refreshToken && !isAuthRequest) {
            originalRequest._retry = true; // Đánh dấu request đã thử lại.
            isRefreshing = true; // Báo rằng đang có request refresh token.

            try {
                // Gọi backend lấy access token mới.
                const rs = await axios.post(`${API_URL}auth/refreshtoken`, {
                    refreshToken: user.refreshToken
                });

                const { accessToken, refreshToken: newRefreshToken } = rs.data.data;
                user.accessToken = accessToken;
                if (newRefreshToken) {
                    user.refreshToken = newRefreshToken; // Cập nhật cả refresh token mới (nếu backend cấp mới)
                }
                localStorage.setItem('user', JSON.stringify(user)); // Lưu lại user mới
                
                originalRequest.headers['Authorization'] = 'Bearer ' + accessToken; // Gán token mới vào header
                processQueue(null, accessToken); // Giải phóng hàng đợi
                
                return axios(originalRequest); // Gửi lại request gốc với token mới
            } catch (_error) {
                processQueue(_error, null);
                expireSession(); // Kết thúc phiên đăng nhập nếu refresh token hết hạn hoặc lỗi.
                return Promise.reject(_error);
            } finally {
                isRefreshing = false; // Kết thúc quá trình refresh
            }
        } else {
            // Nếu không có user hoặc refresh token, hoặc là request login -> kết thúc phiên
            expireSession();
            return Promise.reject(error);
        }
    }
    
    return Promise.reject(error);
};
