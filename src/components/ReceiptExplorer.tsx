import React, { useState, useMemo } from 'react';
import { SearchBar } from './SearchBar';
import { FilterBar } from './FilterBar';
import { ReceiptCard } from './ReceiptCard';
import { Receipt, ReceiptCategory, Connection } from '../types';
import { CATEGORIES } from '../data/categories';
import {
  FileQuestion,
  Sparkles,
  ArrowUpDown,
  X,
  ExternalLink,
  Calendar,
  Clock,
  MapPin,
  Layers,
  Play
} from 'lucide-react';
import { playClick } from '../utils/soundEffects';

interface ReceiptExplorerProps {
  receipts: Receipt[];
  connections: Connection[];
  onOpenInGraph?: (receiptId: number) => void;
  onExploreMoment?: (receipt: Receipt) => void;
}

export const ReceiptExplorer: React.FC<ReceiptExplorerProps> = ({
  receipts,
  connections,
  onOpenInGraph,
  onExploreMoment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ReceiptCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'connections'>('date-desc');
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  // Map each receipt ID to its count of connected peers
  const connectionCountsMap = useMemo(() => {
    const map = new Map<number, number>();
    connections.forEach(c => {
      map.set(c.source, (map.get(c.source) || 0) + 1);
      map.set(c.target, (map.get(c.target) || 0) + 1);
    });
    return map;
  }, [connections]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    receipts.forEach(r => {
      counts[r.type] = (counts[r.type] || 0) + 1;
    });
    return counts;
  }, [receipts]);

  // Filtered and sorted receipts
  const filteredReceipts = useMemo(() => {
    return receipts
      .filter(r => {
        // Category filter
        if (selectedCategory !== 'all' && r.type !== selectedCategory) {
          return false;
        }

        // Search query
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        const matchesTitle = r.title.toLowerCase().includes(q);
        const matchesDesc = r.description.toLowerCase().includes(q);
        const matchesLoc = r.location.toLowerCase().includes(q);
        const matchesCat = r.type.toLowerCase().includes(q);
        const matchesKeywords = r.keywords.some(k => k.toLowerCase().includes(q));
        const matchesMeta = r.metadata
          ? Object.values(r.metadata).some(val => String(val).toLowerCase().includes(q))
          : false;

        return matchesTitle || matchesDesc || matchesLoc || matchesCat || matchesKeywords || matchesMeta;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`);
        }
        if (sortBy === 'date-asc') {
          return `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
        }
        if (sortBy === 'connections') {
          const cA = connectionCountsMap.get(a.id) || 0;
          const cB = connectionCountsMap.get(b.id) || 0;
          return cB - cA;
        }
        return 0;
      });
  }, [receipts, selectedCategory, searchQuery, sortBy, connectionCountsMap]);

  // Find all connections for selected receipt
  const activeReceiptConnections = useMemo(() => {
    if (!selectedReceipt) return [];
    return connections.filter(
      c => c.source === selectedReceipt.id || c.target === selectedReceipt.id
    );
  }, [selectedReceipt, connections]);

  return (
    <section id="explorer-section" className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8DFD0]/60 text-xs font-semibold text-[#544F49] mb-2">
            <Layers className="w-3.5 h-3.5 text-[#B45309]" />
            <span>Digital Archive</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#161D26] tracking-tight font-['Plus_Jakarta_Sans']">
            Receipt Explorer
          </h2>
          <p className="text-sm sm:text-base text-[#6B7280] mt-1 max-w-xl">
            Every moment generates a digital footprint. Search, filter, and inspect the raw records feeding our Connection Engine.
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs text-[#7C7469] flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
          </span>
          <select
            id="receipts-sort-select"
            value={sortBy}
            onChange={e => {
              playClick();
              setSortBy(e.target.value as any);
            }}
            className="text-xs font-medium bg-white border border-[#DDD6CA] text-[#161D26] rounded-xl px-3 py-2 focus:outline-hidden focus:border-[#161D26] shadow-2xs"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="connections">Most Connected Links</option>
          </select>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-4 mb-8">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          resultsCount={filteredReceipts.length}
          totalCount={receipts.length}
        />
        <FilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
          totalCount={receipts.length}
        />
      </div>

      {/* Receipts Grid or Empty State */}
      {filteredReceipts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredReceipts.map(receipt => (
            <ReceiptCard
              key={receipt.id}
              receipt={receipt}
              onSelect={setSelectedReceipt}
              connectedCount={connectionCountsMap.get(receipt.id) || 0}
              highlighted={selectedReceipt?.id === receipt.id}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-[#E7E2DA] max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F0EDE6] text-[#7C7469] flex items-center justify-center mx-auto">
            <FileQuestion className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-[#161D26]">No matching receipts found</h3>
          <p className="text-xs text-[#6B7280]">
            {searchQuery
              ? `No records matched "${searchQuery}".`
              : 'No records found for the selected category filter.'}{' '}
            Try clearing filters or searching for terms like "Bengaluru", "coffee", or "concert".
          </p>
          <button
            type="button"
            id="btn-reset-filters"
            onClick={() => {
              playClick();
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#161D26] text-white text-xs font-semibold hover:bg-[#283342] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Detailed Modal/Drawer when a receipt is clicked */}
      {selectedReceipt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          onClick={() => setSelectedReceipt(null)}
          id="receipt-detail-modal"
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 border border-[#DDD6CA] shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DC]">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg"
                  style={{
                    backgroundColor: CATEGORIES[selectedReceipt.type].bgLight,
                    color: CATEGORIES[selectedReceipt.type].color,
                  }}
                >
                  {CATEGORIES[selectedReceipt.type].name}
                </span>
                <span className="text-xs font-mono text-[#8C8275]">
                  ID: #{String(selectedReceipt.id).padStart(4, '0')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {onExploreMoment && (
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      onExploreMoment(selectedReceipt);
                      setSelectedReceipt(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#161D26] text-[#FAF9F5] text-xs font-bold hover:bg-[#283342] shadow-2xs transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current text-[#FDE68A]" />
                    <span>Start Story</span>
                  </button>
                )}
                <button
                  type="button"
                  id="btn-close-receipt-modal"
                  onClick={() => setSelectedReceipt(null)}
                  className="p-1.5 rounded-full hover:bg-[#F2ECE1] text-[#7C7469] hover:text-[#161D26]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#161D26] font-['Playfair_Display']">
                {selectedReceipt.title}
              </h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                {selectedReceipt.description}
              </p>
            </div>

            {/* Location & Time info box */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] text-xs">
              <div className="space-y-1">
                <span className="text-[#8C8275] flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5" /> Date & Time
                </span>
                <p className="font-mono font-semibold text-[#161D26]">
                  {selectedReceipt.date} at {selectedReceipt.time}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[#8C8275] flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5" /> Location
                </span>
                <p className="font-semibold text-[#161D26]">
                  {selectedReceipt.location}
                </p>
              </div>
            </div>

            {/* Keywords */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-[#8C8275] uppercase tracking-wider">
                Extracted Context Keywords
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedReceipt.keywords.map(kw => (
                  <span
                    key={kw}
                    className="text-xs px-2.5 py-1 rounded-lg bg-[#EFECE6] text-[#4B5563] font-mono"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Connected Peers Discovered by Engine */}
            <div className="space-y-2.5 pt-2 border-t border-[#EAE5DC]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#161D26] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#B45309]" />
                  Engine Discovered Connections ({activeReceiptConnections.length})
                </span>
                {onOpenInGraph && (
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      onOpenInGraph(selectedReceipt.id);
                      setSelectedReceipt(null);
                    }}
                    className="text-xs text-[#2B6CB0] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>View in Graph</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              {activeReceiptConnections.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {activeReceiptConnections.map(conn => {
                    const peer =
                      conn.source === selectedReceipt.id ? conn.targetReceipt : conn.sourceReceipt;
                    return (
                      <div
                        key={conn.id}
                        className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE5DC] text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#161D26] truncate max-w-[240px]">
                            {peer.title}
                          </span>
                          <span className="font-mono text-[11px] font-bold text-[#2B6CB0] px-1.5 py-0.5 rounded bg-[#E0EDFB]">
                            Score: {conn.score}
                          </span>
                        </div>
                        <ul className="text-[11px] text-[#6B7280] list-disc list-inside">
                          {conn.reasons.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-[#8C8275] italic">
                  No direct peer connection met the threshold score (50+) for this isolated receipt.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
