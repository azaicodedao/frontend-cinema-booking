import React from 'react';
import './DateTabs.css';

const DateTabs = ({ selectedDate, onDateChange }) => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        
        let label = '';
        if (i === 0) label = 'Hôm nay';
        else if (i === 1) label = 'Ngày mai';
        else {
            const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
            label = days[d.getDay()];
        }

        dates.push({
            date: dateStr,
            display: `${label}, ${d.getDate()}/${d.getMonth() + 1}`,
            full: label
        });
    }

    return (
        <div className="dtabs">
            {dates.map((item) => (
                <div
                    key={item.date}
                    className={`dtab ${selectedDate === item.date ? 'on' : ''}`}
                    onClick={() => onDateChange(item.date)}
                >
                    {item.display}
                </div>
            ))}
        </div>
    );
};

export default DateTabs;
