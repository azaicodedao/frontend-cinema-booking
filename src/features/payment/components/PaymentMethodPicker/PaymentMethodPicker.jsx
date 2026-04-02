import React, { useState } from 'react';
import './PaymentMethodPicker.css';

const METHODS = [
  { id: 'credit_card', label: 'Credit Card', icon: '💳' },
  { id: 'paypal', label: 'PayPal', icon: '🅿️' },
  { id: 'momo', label: 'MoMo', icon: '📱' },
];

const PaymentMethodPicker = ({ selected, onSelect }) => {
  return (
    <div className="payment-methods">
      <h3 className="payment-methods__title">Payment Method</h3>
      <div className="payment-methods__grid">
        {METHODS.map((method) => (
          <button
            key={method.id}
            className={`payment-methods__item ${selected === method.id ? 'payment-methods__item--active' : ''}`}
            onClick={() => onSelect(method.id)}
          >
            <span className="payment-methods__icon">{method.icon}</span>
            <span className="payment-methods__label">{method.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodPicker;
