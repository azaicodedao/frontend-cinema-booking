import React from 'react';
import './DateTabs.css';
import { formatLocalDate } from '../../../../utils/date';

/**
 * Component hiển thị Thanh danh sách 7 ngày liên tiếp để chọn Lịch Chiếu.
 * Tự động tính toán ngày bắt đầu từ Hôm nay.
 *
 * @param {Object} props - Thuộc tính truyền vào.
 * @param {string} props.selectedDate - Ngày đang được người dùng bấm chọn (định dạng YYYY-MM-DD).
 * @param {Function} props.onDateChange - Hàm gọi ngược lại thẻ cha khi người dùng bấm chọn ngày khác.
 * @returns {JSX.Element} Thanh cuộn ngày tháng.
 */
const DateTabs = ({ selectedDate, onDateChange }) => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const dateStr = formatLocalDate(d);
        
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
