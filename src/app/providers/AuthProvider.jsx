import React, { useState, useEffect, useCallback } from 'react';
import AuthContext from '../../context/AuthContext';
import AuthService from '../../features/auth/services/auth.api';

const AuthProvider = ({ children }) => {
  // Tạo ra một "biến trạng thái" để lưu thông tin người dùng. Mọi Component trong App sẽ nhìn vào biến currentUser này để biết ai đang online.
  const [currentUser, setCurrentUser] = useState(null);
  
  /**
   * Nhiệm vụ: Khi người dùng F5 (làm mới) trang web, React sẽ bị reset.
   * Cách giải quyết: useEffect này chạy ngay khi App vừa load. Nó gọi vào AuthService (thường là lấy từ localStorage hoặc Cookie) để xem trước đó đã đăng nhập chưa. Nếu có thì "hồi sinh" lại trạng thái đăng nhập ngay lập tức.
   */
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  /**
   * Tại đây bạn sử dụng useCallback để tối ưu hiệu năng (tránh việc tạo lại hàm mỗi khi Component re-render).
   */
  /** Gọi API đăng nhập qua AuthService. Nếu thành công, nó cập nhật currentUser để cả ứng dụng nhận diện được người dùng mới. */
  const login = useCallback(async (email, password) => {
    const userData = await AuthService.login(email, password);
    setCurrentUser(userData);
    return userData;
  }, []);

  /** Xóa dữ liệu ở cả "kho lưu trữ" (AuthService.logout) và xóa luôn trạng thái trong React (setCurrentUser(null)). */
  const logout = useCallback(() => {
    AuthService.logout();
    setCurrentUser(null);
  }, []);

  const isAuthenticated = !!currentUser; // Biến currentUser thành kiểu boolean. Có user = true, không có = false
  const isAdmin = currentUser?.roles?.includes('ADMIN') || false; // Kiểm tra nhanh xem trong mảng roles của người dùng có quyền ADMIN hay không. Bạn sẽ dùng biến này để ẩn/hiện menu quản trị.

/**Cấu trúc thực tế của AuthContext sau khi khởi tạo
{
  Provider: { $$typeof: Symbol(react.provider), ... },
  Consumer: { $$typeof: Symbol(react.context), ... },
  _currentValue: { ... }, // Giá trị mặc định bạn truyền vào ban đầu 
  ... các thuộc tính nội bộ khác của React
}
*/
  return (
    <AuthContext.Provider // Đây chính là "Trạm phát sóng".
      value={{ // Tất cả những gì bạn bỏ vào object này sẽ được "phát" đi toàn bộ ứng dụng.
        currentUser,
        setCurrentUser,
        login,
        logout,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children} {/* Đại diện cho toàn bộ các Component con của App. Nhờ có dòng này mà bạn có thể bọc AuthProvider quanh App trong file index.js hoặc main.js. */}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
/**
 * Nếu file AuthContext.js là "Bản thiết kế", thì file AuthProvider.js này chính là "Nhà máy vận hành" thực tế.
 * Đây là nơi bạn thực hiện các logic thực sự như gọi API, lưu dữ liệu vào bộ nhớ, và kiểm tra quyền hạn
 */

/** Giải thích cơ chế:
 * Khi một Component con gọi useContext(AuthContext), React sẽ đi tìm xem có cái <AuthContext.Provider> nào đang bao bọc nó không.
 * Trường hợp 1 (Có Provider): React sẽ lấy giá trị từ thuộc tính value={...} của Provider đó để dùng.
 * Trường hợp 2 (Quên không dùng Provider): Nếu bạn để một Component "mồ côi" (không nằm trong Provider) mà lại đòi dùng useContext, thì React sẽ lấy chính cái Object mặc định này để trả về. Nó giúp ứng dụng không bị crash (văng lỗi) vì các biến như login hay logout vẫn tồn tại (dù nó chẳng làm gì cả).
 */
