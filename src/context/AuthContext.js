import { createContext } from 'react';

const AuthContext = createContext({ // giá trị mặc định cho Context này được tạo khi gọi
  currentUser: null, //  Lưu trữ thông tin của người dùng đang đăng nhập (ví dụ: một object chứa {id, name, email}). Mặc định là null vì khi mới mở app, chưa có ai đăng nhập.
  setCurrentUser: () => {}, // Một hàm rỗng đóng vai trò là "giữ chỗ" (placeholder). Sau này, bạn sẽ thay thế nó bằng hàm setState thực tế để cập nhật lại currentUser
  login: () => {},
  register: () => {},
  logout: () => {},
  isAuthenticated: false, // Một biến kiểu Boolean (đúng/sai) để kiểm tra nhanh xem người dùng đã đăng nhập hay chưa (thường dùng để bảo vệ các Router)
  isAdmin: false,
  isInitialized: false,
});

export default AuthContext;
// 1. Mục đích AuthContext
/**
 * Trong một ứng dụng React, thông tin người dùng (tên, email, quyền hạn) thường được dùng ở rất nhiều nơi (Header, Profile, Trang quản trị...).
 *  Thay vì phải truyền dữ liệu qua từng cấp độ Component (Prop Drilling), AuthContext tạo ra một "kho lưu trữ chung" mà bất kỳ Component nào cũng có thể truy cập được.
 * -> định dạng/lưu trữ thông tin người dùng
 */
