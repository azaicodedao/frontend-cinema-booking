import React from 'react';
import MovieCard from '../MovieCard/MovieCard';
import EmptyState from '../../../../components/common/EmptyState/EmptyState';
import './MovieList.css';

const MovieList = ({ title, movies = [], emptyMessage, badge }) => {
  return (
    <section>
      <div className="movie-list__header">
        <div className="movie-list__header-left">
          <h2 className="movie-list__title">{title}</h2>
          {badge === 'now' && <span className="movie-list__badge movie-list__badge--now">Đang chiếu</span>}
          {badge === 'soon' && <span className="movie-list__badge movie-list__badge--soon">Sắp chiếu</span>}
        </div>
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
