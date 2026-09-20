import React, { useState, useEffect } from 'react';
import { Sparkles, Play, Volume2, VolumeX, Share2, Layers, Menu, X, Plus, Bot, BarChart3 } from 'lucide-react';
import { isSoundEnabled, toggleSound, playClick } from '../utils/soundEffects';

interface NavbarProps {
  onConnectDots: () => void;
  onPlayStory: () => void;
  onOpenAddReceipt?: () => void;
  onOpenAiSynthesis?: () => void;
  totalReceipts: number;
  totalConnections: number;
  totalMoments: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onConnectDots,
  onPlayStory,
  onOpenAddReceipt,
  onOpenAiSynthesis,
  totalReceipts,
  totalConnections,
  totalMoments,
}) => {
  const [soundOn, setSoundOn] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-navbar"
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E7E2DA] shadow-xs'
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
              <span className="font-extrabold text-xl tracking-tight text-[#161D26] font-['Plus_Jakarta_Sans']">
                LIFELOOP
              </span>
            </div>
            <p className="text-xs text-[#6B7280] hidden sm:block">
              Hundreds of moments. One story.
            </p>
          </div>
        </a>

        {/* Navigation Anchors */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-[#4B5563]">
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
            Patterns
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
            Footprint
          </a>
          <a
            href="#insights-section"
            className="px-3 py-1.5 rounded-lg hover:text-[#161D26] hover:bg-[#F0EDE6] transition-colors"
            id="nav-link-insights"
          >
            Telemetry
          </a>
        </nav>

        {/* Action controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Add Receipt Button (for quick demonstration) */}
          {onOpenAddReceipt && (
            <button
              type="button"
              id="nav-btn-simulate-receipt"
              onClick={() => {
                playClick();
                onOpenAddReceipt();
              }}
              title="Add a new digital receipt to watch the graph recalculate live"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-[#D5CEC2] text-[#161D26] hover:bg-[#F2ECE1] transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#2B6CB0]" />
              <span>Simulate Receipt</span>
            </button>
          )}

          {/* AI Memoir Synthesis Button */}
          {onOpenAiSynthesis && (
            <button
              type="button"
              id="nav-btn-ai-synthesis"
              onClick={() => {
                playClick();
                onOpenAiSynthesis();
              }}
              title="Open AI Memoir & Life Archetype Synthesis"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-linear-to-r from-[#161D26] to-[#2B6CB0] text-white hover:opacity-95 transition-all shadow-xs"
            >
              <Bot className="w-3.5 h-3.5 text-[#FDE68A]" />
              <span>AI Synthesis</span>
            </button>
          )}

          {/* Audio toggle */}
          <button
            type="button"
            id="btn-toggle-sound"
            onClick={handleSoundToggle}
            title={soundOn ? 'Sound FX Enabled (Click to mute)' : 'Sound Muted'}
            className="p-2 rounded-lg text-[#6B7280] hover:text-[#161D26] hover:bg-[#F0EDE6] transition-colors"
            aria-label={soundOn ? 'Mute sound effects' : 'Unmute sound effects'}
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
            aria-label="Copy app link"
          >
            <Share2 className="w-4 h-4" />
            {copied && (
              <span className="absolute -bottom-8 right-0 text-[11px] bg-[#161D26] text-white px-2 py-0.5 rounded-sm shadow-xs whitespace-nowrap z-50">
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
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-[#FAF9F5] text-[#161D26] border border-[#D5CEC2] hover:bg-[#F2ECE1] transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B45309]" />
            <span className="hidden xl:inline">Connect Dots</span>
            <span className="text-[11px] font-mono text-[#6B7280]">
              ({totalConnections})
            </span>
          </button>

          {/* Start Your Story Button */}
          <button
            type="button"
            id="nav-btn-play-story"
            onClick={() => {
              playClick();
              onPlayStory();
            }}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#161D26] text-[#FAF9F5] hover:bg-[#283342] transition-all shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current text-[#FDE68A]" />
            <span>Start Your Story</span>
          </button>

          {/* Mobile Menu Toggle (screens < lg) */}
          <button
            type="button"
            id="nav-btn-mobile-toggle"
            onClick={() => {
              playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden p-2 rounded-lg text-[#6B7280] hover:text-[#161D26] hover:bg-[#F0EDE6] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="lg:hidden bg-[#FAF9F5] border-b border-[#E7E2DA] px-4 pt-3 pb-5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Prominent Start Your Story Action Button */}
          <button
            type="button"
            id="mobile-btn-start-story"
            onClick={() => {
              closeMobileMenu();
              playClick();
              onPlayStory();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#161D26] text-white text-sm font-bold shadow-md active:scale-98 transition-all"
          >
            <Play className="w-4 h-4 fill-current text-[#FDE68A]" />
            <span>Start Your Story</span>
          </button>

          <div className="grid grid-cols-2 gap-2 text-sm font-medium text-[#4B5563]">
            <a
              href="#graph-section"
              onClick={closeMobileMenu}
              className="p-2 rounded-lg hover:bg-[#F0EDE6] hover:text-[#161D26]"
            >
              Connection Graph
            </a>
            <a
              href="#moments-section"
              onClick={closeMobileMenu}
              className="p-2 rounded-lg hover:bg-[#F0EDE6] hover:text-[#161D26] flex items-center justify-between"
            >
              <span>Moments</span>
              <span className="text-xs px-1.5 py-0.2 rounded-full bg-[#E0EDFB] text-[#2B6CB0] font-mono">
                {totalMoments}
              </span>
            </a>
            <a
              href="#explorer-section"
              onClick={closeMobileMenu}
              className="p-2 rounded-lg hover:bg-[#F0EDE6] hover:text-[#161D26] flex items-center justify-between"
            >
              <span>Receipts Archive</span>
              <span className="text-xs px-1.5 py-0.2 rounded-full bg-[#E7E2DA] text-[#4B5563] font-mono">
                {totalReceipts}
              </span>
            </a>
            <a
              href="#patterns-section"
              onClick={closeMobileMenu}
              className="p-2 rounded-lg hover:bg-[#F0EDE6] hover:text-[#161D26]"
            >
              Hidden Patterns
            </a>
            <a
              href="#chapters-section"
              onClick={closeMobileMenu}
              className="p-2 rounded-lg hover:bg-[#F0EDE6] hover:text-[#161D26]"
            >
              Life Chapters
            </a>
            <a
              href="#map-section"
              onClick={closeMobileMenu}
              className="p-2 rounded-lg hover:bg-[#F0EDE6] hover:text-[#161D26]"
            >
              Spatial Footprint
            </a>
            <a
              href="#insights-section"
              onClick={closeMobileMenu}
              className="p-2 rounded-lg hover:bg-[#F0EDE6] hover:text-[#161D26]"
            >
              Telemetry & Charts
            </a>
          </div>

          <div className="pt-2 border-t border-[#EAE5DC] flex flex-wrap gap-2">
            {onOpenAddReceipt && (
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  onOpenAddReceipt();
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-[#DDD6CA] text-xs font-semibold text-[#161D26]"
              >
                <Plus className="w-3.5 h-3.5 text-[#2B6CB0]" />
                <span>Simulate Receipt</span>
              </button>
            )}

            {onOpenAiSynthesis && (
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  onOpenAiSynthesis();
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#161D26] text-white text-xs font-semibold"
              >
                <Bot className="w-3.5 h-3.5 text-[#FDE68A]" />
                <span>AI Synthesis</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

