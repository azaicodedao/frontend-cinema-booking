import React from 'react';
import './GenreFilter.css';

/**
 * Component hiển thị mảng các Thể loại phim (Hành động, Hài hước,...).
 * Giúp người dùng lọc danh sách phim ngoài trang chủ.
 *
 * @param {Object} props - Tham số.
 * @param {Array} props.genres - Mảng đối tượng chứa tên và ID thể loại.
 * @param {number|null} props.selectedGenre - ID của thể loại đang được tô sáng (null = Chọn "Tất cả").
 * @param {Function} props.onSelect - Sự kiện xảy ra khi bấm vào một viên nang thẻ (pill).
 * @returns {JSX.Element} Khối lọc thể loại.
 */
const GenreFilter = ({ genres = [], selectedGenre, onSelect }) => {
  return (
    <div className="genre-filter">
      <button
        className={`genre-filter__pill ${!selectedGenre ? 'genre-filter__pill--active' : ''}`}
        onClick={() => onSelect(null)}
      >
        Tất cả
      </button>
      {genres.map((genre) => (
        <button
          key={genre.id}
          className={`genre-filter__pill ${selectedGenre === genre.id ? 'genre-filter__pill--active' : ''}`}
          onClick={() => onSelect(genre.id)}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
};

export default GenreFilter;
