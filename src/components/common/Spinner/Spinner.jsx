import React from 'react';
import './Spinner.css';

const Spinner = ({ size = 'medium', className = '' }) => {
  return (
    <div className={`spinner-container ${className}`}>
      <div className={`spinner spinner--${size}`} />
    </div>
  );
};

export default Spinner;
