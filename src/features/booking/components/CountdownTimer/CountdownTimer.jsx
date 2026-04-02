import React from 'react';
import './CountdownTimer.css';

const CountdownTimer = ({ formatted, isExpired, secondsLeft }) => {
  const isUrgent = secondsLeft < 60;

  return (
    <div className={`countdown ${isExpired ? 'countdown--expired' : ''} ${isUrgent ? 'countdown--urgent' : ''}`}>
      <div className="countdown__text">
        <span className="countdown__time">{isExpired ? '00:00' : formatted}</span>
        <span className="countdown__label">{isExpired ? 'Hết thời gian giữ chỗ' : 'Thời gian giữ chỗ'}</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
