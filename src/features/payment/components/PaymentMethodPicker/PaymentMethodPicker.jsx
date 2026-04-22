import React from 'react';
import './PaymentMethodPicker.css';

/**
 * Component lựa chọn phương thức thanh toán.
 * Cho phép người dùng chọn giữa VNPay, MoMo và Thẻ ngân hàng.
 */

const METHODS = [
  { id: 'vnpay', name: 'VNPay', desc: 'Quét QR hoặc OTP' },
  { id: 'momo', name: 'MoMo', desc: 'Ví điện tử MoMo' },
  { id: 'bank', name: 'Thẻ ngân hàng', desc: 'Visa / Mastercard / JCB' },
];

const PaymentMethodPicker = ({ selected, onSelect }) => {
  return (
    <div className="pmcard">
      <div className="pmlbl">Phương thức thanh toán</div>
      {METHODS.map((method) => (
        <div
          key={method.id}
          className={`pmit ${selected === method.id ? 'on' : ''}`}
          onClick={() => onSelect(method.id)}
        >
          <div className="pmr"></div>
          <div>
            <div className="pmname">{method.name}</div>
            <div className="pmdesc">{method.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentMethodPicker;
