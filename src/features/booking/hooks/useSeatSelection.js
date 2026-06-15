import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SeatApi from '../services/seat.api';
import BookingService from '../services/booking.api';
import { PATH_GENERATORS } from '../../../config/routes';
import useCountdown from './useCountdown';
import useSeatRealtime from './useSeatRealtime';

const HOLD_SECONDS = 10 * 60; 

const getUserId = (currentUser) => Number(currentUser?.id || currentUser?.user?.id || 0);

const useSeatSelection = ({ showtimeId, currentUser, navigate }) => {
  const [data, setData] = useState(null);// Lưu toàn bộ dữ liệu ghế (layout, trạng thái, giá...)
  const [selectedSeats, setSelectedSeats] = useState([]);// Lưu danh sách ghế đang được chọn
  const [loading, setLoading] = useState(true);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);// Đang tạo đơn hàng
  const isConfirmedRef = useRef(false); // Đã xác nhận đơn hàng
  const isBackRef = useRef(false); // Đã quay lại
  const selectedSeatsRef = useRef([]); // Lưu danh sách ghế đang được chọn
  const currentUserId = getUserId(currentUser);

  const countdown = useCountdown(HOLD_SECONDS, { enabled: selectedSeats.length > 0 });// Đồng hồ đếm ngược

  useEffect(() => {
    selectedSeatsRef.current = selectedSeats;
  }, [selectedSeats]);

  const fetchInitialData = useCallback(async () => {// Lấy dữ liệu ghế
    try {
      setLoading(true);
      const res = await SeatApi.getSeatSelection(showtimeId);// Gọi API lấy dữ liệu ghế
      if (res.data.statusCode === 200 && res.data.data) {
        const fetchedData = res.data.data;
        setData(fetchedData);

        if (currentUserId) {// Kiểm tra xem có user hiện tại không
          const mySeats = new Map();// Tạo Map để lưu ghế
          Object.values(fetchedData.seatsByRow || {}).forEach((row) => {// Duyệt qua từng hàng ghế
            row.forEach((seat) => {// Duyệt qua từng ghế trong hàng
              if (seat.status === 'HOLDING' && Number(seat.holdByUserId) === currentUserId) {// Nếu ghế đang được giữ bởi user hiện tại
                mySeats.set(seat.seatId, seat);// Thêm ghế vào Map
              }
            });
          });
          setSelectedSeats(Array.from(mySeats.values()));// Cập nhật danh sách ghế đã chọn
        }
      }
    } catch (error) {
      console.error('Failed to fetch seat data', error);
    } finally {
      setLoading(false);
    }
  }, [currentUserId, showtimeId]);

  useEffect(() => {// Gọi API lấy dữ liệu ghế khi component mount
    fetchInitialData();
  }, [fetchInitialData]);
// chạy khi Component bị phá hủy (người dùng thoát khỏi trang).
  useEffect(() => () => {// Giải phóng ghế khi component unmount 
    if (!isConfirmedRef.current && !isBackRef.current && selectedSeatsRef.current.length > 0) {// Kiểm tra xem người dùng đã xác nhận đơn hàng hoặc quay lại trang trước đó không, và số ghế đang được giữ có lớn hơn 0 không
      const seatIds = selectedSeatsRef.current.map((seat) => seat.seatId);// Lấy danh sách ghế
      SeatApi.releaseSeats(seatIds, showtimeId).catch((error) => {// Giải phóng ghế
        console.error('>>> [Cleanup] Loi khi giai phong ghe:', error);
      });
    }
  }, [showtimeId]);
