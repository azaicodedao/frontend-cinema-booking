import React from 'react';
import MovieCard from '../MovieCard/MovieCard';
import EmptyState from '../../../../components/common/EmptyState/EmptyState';
import './MovieList.css';

/**
 * Component hiển thị danh sách các phim dưới dạng lưới (grid).
 * Hỗ trợ hiển thị badge, thông báo khi rỗng và nút xem thêm/thu gọn.
 * 
 * @param {Object} props - Các thuộc tính của component.
 * @param {string} props.title - Tiêu đề của danh sách.
 * @param {Array} [props.movies=[]] - Mảng dữ liệu các phim.
 * @param {string} [props.emptyMessage] - Thông báo khi danh sách rỗng.
 * @param {string} [props.badge] - Badge phân loại ('now' hoặc 'soon').
 * @param {boolean} props.showSeeAll - Hiển thị nút "Xem tất cả / Thu gọn".
 * @param {Function} props.onSeeAll - Hàm xử lý sự kiện bấm nút.
 * @param {boolean} props.isExpanded - Trạng thái danh sách có đang mở rộng hay không.
 * @returns {JSX.Element} Giao diện danh sách phim.
 */
const MovieList = ({ title, movies = [], emptyMessage, badge, showSeeAll, onSeeAll, isExpanded }) => {
  return (
    <section className="movie-list">
      <div className="movie-list__header">
        <div className="movie-list__header-left">
          <h2 className="movie-list__title">{title}</h2>
          {badge === 'now' && <span className="movie-list__badge movie-list__badge--now">Đang chiếu</span>}
          {badge === 'soon' && <span className="movie-list__badge movie-list__badge--soon">Sắp chiếu</span>}
        </div>
        {showSeeAll && (
          <button className="movie-list__see-all" onClick={onSeeAll}>
            {isExpanded ? 'Thu gọn' : 'Xem tất cả'}
          </button>
        )}
      </div>
      {movies.length === 0 ? (
        <div className="movie-list__empty">{emptyMessage || 'Không tìm thấy phim phù hợp.'}</div>
      ) : (
        <div className="movie-list__grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
};

export default MovieList;
