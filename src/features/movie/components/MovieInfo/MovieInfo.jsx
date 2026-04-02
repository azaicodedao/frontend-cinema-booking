import React from 'react';
import './MovieInfo.css';

const MovieInfo = ({ movie }) => {
  return (
    <div className="movie-info">
      <div className="movie-info__poster">
        {movie.posterUrl ? (
          <img src={movie.posterUrl} alt={movie.title} className="movie-info__image" />
        ) : (
          <div className="movie-info__no-poster">🎬</div>
        )}
      </div>
      <div className="movie-info__details">
        <h1 className="movie-info__title">{movie.title}</h1>
        <div className="movie-info__meta">
          <span className="movie-info__badge">{movie.duration} mins</span>
          {movie.ageLimit && (
            <span className="movie-info__badge movie-info__badge--age">{movie.ageLimit}+</span>
          )}
          {movie.country && (
            <span className="movie-info__badge">{movie.country}</span>
          )}
        </div>
        {movie.genres && movie.genres.length > 0 && (
          <div className="movie-info__genres">
            {movie.genres.map((genre, i) => (
              <span key={i} className="movie-info__genre">{genre.name || genre}</span>
            ))}
          </div>
        )}
        {movie.director && (
          <p className="movie-info__field">
            <span className="movie-info__label">Director:</span> {movie.director}
          </p>
        )}
        {movie.actors && (
          <p className="movie-info__field">
            <span className="movie-info__label">Cast:</span> {movie.actors}
          </p>
        )}
        <p className="movie-info__description">
          {movie.description || 'No description available.'}
        </p>
        {movie.trailerUrl && (
          <a
            href={movie.trailerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="movie-info__trailer-btn"
          >
            ▶ Watch Trailer
          </a>
        )}
      </div>
    </div>
  );
};

export default MovieInfo;
