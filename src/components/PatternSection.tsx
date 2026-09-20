import React, { useState } from 'react';
import { HiddenPattern } from '../types';
import {
  Moon,
  MapPin,
  Search,
  Camera,
  Headphones,
  Eye,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { playClick } from '../utils/soundEffects';

interface PatternSectionProps {
  patterns: HiddenPattern[];
}

export const PatternSection: React.FC<PatternSectionProps> = ({ patterns }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Moon': return Moon;
      case 'MapPin': return MapPin;
      case 'Search': return Search;
      case 'Camera': return Camera;
      case 'Headphones':
      default: return Headphones;
    }
  };

  return (
    <section id="patterns-section" className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#E7E2DA]">
      <div className="space-y-4 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F4EA] text-xs font-semibold text-[#2D7A4C]">
          <Eye className="w-3.5 h-3.5" />
          <span>Algorithmic Telemetry</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#161D26] tracking-tight font-['Plus_Jakarta_Sans']">
              👀 You Didn't Notice This
            </h2>
            <p className="text-sm sm:text-base text-[#6B7280] mt-1 max-w-2xl">
              Underneath the individual timestamps and receipts, latent behavioral algorithms discovered high-probability correlations across your habits.
            </p>
          </div>
          <span className="text-xs text-[#8C8275] italic">
            100% computed from your local dataset
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patterns.map(pattern => {
          const Icon = getIcon(pattern.icon);
          const isExpanded = expandedId === pattern.id;

          return (
            <article
              key={pattern.id}
              id={`pattern-card-${pattern.id}`}
              className="bg-white rounded-3xl p-6 border border-[#E5E0D6] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header Icon + Metric Pill */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D6] flex items-center justify-center text-[#161D26]">
                    <Icon className="w-5 h-5 text-[#B45309]" />
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[#FAF0E6] text-[#A05A2C] border border-[#F0DFD1]">
                    {pattern.metric}
                  </span>
                </div>

                {/* Title & Headline */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C8275]">
                    {pattern.title}
                  </span>
                  <h3 className="text-base font-bold text-[#161D26] leading-snug font-['Plus_Jakarta_Sans']">
                    {pattern.headline}
                  </h3>
                </div>

                <p className="text-xs text-[#525B6A] leading-relaxed">
                  {pattern.description}
                </p>

                {/* Evidence Drawer */}
                {isExpanded && (
                  <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#EAE5DC] text-xs space-y-2 animate-in fade-in duration-200">
                    <div className="flex items-center gap-1.5 font-bold text-[#161D26]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2D7A4C]" />
                      <span>Supported Data Evidence:</span>
                    </div>
                    <p className="text-[11px] text-[#6B7280] leading-relaxed">
                      {pattern.evidenceText}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-[#F2ECE1] flex items-center justify-between">
                <span className="text-[11px] text-[#8C8275] font-mono">
                  {pattern.supportedReceiptsCount} supported records
                </span>

                <button
                  type="button"
                  id={`btn-expand-pattern-${pattern.id}`}
                  onClick={() => {
                    playClick();
                    setExpandedId(isExpanded ? null : pattern.id);
                  }}
                  className="text-xs font-semibold text-[#2B6CB0] hover:text-[#1D4ED8] flex items-center gap-1 focus:outline-hidden"
                >
                  <span>{isExpanded ? 'Less' : 'View Evidence'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
