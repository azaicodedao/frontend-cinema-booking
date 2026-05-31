import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../../../context/AuthContext';
import CustomerSeatMap from '../components/CustomerSeatMap/CustomerSeatMap';
import CustomerSeatLegend from '../components/CustomerSeatLegend/CustomerSeatLegend';
import useSeatSelection from '../hooks/useSeatSelection';
import { formatCountdown, formatCurrency, formatDate, formatTime } from '../../../utils/format';
import './SeatSelection.css';

const SeatSelection = () => {
    const { showtimeId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);

    const {
        data,
        rows,
        selectedSeats,
        loading,
        isCreatingBooking,
        currentUserId,
        totalAmount,
        countdown,
        handleSeatClick,
        handleConfirmSeats,
        handleBack,
    } = useSeatSelection({ showtimeId, currentUser, navigate });

    if (loading) return (
        <div className="seat-selection-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto 16px' }} />
                <div style={{ color: 'var(--t2)', fontSize: 14 }}>Đang tải sơ đồ ghế...</div>
            </div>
        </div>
    );

    if (!data) return (
        <div className="seat-selection-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ textAlign: 'center', color: 'var(--t2)' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
                <div style={{ fontSize: 16 }}>Không tìm thấy thông tin suất chiếu.</div>
                <button className="back" onClick={() => navigate(-1)} style={{ marginTop: 20 }}>← Quay lại</button>
            </div>
        </div>
    );

    return (
        <div className="seat-selection-container">
            <button className="back" onClick={handleBack}>
                ← Quay lại
            </button>

            <div className="sibar">
                <div>
                    <div className="smtitle">{data.movieTitle}</div>
                    <div className="smmeta">
                        {formatDate(data.startTime)}
                        {' · '}
                        {formatTime(data.startTime)}
                        {' · '}
                        {data.roomName}
                    </div>
                </div>
                <div className="countdown-box">
                    <div className="cd">{formatCountdown(countdown.secondsLeft)}</div>
                    <div className="cdlbl">Thời gian giữ chỗ</div>
                </div>
            </div>

            <div className="screen-container">
                <div className="scrbar" />
                <div className="scrtt">Màn hình</div>
            </div>

            <CustomerSeatLegend />

            <CustomerSeatMap
                rows={rows}
                selectedSeats={selectedSeats}
                currentUserId={currentUserId}
                onSeatClick={handleSeatClick}
            />

            <div className="sfoot">
                <div className="sel-info">
                    <div className="sel-count">Đã chọn: <strong>{selectedSeats.length}</strong> ghế</div>
                    <div className="sel-names">
                        {selectedSeats.length > 0
                            ? selectedSeats.map((seat) => `${seat.rowLabel}${seat.colNumber}`).join(', ')
                            : <span style={{ color: 'var(--t3)', fontWeight: 400 }}>Chọn ghế trên sơ đồ</span>
                        }
                    </div>
                </div>
                <div className="price-box">
                    <div className="stot">{formatCurrency(totalAmount)}</div>
                    <button
                        className="btn-cta"
                        disabled={selectedSeats.length === 0 || isCreatingBooking}
                        onClick={handleConfirmSeats}
                    >
                        {isCreatingBooking ? 'Đang xử lý...' : `Xác nhận ${selectedSeats.length > 0 ? `${selectedSeats.length} ghế` : ''}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeatSelection;
