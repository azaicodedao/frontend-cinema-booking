import React from 'react';

const CustomerSeatLegend = () => (
  <div className="legrow">
    <div className="legit"><div className="legdot" style={{ background: 'var(--seat-avail)', borderColor: 'var(--seat-avail-border)' }} />Trống</div>
    <div className="legit"><div className="legdot" style={{ background: 'var(--gold)', borderColor: 'var(--gold)' }} />Đang chọn</div>
    <div className="legit"><div className="legdot" style={{ background: 'var(--seat-holding)', borderColor: 'rgba(78, 143, 255, 0.35)' }} />Đang giữ</div>
    <div className="legit"><div className="legdot" style={{ background: 'var(--seat-booked)', opacity: 0.3 }} />Đã đặt</div>
    <div className="legit"><div className="legdot" style={{ background: 'linear-gradient(180deg, rgba(232,160,32,0.35) 0%, rgba(232,160,32,0.1) 100%)', borderColor: 'rgba(232,160,32,0.45)', boxShadow: '0 0 6px rgba(232,160,32,0.12)' }} />VIP</div>
  </div>
);

export default CustomerSeatLegend;
