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
  Sparkles,
} from 'lucide-react';
import { ReceiptCategory } from '../types';
import { playClick } from '../utils/soundEffects';

interface FilterBarProps {
  selectedCategory: ReceiptCategory | 'all';
  onSelectCategory: (category: ReceiptCategory | 'all') => void;
  categoryCounts: Record<string, number>;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  totalCount,
}) => {
  const filters: Array<{
    id: ReceiptCategory | 'all';
    label: string;
    icon: React.ElementType;
    color: string;
  }> = [
    { id: 'all', label: 'All Receipts', icon: Sparkles, color: 'text-[#161D26]' },
    { id: 'music', label: 'Music', icon: Music2, color: 'text-[#3B82F6]' },
    { id: 'movie', label: 'Movies', icon: Film, color: 'text-[#8B5CF6]' },
    { id: 'place', label: 'Places', icon: MapPin, color: 'text-[#10B981]' },
    { id: 'purchase', label: 'Purchases', icon: ShoppingBag, color: 'text-[#F59E0B]' },
    { id: 'photo', label: 'Photos', icon: Camera, color: 'text-[#EC4899]' },
    { id: 'message', label: 'Messages', icon: MessageSquare, color: 'text-[#06B6D4]' },
    { id: 'search', label: 'Searches', icon: Search, color: 'text-[#6366F1]' },
    { id: 'event', label: 'Events', icon: Ticket, color: 'text-[#EA580C]' },
    { id: 'note', label: 'Notes', icon: FileText, color: 'text-[#64748B]' },
  ];

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none" id="category-filter-bar">
      <div className="flex items-center gap-2 min-w-max px-1">
        {filters.map(item => {
          const Icon = item.icon;
          const isSelected = selectedCategory === item.id;
          const count = item.id === 'all' ? totalCount : categoryCounts[item.id] || 0;

          return (
            <button
              key={item.id}
              type="button"
              id={`filter-category-${item.id}`}
              onClick={() => {
                playClick();
                onSelectCategory(item.id);
              }}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                isSelected
                  ? 'bg-[#161D26] text-[#FAF9F5] shadow-sm'
                  : 'bg-white text-[#4B5563] border border-[#DDD6CA] hover:border-[#161D26]/40 hover:bg-[#F9F7F2]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#FAF9F5]' : item.color}`} />
              <span>{item.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-[#FAF9F5]' : 'bg-[#EFECE6] text-[#6B7280]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
