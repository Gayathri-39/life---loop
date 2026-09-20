import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Music2,
  Film,
  MapPin,
  ShoppingBag,
  Camera,
  MessageSquare,
  Search,
  Ticket,
  FileText,
  RotateCcw
} from 'lucide-react';
import { LifeMoment, StoryData, StoryScene } from '../types';
import { CATEGORIES } from '../data/categories';
import { buildStoryFromMoment } from '../utils/storyEngine';
import { playClick, playChime, playConnectHarmonics } from '../utils/soundEffects';

interface StoryModeProps {
  initialMoment?: LifeMoment;
  allMoments: LifeMoment[];
  onClose: () => void;
}

export const StoryMode: React.FC<StoryModeProps> = ({
  initialMoment,
  allMoments,
  onClose,
}) => {
  const [selectedMoment, setSelectedMoment] = useState<LifeMoment>(
    initialMoment || allMoments[0]
  );
  const [story, setStory] = useState<StoryData>(() => buildStoryFromMoment(selectedMoment));
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Sync story when selected moment changes
  useEffect(() => {
    setStory(buildStoryFromMoment(selectedMoment));
    setCurrentStepIndex(0);
    setIsPlaying(true);
  }, [selectedMoment]);

  // Total steps: scenes + 1 final revelation climax scene
  const totalSteps = story.scenes.length + 1;
  const isClimaxScene = currentStepIndex === story.scenes.length;
  const currentScene: StoryScene | undefined = story.scenes[currentStepIndex];

  // Auto-advance timer when playing
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => {
      if (currentStepIndex < totalSteps - 1) {
        setCurrentStepIndex(prev => prev + 1);
        playChime(440 + currentStepIndex * 60);
      } else {
        setIsPlaying(false);
      }
    }, isClimaxScene ? 6000 : 3800);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, totalSteps, isClimaxScene]);

  // Trigger celebration confetti when climax is revealed
  useEffect(() => {
    if (isClimaxScene) {
      playConnectHarmonics();
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2B6CB0', '#D4AF37', '#E07A5F', '#10B981'],
        });
      } catch {
        // Fallback
      }
    }
  }, [isClimaxScene]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIndex, totalSteps]);

  const handleNext = () => {
    playClick();
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
      playChime(500 + currentStepIndex * 50);
    }
  };

  const handlePrev = () => {
    playClick();
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    playClick();
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  const getSceneIcon = (type: string) => {
    switch (type) {
      case 'music': return Music2;
      case 'movie': return Film;
      case 'place': return MapPin;
      case 'purchase': return ShoppingBag;
      case 'photo': return Camera;
      case 'message': return MessageSquare;
      case 'search': return Search;
      case 'event': return Ticket;
      default: return FileText;
    }
  };

  return (
    <div
      id="cinematic-story-modal"
      className="fixed inset-0 z-50 bg-[#121820]/95 backdrop-blur-md flex flex-col justify-between text-[#FAF9F5] p-4 sm:p-8 overflow-hidden select-none"
    >
      {/* Top Header Bar */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#FDE68A]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-white/50 font-mono">
                CINEMATIC REPLAY
              </span>
              <span className="text-white/30">•</span>
              <span className="text-xs font-semibold text-white/80">
                {story.location} ({story.date})
              </span>
            </div>
            {/* Story Moment Selector Dropdown */}
            <select
              value={selectedMoment.id}
              onChange={e => {
                const found = allMoments.find(m => m.id === e.target.value);
                if (found) setSelectedMoment(found);
              }}
              className="bg-transparent text-sm font-bold text-[#FDE68A] hover:underline focus:outline-hidden cursor-pointer"
            >
              {allMoments.map(m => (
                <option key={m.id} value={m.id} className="bg-[#161D26] text-white">
                  {m.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Exit Button */}
        <button
          type="button"
          id="btn-close-story"
          onClick={() => {
            playClick();
            onClose();
          }}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          title="Exit Story Mode (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Story Progress Bar */}
      <div className="max-w-2xl mx-auto w-full py-4 z-20">
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div
              key={idx}
              className="h-1 flex-1 rounded-full overflow-hidden bg-white/20 cursor-pointer"
              onClick={() => {
                playClick();
                setCurrentStepIndex(idx);
              }}
            >
              <div
                className={`h-full transition-all duration-300 ${
                  idx <= currentStepIndex ? 'bg-[#FDE68A]' : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Cinematic Stage */}
      <div className="max-w-3xl mx-auto w-full flex-1 flex items-center justify-center relative z-10 py-6">
        <AnimatePresence mode="wait">
          {!isClimaxScene && currentScene ? (
            /* Individual Scene Step */
            <motion.div
              key={`scene-${currentScene.step}`}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-full text-center space-y-6"
            >
              {/* Scene hook */}
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-[#FDE68A] font-mono">
                  SCENE {currentScene.step} OF {story.scenes.length}
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal font-['Playfair_Display'] italic text-white/90">
                  "{currentScene.hook}"
                </h2>
              </div>

              {/* Central Receipt Spotlight Card */}
              {(() => {
                const Icon = getSceneIcon(currentScene.receipt.type);
                const cat = CATEGORIES[currentScene.receipt.type] || CATEGORIES.note;

                return (
                  <div className="max-w-md mx-auto bg-white/95 text-[#161D26] rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 text-left space-y-4">
                    <div className="flex items-center justify-between border-b border-[#EAE5DC] pb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: cat.bgLight, color: cat.color }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                          {cat.name}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-[#8C8275]">
                        {currentScene.receipt.time}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-[#161D26]">
                        {currentScene.receipt.title}
                      </h3>
                      <p className="text-xs text-[#525B6A] leading-relaxed">
                        {currentScene.receipt.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#F2ECE1] flex items-center justify-between text-xs text-[#8C8275]">
                      <span className="flex items-center gap-1 font-medium text-[#161D26]">
                        <MapPin className="w-3.5 h-3.5 text-[#E07A5F]" />
                        {currentScene.receipt.location}
                      </span>
                      <span className="font-mono">{currentScene.receipt.date}</span>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          ) : (
            /* Climax Grand Reveal */
            <motion.div
              key="climax"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-center space-y-8 max-w-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FDE68A] text-[#161D26] flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <Sparkles className="w-8 h-8" />
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl sm:text-3xl text-white/70 font-light">
                  {story.climaxStatement}
                </h3>
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#FAF9F5] font-['Playfair_Display']">
                  "{story.revelation}"
                </h1>
                <p className="text-base text-white/70 max-w-lg mx-auto pt-2">
                  Occurred on {story.date} in {story.location}. The Connection Engine linked these {story.scenes.length} records with a 92% confidence score.
                </p>
              </div>

              {/* Mini Constellation preview of the receipts */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {story.scenes.map(s => {
                  const Icon = getSceneIcon(s.receipt.type);
                  return (
                    <div
                      key={s.receipt.id}
                      className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs flex items-center gap-1.5"
                    >
                      <Icon className="w-3.5 h-3.5 text-[#FDE68A]" />
                      <span className="truncate max-w-[120px]">{s.receipt.title}</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  id="btn-replay-story"
                  onClick={handleRestart}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Replay Story</span>
                </button>
                <button
                  type="button"
                  id="btn-finish-story"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FAF9F5] text-[#161D26] text-xs font-bold hover:bg-white transition-colors"
                >
                  <span>Explore All Moments</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Controls Bar */}
      <div className="max-w-xl mx-auto w-full flex items-center justify-between z-20 pb-2">
        <button
          type="button"
          id="btn-prev-scene"
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Previous (Left Arrow)"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            id="btn-toggle-play-pause"
            onClick={() => {
              playClick();
              setIsPlaying(!isPlaying);
            }}
            className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-2 transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Auto-Play</span>
              </>
            )}
          </button>
        </div>

        <button
          type="button"
          id="btn-next-scene"
          onClick={handleNext}
          disabled={currentStepIndex === totalSteps - 1}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Next (Right Arrow or Space)"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
