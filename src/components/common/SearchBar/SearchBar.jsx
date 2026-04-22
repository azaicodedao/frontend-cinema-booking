import React from 'react';
import './SearchBar.css';

/**
 * Component thanh tìm kiếm (Search Bar).
 * Chứa icon kính lúp, ô nhập liệu và nút biểu tượng X để xóa nhánh từ khóa.
 *
 * @param {Object} props - Dữ liệu truyền vào.
 * @param {string} props.value - Chuỗi khóa tìm kiếm hiện tại.
 * @param {Function} props.onChange - Hàm được gọi khi người dùng gõ văn bản, truyền về chuỗi mới.
 * @param {string} [props.placeholder='Search...'] - Gợi ý mờ khi chưa nhập.
 * @param {string} [props.className=''] - Class CSS bổ sung nếu muốn đè style.
 * @returns {JSX.Element} Thanh nhập liệu tìm kiếm.
 */
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
