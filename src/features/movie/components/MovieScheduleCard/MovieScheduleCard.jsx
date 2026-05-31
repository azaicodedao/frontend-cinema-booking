import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../../../context/AuthContext';
import AuthModalContext from '../../../../context/AuthModalContext';
import { PATH_GENERATORS } from '../../../../config/routes';
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
    const { isAuthenticated } = useContext(AuthContext);
    const { openLogin } = useContext(AuthModalContext);
    const showtimes = Array.isArray(movie?.showtimes) ? movie.showtimes.filter(Boolean) : [];

    const handleShowtimeClick = (showtimeId) => {
        if (!showtimeId) return;

        // Chuyển hướng sang trang chọn ghế
        navigate(PATH_GENERATORS.seatSelection(showtimeId));
    };

    return (
        <div className="mst-card">
            <div className="mst-poster">
                {movie?.posterUrl ? (
                    <img src={movie.posterUrl} alt={movie?.title || 'Movie poster'} />
                ) : (
                    <div className="pbg">🎬</div>
                )}
                {movie?.ageRating && <div className="mst-age">{movie.ageRating}</div>}
            </div>
            
            <div className="mst-info">
                <div className="mst-title">{movie?.title || 'Chưa có tên phim'}</div>
                <div className="mst-meta">
                    {movie?.genres && <span className="tag g">{movie.genres}</span>}
                    {movie?.duration && <span className="tag">{movie.duration} phút</span>}
                    <span className="cg">★ {movie?.rating || 'N/A'}</span>
                </div>
                
                <div className="st-group">
                    <div className="st-label">Suất chiếu:</div>
                    {!isAuthenticated ? (
                        <div className="st-guest-action">
                            <button
                                className="btn-gold btn-small"
                                onClick={openLogin}
                            >
                                Đăng nhập để xem suất chiếu
                            </button>
                        </div>
                    ) : (
                        <div className="stgrid">
                            {showtimes.map((st) => {
                                const isFull = st.status === 'FULL';
                                const roomLabel = st.formatAndRoom || [st.roomType, st.roomName].filter(Boolean).join(' · ');
                                const availableSeats = st.availableSeats ?? 0;

                                return (
                                    <button
                                        type="button"
                                        key={st.id || `${st.startTime || 'unknown'}-${roomLabel || 'room'}`}
                                        className={`stc ${isFull ? 'full' : ''}`}
                                        disabled={isFull}
                                        onClick={() => handleShowtimeClick(st.id)}
                                    >
                                        <div className="sttime">{st.timeString || st.startTime || '--:--'}</div>
                                        {roomLabel && <div className="stroom">{roomLabel}</div>}
                                        {isFull ? (
                                            <div className="stfull">Hết vé</div>
                                        ) : (
                                            <div className="stavail">{availableSeats} ghế trống</div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieScheduleCard;