// tìm đúng chiếc ghế trong sơ đồ (seatsByRow) và cập nhật lại trạng thái
  const updateSeatStatus = useCallback((update) => {// Cập nhật trạng thái ghế
    setData((prev) => {// Lưu trạng thái ghế
      if (!prev || !prev.seatsByRow) return prev;// Nếu không có dữ liệu thì trả về dữ liệu cũ
      const updatedRows = { ...prev.seatsByRow };
      const rowLabel = update.rowLetter;// Lấy hàng ghế

      if (updatedRows[rowLabel]) {
        updatedRows[rowLabel] = updatedRows[rowLabel].map((seat) => ( 
          seat.seatId === update.seatId 
            ? { ...seat, status: update.status, holdByUserId: update.holdByUserId } 
            : seat
        ));
      }

      return { ...prev, seatsByRow: updatedRows };// Trả về dữ liệu ghế đã cập nhật
    });

    if (update.status === 'AVAILABLE') {// Nếu trạng thái ghế là AVAILABLE
      setSelectedSeats((prev) => prev.filter((seat) => seat.seatId !== update.seatId)); // Lọc ra những ghế không được chọn
    }
  }, []);

  useSeatRealtime(showtimeId, updateSeatStatus);//lắng nghe sự thay đổi trạng thái ghế từ server

  const handleSeatClick = useCallback(async (seat) => {// xử lý khi người dùng click vào ghế
    const isSelected = selectedSeats.some((selectedSeat) => selectedSeat.seatId === seat.seatId);
    const isMyHold = Number(seat.holdByUserId) === currentUserId;

    if (seat.status === 'BOOKED' || (seat.status === 'HOLDING' && !isSelected && !isMyHold)) {// Nếu ghế đã được đặt hoặc đang được giữ bởi người dùng khác thì không cho phép chọn
      return;
    }

    try {
      if (isSelected || isMyHold) {// Nếu ghế đã được chọn hoặc đang được giữ bởi user hiện tại
        await SeatApi.releaseSeats([seat.seatId], showtimeId);// Giải phóng ghế
        setSelectedSeats((prev) => prev.filter((selectedSeat) => selectedSeat.seatId !== seat.seatId));
      } else {
        await SeatApi.holdSeats([seat.seatId], showtimeId);// Giữ ghế
        setSelectedSeats((prev) => (
          prev.some((selectedSeat) => selectedSeat.seatId === seat.seatId) ? prev : [...prev, seat]
        ));
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Thao tac that bai');
    }
  }, [currentUserId, selectedSeats, showtimeId]);

  const totalAmount = useMemo(// Tính tổng tiền ghế đã chọn
    () => selectedSeats.reduce((sum, seat) => sum + (seat.price || 0), 0),// Tính tổng tiền ghế đã chọn
    [selectedSeats],
  );

  const handleConfirmSeats = useCallback(async () => {// Xử lý khi người dùng xác nhận ghế
    if (selectedSeats.length === 0) return;// Nếu không có ghế nào được chọn thì không cho phép xác nhận

    setIsCreatingBooking(true);// Tạo đơn hàng
    const seatIds = selectedSeats.map((seat) => seat.seatId);// Lấy danh sách ghế

    try {
      const res = await BookingService.createBooking(showtimeId, seatIds);// Tạo đơn hàng
      const bookingId = res.data?.data?.bookingId || res.data?.bookingId || res.data?.data?.id || res.data?.id;// Lấy mã đơn hàng

      if (!bookingId) throw new Error('Khong lay duoc ma don hang');// Nếu không lấy được mã đơn hàng thì ném lỗi

      isConfirmedRef.current = true;// Đã xác nhận đơn hàng
      navigate(PATH_GENERATORS.pay(bookingId));// Chuyển sang trang thanh toán
    } catch (error) {// Xử lý lỗi
      alert(error.response?.data?.message || 'Khong the tao don hang. Vui long thu lai.');
    } finally {
      setIsCreatingBooking(false);// Tạo đơn hàng
    }
  }, [navigate, selectedSeats, showtimeId]);

  const handleBack = useCallback(() => {// Xử lý khi người dùng quay lại
    isBackRef.current = true;// Đã quay lại
    navigate(-1);// Quay lại trang trước
  }, [navigate]);

  return {// Trả về dữ liệu và các hàm xử lý
    data,
    rows: data?.seatsByRow || {},
    selectedSeats,
    loading,
    isCreatingBooking,
    currentUserId,
    totalAmount,
    countdown,
    handleSeatClick,
    handleConfirmSeats,
    handleBack,
  };
};

export default useSeatSelection;
