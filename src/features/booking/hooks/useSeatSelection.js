import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SeatApi from '../services/seat.api';
import BookingService from '../services/booking.api';
import { PATH_GENERATORS } from '../../../config/routes';
import useCountdown from './useCountdown';
import useSeatRealtime from './useSeatRealtime';

const HOLD_SECONDS = 10 * 60;

const getUserId = (currentUser) => Number(currentUser?.id || currentUser?.user?.id || 0);

const useSeatSelection = ({ showtimeId, currentUser, navigate }) => {
  const [data, setData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const isConfirmedRef = useRef(false);
  const isBackRef = useRef(false);
  const selectedSeatsRef = useRef([]);
  const currentUserId = getUserId(currentUser);

  const countdown = useCountdown(HOLD_SECONDS, { enabled: selectedSeats.length > 0 });

  useEffect(() => {
    selectedSeatsRef.current = selectedSeats;
  }, [selectedSeats]);

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await SeatApi.getSeatSelection(showtimeId);
      if (res.data.statusCode === 200 && res.data.data) {
        const fetchedData = res.data.data;
        setData(fetchedData);

        if (currentUserId) {
          const mySeats = new Map();
          Object.values(fetchedData.seatsByRow || {}).forEach((row) => {
            row.forEach((seat) => {
              if (seat.status === 'HOLDING' && Number(seat.holdByUserId) === currentUserId) {
                mySeats.set(seat.seatId, seat);
              }
            });
          });
          setSelectedSeats(Array.from(mySeats.values()));
        }
      }
    } catch (error) {
      console.error('Failed to fetch seat data', error);
    } finally {
      setLoading(false);
    }
  }, [currentUserId, showtimeId]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => () => {
    if (!isConfirmedRef.current && !isBackRef.current && selectedSeatsRef.current.length > 0) {
      const seatIds = selectedSeatsRef.current.map((seat) => seat.seatId);
      SeatApi.releaseSeats(seatIds, showtimeId).catch((error) => {
        console.error('>>> [Cleanup] Loi khi giai phong ghe:', error);
      });
    }
  }, [showtimeId]);

  const updateSeatStatus = useCallback((update) => {
    setData((prev) => {
      if (!prev || !prev.seatsByRow) return prev;
      const updatedRows = { ...prev.seatsByRow };
      const rowLabel = update.rowLetter;

      if (updatedRows[rowLabel]) {
        updatedRows[rowLabel] = updatedRows[rowLabel].map((seat) => (
          seat.seatId === update.seatId
            ? { ...seat, status: update.status, holdByUserId: update.holdByUserId }
            : seat
        ));
      }

      return { ...prev, seatsByRow: updatedRows };
    });

    if (update.status === 'AVAILABLE') {
      setSelectedSeats((prev) => prev.filter((seat) => seat.seatId !== update.seatId));
    }
  }, []);

  useSeatRealtime(showtimeId, updateSeatStatus);

  const handleSeatClick = useCallback(async (seat) => {
    const isSelected = selectedSeats.some((selectedSeat) => selectedSeat.seatId === seat.seatId);
    const isMyHold = Number(seat.holdByUserId) === currentUserId;

    if (seat.status === 'BOOKED' || (seat.status === 'HOLDING' && !isSelected && !isMyHold)) {
      return;
    }

    try {
      if (isSelected || isMyHold) {
        await SeatApi.releaseSeats([seat.seatId], showtimeId);
        setSelectedSeats((prev) => prev.filter((selectedSeat) => selectedSeat.seatId !== seat.seatId));
      } else {
        await SeatApi.holdSeats([seat.seatId], showtimeId);
        setSelectedSeats((prev) => (
          prev.some((selectedSeat) => selectedSeat.seatId === seat.seatId) ? prev : [...prev, seat]
        ));
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Thao tac that bai');
    }
  }, [currentUserId, selectedSeats, showtimeId]);

  const totalAmount = useMemo(
    () => selectedSeats.reduce((sum, seat) => sum + (seat.price || 0), 0),
    [selectedSeats],
  );

  const handleConfirmSeats = useCallback(async () => {
    if (selectedSeats.length === 0) return;

    setIsCreatingBooking(true);
    const seatIds = selectedSeats.map((seat) => seat.seatId);

    try {
      const res = await BookingService.createBooking(showtimeId, seatIds);
      const bookingId = res.data?.data?.bookingId || res.data?.bookingId || res.data?.data?.id || res.data?.id;

      if (!bookingId) throw new Error('Khong lay duoc ma don hang');

      isConfirmedRef.current = true;
      navigate(PATH_GENERATORS.pay(bookingId));
    } catch (error) {
      alert(error.response?.data?.message || 'Khong the tao don hang. Vui long thu lai.');
    } finally {
      setIsCreatingBooking(false);
    }
  }, [navigate, selectedSeats, showtimeId]);

  const handleBack = useCallback(() => {
    isBackRef.current = true;
    navigate(-1);
  }, [navigate]);

  return {
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
