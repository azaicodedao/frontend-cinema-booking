import api from '../../../services/apiClient';

const AUTH_URL = 'auth/';

class AuthService {
    login(email, password) {
        return api
            .post(AUTH_URL + 'signin', { email, password })
            .then(response => {
                const data = response.data.data;
                // Backend trả về: { accessToken, refreshToken, user: { id, fullName, email, role } }
                if (data && data.accessToken) {
                    // Flatten để lưu: { token, role, fullName, ... } cho dễ dùng
                    const userToStore = {
                        token: data.accessToken,
                        refreshToken: data.refreshToken,
                        ...data.user,  // id, fullName, email, avatarUrl, role
                    };
                    localStorage.setItem('user', JSON.stringify(userToStore));
                    return userToStore;
                }
                return data;
            });
    }

    logout() {
        localStorage.removeItem('user');
    }

    register(fullName, email, password) {
        return api.post(AUTH_URL + 'signup', { fullName, email, password });
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
}

export default new AuthService();
