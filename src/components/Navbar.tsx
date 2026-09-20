import React, { useState, useEffect } from 'react';
import { Sparkles, Play, Volume2, VolumeX, Share2, Layers } from 'lucide-react';
import { isSoundEnabled, toggleSound, playClick } from '../utils/soundEffects';

interface NavbarProps {
  onConnectDots: () => void;
  onPlayStory: () => void;
  totalReceipts: number;
  totalConnections: number;
  totalMoments: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onConnectDots,
  onPlayStory,
  totalReceipts,
  totalConnections,
  totalMoments,
}) => {
  const [soundOn, setSoundOn] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSoundOn(isSoundEnabled());
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSoundToggle = () => {
    playClick();
    const updated = toggleSound();
    setSoundOn(updated);
  };

  const handleShare = () => {
    playClick();
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header
      id="main-navbar"
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#E7E2DA] shadow-xs'
          : 'bg-[#FAF9F5] border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand identity */}
        <a href="#hero" className="flex items-center gap-3 group focus:outline-hidden" id="nav-brand-logo">
          <div className="w-10 h-10 rounded-xl bg-[#161D26] text-[#FAF9F5] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200">
            <Layers className="w-5 h-5 text-[#E8DFD0]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-[#161D26] font-['Plus_Jakarta_Sans']">
                LIFELOOP
              </span>
              <span className="text-[10px] tracking-wider uppercase px-1.5 py-0.5 rounded font-mono font-medium bg-[#E8DFD0]/60 text-[#544F49]">
                v1.0
              </span>
            </div>
            <p className="text-xs text-[#6B7280] hidden sm:block">
              Hundreds of moments. One story.
            </p>
          </div>
        </a>

        {/* Navigation Anchors */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-[#4B5563]">
          <a
            href="#graph-section"
            className="px-3 py-1.5 rounded-lg hover:text-[#161D26] hover:bg-[#F0EDE6] transition-colors"
            id="nav-link-graph"
          >
            Connection Graph
          </a>
          <a
            href="#moments-section"
            className="px-3 py-1.5 rounded-lg hover:text-[#161D26] hover:bg-[#F0EDE6] transition-colors"
            id="nav-link-moments"
          >
            Moments
            <span className="ml-1.5 text-xs px-1.5 py-0.2 rounded-full bg-[#E0EDFB] text-[#2B6CB0] font-mono">
              {totalMoments}
            </span>
          </a>
          <a
            href="#explorer-section"
            className="px-3 py-1.5 rounded-lg hover:text-[#161D26] hover:bg-[#F0EDE6] transition-colors"
            id="nav-link-explorer"
          >
            Receipts
            <span className="ml-1.5 text-xs px-1.5 py-0.2 rounded-full bg-[#E7E2DA] text-[#4B5563] font-mono">
              {totalReceipts}
            </span>
          </a>
          <a
            href="#patterns-section"
            className="px-3 py-1.5 rounded-lg hover:text-[#161D26] hover:bg-[#F0EDE6] transition-colors"
            id="nav-link-patterns"
          >
            Hidden Patterns
          </a>
          <a
            href="#chapters-section"
            className="px-3 py-1.5 rounded-lg hover:text-[#161D26] hover:bg-[#F0EDE6] transition-colors"
            id="nav-link-chapters"
          >
            Chapters
          </a>
          <a
            href="#map-section"
            className="px-3 py-1.5 rounded-lg hover:text-[#161D26] hover:bg-[#F0EDE6] transition-colors"
            id="nav-link-map"
          >
            Life Footprint
          </a>
        </nav>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <button
            type="button"
            id="btn-toggle-sound"
            onClick={handleSoundToggle}
            title={soundOn ? 'Sound FX Enabled (Click to mute)' : 'Sound Muted'}
            className="p-2 rounded-lg text-[#6B7280] hover:text-[#161D26] hover:bg-[#F0EDE6] transition-colors"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-[#2D7A4C]" /> : <VolumeX className="w-4 h-4 text-[#9CA3AF]" />}
          </button>

          {/* Share */}
          <button
            type="button"
            id="btn-share-app"
            onClick={handleShare}
            title="Copy app link"
            className="p-2 rounded-lg text-[#6B7280] hover:text-[#161D26] hover:bg-[#F0EDE6] transition-colors relative"
          >
            <Share2 className="w-4 h-4" />
            {copied && (
              <span className="absolute -bottom-8 right-0 text-[11px] bg-[#161D26] text-white px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                Link copied!
              </span>
            )}
          </button>

          {/* Connect Dots Button */}
          <button
            type="button"
            id="nav-btn-connect-dots"
            onClick={() => {
              playClick();
              onConnectDots();
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#FAF9F5] text-[#161D26] border border-[#D5CEC2] hover:bg-[#F2ECE1] transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B45309]" />
            Connect Dots
            <span className="text-[11px] font-mono text-[#6B7280]">
              ({totalConnections})
            </span>
          </button>

          {/* Story Mode Button */}
          <button
            type="button"
            id="nav-btn-play-story"
            onClick={() => {
              playClick();
              onPlayStory();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#161D26] text-[#FAF9F5] hover:bg-[#283342] transition-all shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current text-[#FAF9F5]" />
            <span>Story Mode</span>
          </button>
        </div>
      </div>
    </header>
  );
};
