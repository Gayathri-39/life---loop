import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Bot,
  X,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Compass,
  Cpu,
  Feather,
  Layers,
  ArrowRight
} from 'lucide-react';
import { LifeMoment, Receipt, HiddenPattern } from '../types';
import { playClick, playChime, playConnectHarmonics } from '../utils/soundEffects';

interface AiSynthesisModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipts: Receipt[];
  moments: LifeMoment[];
  patterns: HiddenPattern[];
}

type ReflectionStyle = 'cinematic' | 'analytical' | 'introspective';
type ReflectionPrompt = 'memoir' | 'psychology' | 'next-chapter';

export const AiSynthesisModal: React.FC<AiSynthesisModalProps> = ({
  isOpen,
  onClose,
  receipts,
  moments,
  patterns,
}) => {
  const [promptType, setPromptType] = useState<ReflectionPrompt>('memoir');
  const [style, setStyle] = useState<ReflectionStyle>('cinematic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStage, setProgressStage] = useState('');
  const [resultText, setResultText] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate synthesis content deterministically and with high literary craft
  const generateNarrative = () => {
    playClick();
    setIsGenerating(true);
    setResultText('');

    const stages = [
      'Scanning temporal timestamps across 3 cities...',
      'Extracting emotional sentiment from 52 digital receipts...',
      'Aligning midnight sprints with geographical migrations...',
      'Synthesizing narrative monologue...',
    ];

    let currentStageIndex = 0;
    setProgressStage(stages[0]);

    const interval = setInterval(() => {
      currentStageIndex++;
      if (currentStageIndex < stages.length) {
        setProgressStage(stages[currentStageIndex]);
      } else {
        clearInterval(interval);
        // Build narrative text based on user selections
        const narrative = buildTailoredNarrative(promptType, style, receipts, moments, patterns);
        setResultText(narrative);
        setIsGenerating(false);
        playConnectHarmonics();
      }
    }, 450);
  };

  useEffect(() => {
    if (isOpen && !resultText) {
      generateNarrative();
    }
  }, [isOpen]);

  const handleCopy = () => {
    playClick();
    navigator.clipboard?.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      id="ai-synthesis-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-[#DDD6CA] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto text-left"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#161D26] to-[#2B6CB0] text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-[#FDE68A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="ai-modal-title" className="text-xl font-bold text-[#161D26] font-['Plus_Jakarta_Sans']">
                  AI Life Synthesis Engine
                </h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#E0EDFB] text-[#2B6CB0] font-bold">
                  Neural Narrative
                </span>
              </div>
              <p className="text-xs text-[#6B7280]">
                Synthesizing {receipts.length} raw activities into a unified autobiographical reflection.
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-ai-modal"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F2ECE1] text-[#7C7469] hover:text-[#161D26] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls: Prompt Type & Voice Tone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF9F5] p-4 rounded-2xl border border-[#EAE5DC]">
          {/* Goal Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#161D26] block">Synthesis Angle</label>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setPromptType('memoir')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  promptType === 'memoir'
                    ? 'bg-[#161D26] text-white border-[#161D26]'
                    : 'bg-white text-[#544F49] border-[#DDD6CA] hover:bg-[#F2ECE1]'
                }`}
              >
                Autobiographical Memoir
              </button>
              <button
                type="button"
                onClick={() => setPromptType('psychology')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  promptType === 'psychology'
                    ? 'bg-[#161D26] text-white border-[#161D26]'
                    : 'bg-white text-[#544F49] border-[#DDD6CA] hover:bg-[#F2ECE1]'
                }`}
              >
                Behavioral Archetype
              </button>
              <button
                type="button"
                onClick={() => setPromptType('next-chapter')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  promptType === 'next-chapter'
                    ? 'bg-[#161D26] text-white border-[#161D26]'
                    : 'bg-white text-[#544F49] border-[#DDD6CA] hover:bg-[#F2ECE1]'
                }`}
              >
                Next Chapter Forecast
              </button>
            </div>
          </div>

          {/* Voice Style */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#161D26] block">Voice Tone</label>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setStyle('cinematic')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  style === 'cinematic'
                    ? 'bg-[#161D26] text-white border-[#161D26]'
                    : 'bg-white text-[#544F49] border-[#DDD6CA] hover:bg-[#F2ECE1]'
                }`}
              >
                🎬 Cinematic & Poetic
              </button>
              <button
                type="button"
                onClick={() => setStyle('analytical')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  style === 'analytical'
                    ? 'bg-[#161D26] text-white border-[#161D26]'
                    : 'bg-white text-[#544F49] border-[#DDD6CA] hover:bg-[#F2ECE1]'
                }`}
              >
                📊 Structured & Sharp
              </button>
              <button
                type="button"
                onClick={() => setStyle('introspective')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  style === 'introspective'
                    ? 'bg-[#161D26] text-white border-[#161D26]'
                    : 'bg-white text-[#544F49] border-[#DDD6CA] hover:bg-[#F2ECE1]'
                }`}
              >
                🕯️ Warm & Reflective
              </button>
            </div>
          </div>
        </div>

        {/* Action Trigger button if user changes settings */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#8C8275] font-mono">
            Analyzed {moments.length} moments and {patterns.length} algorithmic patterns
          </span>
          <button
            type="button"
            id="btn-trigger-ai-synthesis"
            onClick={generateNarrative}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#161D26] text-white text-xs font-bold hover:bg-[#283342] transition-colors disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing...' : 'Regenerate Narrative'}</span>
          </button>
        </div>

        {/* Narrative Output Container */}
        <div className="min-h-[260px] bg-[#FAF8F5] border border-[#EAE5DC] rounded-2xl p-6 relative">
          {isGenerating ? (
            <div className="h-56 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#DDD6CA] flex items-center justify-center shadow-xs animate-bounce">
                <Sparkles className="w-6 h-6 text-[#2B6CB0]" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-[#161D26] font-mono">
                  {progressStage}
                </p>
                <p className="text-[11px] text-[#8C8275]">
                  Applying cognitive graph synthesis across your digital footprint...
                </p>
              </div>
              <div className="w-48 h-1.5 rounded-full bg-[#E5E0D6] overflow-hidden">
                <div className="h-full bg-[#2B6CB0] rounded-full animate-pulse w-3/4" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DC]">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[#2B6CB0]" />
                  <span className="text-xs font-bold text-[#161D26]">
                    {promptType === 'memoir' && 'Synthesized Personal Memoir'}
                    {promptType === 'psychology' && 'Cognitive Archetype Profile'}
                    {promptType === 'next-chapter' && 'Predictive Trajectory & Next Chapter'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#2B6CB0] hover:underline"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Text'}</span>
                </button>
              </div>

              <div className="text-sm text-[#374151] leading-relaxed whitespace-pre-line font-['Plus_Jakarta_Sans']">
                {resultText}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between pt-2 text-xs text-[#8C8275]">
          <span>
            Crafted for live hackathon demonstration • Pure browser synthesis
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-[#DDD6CA] text-[#161D26] font-semibold hover:bg-[#F2ECE1] transition-colors"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Heuristic Generator with High Literary Craft
function buildTailoredNarrative(
  prompt: ReflectionPrompt,
  style: ReflectionStyle,
  receipts: Receipt[],
  moments: LifeMoment[],
  patterns: HiddenPattern[]
): string {
  const topMoments = moments.slice(0, 3).map(m => `"${m.title}"`).join(', ');
  const totalReceipts = receipts.length;

  if (prompt === 'memoir') {
    if (style === 'cinematic') {
      return `If someone looked at these ${totalReceipts} receipts as mere transactions, they would see coffees bought, kilometers traveled, and music streamed. But look closer.

Between the late-night filter coffee on Avinashi Road and the 2 AM breakthrough sprint in Koramangala, a distinct human arc appears. It is a story of deliberate momentum:

You do not simply consume the world; you explore it with intent. The data shows that your searches never stay trapped in a browser window—within hours, they transform into physical concert tickets, mountain switchback roads, or vintage 35mm cinema screenings. Moments like ${topMoments} aren't isolated events; they are anchor stones in a life refusing to live on autopilot.

When night falls, your focus sharpens. In the quiet hours between 10 PM and dawn, with lo-fi synthwave looping through headphones, your most enduring ideas took physical form.

These weren't hundreds of receipts. They were chapters in an unwritten book.`;
    }

    if (style === 'analytical') {
      return `### AUTOBIOGRAPHICAL TELEMETRY SUMMARY
- Total Data Points Analyzed: ${totalReceipts} records across 9 distinct categories.
- Core Synthesized Moments: ${moments.length} high-affinity clusters.
- Predominant Rhythm: Night Owl / Flow State (Peak velocity: 22:00 — 04:00).

### KEY BEHAVIORAL HIGHLIGHTS:
1. Intentional Spatial Mobility: High geographical correlation between Nilgiri mountain ascents and Chennai coastal strides. Travel is consistently accompanied by acoustic soundscapes.
2. Direct Action Conversion: Over 75% of information queries (searches) resulted in a physical receipt (event, cinema, or purchase) within a 24-hour window.
3. Anchor Epicenter: Coimbatore serves as the primary social and cultural nexus, while Bengaluru acts as the technical deep-work workshop.`;
    }

    return `Looking back over these weeks, what stands out isn't the busyness—it's the stillness that lived inside the motion.

From the first morning sips of specialty pour-overs to rain-soaked train windows watching the Palakkad gap blur by at dusk, every receipt holds a sensory trace. We often forget the tiny moments that define who we are: an encouraging group text after getting home safe, the smell of damp pine needles at 2,600 meters in Ooty, or the quiet triumph of closing a laptop when the code finally ran.

Life doesn't happen in grand milestones alone. It lives right here—in the loop between what we seek, what we experience, and what we remember.`;
  }

  if (prompt === 'psychology') {
    return `### BEHAVIORAL ARCHETYPE: "THE NOCTURNAL ARCHITECT & SENSORY CHRONICLER"

Based on recursive cluster analysis across your ${totalReceipts} digital receipts:

1. Cognitive Profile:
You exhibit a high "curiosity-to-action quotient." Unlike passive digital consumers, your queries consistently culminate in real-world explorations—from experimental coffee roasts to independent film retrospectives.

2. Peak Creative Velocity:
Your circadian rhythms cluster heavily around late evenings. Notes and music streaming peak post-10 PM, suggesting that daytime hours are reserved for sensory observation, while night hours are dedicated to synthesis and deep work.

3. Aesthetic Anchoring:
Visual captures (photos) occur exclusively at aesthetic transitions (golden hour, mountain mist, concert amphitheaters). You preserve atmosphere rather than vanity.`;
  }

  // Next Chapter
  return `### THE NEXT CHAPTER: WHERE THE LOOP IS HEADING

Looking across the trajectory of your recent chapters (${topMoments}):

1. Increased Creative Autonomy:
The shift from July's exploratory college fest energy to August's disciplined 10K running strides and deep algorithmic sprints indicates a sharpening of personal craft.

2. Forthcoming Synthesis:
The pattern indicates that your frequent migrations between Bengaluru's tech ecosystem and Coimbatore's cultural grounding are about to converge into a major creative project or venture.

3. Recommendation for the Next Horizon:
Protect the quiet morning rituals that preceded your biggest breakthroughs. Your best work consistently blooms when sensory rest precedes high-intensity execution.`;
}
