import React, { useState, useEffect } from 'react';

export default function DebouncedSearchInput({
  value: initialValue = '',
  onChange,
  placeholder = 'Search...',
  debounceTime = 350,
  className = '',
  autoFocus = false,
}) {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  // Sync internal state if external value changes (e.g. cleared externally)
  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  // Debounce the call to onChange
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onChange) {
        onChange(searchTerm);
      }
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceTime, onChange]);

  const handleClear = () => {
    setSearchTerm('');
    if (onChange) {
      onChange('');
    }
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      {/* Search Icon */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
          />
        </svg>
      </div>

      {/* Input */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
      />

      {/* Clear Button */}
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          title="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
