import React from 'react';
import './Pagination.css';

/**
 * Component tạo thanh điều hướng phân trang.
 * Hiển thị các trang và dấu 3 chấm "..." nếu số lượng trang chênh quá nhiều.
 *
 * @param {Object} props - Tham số định cấu hình Phân trang.
 * @param {number} props.currentPage - Vị trí của trang hiện tại (bắt đầu từ 1).
 * @param {number} props.totalPages - Tổng số trang hiện tại có.
 * @param {Function} props.onPageChange - Cấu hình hàm callback khi người dùng bấm qua một trang mới.
 * @returns {JSX.Element|null} Thanh tính toán số trang.
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  /**
   * Tính toán mảng các số trang cần hiển thị trên UI.
   * Bao gồm các logic thu gọn lại list trang khi có quá nhiều (ví dụ 1... 4 5 6 ...10).
   * 
   * @returns {Array<number|string>} Danh sách nhãn trang (hoặc dấu 3 chấm).
   */
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="pagination">
      <button
        className="pagination__btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ‹
      </button>
      {getPageNumbers().map((page, index) =>
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="pagination__ellipsis">
            …
          </span>
        ) : (
          <button
            key={page}
            className={`pagination__btn ${page === currentPage ? 'pagination__btn--active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      )}
      <button
        className="pagination__btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        ›
      </button>
    </div>
  );
};

export default Pagination;
