import api from '../../../services/apiClient';

/** Object chịu trách nhiệm gọi API xử lý các vấn đề xem/quản lý Vé điện tử của EndUser */
const TicketApi = {
  /** Xem lịch sử tất cả các loại vé đã từng chốt/đã lưu của user đang đăng nhập */
  getMyBookings() {
    return api.get('bookings/my').then((res) => res.data);
  },

  /** Xem chi tiết cụ thể 1 vé dựa vào ID đặt vé */
  getBookingById(id) {
    return api.get('bookings/' + id).then((res) => res.data);
  },
};

export default TicketApi;
