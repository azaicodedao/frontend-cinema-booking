import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieScheduleCard.css';

const MovieScheduleCard = ({ movie }) => {
    const navigate = useNavigate();

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
                    <span className="tag g">{movie.genres}</span>
                    <span className="tag">{movie.duration} phút</span>
                    <span className="cg">★ {movie.rating || 'N/A'}</span>
                </div>
                
                <div className="st-group">
                    <div className="st-label">Suất chiếu:</div>
                    <div className="stgrid">
                        {movie.showtimes && movie.showtimes.map((st) => (
                            <div 
                                key={st.id} 
                                className={`stc ${st.availableSeats === 0 ? 'full' : ''}`}
                                onClick={() => st.availableSeats > 0 && handleShowtimeClick(st.id)}
                            >
                                <div className="sttime">{st.startTime}</div>
                                <div className="stroom">{st.roomType} · {st.roomName}</div>
                                {st.availableSeats === 0 ? (
                                    <div className="stfull">Hết vé</div>
                                ) : (
                                    <div className="stavail">{st.availableSeats} ghế trống</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieScheduleCard;
