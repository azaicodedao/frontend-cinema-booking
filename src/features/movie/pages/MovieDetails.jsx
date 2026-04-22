import React, { useEffect, useState, useRef, useContext } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../../../context/AuthContext';
import MovieService from '../services/movie.api';
import ReviewApi from '../services/review.api';
import api from '../../../services/apiClient';
import './MovieDetails.css';

/**
 * Trang Tổng hợp Chi tiết Phim (Movie Details).
 * Cung cấp thông tin Poster, Trailer, Đánh giá và Lịch chiếu chi tiết cho 1 bộ phim theo ID truyền vào trên đường dẫn.
 *
 * @returns {JSX.Element} Màn hình hiển thị chi tiết phim.
 */
const MovieDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const showtimesRef = useRef(null);
  const { isAuthenticated } = useContext(AuthContext);
  const [movie, setMovie] = useState(null);
  const [groupedShowtimes, setGroupedShowtimes] = useState({});
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSchedule, setShowSchedule] = useState(new URLSearchParams(location.search).get('book') === 'true');

  /**
   * Gọi song song 3 API để lấy: Thông tin chi tiết Phim, Các suất chiếu, Bình luận.
   */
  useEffect(() => {
    setLoading(true);
    Promise.all([
      MovieService.getMovieDetail(id),
      api.get(`showtimes/movie/${id}`).then((res) => res.data.data || res.data).catch(() => []),
      ReviewApi.getReviewsByMovie(id).then((res) => res.data || []).catch(() => []),
    ]).then(([movieData, showtimeData, reviewData]) => {
      setMovie(movieData);
      
      const grouped = {};
      const now = new Date();
      const showtimesList = (Array.isArray(showtimeData) ? showtimeData : [])
        .filter(st => new Date(st.startTime) >= now);

      showtimesList.forEach(st => {
        const dateKey = st.showDate;
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(st);
      });

      // Sắp xếp các suất chiếu trong cùng 1 ngày theo thứ tự Thời gian (Sớm tới Muộn)
      Object.keys(grouped).forEach(date => {
        grouped[date].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
      });

      const sortedDates = Object.keys(grouped).sort();
      setGroupedShowtimes(grouped);
      setDates(sortedDates);
      if (sortedDates.length > 0) {
        setSelectedDate(sortedDates[0]);
      }
      
      setReviews(Array.isArray(reviewData) ? reviewData : []);
      setLoading(false);
    });
    window.scrollTo(0, 0);
  }, [id]);

  /** Tự động trượt mượt mà (smooth scroll) màn hình xuống Khu vực Lịch chiếu khi bấm 'Đặt vé ngay' */
  const scrollToShowtimes = () => {
    setShowSchedule(true);
  };

  useEffect(() => {
    if (showSchedule && showtimesRef.current) {
      showtimesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showSchedule]);

  const formatDateTab = (dateStr) => {
    const d = new Date(dateStr);
    const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const dayName = days[d.getDay()];
    const datePart = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    return { dayName, datePart };
  };

  if (loading) return (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>Đang tải thông tin phim...</p>
    </div>
  );
  
  if (!movie) return (
    <div className="inner" style={{padding: '100px 0', textAlign: 'center'}}>
      <h2 style={{color: 'var(--t1)'}}>Không tìm thấy phim</h2>
      <Link to="/" className="btn-cta" style={{display: 'inline-block', marginTop: '20px'}}>Quay lại trang chủ</Link>
    </div>
  );

  return (
    <div className="screen" id="screen-detail">
      <div className="inner">
        <Link to="/" className="back">← Quay lại danh sách</Link>
        
        <div className="dhero">
          <div className="dposter">
            {movie.posterUrl ? (
              <img src={movie.posterUrl} alt={movie.title} />
            ) : (
              <div className="pbg">🎬</div>
            )}
          </div>
          <div className="dinfo">
            <div className="dtitle">{movie.title}</div>
            <div className="trow">
              {movie.genres && movie.genres.map((g, i) => (
                <span key={i} className="tag g">{g.name || g}</span>
              ))}
              <span className="tag">{movie.duration} phút</span>
              <span className="tag">T{movie.ageRating}+</span>
              <span className="tag">{movie.country || 'N/A'}</span>
            </div>
            
            <div className="rrow">
              <span className="rnum">{movie.averageRating?.toFixed(1) || '0.0'} ★</span>
              <span className="rct">({movie.reviewCount || 0} đánh giá)</span>
            </div>

            <div className="ddesc">
              {movie.description || 'Chưa có mô tả cho bộ phim này.'}
              <div style={{marginTop: '12px', fontSize: '13px', color: 'var(--t2)'}}>
                {movie.director && <div><strong>Đạo diễn:</strong> {movie.director}</div>}
                {movie.actors && <div><strong>Diễn viên:</strong> {movie.actors}</div>}
              </div>
            </div>

            <div className="arow">
              <button className="btn-cta" onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login', { state: { from: location } });
                } else {
                  scrollToShowtimes();
                }
              }}>Đặt vé ngay</button>
              {movie.trailerUrl && (
                <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer" className="btn-trailer">
                  ▶ Xem trailer
                </a>
              )}
            </div>
          </div>
        </div>

        {/* SHOWTIMES SECTION */}
        {showSchedule && (
          <div className="cwrap" ref={showtimesRef} style={{marginTop: '60px'}}>
            <div className="shd">
              <div className="stitle">Lịch chiếu tại rạp</div>
            </div>
            
            {!isAuthenticated ? (
              <div className="empty-st" style={{ textAlign: 'center', padding: '40px 0' }}>
                <p style={{ marginBottom: '20px', color: 'var(--t2)' }}>Vui lòng đăng nhập để xem lịch chiếu và đặt vé.</p>
                <button 
                  className="btn-gold" 
                  onClick={() => navigate('/login', { state: { from: location } })}
                >
                  Đăng nhập ngay
                </button>
              </div>
            ) : dates.length > 0 ? (
              <>
                {/* MINI DATE TABS */}
                <div className="dt-mini-tabs">
                  {dates.map(date => {
                    const { dayName, datePart } = formatDateTab(date);
                    return (
                      <div 
                        key={date} 
                        className={`dt-tab ${selectedDate === date ? 'active' : ''}`}
                        onClick={() => setSelectedDate(date)}
                      >
                        <span className="d-name">{dayName}</span>
                        <span className="d-part">{datePart}</span>
                      </div>
                    );
                  })}
                </div>

                {/* TIME SLOTS GRID */}
                <div className="st-grid-v2">
                  {groupedShowtimes[selectedDate]?.map((st) => (
                    <div 
                      key={st.id} 
                      className={`st-btn ${st.status === 'FULL' ? 'full' : ''}`}
                      onClick={() => st.status !== 'FULL' && navigate(`/booking/seats/${st.id}`)}
                    >
                      <div className="st-time-val">{st.timeString}</div>
                      <div className="st-room-val">{st.formatAndRoom}</div>
                      {st.status === 'FULL' && <div className="st-full-tag">Hết vé</div>}
                      {st.status !== 'FULL' && st.availableSeats !== null && (
                        <div className="st-seats-val">{st.availableSeats} ghế trống</div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-st">
                <p>Hiện chưa có suất chiếu nào cho phim này.</p>
              </div>
            )}
          </div>
        )}

        {/* REVIEWS SECTION */}
        <div className="cwrap" style={{marginTop: '60px'}}>
          <div className="shd">
            <div className="stitle">Đánh giá từ khán giả</div>
          </div>
          
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <div className="ci" key={rev.id}>
                <div className="chd">
                  <div className="av">
                    {rev.user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="cuser">
                    <strong>{rev.user?.fullName}</strong>
                    <div className="cmeta">
                      <span className="cstars">{rev.rating} ★</span>
                      <span>{new Date(rev.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>
                <div className="ctxt">{rev.comment}</div>
              </div>
            ))
          ) : (
            <div className="empty-st">
              <p>Chưa có đánh giá nào cho phim này. Hãy là người đầu tiên đánh giá!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
