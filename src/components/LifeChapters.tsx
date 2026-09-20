import React from 'react';
import { LifeChapter, LifeMoment, Receipt } from '../types';
import { BookOpen, Calendar, ArrowRight, Sparkles, Play } from 'lucide-react';
import { playClick } from '../utils/soundEffects';

interface LifeChaptersProps {
  chapters: LifeChapter[];
  moments: LifeMoment[];
  receipts: Receipt[];
  onSelectChapterInGraph: (receiptIds: number[]) => void;
  onPlayChapterStory: (momentTitle: string) => void;
}

export const LifeChapters: React.FC<LifeChaptersProps> = ({
  chapters,
  moments,
  receipts,
  onSelectChapterInGraph,
  onPlayChapterStory,
}) => {
  return (
    <section id="chapters-section" className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#E7E2DA]">
      <div className="space-y-4 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCEADE] text-xs font-semibold text-[#A05A2C]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Longitudinal Narrative</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#161D26] tracking-tight font-['Plus_Jakarta_Sans']">
              📖 Life Chapters
            </h2>
            <p className="text-sm sm:text-base text-[#6B7280] mt-1 max-w-2xl">
              Rather than splitting by calendar months, our engine groups your digital life into thematic chapters shaped by activity density, emotional tone, and geographical arcs.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-white border border-[#DDD6CA] text-[#6B7280]">
            {chapters.length} Narrative Arcs
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {chapters.map((chapter, index) => {
          return (
            <article
              key={chapter.id}
              id={`chapter-card-${chapter.id}`}
              className="group bg-white rounded-3xl border border-[#E5E0D6] shadow-xs hover:shadow-md transition-all p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Left Column: Title & Timeline */}
              <div className="space-y-3 lg:max-w-xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#DDD6CA] text-[#161D26]">
                    Chapter {index + 1}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#FAF0E6] text-[#A05A2C]">
                    {chapter.badge}
                  </span>
                  <span className="text-xs font-mono text-[#8C8275] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {chapter.dateRange}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-[#161D26] font-['Playfair_Display'] group-hover:text-[#2B6CB0] transition-colors">
                  {chapter.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#525B6A] leading-relaxed">
                  {chapter.description}
                </p>

                {/* Key Pattern Callout */}
                <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#EAE5DC] text-xs">
                  <span className="font-bold text-[#161D26] mr-1">Key Dynamic:</span>
                  <span className="text-[#6B7280]">{chapter.keyPattern}</span>
                </div>
              </div>

              {/* Right Column: Moments & Action Links */}
              <div className="lg:w-80 shrink-0 space-y-4 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l lg:border-[#EAE5DC] lg:pl-6">
                <div>
                  <span className="text-[11px] font-semibold text-[#8C8275] uppercase tracking-wider block mb-2">
                    Synthesized Moments:
                  </span>
                  <div className="space-y-1.5">
                    {chapter.connectedMoments.map((mTitle, i) => (
                      <div
                        key={i}
                        className="text-xs font-medium text-[#161D26] flex items-center gap-2 p-2 rounded-xl bg-[#FAF9F5] border border-[#EFECE6]"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
                        <span className="truncate">{mTitle}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id={`btn-explore-chapter-graph-${chapter.id}`}
                    onClick={() => {
                      playClick();
                      onSelectChapterInGraph(chapter.importantReceipts);
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-[#DDD6CA] bg-white text-xs font-semibold text-[#161D26] hover:bg-[#F2ECE1] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View in Graph</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    id={`btn-play-chapter-story-${chapter.id}`}
                    onClick={() => {
                      playClick();
                      onPlayChapterStory(chapter.connectedMoments[0]);
                    }}
                    className="py-2.5 px-4 rounded-xl bg-[#161D26] text-white text-xs font-bold hover:bg-[#283342] transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
