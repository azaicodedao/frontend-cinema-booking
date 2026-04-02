import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import SeatApi from '../services/seat.api.js';
import './SeatSelection.css';

const SeatSelection = () => {
    const { showtimeId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const stompClient = useRef(null);

    useEffect(() => {
        fetchInitialData();
        connectWebSocket();

        return () => {
            if (stompClient.current) {
                stompClient.current.deactivate();
            }
        };
    }, [showtimeId]);

    useEffect(() => {
        if (timeLeft > 0 && selectedSeats.length > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft, selectedSeats]);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const res = await SeatApi.getSeatSelection(showtimeId);
            if (res.data.status === 'success') {
                setData(res.data.data);
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
            if (!prev) return prev;
            const updatedMap = prev.seatMap.map(seat => {
                if (seat.seatId === update.seatId) {
                    return { ...seat, status: update.status, holdByUserId: update.holdByUserId };
                }
                return seat;
            });
            return { ...prev, seatMap: updatedMap };
        });
    };

    const handleSeatClick = async (seat) => {
        if (seat.status === 'BOOKED' || (seat.status === 'HOLDING' && !selectedSeats.find(s => s.seatId === seat.seatId))) {
            return;
        }

        const isSelected = selectedSeats.find(s => s.seatId === seat.seatId);

        try {
            if (isSelected) {
                // Release seat
                await SeatApi.releaseSeat(seat.seatId, showtimeId);
                setSelectedSeats(prev => prev.filter(s => s.seatId !== seat.seatId));
            } else {
                // Hold seat
                await SeatApi.holdSeat(seat.seatId, showtimeId);
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

    const totalAmount = selectedSeats.reduce((sum, s) => sum + s.price, 0);

    if (loading) return <div className="loading">Đang tải sơ đồ ghế...</div>;
    if (!data) return <div className="error">Không tìm thấy thông tin suất chiếu.</div>;

    // Group seats by row for rendering
    const rows = {};
    data.seatMap.forEach(seat => {
        if (!rows[seat.rowLabel]) rows[seat.rowLabel] = [];
        rows[seat.rowLabel].push(seat);
    });

    return (
        <div className="seat-selection-container">
            <button className="back" onClick={() => navigate(-1)}>← Quay lại</button>

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
                        disabled={selectedSeats.length === 0}
                        onClick={() => navigate('/booking/payment', { state: { selectedSeats, showtimeId, data } })}
                    >
                        Xác nhận ghế
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeatSelection;
