import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Sparkles, MapPin, Calendar, Clock, Tag, FileText, Check } from 'lucide-react';
import { Receipt, ReceiptCategory } from '../types';
import { CATEGORIES } from '../data/categories';
import { playClick, playConnectHarmonics } from '../utils/soundEffects';

interface AddReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReceipt: (receipt: Receipt) => void;
  existingCount: number;
}

const PRESET_SCENARIOS = [
  {
    name: '☕ Midnight Filter Coffee in Coimbatore',
    category: 'purchase' as ReceiptCategory,
    title: 'Midnight Coffee & Warm Puffs',
    location: 'Coimbatore',
    time: '23:45',
    date: '2026-07-12',
    description: 'Steaming degree coffee and conversations under yellow streetlamps on Avinashi Road.',
    keywords: ['coffee', 'midnight', 'coimbatore', 'snack', 'evening'],
    amount: 90,
  },
  {
    name: '📸 Sunrise Finish Line Photo in Chennai',
    category: 'photo' as ReceiptCategory,
    title: 'Finishing the 10K with Salty Sea Breeze',
    location: 'Chennai',
    time: '06:45',
    date: '2026-08-20',
    description: 'Sweat-drenched selfie under Marina Beach lighthouse as morning joggers cheer.',
    keywords: ['photo', 'running', 'sunrise', 'ocean', 'chennai'],
    camera: 'Pixel 8 Pro, Portrait',
  },
  {
    name: '🎶 Late-Night Indie Track in Bengaluru',
    category: 'music' as ReceiptCategory,
    title: 'Sunset in Marfa — Tycho',
    location: 'Bengaluru',
    time: '02:40',
    date: '2026-07-28',
    description: 'Ambient chillwave looping while fixing asynchronous data pipeline bug.',
    keywords: ['music', 'lo-fi', 'coding', 'hackathon', 'late-night', 'bengaluru'],
    artist: 'Tycho',
  },
];

export const AddReceiptModal: React.FC<AddReceiptModalProps> = ({
  isOpen,
  onClose,
  onAddReceipt,
  existingCount,
}) => {
  const [type, setType] = useState<ReceiptCategory>('purchase');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-07-12');
  const [time, setTime] = useState('18:30');
  const [location, setLocation] = useState('Coimbatore');
  const [description, setDescription] = useState('');
  const [keywordsText, setKeywordsText] = useState('coffee, evening, coimbatore');
  const [metaInfo, setMetaInfo] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const applyPreset = (preset: typeof PRESET_SCENARIOS[0]) => {
    playClick();
    setType(preset.category);
    setTitle(preset.title);
    setLocation(preset.location);
    setTime(preset.time);
    setDate(preset.date);
    setDescription(preset.description);
    setKeywordsText(preset.keywords.join(', '));
    if ('amount' in preset) setMetaInfo(`amount: ${preset.amount}`);
    else if ('camera' in preset) setMetaInfo(`camera: ${preset.camera}`);
    else if ('artist' in preset) setMetaInfo(`artist: ${preset.artist}`);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Title is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!date.trim()) newErrors.date = 'Date is required';
    if (!time.trim()) newErrors.time = 'Time is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const kwArray = keywordsText
      .split(',')
      .map(k => k.trim().toLowerCase())
      .filter(Boolean);

    const newReceipt: Receipt = {
      id: existingCount + 1,
      type,
      title: title.trim(),
      date: date.trim(),
      time: time.trim(),
      location: location.trim(),
      description: description.trim(),
      keywords: kwArray.length > 0 ? kwArray : [type, location.toLowerCase()],
      metadata: metaInfo.trim()
        ? { note: metaInfo.trim() }
        : undefined,
    };

    playConnectHarmonics();
    onAddReceipt(newReceipt);
    onClose();

    // Reset fields
    setTitle('');
    setDescription('');
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div
      id="add-receipt-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#DDD6CA] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto text-left"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-receipt-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DC]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#161D26] text-white flex items-center justify-center shadow-xs">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 id="add-receipt-title" className="text-lg font-bold text-[#161D26]">
                Simulate New Digital Receipt
              </h3>
              <p className="text-xs text-[#6B7280]">
                Add an activity and watch the Connection Engine link it live in real time.
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-add-modal"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F2ECE1] text-[#7C7469] hover:text-[#161D26] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets Strip for Hackathon Judges */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-[#8C8275] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#B45309]" />
            Quick Presets for Live Judge Demo:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PRESET_SCENARIOS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                className="p-2.5 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5] hover:bg-white hover:border-[#161D26] transition-all text-left text-xs space-y-1 group"
              >
                <div className="font-semibold text-[#161D26] truncate">{p.name}</div>
                <div className="text-[10px] text-[#6B7280] font-mono">{p.location} • {p.time}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#161D26] block">Activity Category</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {(Object.keys(CATEGORIES) as ReceiptCategory[]).map(catKey => {
                const cat = CATEGORIES[catKey];
                const isSelected = type === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => {
                      playClick();
                      setType(catKey);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all text-center truncate ${
                      isSelected
                        ? 'bg-[#161D26] text-white border-[#161D26] shadow-xs'
                        : 'bg-white text-[#4B5563] border-[#DDD6CA] hover:bg-[#F9F7F2]'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#161D26] block">Activity Title *</label>
            <input
              type="text"
              id="input-receipt-title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Midnight Filter Coffee at Annapoorna"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-sm text-[#161D26] focus:outline-hidden focus:border-[#161D26] ${
                errors.title ? 'border-rose-400 bg-rose-50/20' : 'border-[#DDD6CA]'
              }`}
            />
            {errors.title && <p className="text-[11px] text-rose-600">{errors.title}</p>}
          </div>

          {/* Date, Time, Location in 3 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#544F49] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#7C7469]" /> Date (YYYY-MM-DD)
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD6CA] text-xs text-[#161D26] focus:outline-hidden focus:border-[#161D26]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#544F49] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#7C7469]" /> Time (HH:mm)
              </label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD6CA] text-xs text-[#161D26] focus:outline-hidden focus:border-[#161D26]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#544F49] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#E07A5F]" /> City / Locale
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Coimbatore"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD6CA] text-xs text-[#161D26] focus:outline-hidden focus:border-[#161D26]"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#161D26] block">Description & Context *</label>
            <textarea
              rows={2}
              id="input-receipt-description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What happened? (e.g. Discussing system architecture after campus hackathon sprint...)"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-xs text-[#161D26] focus:outline-hidden focus:border-[#161D26] resize-none ${
                errors.description ? 'border-rose-400 bg-rose-50/20' : 'border-[#DDD6CA]'
              }`}
            />
            {errors.description && <p className="text-[11px] text-rose-600">{errors.description}</p>}
          </div>

          {/* Keywords */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#544F49] flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-[#7C7469]" /> Keywords (comma separated)
            </label>
            <input
              type="text"
              value={keywordsText}
              onChange={e => setKeywordsText(e.target.value)}
              placeholder="coffee, evening, coimbatore, discussion"
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD6CA] text-xs text-[#161D26] focus:outline-hidden focus:border-[#161D26]"
            />
            <p className="text-[10px] text-[#8C8275]">
              Used by the Connection Engine to discover semantic affinities with other records.
            </p>
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#EAE5DC]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#DDD6CA] text-xs font-semibold text-[#544F49] hover:bg-[#F2ECE1] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-submit-new-receipt"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#161D26] text-white text-xs font-bold hover:bg-[#283342] shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
              <span>Add & Recompute Engine</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
