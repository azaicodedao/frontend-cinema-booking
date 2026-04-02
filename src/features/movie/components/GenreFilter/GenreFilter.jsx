import React from 'react';
import './GenreFilter.css';

const GenreFilter = ({ genres = [], selectedGenre, onSelect }) => {
  return (
    <div className="genre-filter">
      <button
        className={`genre-filter__chip ${!selectedGenre ? 'genre-filter__chip--active' : ''}`}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {genres.map((genre) => (
        <button
          key={genre.id}
          className={`genre-filter__chip ${selectedGenre === genre.id ? 'genre-filter__chip--active' : ''}`}
          onClick={() => onSelect(genre.id)}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
};

export default GenreFilter;
