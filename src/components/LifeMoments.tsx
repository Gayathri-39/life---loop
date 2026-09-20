import React from 'react';
import { LifeMoment } from '../types';
import { CATEGORIES } from '../data/categories';
import {
  Sparkles,
  Play,
  Calendar,
  MapPin,
  ArrowRight,
  Compass,
  Clock
} from 'lucide-react';
import { playClick } from '../utils/soundEffects';

interface LifeMomentsProps {
  moments: LifeMoment[];
  onPlayMomentStory: (moment: LifeMoment) => void;
  onViewInGraph: (moment: LifeMoment) => void;
}

export const LifeMoments: React.FC<LifeMomentsProps> = ({
  moments,
  onPlayMomentStory,
  onViewInGraph,
}) => {
  return (
    <section id="moments-section" className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#E7E2DA]">
      <div className="space-y-4 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] text-xs font-semibold text-[#B45309]">
          <Compass className="w-3.5 h-3.5" />
          <span>Synthesis Layer</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#161D26] tracking-tight font-['Plus_Jakarta_Sans']">
              Discovered Life Moments
            </h2>
            <p className="text-sm sm:text-base text-[#6B7280] mt-1 max-w-2xl">
              By evaluating spatial coordinates, temporal proximity, and semantic keywords, our engine synthesized raw receipts into coherent memories.
            </p>
          </div>
          <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-[#FAF9F5] border border-[#DDD6CA] text-[#6B7280]">
            <span className="font-bold text-[#161D26]">{moments.length}</span> Moments Synthesized
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {moments.map(moment => {
          return (
            <article
              key={moment.id}
              id={`moment-card-${moment.id}`}
              className="group bg-white rounded-3xl border border-[#E5E0D6] shadow-xs hover:shadow-lg hover:border-[#161D26]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Header Banner */}
              <div className="p-6 pb-4 border-b border-[#F2ECE1] bg-gradient-to-br from-[#FAF8F5] to-white space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] font-semibold text-[#8C8275] uppercase tracking-wider">
                    {moment.primaryTheme}
                  </span>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E0EDFB] text-[#2B6CB0] font-mono text-[11px] font-bold">
                    <Sparkles className="w-3 h-3" />
                    <span>Score: {moment.connectionScore}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-[#161D26] font-['Playfair_Display'] group-hover:text-[#2B6CB0] transition-colors">
                    {moment.title}
                  </h3>
                  <p className="text-xs font-medium text-[#7C7469] italic">
                    "{moment.tagline}"
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    {moment.date}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-[#161D26]">
                    <MapPin className="w-3.5 h-3.5 text-[#E07A5F]" />
                    {moment.location}
                  </span>
                </div>
              </div>

              {/* Narrative Story Description */}
              <div className="p-6 space-y-4 flex-1">
                <p className="text-xs text-[#525B6A] leading-relaxed">
                  {moment.description}
                </p>

                {/* Receipts Trail */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-semibold text-[#8C8275] uppercase tracking-wider block">
                    Connected Timeline ({moment.receipts.length} records)
                  </span>
                  <div className="space-y-1.5">
                    {moment.receipts.slice(0, 4).map(r => {
                      const cat = CATEGORIES[r.type] || CATEGORIES.note;
                      return (
                        <div
                          key={r.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-[#FAF9F5] border border-[#EFECE6] text-xs"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: cat.color }}
                            />
                            <span className="font-medium text-[#161D26] truncate max-w-[170px]">
                              {r.title}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-[#8C8275] shrink-0">
                            {r.time}
                          </span>
                        </div>
                      );
                    })}
                    {moment.receipts.length > 4 && (
                      <p className="text-[11px] text-[#8C8275] italic pl-2">
                        + {moment.receipts.length - 4} more synchronized receipts
                      </p>
                    )}
                  </div>
                </div>

                {/* Categories Badge Strip */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {moment.categories.map(catKey => {
                    const cat = CATEGORIES[catKey];
                    if (!cat) return null;
                    return (
                      <span
                        key={catKey}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                        style={{ backgroundColor: cat.bgLight, color: cat.color }}
                      >
                        {cat.name}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-[#FAF9F5] border-t border-[#EAE5DC] flex items-center justify-between gap-2">
                <button
                  type="button"
                  id={`btn-graph-moment-${moment.id}`}
                  onClick={() => {
                    playClick();
                    onViewInGraph(moment);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-[#544F49] hover:text-[#161D26] hover:bg-[#EFECE6] transition-colors"
                >
                  Inspect in Graph
                </button>

                <button
                  type="button"
                  id={`btn-play-moment-${moment.id}`}
                  onClick={() => {
                    playClick();
                    onPlayMomentStory(moment);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#161D26] text-white text-xs font-bold hover:bg-[#283342] shadow-2xs transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-[#FAF9F5]" />
                  <span>Play Story</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
