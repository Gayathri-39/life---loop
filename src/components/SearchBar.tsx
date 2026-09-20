import React, { useRef, useEffect } from 'react';
import { Search, X, Command } from 'lucide-react';
import { playClick } from '../utils/soundEffects';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultsCount: number;
  totalCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  resultsCount,
  totalCount,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full max-w-xl mx-auto" id="global-search-container">
      <div className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none text-[#7C7469]">
          <Search className="w-4 h-4" />
        </div>
        <input
          ref={inputRef}
          type="text"
          id="global-receipt-search"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search your life... (e.g. Coimbatore, coffee, lo-fi, midnight)"
          className="w-full pl-11 pr-24 py-3 rounded-2xl bg-white border border-[#DDD6CA] text-[#161D26] placeholder-[#9CA3AF] text-sm focus:outline-hidden focus:border-[#161D26] focus:ring-2 focus:ring-[#161D26]/10 shadow-xs transition-all"
        />

        <div className="absolute right-3 flex items-center gap-1.5">
          {searchQuery ? (
            <button
              type="button"
              id="btn-clear-search"
              onClick={() => {
                playClick();
                onSearchChange('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full text-[#9CA3AF] hover:text-[#161D26] hover:bg-[#F2ECE1] transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-[#E5E0D6] bg-[#FAF8F5] text-[11px] font-mono text-[#8C8275]">
              <Command className="w-3 h-3" /> /
            </span>
          )}
        </div>
      </div>

      {searchQuery && (
        <div className="mt-2 text-xs text-center text-[#6B7280]">
          Showing <span className="font-semibold text-[#161D26]">{resultsCount}</span> matching records of {totalCount}
        </div>
      )}
    </div>
  );
};
