export default function Pagination({ currentPage, totalPages, perPage, total, onPageChange, onPerPageChange }) {
  const perPageOptions = [10, 25, 50, 100]
  const pages = []

  // Build page numbers with ellipsis
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', totalPages)
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
    }
  }

  const start = total === 0 ? 0 : (currentPage - 1) * perPage + 1
  const end   = Math.min(currentPage * perPage, total)

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
      {/* Left: Show entries */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>បង្ហាញ</span>
        <select
          value={perPage}
          onChange={e => onPerPageChange(Number(e.target.value))}
          className="border border-gray-200 rounded-lg px-2 py-1 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
          {perPageOptions.map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <span>
          {start}–{end} នៃ <strong>{total}</strong> ជួរ
        </span>
      </div>

      {/* Right: Page buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm
                     border border-gray-200 bg-white text-gray-600
                     hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed
                     transition-colors">
          <span className="material-icons text-base">chevron_left</span>
          <span>មុន</span>
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`}
              className="px-2 py-1.5 text-sm text-gray-400">
              ···
            </span>
          ) : (
            <button key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors
                ${currentPage === p
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-100'}`}>
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm
                     border border-gray-200 bg-white text-gray-600
                     hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed
                     transition-colors">
          <span>បន្ទាប់</span>
          <span className="material-icons text-base">chevron_right</span>
        </button>
      </div>
    </div>
  )
}