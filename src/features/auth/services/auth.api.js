import api from '../../../services/apiClient';

const AUTH_URL = 'auth/';

class AuthService {
    /**
     * Gửi yêu cầu đăng nhập lên hệ thống Backend.
     * @param {string} email - Địa chỉ email của người dùng.
     * @param {string} password - Mật khẩu bảo mật.
     * @returns {Promise<Object>} Trả về thông tin người dùng và token bảo mật nếu thành công.
     */
    login(email, password) {
        return api
            .post(AUTH_URL + 'signin', {
                email,
                password
            })
            .then(response => {
                if (response.data.data && response.data.data.accessToken) {
                    // Nếu đăng nhập thành công, nó sẽ lưu toàn bộ thông tin người dùng (bao gồm token) vào bộ nhớ trình duyệt dưới cái tên 'user'
                    // localStorage chỉ có thể lưu trữ dữ liệu dạng Chuỗi (String), nên ta phải biến Object người dùng thành chuỗi JSON trước khi lưu.
                    localStorage.setItem('user', JSON.stringify(response.data.data));
                }
                return response.data.data;
            });
    }

    /**
     * Đăng xuất người dùng khỏi hệ thống.
     * Xoá mọi phiên bản bộ nhớ tạm có chứa thông tin mật (Token).
     */
    logout() {
        // Xóa sạch cái nhãn 'user' mà hàm login đã tạo ra trước đó.
        localStorage.removeItem('user');
    }

    /**
     * Khởi tạo tài khoản mới.
     * @param {string} fullName - Tên hiển thị người dùng.
     * @param {string} email - Địa chỉ đăng nhập.
     * @param {string} password - Mật khẩu.
     * @returns {Promise<Object>}
     */
    register(fullName, email, password) {
        return api.post(AUTH_URL + 'signup', {
            fullName,
            email,
            password
        });
    }

    /**
     * Lấy ra dữ liệu hồ sơ cơ bản của phiên Đăng nhập hiện tại.
     * Thường dùng để check xem người dùng đã login hay chưa.
     * @returns {Object|null} Thông tin người dùng hoặc null.
     */
    getCurrentUser() {
        // Vì dữ liệu đang ở dạng Chuỗi, hàm này sẽ biến nó ngược lại thành một Object JavaScript
        return JSON.parse(localStorage.getItem('user'));
    }

    /**
     * Sử dụng Refresh Token để xin cấp lại Access Token mới khi thẻ cũ hết hạn.
     * Yêu cầu này giúp người dùng không bị Đăng xuất bất ngờ giữa chừng.
     * @param {string} refreshTokenStr - Mã khóa refresh dự trữ của phiên đăng nhập.
     * @returns {Promise<Object>} Phản hồi chứa Accesstoken mới.
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
/**
 * Thay vì export cả cái Class, file này export một đối tượng đã được khởi tạo sẵn (new). Điều này đảm bảo toàn bộ ứng dụng của bạn dùng chung một bộ máy xử lý duy nhất (Singleton Pattern), tránh việc tạo ra nhiều bản sao không cần thiết.
 */
