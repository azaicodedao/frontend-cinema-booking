import React from 'react';
import './SearchBar.css';

const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}) => {
  return (
    <div className={`search-bar ${className}`}>
      <span className="search-bar__icon">🔍</span>
      <input
        type="text"
        className="search-bar__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button
          className="search-bar__clear"
          onClick={() => onChange('')}
          type="button"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
