import React from 'react';
import './StarRating.css';

const StarRating = ({
  value = 0,
  onChange,
  max = 5,
  readOnly = false,
  size = 'medium',
}) => {
  const handleClick = (rating) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  };

  return (
    <div className={`star-rating star-rating--${size} ${readOnly ? 'star-rating--readonly' : ''}`}>
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        return (
          <span
            key={starValue}
            className={`star-rating__star ${starValue <= value ? 'star-rating__star--filled' : ''}`}
            onClick={() => handleClick(starValue)}
            role={readOnly ? 'img' : 'button'}
            tabIndex={readOnly ? undefined : 0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleClick(starValue);
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
