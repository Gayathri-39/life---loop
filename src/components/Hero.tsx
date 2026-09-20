import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Play,
  Music2,
  MapPin,
  Camera,
  ShoppingBag,
  Ticket,
  Search,
  ArrowRight,
  TrendingUp,
  Network,
  RotateCcw
} from 'lucide-react';
import { playClick, playConnectHarmonics } from '../utils/soundEffects';

interface HeroProps {
  onConnectDots: () => void;
  onExploreStory: () => void;
  totalReceiptsCount: number;
  totalConnectionsCount: number;
  totalMomentsCount: number;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onConnectDots,
  onExploreStory,
  totalReceiptsCount,
  totalConnectionsCount,
  totalMomentsCount,
  isConnected,
  setIsConnected,
}) => {
  const [activeNode, setActiveNode] = useState<number | null>(null);

  // Five sample receipts illustrating the Coimbatore evening story
  const demonstrationNodes = [
    {
      id: 1,
      type: 'music',
      label: 'Midnight Drive',
      meta: '19:42 • The Local Train',
      icon: Music2,
      color: '#3B82F6',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      initialPos: { x: -160, y: -90 },
      connectedPos: { x: 0, y: -120 },
    },
    {
      id: 2,
      type: 'place',
      label: 'Race Course Walk',
      meta: '17:30 • Promenade',
      icon: MapPin,
      color: '#10B981',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      initialPos: { x: 170, y: -80 },
      connectedPos: { x: 0, y: 0 }, // Center Hub
    },
    {
      id: 3,
      type: 'photo',
      label: 'Stage Spotlights',
      meta: '19:10 • Golden Hour',
      icon: Camera,
      color: '#EC4899',
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      text: 'text-pink-700',
      initialPos: { x: -210, y: 50 },
      connectedPos: { x: -180, y: 0 },
    },
    {
      id: 4,
      type: 'purchase',
      label: 'Annapoorna Coffee',
      meta: '16:15 • Filter Brew',
      icon: ShoppingBag,
      color: '#F59E0B',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      initialPos: { x: 190, y: 70 },
      connectedPos: { x: 180, y: 0 },
    },
    {
      id: 5,
      type: 'event',
      label: 'Battle of the Bands',
      meta: '18:45 • Fest Amphitheater',
      icon: Ticket,
      color: '#EA580C',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      initialPos: { x: 0, y: 130 },
      connectedPos: { x: 0, y: 120 },
    },
  ];

  const handleHeroConnect = () => {
    playClick();
    playConnectHarmonics();
    setIsConnected(!isConnected);
    onConnectDots();
  };

  return (
    <section id="hero" className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden border-b border-[#E7E2DA]/60 bg-gradient-to-b from-[#FAF9F5] via-[#FAF9F5] to-[#F5F2EB]/50">
      {/* Subtle background scrapbook grid texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#D5CEC2_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Storytelling Headline */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFECE6] border border-[#DDD6CA] text-xs font-semibold text-[#544F49]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>Life-Loop (2) • Relationship Engine & Synthesis</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#161D26] font-['Plus_Jakarta_Sans'] leading-[1.1]">
                  Life-Loop
                </h1>
                <span className="text-xl sm:text-2xl font-mono font-bold px-3 py-1 rounded-xl bg-[#161D26] text-[#FAF9F5] shadow-xs">
                  (2)
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-medium text-[#7C7469] font-['Playfair_Display'] italic">
                Hundreds of moments. One story.
              </p>
            </div>

            <p className="text-base sm:text-lg text-[#5A6372] max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Your digital life is made of tiny moments. Life-Loop (2) connects them to reveal the stories hiding between the receipts.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                type="button"
                id="hero-btn-connect-dots"
                onClick={handleHeroConnect}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#161D26] text-[#FAF9F5] text-sm font-semibold hover:bg-[#283342] shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Sparkles className="w-4 h-4 text-[#FDE68A]" />
                <span>{isConnected ? 'Disconnect Sample' : '✨ Connect the Dots'}</span>
              </button>

              <button
                type="button"
                id="hero-btn-explore-story"
                onClick={() => {
                  playClick();
                  onExploreStory();
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FFFFFF] text-[#161D26] text-sm font-semibold border border-[#D5CEC2] hover:bg-[#F7F4EE] shadow-xs hover:shadow-sm transition-all transform hover:-translate-y-0.5"
              >
                <Play className="w-4 h-4 text-[#E07A5F] fill-current" />
                <span>▶ Explore My Story</span>
              </button>
            </div>

            {/* Data summary pill stats */}
            <div className="pt-4 border-t border-[#E7E2DA] flex items-center justify-center lg:justify-start gap-6 text-xs text-[#6B7280]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-[#161D26] font-mono">{totalReceiptsCount}</span>
                <span>Raw Receipts</span>
              </div>
              <div className="w-px h-4 bg-[#D5CEC2]" />
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-[#2B6CB0] font-mono">{totalConnectionsCount}</span>
                <span>Connections Found</span>
              </div>
              <div className="w-px h-4 bg-[#D5CEC2]" />
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-[#2D7A4C] font-mono">{totalMomentsCount}</span>
                <span>Life Moments</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Constellation Visual */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full max-w-lg bg-[#FAF9F5] rounded-3xl p-6 border border-[#E5E0D6] shadow-sm relative overflow-hidden">
              {/* Header status bar */}
              <div className="flex items-center justify-between pb-4 border-b border-[#ECE6DC] mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E57373]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFB74D]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#81C784]" />
                  </div>
                  <span className="text-xs font-mono text-[#8C8275] ml-2">
                    {isConnected ? 'STATUS: RELATIONSHIP GRAPH ACTIVE' : 'STATUS: UNCONNECTED RECEIPTS'}
                  </span>
                </div>
                <button
                  type="button"
                  id="btn-toggle-hero-state"
                  onClick={handleHeroConnect}
                  className="text-xs font-medium text-[#2B6CB0] hover:text-[#1D4ED8] flex items-center gap-1 focus:outline-hidden"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{isConnected ? 'Reset' : 'Demonstrate'}</span>
                </button>
              </div>

              {/* Central stage area */}
              <div className="h-84 relative flex items-center justify-center">
                {/* SVG connection lines rendered when connected */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  {isConnected && (
                    <>
                      {/* Lines from center hub (RS Puram) to outer receipts */}
                      <motion.line
                        x1="50%"
                        y1="50%"
                        x2="50%"
                        y2="18%"
                        stroke="#94A3B8"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                      />
                      <motion.line
                        x1="50%"
                        y1="50%"
                        x2="18%"
                        y2="50%"
                        stroke="#94A3B8"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      />
                      <motion.line
                        x1="50%"
                        y1="50%"
                        x2="82%"
                        y2="50%"
                        stroke="#94A3B8"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                      />
                      <motion.line
                        x1="50%"
                        y1="50%"
                        x2="50%"
                        y2="82%"
                        stroke="#94A3B8"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      />
                    </>
                  )}
                </svg>

                {/* Animated receipt cards */}
                {demonstrationNodes.map(node => {
                  const Icon = node.icon;
                  const pos = isConnected ? node.connectedPos : node.initialPos;

                  return (
                    <motion.div
                      key={node.id}
                      layout
                      initial={false}
                      animate={{
                        x: pos.x,
                        y: pos.y,
                        scale: activeNode === node.id ? 1.05 : 1,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 70,
                        damping: 14,
                      }}
                      onHoverStart={() => setActiveNode(node.id)}
                      onHoverEnd={() => setActiveNode(null)}
                      onClick={() => {
                        playClick();
                        setActiveNode(node.id);
                      }}
                      className={`absolute z-10 cursor-pointer rounded-2xl p-3 bg-white border ${
                        activeNode === node.id ? 'border-[#161D26] shadow-md ring-2 ring-[#161D26]/10' : node.border
                      } shadow-xs hover:shadow-md transition-shadow select-none w-40 text-left`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${node.bg} ${node.text}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-[#161D26] truncate">
                            {node.label}
                          </p>
                          <p className="text-[10px] text-[#6B7280] font-mono truncate">
                            {node.meta}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom discovery insight banner */}
              <div className="pt-4 border-t border-[#ECE6DC] bg-[#FAF8F5] -mx-6 -mb-6 p-4 rounded-b-3xl">
                {isConnected ? (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#161D26] font-['Playfair_Display']">
                        ✨ Discovered: "An Electric Evening in Coimbatore"
                      </p>
                      <p className="text-[11px] text-[#6B7280]">
                        Connected score: <strong className="text-[#2B6CB0]">88/100</strong> (Same date, location & within 3.5 hrs)
                      </p>
                    </div>
                    <a
                      href="#moments-section"
                      className="text-xs font-semibold text-[#161D26] hover:underline flex items-center gap-1"
                    >
                      <span>View Story</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </motion.div>
                ) : (
                  <p className="text-xs text-center text-[#7C7469] italic">
                    Click "Connect the Dots" to synthesize these receipts into a single coherent moment.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
