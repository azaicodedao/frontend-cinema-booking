import api from '../../../services/apiClient';

const AUTH_URL = 'auth/';

class AuthService {
    login(email, password) {
        return api
            .post(AUTH_URL + 'signin', {
                email,
                password
            })
            .then(response => {
                if (response.data.data && response.data.data.token) {
                    // Nếu đăng nhập thành công, nó sẽ lưu toàn bộ thông tin người dùng (bao gồm token) vào bộ nhớ trình duyệt dưới cái tên 'user'
                    // localStorage chỉ có thể lưu trữ dữ liệu dạng Chuỗi (String), nên ta phải biến Object người dùng thành chuỗi JSON trước khi lưu.
                    localStorage.setItem('user', JSON.stringify(response.data.data));
                }
                return response.data.data;
            });
    }

    logout() {
        // Xóa sạch cái nhãn 'user' mà hàm login đã tạo ra trước đó.
        localStorage.removeItem('user');
    }

    register(fullName, email, password) {
        return api.post(AUTH_URL + 'signup', {
            fullName,
            email,
            password
        });
    }

    getCurrentUser() {
        // Vì dữ liệu đang ở dạng Chuỗi, hàm này sẽ biến nó ngược lại thành một Object JavaScript
        return JSON.parse(localStorage.getItem('user'));
    }
}

export default new AuthService();
/**
 * Thay vì export cả cái Class, file này export một đối tượng đã được khởi tạo sẵn (new). Điều này đảm bảo toàn bộ ứng dụng của bạn dùng chung một bộ máy xử lý duy nhất (Singleton Pattern), tránh việc tạo ra nhiều bản sao không cần thiết.
 */
