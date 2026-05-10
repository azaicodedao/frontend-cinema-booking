import api from '../../../services/apiClient';

const AUTH_URL = 'auth/';

class AuthService {
    /**
     * Gửi yêu cầu đăng nhập lên hệ thống Backend.
     */
    login(email, password) {
        return api
            .post(AUTH_URL + 'signin', { email, password })
            .then(response => {
                const data = response.data.data;
                // Backend trả về: { accessToken, refreshToken, user: { id, fullName, email, role } }
                if (data && data.accessToken) {
                    // Flatten dữ liệu để lưu: { accessToken, refreshToken, id, fullName, email, role }
                    const userToStore = {
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                        ...data.user,  // id, fullName, email, avatarUrl, role
                    };
                    localStorage.setItem('user', JSON.stringify(userToStore));
                    return userToStore;
                }
                return data;
            });
    }

    /**
     * Đăng xuất người dùng khỏi hệ thống.
     */
    logout() {
        localStorage.removeItem('user');
    }

    /**
     * Khởi tạo tài khoản mới.
     */
    register(fullName, email, password) {
        return api.post(AUTH_URL + 'signup', { fullName, email, password });
    }

    /**
     * Lấy ra dữ liệu hồ sơ hiện tại từ localStorage.
     */
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    /**
     * Làm mới token khi hết hạn.
     */
    refreshToken(refreshTokenStr) {
        return api
            .post(AUTH_URL + 'refreshtoken', {
                refreshToken: refreshTokenStr
            })
            .then(response => {
                const user = JSON.parse(localStorage.getItem('user'));
                if (user && response.data.data && response.data.data.accessToken) {
                    user.accessToken = response.data.data.accessToken;
                    if (response.data.data.refreshToken) {
                        user.refreshToken = response.data.data.refreshToken;
                    }
                    localStorage.setItem('user', JSON.stringify(user));
                }
                return response.data.data;
            });
    }
}

export default new AuthService();
