import React from 'react';
import './Paginator.css';

function Paginator({ currentPage = 1, totalPages = 1, onPageChange = () => {} }) {
  if (!totalPages || totalPages <= 1) return null;

  const windowSize = 10;
  const windowIndex = Math.floor((currentPage - 1) / windowSize);
  const startPage = windowIndex * windowSize + 1;
  const endPage = Math.min(startPage + windowSize - 1, totalPages);

  const pages = [];
  for (let p = startPage; p <= endPage; p++) pages.push(p);

  const goPrev = () => onPageChange(Math.max(1, currentPage - 1));
  const goNext = () => onPageChange(Math.min(totalPages, currentPage + 1));

  return (
    <div className="pagination">
      <button onClick={goPrev} disabled={currentPage === 1}>
        Previous
      </button>

      {startPage > 1 && (
        <>
          <button onClick={() => onPageChange(1)}>1</button>
          <span className="dots">...</span>
        </>
      )}

      {pages.map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          style={{
            fontWeight: currentPage === pageNum ? 'bold' : 'normal',
            textDecoration: currentPage === pageNum ? 'underline' : 'none',
          }}
        >
          {pageNum}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          <span className="dots">...</span>
          <button onClick={() => onPageChange(totalPages)}>{totalPages}</button>
        </>
      )}

      <button onClick={goNext} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
}

export default Paginator;
