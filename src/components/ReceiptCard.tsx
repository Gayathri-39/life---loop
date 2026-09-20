import React from 'react';
import {
  Music2,
  Film,
  MapPin,
  ShoppingBag,
  Camera,
  MessageSquare,
  Search,
  Ticket,
  FileText,
  Clock,
  Calendar,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Receipt } from '../types';
import { CATEGORIES } from '../data/categories';
import { playClick } from '../utils/soundEffects';

interface ReceiptCardProps {
  receipt: Receipt;
  onSelect?: (receipt: Receipt) => void;
  connectedCount?: number;
  highlighted?: boolean;
}

export const ReceiptCard: React.FC<ReceiptCardProps> = ({
  receipt,
  onSelect,
  connectedCount = 0,
  highlighted = false,
}) => {
  const cat = CATEGORIES[receipt.type] || CATEGORIES.note;

  const getIcon = () => {
    switch (receipt.type) {
      case 'music': return Music2;
      case 'movie': return Film;
      case 'place': return MapPin;
      case 'purchase': return ShoppingBag;
      case 'photo': return Camera;
      case 'message': return MessageSquare;
      case 'search': return Search;
      case 'event': return Ticket;
      case 'note':
      default: return FileText;
    }
  };

  const Icon = getIcon();

  return (
    <article
      id={`receipt-card-${receipt.id}`}
      onClick={() => {
        playClick();
        onSelect?.(receipt);
      }}
      className={`group relative bg-white rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between ${
        highlighted
          ? 'border-[#161D26] shadow-lg ring-2 ring-[#161D26]/10'
          : 'border-[#E4DFD5] hover:border-[#161D26]/40 hover:shadow-md'
      }`}
    >
      {/* Top Paper Header Bar */}
      <div className="p-4 pb-3 border-b border-dashed border-[#EAE5DC] flex items-center justify-between bg-[#FCFBF8]">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: cat.bgLight, color: cat.color }}
          >
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <span
              className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md"
              style={{ backgroundColor: cat.bgLight, color: cat.color }}
            >
              {cat.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {connectedCount > 0 && (
            <span
              className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#E0EDFB] text-[#2B6CB0]"
              title={`${connectedCount} connected moments detected`}
            >
              <Sparkles className="w-3 h-3" />
              {connectedCount} links
            </span>
          )}
          <span className="text-[10px] font-mono text-[#9CA3AF]">
            #{String(receipt.id).padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-4 space-y-2.5 flex-1">
        <h3 className="font-bold text-sm text-[#161D26] group-hover:text-[#2B6CB0] transition-colors leading-snug">
          {receipt.title}
        </h3>

        <p className="text-xs text-[#525B6A] leading-relaxed line-clamp-2">
          {receipt.description}
        </p>

        {/* Metadata Details (Amount, Artist, Query, Venue, etc.) */}
        {receipt.metadata && Object.keys(receipt.metadata).length > 0 && (
          <div className="pt-1 flex flex-wrap gap-1.5 text-[11px]">
            {receipt.metadata.amount !== undefined && (
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-mono font-medium border border-amber-200">
                ₹{receipt.metadata.amount}
              </span>
            )}
            {receipt.metadata.artist && (
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 truncate max-w-[180px]">
                🎵 {receipt.metadata.artist}
              </span>
            )}
            {receipt.metadata.venue && (
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 truncate max-w-[180px]">
                📍 {receipt.metadata.venue}
              </span>
            )}
            {receipt.metadata.query && (
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 truncate max-w-[200px] italic">
                "{receipt.metadata.query}"
              </span>
            )}
            {receipt.metadata.camera && (
              <span className="px-2 py-0.5 rounded bg-pink-50 text-pink-800 border border-pink-200 truncate max-w-[180px]">
                📷 {receipt.metadata.camera}
              </span>
            )}
            {receipt.metadata.mood && (
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                💭 {receipt.metadata.mood}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Info & Paper Stub Serrations */}
      <div className="pt-2 px-4 pb-3 bg-[#FAF9F5] border-t border-[#EAE5DC] flex items-center justify-between text-[11px] text-[#6B7280]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-mono">
            <Calendar className="w-3 h-3 text-[#9CA3AF]" />
            {receipt.date}
          </span>
          <span className="flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3 text-[#9CA3AF]" />
            {receipt.time}
          </span>
        </div>

        <div className="flex items-center gap-1 font-medium text-[#161D26]">
          <MapPin className="w-3 h-3 text-[#E07A5F]" />
          <span>{receipt.location}</span>
        </div>
      </div>
    </article>
  );
};
