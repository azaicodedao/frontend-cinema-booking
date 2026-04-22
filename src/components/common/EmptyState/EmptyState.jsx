import React from 'react';
import './EmptyState.css';

/**
 * Component hiển thị trạng thái Trống (Empty State).
 * Được sử dụng khi không có dữ liệu nào để hiển thị (ví dụ: giỏ hàng trống, không có phim...).
 *
 * @param {Object} props - Thuộc tính truyền vào.
 * @param {string|React.ReactNode} [props.icon='📭'] - Biểu tượng (thường là Emoji hoặc Icon SVG) ở trên cùng.
 * @param {string} [props.title='No data found'] - Tiêu đề chính để thông báo trống.
 * @param {string} [props.description] - Đoạn văn bản mô tả chi tiết lý do hoặc hướng dẫn.
 * @param {React.ReactNode} [props.action] - Khối giao diện chứa nút thao tác (ví dụ: Nút "Thêm mới").
 * @returns {JSX.Element} Khối giao diện thông báo trống.
 */
const EmptyState = ({
  icon = '📭',
  title = 'No data found',
  description,
  action,
}) => {
  return (
    <div className="empty-state">
      <span className="empty-state__icon">{icon}</span>
      <h3 className="empty-state__title">{title}</h3>
      {description && (
        <p className="empty-state__description">{description}</p>
      )}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
};

export default EmptyState;
