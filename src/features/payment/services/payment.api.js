import api from '../../../services/apiClient';

/** Object chịu trách nhiệm gọi lên Hệ thống xử lý Đặt Vé & Thanh toán */
const PaymentApi = {
  /** Lấy chi tiết thông tin của 1 Lệnh đặt vé bao gồm cả số tiền, ghế đã chọn và Bộ đếm ngược (countdown) */
  getBookingById(bookingId) {
    return api.get('bookings/' + bookingId);
  },

  /**
   * Gọi API xác nhận thanh toán đơn vé.
   * @param {number|string} bookingId - Mã lệnh đặt vé.
   * @param {string} paymentMethod - Phương thức thanh toán (CASH, MOMO, VNPAY).
   */
  pay(bookingId, paymentMethod = 'VNPAY') {
    // Nếu chọn Thẻ ngân hàng (bank), ánh xạ sang giá trị CASH trong Enum của Database
    const method = paymentMethod === 'bank' ? 'CASH' : paymentMethod.toUpperCase();
    return api.post(`bookings/${bookingId}/pay?paymentMethod=${method}`).then((res) => res.data);
  },
};

export default PaymentApi;
