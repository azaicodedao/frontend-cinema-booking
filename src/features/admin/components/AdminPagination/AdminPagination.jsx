import React from 'react';

const getPageNumbers = (currentPage, totalPages) => {
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

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < totalPages) {
    if (end < totalPages - 1) pages.push('...');
    pages.push(totalPages);
  }

  return pages;
};

const AdminPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const displayPage = currentPage + 1;

  return (
    <div className="admin-pagination">
      <button className="admin-page-btn" disabled={currentPage === 0} onClick={() => onPageChange(currentPage - 1)}>
        ‹
      </button>
      {getPageNumbers(displayPage, totalPages).map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="admin-page-btn" style={{ cursor: 'default' }}>…</span>
        ) : (
          <button
            key={page}
            className={`admin-page-btn ${page === displayPage ? 'active' : ''}`}
            onClick={() => onPageChange(page - 1)}
          >
            {page}
          </button>
        )
      ))}
      <button className="admin-page-btn" disabled={currentPage >= totalPages - 1} onClick={() => onPageChange(currentPage + 1)}>
        ›
      </button>
    </div>
  );
};

export default AdminPagination;
