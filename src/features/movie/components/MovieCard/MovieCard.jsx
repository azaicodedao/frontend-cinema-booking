import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css';

/**
 * Component Hiển thị Thẻ ảnh bìa Phim (Movie Card).
 * Thành phần nhỏ bé nhất cấu tạo nên Lưới danh sách phim. Bấm vào sẽ đưa tới trang chi tiết.
 *
 * @param {Object} props - Dữ liệu truyền vào thẻ.
 * @param {Object} props.movie - Đối tượng chứa thông tin phim (posterUrl, title, rating...).
 * @returns {JSX.Element} Một khối card phim dọc.
 */
const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const genres = movie.genres || movie.categories || [];
  const genreName = genres.length > 0 ? genres[0].name : '';

  return (
    <div className="movie-card" onClick={() => navigate(`/movie/${movie.id}`)}>
      <div className="movie-card__poster">
        {movie.posterUrl ? (
          <img src={movie.posterUrl} alt={movie.title} className="movie-card__poster-bg" />
        ) : (
          <div className="movie-card__poster-placeholder">🎬</div>
        )}
        <div className="movie-card__poster-gradient" />
      </div>
      <div className="movie-card__info">
        <div className="movie-card__title">{movie.title}</div>
        <div className="movie-card__meta">
          {genreName && <span>{genreName}</span>}
          {genreName && movie.ageLimit && <span>·</span>}
          {movie.ageLimit && <span>T{movie.ageLimit}+</span>}
        </div>
        {movie.averageRating > 0 && (
          <div className="movie-card__rating">★ {movie.averageRating?.toFixed(1) || '—'}</div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
