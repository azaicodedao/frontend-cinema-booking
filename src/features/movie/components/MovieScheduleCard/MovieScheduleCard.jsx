import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../../../../context/AuthContext';
import './MovieScheduleCard.css';

/**
 * Component Khối hiển thị Suất chiếu của 1 Phim ở trang Lịch Chiếu (Movies).
 * Hiển thị Poster thu gọn nằm ngang và các nút giờ chiếu bên cạnh. Bắt buộc đăng nhập để xem.
 *
 * @param {Object} props - Thuộc tính.
 * @param {Object} props.movie - Thông tin phim kèm theo mảng 'showtimes' tương ứng với ngày đang chọn.
 * @returns {JSX.Element} Card lịch chiếu ngang.
 */
const MovieScheduleCard = ({ movie }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useContext(AuthContext);

    const handleShowtimeClick = (showtimeId) => {
        // Chuyển hướng sang trang chọn ghế
        navigate(`/booking/seats/${showtimeId}`);
    };

    return (
        <div className="mst-card">
            <div className="mst-poster">
                {movie.posterUrl ? (
                    <img src={movie.posterUrl} alt={movie.title} />
                ) : (
                    <div className="pbg">🎬</div>
                )}
                <div className="mst-age">{movie.ageRating}</div>
            </div>
            
            <div className="mst-info">
                <div className="mst-title">{movie.title}</div>
                <div className="mst-meta">
                    {movie.genres && <span className="tag g">{movie.genres}</span>}
                    {movie.duration && <span className="tag">{movie.duration} phút</span>}
                    <span className="cg">★ {movie.rating || 'N/A'}</span>
                </div>
                
                <div className="st-group">
                    <div className="st-label">Suất chiếu:</div>
                    {!isAuthenticated ? (
                        <div className="st-guest-action">
                            <button 
                                className="btn-gold btn-small" 
                                onClick={() => navigate('/login', { state: { from: location } })}
                            >
                                Đăng nhập để xem suất chiếu
                            </button>
                        </div>
                    ) : (
                        <div className="stgrid">
                            {movie.showtimes && movie.showtimes.map((st) => (
                                <div 
                                    key={st.id} 
                                    className={`stc ${st.status === 'FULL' ? 'full' : ''}`}
                                    onClick={() => st.status !== 'FULL' && handleShowtimeClick(st.id)}
                                >
                                    <div className="sttime">{st.timeString || st.startTime}</div>
                                    <div className="stroom">{st.formatAndRoom || `${st.roomType} · ${st.roomName}`}</div>
                                    {st.status === 'FULL' ? (
                                        <div className="stfull">Hết vé</div>
                                    ) : (
                                        <div className="stavail">{st.availableSeats} ghế trống</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieScheduleCard;
