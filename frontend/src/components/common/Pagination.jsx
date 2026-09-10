import React from 'react';

export default function Pagination({
  currentPage = 1,
  lastPage = 1,
  total = 0,
  from = 0,
  to = 0,
  onPageChange,
  className = '',
}) {
  if (lastPage <= 1 && total === 0) {
    return null;
  }

  // Calculate page numbers to display with smart ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1; // Number of pages to show around current page

    for (let i = 1; i <= lastPage; i++) {
      if (
        i === 1 ||
        i === lastPage ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-3.5 bg-slate-50 border-t border-slate-200 text-sm text-slate-600 ${className}`}
    >
      {/* Information text */}
      <div className="text-xs text-slate-500">
        {total > 0 ? (
          <>
            Showing <span className="font-semibold text-slate-700">{from || 1}</span> to{' '}
            <span className="font-semibold text-slate-700">{to || total}</span> of{' '}
            <span className="font-semibold text-slate-700">{total}</span> results
          </>
        ) : (
          <span>No entries found</span>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-1.5">
        {/* Previous button */}
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        {/* Page numbers */}
        {pages.map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 py-1 text-slate-400 text-xs">
                …
              </span>
            );
          }

          const isActive = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange && onPageChange(p)}
              className={`min-w-[32px] h-8 px-2.5 rounded-lg text-xs font-medium transition-colors shadow-sm ${
                isActive
                  ? 'bg-indigo-600 text-white border border-indigo-600'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          );
        })}

        {/* Next button */}
        <button
          type="button"
          disabled={currentPage >= lastPage}
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          Next
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}