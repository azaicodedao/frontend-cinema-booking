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
                // Backend trả về: { success: true, message: "...", data: { accessToken, refreshToken, user: { ... } } }
                const data = response.data.data || response.data; // Phòng hờ cấu trúc khác nhau
                console.log('[AuthService] RAW DATA FROM SERVER:', JSON.stringify(data));

                if (data && (data.accessToken || data.token)) {
                    const accessToken = data.accessToken || data.token;
                    const refreshToken = data.refreshToken;
                    const userDetails = data.user || {};
                    
                    // Lấy Role từ bất kỳ đâu có thể
                    let detectedRole = userDetails.role || data.role || (Array.isArray(userDetails.roles) ? userDetails.roles[0] : null);
                    
                    // ÉP BUỘC: Nếu là email admin hệ thống, luôn gán ADMIN
                    if (email === 'admin@cinema.com') {
                        console.warn('[AuthService] Forcing ADMIN role for system admin email');
                        detectedRole = 'ADMIN';
                    }

                    // Tạo object lưu trữ chuẩn cơm mẹ nấu
                    const userToStore = {
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        id: userDetails.id || data.id,
                        fullName: userDetails.fullName || data.fullName,
                        email: userDetails.email || data.email || email,
                        role: detectedRole, // Đây là trường quan trọng nhất
                        avatarUrl: userDetails.avatarUrl || data.avatarUrl
                    };
                    
                    console.log('[AuthService] FINAL USER OBJECT TO STORE:', userToStore);
                    localStorage.setItem('user', JSON.stringify(userToStore));
                    return userToStore;
                }
                
                throw new Error('Đăng nhập không thành công: Thiếu Token');
            });
    }

    logout() {
        localStorage.removeItem('user');
    }

    register(fullName, email, password) {
        return api.post(AUTH_URL + 'signup', { fullName, email, password });
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    refreshToken(refreshTokenStr) {
        return api
            .post(AUTH_URL + 'refreshtoken', {
                refreshToken: refreshTokenStr
            })
            .then(response => {
                const user = this.getCurrentUser();
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
