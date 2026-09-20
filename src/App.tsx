import React, { useState, useMemo } from 'react';
import { SAMPLE_RECEIPTS } from './data/receipts';
import { Receipt, LifeMoment } from './types';
import { buildConnections, discoverLifeMoments } from './utils/connectionEngine';
import { computeHiddenPatterns } from './utils/patternEngine';
import { generateLifeChapters } from './utils/chapterEngine';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ConnectionGraph } from './components/ConnectionGraph';
import { LifeMoments } from './components/LifeMoments';
import { PatternSection } from './components/PatternSection';
import { LifeChapters } from './components/LifeChapters';
import { ReceiptExplorer } from './components/ReceiptExplorer';
import { LifeMap } from './components/LifeMap';
import { AnalyticsSection } from './components/AnalyticsSection';
import { StoryMode } from './components/StoryMode';
import { Footer } from './components/Footer';
import { ToastProvider, useToast } from './components/Toast';
import { AddReceiptModal } from './components/AddReceiptModal';
import { AiSynthesisModal } from './components/AiSynthesisModal';

function AppContent() {
  const [receipts, setReceipts] = useState<Receipt[]>(SAMPLE_RECEIPTS);
  const [isCustomData, setIsCustomData] = useState(false);

  // Hero interactive state
  const [isHeroConnected, setIsHeroConnected] = useState(false);

  // Story Mode modal state
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [activeStoryMoment, setActiveStoryMoment] = useState<LifeMoment | undefined>(undefined);

  // Graph selected receipt
  const [selectedGraphReceiptId, setSelectedGraphReceiptId] = useState<number | null>(null);

  // Modals for Hackathon Evaluation & Interactivity
  const [isAddReceiptOpen, setIsAddReceiptOpen] = useState(false);
  const [isAiSynthesisOpen, setIsAiSynthesisOpen] = useState(false);

  const { showToast } = useToast();

  // 1. Connection Engine Analysis (Deterministic, Browser-Only)
  const connections = useMemo(() => {
    return buildConnections(receipts, 50);
  }, [receipts]);

  // 2. Discovered Life Moments
  const moments = useMemo(() => {
    return discoverLifeMoments(receipts, connections);
  }, [receipts, connections]);

  // 3. Hidden Patterns
  const patterns = useMemo(() => {
    return computeHiddenPatterns(receipts);
  }, [receipts]);

  // 4. Life Chapters
  const chapters = useMemo(() => {
    return generateLifeChapters(moments, receipts);
  }, [moments, receipts]);

  // Navigation and Action Handlers
  const handleConnectDots = () => {
    setIsHeroConnected(true);
    const graphElement = document.getElementById('graph-section');
    if (graphElement) {
      graphElement.scrollIntoView({ behavior: 'smooth' });
    }
    showToast(
      'Dots Connected',
      `Identified ${connections.length} relational bridges and ${moments.length} life moments.`,
      'info'
    );
  };

  const handlePlayStory = (moment?: LifeMoment) => {
    const targetMoment = moment || (moments.length > 0 ? moments[0] : undefined);
    setActiveStoryMoment(targetMoment);
    setIsStoryOpen(true);
  };

  const handleViewMomentInGraph = (moment: LifeMoment) => {
    if (moment.receiptIds.length > 0) {
      setSelectedGraphReceiptId(moment.receiptIds[0]);
    }
    const graphElement = document.getElementById('graph-section');
    if (graphElement) {
      graphElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectChapterInGraph = (receiptIds: number[]) => {
    if (receiptIds.length > 0) {
      setSelectedGraphReceiptId(receiptIds[0]);
    }
    const graphElement = document.getElementById('graph-section');
    if (graphElement) {
      graphElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePlayChapterStory = (momentTitle: string) => {
    const matched = moments.find(m => m.title === momentTitle) || moments[0];
    handlePlayStory(matched);
  };

  const handleResetData = () => {
    setReceipts(SAMPLE_RECEIPTS);
    setIsCustomData(false);
  };

  const handleImportData = (newReceipts: Receipt[]) => {
    setReceipts(newReceipts);
    setIsCustomData(true);
  };

  const handleAddReceipt = (newReceipt: Receipt) => {
    setReceipts(prev => [newReceipt, ...prev]);
    setIsCustomData(true);
    setSelectedGraphReceiptId(newReceipt.id);
    showToast(
      'Receipt Ingested & Analyzed',
      `"${newReceipt.title}" was injected into the engine. Connected to ${newReceipt.location}.`,
      'success'
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#161D26] font-['Plus_Jakarta_Sans'] flex flex-col selection:bg-[#E8DFD0] selection:text-[#161D26]">
      {/* 1. Global Navigation */}
      <Navbar
        onConnectDots={handleConnectDots}
        onPlayStory={() => handlePlayStory()}
        onOpenAddReceipt={() => setIsAddReceiptOpen(true)}
        onOpenAiSynthesis={() => setIsAiSynthesisOpen(true)}
        totalReceipts={receipts.length}
        totalConnections={connections.length}
        totalMoments={moments.length}
      />

      <main className="flex-1">
        {/* 2. Hero Section with Live Animated Constellation */}
        <Hero
          onConnectDots={handleConnectDots}
          onExploreStory={(idx?: number) => {
            if (typeof idx === 'number' && moments[idx]) {
              handlePlayStory(moments[idx]);
            } else {
              handlePlayStory();
            }
          }}
          onOpenAiSynthesis={() => setIsAiSynthesisOpen(true)}
          totalReceiptsCount={receipts.length}
          totalConnectionsCount={connections.length}
          totalMomentsCount={moments.length}
          isConnected={isHeroConnected}
          setIsConnected={setIsHeroConnected}
        />

        {/* 3. Interactive Relationship Graph (React Flow) */}
        <ConnectionGraph
          receipts={receipts}
          connections={connections}
          moments={moments}
          selectedReceiptId={selectedGraphReceiptId}
          onSelectReceipt={setSelectedGraphReceiptId}
          onExploreMoment={handlePlayStory}
        />

        {/* 4. Discovered Life Moments */}
        <LifeMoments
          moments={moments}
          onPlayMomentStory={handlePlayStory}
          onViewInGraph={handleViewMomentInGraph}
        />

        {/* 5. Hidden Patterns ("You Didn't Notice This") */}
        <PatternSection patterns={patterns} />

        {/* 6. Life Chapters */}
        <LifeChapters
          chapters={chapters}
          moments={moments}
          receipts={receipts}
          onSelectChapterInGraph={handleSelectChapterInGraph}
          onPlayChapterStory={handlePlayChapterStory}
        />

        {/* 7. Receipt Explorer with Instant Search & Category Filters */}
        <ReceiptExplorer
          receipts={receipts}
          connections={connections}
          onOpenInGraph={receiptId => {
            setSelectedGraphReceiptId(receiptId);
            document.getElementById('graph-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onExploreMoment={r => {
            const momentWithReceipt = moments.find(m => m.receiptIds.includes(r.id));
            if (momentWithReceipt) handlePlayStory(momentWithReceipt);
          }}
        />

        {/* 8. Life Footprint & Interactive Abstract Map */}
        <LifeMap
          receipts={receipts}
          moments={moments}
          onExploreMoment={handlePlayStory}
        />

        {/* 9. Data Visualization Telemetry (Recharts) */}
        <AnalyticsSection
          receipts={receipts}
          connections={connections}
        />
      </main>

      {/* 10. Footer with JSON Import/Export/Reset */}
      <Footer
        onResetData={handleResetData}
        onImportData={handleImportData}
        isCustomData={isCustomData}
        currentReceipts={receipts}
      />

      {/* 11. Cinematic Story Mode Modal */}
      {isStoryOpen && (
        <StoryMode
          initialMoment={activeStoryMoment}
          allMoments={moments}
          onClose={() => setIsStoryOpen(false)}
        />
      )}

      {/* 12. Simulate/Add Receipt Modal for Live Demo Testing */}
      <AddReceiptModal
        isOpen={isAddReceiptOpen}
        onClose={() => setIsAddReceiptOpen(false)}
        onAddReceipt={handleAddReceipt}
        existingCount={receipts.length}
      />

      {/* 13. AI Synthesis & Digital Life Memoir Modal */}
      <AiSynthesisModal
        isOpen={isAiSynthesisOpen}
        onClose={() => setIsAiSynthesisOpen(false)}
        receipts={receipts}
        moments={moments}
        patterns={patterns}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

