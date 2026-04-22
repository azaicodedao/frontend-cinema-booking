import React, { useEffect, useState, useRef, useContext } from 'react';
 import { useParams, useNavigate } from 'react-router-dom';
 import SockJS from 'sockjs-client';
 import { Client } from '@stomp/stompjs';
 import SeatApi from '../services/seat.api.js';
 import BookingService from '../services/booking.api'; // Thêm API quản lý Đặt vé
 import AuthContext from '../../../context/AuthContext';
 import './SeatSelection.css';

/**
 * Component Chọn ghế (Seat Selection)
 * Cho phép người dùng chọn chỗ, giữ chỗ qua WebSocket và tạo đơn hàng (Booking).
 */
const SeatSelection = () => {
    const { showtimeId } = useParams();
     const navigate = useNavigate();
     const { currentUser } = useContext(AuthContext);
     const [data, setData] = useState(null);
     const [selectedSeats, setSelectedSeats] = useState([]);
     const [loading, setLoading] = useState(true);
     const [isCreatingBooking, setIsCreatingBooking] = useState(false); // Trạng thái đang tạo đơn hàng
     const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const stompClient = useRef(null);

    const isConfirmedRef = useRef(false); // Đánh dấu nếu người dùng nhấn Xác nhận ghế
    const isBackRef = useRef(false); // Đánh dấu nếu người dùng nhấn nút 'Quay lại' trong UI
    const selectedSeatsRef = useRef([]); // Lưu danh sách ghế mới nhất để dùng trong cleanup

    // Đồng bộ Ref với State mỗi khi selectedSeats thay đổi
    useEffect(() => {
        selectedSeatsRef.current = selectedSeats;
    }, [selectedSeats]);

    // Effect 1: Quản lý WebSocket (Chỉ chạy 1 lần khi mount)
    useEffect(() => {
        fetchInitialData();
        connectWebSocket();

        return () => {
            if (stompClient.current) {
                console.log('>>> [WS] Deactivating WebSocket...');
                stompClient.current.deactivate();
            }
        };
    }, [showtimeId]);

    // Effect 2: Tự động giải phóng ghế khi RỜI KHỎI trang (Chỉ chạy khi Unmount)
    useEffect(() => {
        return () => {
            // PHƯƠNG ÁN B: Chỉ giải phóng nếu KHÔNG nhấn Xác nhận và KHÔNG nhấn Quay lại (tức là đi ra ngoài luồng đặt vé)
            if (!isConfirmedRef.current && !isBackRef.current && selectedSeatsRef.current.length > 0) {
                const seatIds = selectedSeatsRef.current.map(s => s.seatId);
                console.log(">>> [Cleanup] Tự động giải phóng ghế (Thoát luồng):", seatIds);
                SeatApi.releaseSeats(seatIds, showtimeId).catch(err => 
                    console.error(">>> [Cleanup] Lỗi khi giải phóng ghế:", err)
                );
            }
        };
    }, [showtimeId]); 

    useEffect(() => {
        if (timeLeft > 0 && selectedSeats.length > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft, selectedSeats.length > 0]);

    const fetchInitialData = async () => {
         try {
             setLoading(true);
             const res = await SeatApi.getSeatSelection(showtimeId);
             if (res.data.statusCode === 200 && res.data.data) {
                 const fetchedData = res.data.data;
                 setData(fetchedData);
 
                 // Khôi phục danh sách ghế đã chọn nếu người dùng quay lại trang
                 if (currentUser?.user?.id) {
                     const userId = currentUser.user.id;
                     const alreadySelected = [];
                     Object.values(fetchedData.seatsByRow).forEach(row => {
                         row.forEach(seat => {
                             if (seat.status === 'HOLDING' && seat.holdByUserId === userId) {
                                 alreadySelected.push(seat);
                             }
                         });
                     });
                     if (alreadySelected.length > 0) {
                         setSelectedSeats(alreadySelected);
                     }
                 }
             }
         } catch (error) {
             console.error("Failed to fetch seat data", error);
         } finally {
             setLoading(false);
         }
     };

    const connectWebSocket = () => {
        const socket = new SockJS('http://localhost:8080/ws-cinema');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log('Connected to WebSocket');
                client.subscribe(`/topic/showtime/${showtimeId}`, (message) => {
                    const statusUpdate = JSON.parse(message.body);
                    updateSeatStatus(statusUpdate);
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        client.activate();
        stompClient.current = client;
    };

    const updateSeatStatus = (update) => {
        setData(prev => {
            if (!prev || !prev.seatsByRow) return prev;
            const updatedRows = { ...prev.seatsByRow };
            const rowLabel = update.rowLetter;
            
            if (updatedRows[rowLabel]) {
                updatedRows[rowLabel] = updatedRows[rowLabel].map(seat => {
                    if (seat.seatId === update.seatId) {
                        return { ...seat, status: update.status, holdByUserId: update.holdByUserId };
                    }
                    return seat;
                });
            }
            return { ...prev, seatsByRow: updatedRows };
        });
    };

    const handleSeatClick = async (seat) => {
        if (seat.status === 'BOOKED' || (seat.status === 'HOLDING' && !selectedSeats.find(s => s.seatId === seat.seatId))) {
            return;
        }

        const isSelected = selectedSeats.find(s => s.seatId === seat.seatId);

        try {
            if (isSelected) {
                // Release seat (Batch mode)
                await SeatApi.releaseSeats([seat.seatId], showtimeId);
                setSelectedSeats(prev => prev.filter(s => s.seatId !== seat.seatId));
            } else {
                // Hold seat (Batch mode)
                await SeatApi.holdSeats([seat.seatId], showtimeId);
                setSelectedSeats(prev => [...prev, seat]);
            }
        } catch (error) {
            alert(error.response?.data?.message || "Thao tác thất bại");
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    /**
     * Xử lý xác nhận ghế và tạo đơn hàng (Booking).
     * Gửi danh sách ID ghế đã chọn lên Backend, sau đó điều hướng đến trang thanh toán.
     */
    /**
     * Tính tổng tiền dựa trên số lượng ghế đã chọn và giá của suất chiếu.
     * Nếu lấy được giá từ từng ghế thì dùng, nếu không thì lấy giá mặc định của Suất chiếu.
     */
    const ticketPrice = data?.price || 0;
    const totalAmount = selectedSeats.length * ticketPrice;

    /**
     * Xử lý xác nhận ghế và tạo đơn hàng (Booking).
     * Gửi danh sách ID ghế đã chọn lên Backend, sau đó điều hướng đến trang thanh toán.
     */
    const handleConfirmSeats = async () => {
        if (selectedSeats.length === 0) return;
        
        setIsCreatingBooking(true);
        const seatIds = selectedSeats.map(s => s.seatId);
        
        console.log(">>> [Booking] Bắt đầu tạo đơn hàng...");
        console.log(">>> [Booking] Showtime ID:", showtimeId);
        console.log(">>> [Booking] Seat IDs:", seatIds);
        console.log(">>> [Booking] Tổng tiền:", totalAmount);

        try {
            const res = await BookingService.createBooking(showtimeId, seatIds, totalAmount);
            console.log(">>> [Booking] Phản hồi từ Server:", res.data);
            
            // Backend trả về data chứa bookingId
            const bookingId = res.data?.data?.bookingId || res.data?.bookingId || res.data?.data?.id || res.data?.id;
            
            if (bookingId) {
                console.log(">>> [Booking] Tạo thành công! ID:", bookingId);
                isConfirmedRef.current = true; // Đánh dấu đã xác nhận để useEffect cleanup không giải phóng ghế
                navigate(`/pay/${bookingId}`); // Điều hướng sang trang thanh toán với ID đơn hàng
            } else {
                console.error(">>> [Booking] Lỗi: Không tìm thấy bookingId trong phản hồi", res.data);
                throw new Error("Không lấy được mã đơn hàng (Booking ID)");
            }
        } catch (error) {
            console.error(">>> [Booking] LỖI khi tạo đặt vé:", error);
            if (error.response) {
                console.error(">>> [Booking] Chi tiết lỗi từ Server:", error.response.status, error.response.data);
            }
            alert(error.response?.data?.message || "Không thể tạo đơn hàng. Vui lòng thử lại.");
        } finally {
            setIsCreatingBooking(false);
        }
    };


    if (loading) return <div className="loading">Đang tải sơ đồ ghế...</div>;
    if (!data) return <div className="error">Không tìm thấy thông tin suất chiếu.</div>;

    const rows = data.seatsByRow || {};

    return (
        <div className="seat-selection-container">
            <button 
                className="back" 
                onClick={() => { 
                    isBackRef.current = true; // Đánh dấu là đang quay lại trang trước, không giải phóng ghế
                    navigate(-1); 
                }}
            >
                ← Quay lại
            </button>

            <div className="sibar">
                <div>
                    <div className="smtitle">{data.movieTitle}</div>
                    <div className="smmeta">
                        {new Date(data.startTime).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' })} 
                        · {new Date(data.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} 
                        · {data.roomName}
                    </div>
                </div>
                <div className="countdown-box">
                    <div className="cd">{formatTime(timeLeft)}</div>
                    <div className="cdlbl">Thời gian giữ chỗ</div>
                </div>
            </div>

            <div className="screen-container">
                <div className="scrbar"></div>
                <div className="scrtt">Màn hình</div>
            </div>

            <div className="legrow">
                <div className="legit"><div className="legdot" style={{ background: 'var(--seat-avail)' }}></div>Trống</div>
                <div className="legit"><div className="legdot" style={{ background: 'var(--gold)' }}></div>Đang chọn</div>
                <div className="legit"><div className="legdot" style={{ background: 'var(--seat-holding)' }}></div>Đang giữ</div>
                <div className="legit"><div className="legdot" style={{ background: 'var(--seat-booked)', opacity: 0.3 }}></div>Đã đặt</div>
            </div>

            <div className="seat-grid-container">
                <div className="seat-grid">
                    {Object.keys(rows).sort().map(rowLabel => (
                        <div key={rowLabel} className="seat-row">
                            <div className="row-label">{rowLabel}</div>
                            {rows[rowLabel].sort((a,b) => a.colNumber - b.colNumber).map(seat => {
                                const isSelected = selectedSeats.find(s => s.seatId === seat.seatId);
                                const statusClass = isSelected ? 'selected' : seat.status.toLowerCase();
                                const typeClass = seat.seatType.toLowerCase();
                                
                                return (
                                    <button
                                        key={seat.seatId}
                                        className={`seat-btn ${statusClass} ${typeClass}`}
                                        onClick={() => handleSeatClick(seat)}
                                        disabled={seat.status === 'BOOKED' || (seat.status === 'HOLDING' && !isSelected)}
                                        title={`${seat.rowLabel}${seat.colNumber} - ${seat.price.toLocaleString()}đ`}
                                    >
                                        {seat.colNumber}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <div className="sfoot">
                <div className="sel-info">
                    <div className="sel-count">Đã chọn: <strong>{selectedSeats.length}</strong> ghế</div>
                    <div className="sel-names">
                        {selectedSeats.map(s => `${s.rowLabel}${s.colNumber}`).join(', ')}
                    </div>
                </div>
                <div className="price-box">
                    <div className="stot">{totalAmount.toLocaleString()} đ</div>
                    <button 
                        className="btn-cta" 
                        disabled={selectedSeats.length === 0 || isCreatingBooking}
                        onClick={handleConfirmSeats}
                    >
                        {isCreatingBooking ? 'Đang xử lý...' : 'Xác nhận ghế'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeatSelection;
