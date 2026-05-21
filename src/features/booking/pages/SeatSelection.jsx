import React, { useEffect, useState, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import SeatApi from '../services/seat.api.js';
import BookingService from '../services/booking.api';
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
    const [isCreatingBooking, setIsCreatingBooking] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const stompClient = useRef(null);

    const isConfirmedRef = useRef(false);
    const isBackRef = useRef(false);
    const selectedSeatsRef = useRef([]);

    // Lấy userId an toàn từ context (hỗ trợ cả cấu trúc phẳng và lồng)
    const currentUserId = Number(currentUser?.id || currentUser?.user?.id || 0);

    useEffect(() => {
        selectedSeatsRef.current = selectedSeats;
    }, [selectedSeats]);

    // Effect: Load dữ liệu ban đầu và kết nối WebSocket
    useEffect(() => {
        fetchInitialData();
        connectWebSocket();

        return () => {
            if (stompClient.current) {
                stompClient.current.deactivate();
            }
        };
    }, [showtimeId]);

    // Effect: Cleanup ghế khi thoát luồng
    useEffect(() => {
        return () => {
            if (!isConfirmedRef.current && !isBackRef.current && selectedSeatsRef.current.length > 0) {
                const seatIds = selectedSeatsRef.current.map(s => s.seatId);
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

                // Khôi phục ghế đã chọn ngay tại đây (chỉ chạy 1 lần khi load)
                // Dùng Map theo seatId để đảm bảo không trùng lặp
                const userId = Number(currentUser?.id || currentUser?.user?.id || 0);
                if (userId) {
                    const mySeats = new Map();
                    Object.values(fetchedData.seatsByRow).forEach(row => {
                        row.forEach(seat => {
                            if (seat.status === 'HOLDING' && Number(seat.holdByUserId) === userId) {
                                mySeats.set(seat.seatId, seat);
                            }
                        });
                    });
                    setSelectedSeats(Array.from(mySeats.values()));
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
                client.subscribe(`/topic/showtime/${showtimeId}`, (message) => {
                    const statusUpdate = JSON.parse(message.body);
                    updateSeatStatus(statusUpdate);
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
            },
        });

        client.activate();
        stompClient.current = client;
    };

    const updateSeatStatus = (update) => {
        // Cập nhật sơ đồ ghế
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

        // Nếu ghế chuyển sang AVAILABLE, xóa khỏi danh sách đang chọn
        if (update.status === 'AVAILABLE') {
            setSelectedSeats(prev => prev.filter(s => s.seatId !== update.seatId));
        }
    };

    const handleSeatClick = async (seat) => {
        const isSelected = selectedSeats.find(s => s.seatId === seat.seatId);
        const isMyHold = Number(seat.holdByUserId) === currentUserId;

        // Chặn: ghế đã đặt hoặc đang giữ bởi người khác
        if (seat.status === 'BOOKED' || (seat.status === 'HOLDING' && !isSelected && !isMyHold)) {
            return;
        }

        try {
            if (isSelected || isMyHold) {
                // Release ghế (Backend sẽ tự hủy booking PENDING nếu cần)
                await SeatApi.releaseSeats([seat.seatId], showtimeId);
                setSelectedSeats(prev => prev.filter(s => s.seatId !== seat.seatId));
            } else {
                // Hold ghế mới (Backend sẽ tự hủy booking PENDING cũ trước khi hold)
                await SeatApi.holdSeats([seat.seatId], showtimeId);
                // Chống trùng lặp: kiểm tra seatId trước khi thêm
                setSelectedSeats(prev => 
                    prev.find(s => s.seatId === seat.seatId) ? prev : [...prev, seat]
                );
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

    const totalAmount = selectedSeats.reduce((sum, seat) => sum + (seat.price || 0), 0);

    const handleConfirmSeats = async () => {
        if (selectedSeats.length === 0) return;
        
        setIsCreatingBooking(true);
        const seatIds = selectedSeats.map(s => s.seatId);
        
        try {
            const res = await BookingService.createBooking(showtimeId, seatIds);
            const bookingId = res.data?.data?.bookingId || res.data?.bookingId || res.data?.data?.id || res.data?.id;
            
            if (bookingId) {
                isConfirmedRef.current = true;
                navigate(`/pay/${bookingId}`);
            } else {
                throw new Error("Không lấy được mã đơn hàng");
            }
        } catch (error) {
            alert(error.response?.data?.message || "Không thể tạo đơn hàng. Vui lòng thử lại.");
        } finally {
            setIsCreatingBooking(false);
        }
    };

    if (loading) return (
        <div className="seat-selection-container" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh'}}>
            <div style={{textAlign:'center'}}>
                <div className="spinner" style={{margin:'0 auto 16px'}}></div>
                <div style={{color:'var(--t2)',fontSize:14}}>Đang tải sơ đồ ghế...</div>
            </div>
        </div>
    );
    if (!data) return (
        <div className="seat-selection-container" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh'}}>
            <div style={{textAlign:'center',color:'var(--t2)'}}>
                <div style={{fontSize:48,marginBottom:16}}>🎬</div>
                <div style={{fontSize:16}}>Không tìm thấy thông tin suất chiếu.</div>
                <button className="back" onClick={() => navigate(-1)} style={{marginTop:20}}>← Quay lại</button>
            </div>
        </div>
    );

    const rows = data.seatsByRow || {};

    return (
        <div className="seat-selection-container">
            <button className="back" onClick={() => { isBackRef.current = true; navigate(-1); }}>
                ← Quay lại
            </button>

            <div className="sibar">
                <div>
                    <div className="smtitle">{data.movieTitle}</div>
                    <div className="smmeta">
                        {new Date(data.startTime).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' })} 
                        {' · '}{new Date(data.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} 
                        {' · '}{data.roomName}
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
                <div className="legit"><div className="legdot" style={{ background: 'var(--seat-avail)', borderColor: 'var(--seat-avail-border)' }}></div>Trống</div>
                <div className="legit"><div className="legdot" style={{ background: 'var(--gold)', borderColor: 'var(--gold)' }}></div>Đang chọn</div>
                <div className="legit"><div className="legdot" style={{ background: 'var(--seat-holding)', borderColor: 'rgba(78, 143, 255, 0.35)' }}></div>Đang giữ</div>
                <div className="legit"><div className="legdot" style={{ background: 'var(--seat-booked)', opacity: 0.3 }}></div>Đã đặt</div>
                <div className="legit"><div className="legdot" style={{ background: 'linear-gradient(180deg, rgba(232,160,32,0.35) 0%, rgba(232,160,32,0.1) 100%)', borderColor: 'rgba(232,160,32,0.45)', boxShadow: '0 0 6px rgba(232,160,32,0.12)' }}></div>VIP</div>
            </div>

            <div className="seat-grid-container">
                <div className="seat-grid">
                    {Object.keys(rows).sort().map(rowLabel => (
                        <div key={rowLabel} className="seat-row">
                            <div className="row-label">{rowLabel}</div>
                            {rows[rowLabel].sort((a,b) => a.colNumber - b.colNumber).map(seat => {
                                const isSelected = selectedSeats.find(s => s.seatId === seat.seatId);
                                const isMyHold = Number(seat.holdByUserId) === currentUserId;
                                
                                const statusClass = (isSelected || isMyHold) ? 'selected' : seat.status.toLowerCase();
                                const typeClass = seat.seatType.toLowerCase();
                                
                                return (
                                    <button
                                        key={seat.seatId}
                                        className={`seat-btn ${statusClass} ${typeClass}`}
                                        onClick={() => handleSeatClick(seat)}
                                        disabled={seat.status === 'BOOKED' || (seat.status === 'HOLDING' && !isSelected && !isMyHold)}
                                        title={`${seat.rowLabel}${seat.colNumber} · ${seat.seatType} · ${seat.price.toLocaleString()}đ`}
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
                        {selectedSeats.length > 0
                            ? selectedSeats.map(s => `${s.rowLabel}${s.colNumber}`).join(', ')
                            : <span style={{color:'var(--t3)', fontWeight:400}}>Chọn ghế trên sơ đồ</span>
                        }
                    </div>
                </div>
                <div className="price-box">
                    <div className="stot">{totalAmount.toLocaleString()} đ</div>
                    <button 
                        className="btn-cta" 
                        disabled={selectedSeats.length === 0 || isCreatingBooking}
                        onClick={handleConfirmSeats}
                    >
                        {isCreatingBooking ? 'Đang xử lý...' : `Xác nhận ${selectedSeats.length > 0 ? selectedSeats.length + ' ghế' : ''}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeatSelection;
