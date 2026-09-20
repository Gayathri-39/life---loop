import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  Node,
  Edge,
  Position,
  Handle,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Connection, LifeMoment, Receipt } from '../types';
import { CATEGORIES } from '../data/categories';
import {
  Music2,
  Film,
  MapPin,
  ShoppingBag,
  Camera,
  MessageSquare,
  Search,
  Ticket,
  FileText,
  Sparkles,
  Sliders,
  Filter,
  Maximize2,
  Info,
  Calendar,
  Clock,
  RotateCcw
} from 'lucide-react';
import { playClick, playConnectHarmonics } from '../utils/soundEffects';

// Custom Receipt Node for React Flow
export const CustomReceiptNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  const receipt: Receipt = data.receipt;
  const isConnectedMode: boolean = data.isConnectedMode;
  const isHighlighted: boolean = data.isHighlighted;
  const isDimmed: boolean = data.isDimmed;

  const cat = CATEGORIES[receipt.type] || CATEGORIES.note;

  const getIcon = () => {
    switch (receipt.type) {
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

  const Icon = getIcon();

  return (
    <div
      className={`relative rounded-2xl bg-white border transition-all duration-300 shadow-xs cursor-pointer select-none ${
        selected || isHighlighted
          ? 'border-[#161D26] ring-3 ring-[#161D26]/20 shadow-lg scale-105 z-30'
          : 'border-[#DDD6CA] hover:border-[#161D26]/50 hover:shadow-md'
      } ${isDimmed ? 'opacity-30 grayscale-[30%]' : 'opacity-100'}`}
      style={{ width: 220 }}
    >
      {/* Handles for edges in 4 directions */}
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 !bg-[#64748B] !border-2 !border-white" />
      <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 !bg-[#64748B] !border-2 !border-white" />
      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 !bg-[#64748B] !border-2 !border-white" />
      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 !bg-[#64748B] !border-2 !border-white" />

      {/* Header */}
      <div className="px-3 py-2 border-b border-[#EAE5DC] flex items-center justify-between bg-[#FAF8F5] rounded-t-2xl">
        <div className="flex items-center gap-1.5">
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center text-xs"
            style={{ backgroundColor: cat.bgLight, color: cat.color }}
          >
            <Icon className="w-3 h-3" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
            {cat.name}
          </span>
        </div>
        <span className="text-[9px] font-mono text-[#9CA3AF]">
          #{String(receipt.id).padStart(3, '0')}
        </span>
      </div>

      {/* Content */}
      <div className="p-3 space-y-1.5 text-left">
        <h4 className="text-xs font-bold text-[#161D26] line-clamp-1 leading-snug">
          {receipt.title}
        </h4>
        <p className="text-[10px] text-[#6B7280] line-clamp-1">
          {receipt.description}
        </p>

        <div className="pt-1 flex items-center justify-between text-[9px] font-mono text-[#8C8275] border-t border-[#F2ECE1]">
          <span>{receipt.time}</span>
          <span className="font-sans font-medium text-[#161D26] truncate max-w-[100px]">
            {receipt.location}
          </span>
        </div>
      </div>
    </div>
  );
};

const nodeTypes = {
  receiptNode: CustomReceiptNode,
};

interface ConnectionGraphProps {
  receipts: Receipt[];
  connections: Connection[];
  moments: LifeMoment[];
  selectedReceiptId?: number | null;
  onSelectReceipt?: (id: number | null) => void;
  onExploreMoment?: (moment: LifeMoment) => void;
}

export const ConnectionGraph: React.FC<ConnectionGraphProps> = ({
  receipts,
  connections,
  moments,
  selectedReceiptId,
  onSelectReceipt,
  onExploreMoment,
}) => {
  const [isConnectedMode, setIsConnectedMode] = useState(true);
  const [threshold, setThreshold] = useState(50);
  const [activeMomentFilter, setActiveMomentFilter] = useState<string>('all');
  const [showMathFormula, setShowMathFormula] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(
    selectedReceiptId ? `node-${selectedReceiptId}` : null
  );

  // Sync external selected receipt if passed
  useEffect(() => {
    if (selectedReceiptId) {
      setActiveNodeId(`node-${selectedReceiptId}`);
    }
  }, [selectedReceiptId]);

  // Filter receipts based on active moment filter
  const currentReceipts = useMemo(() => {
    if (activeMomentFilter === 'all') return receipts;
    const moment = moments.find(m => m.id === activeMomentFilter);
    if (!moment) return receipts;
    return receipts.filter(r => moment.receiptIds.includes(r.id));
  }, [receipts, moments, activeMomentFilter]);

  // Filter connections by threshold and active receipts
  const activeConnections = useMemo(() => {
    if (!isConnectedMode) return [];
    const validIds = new Set(currentReceipts.map(r => r.id));
    return connections.filter(
      c => c.score >= threshold && validIds.has(c.source) && validIds.has(c.target)
    );
  }, [connections, currentReceipts, threshold, isConnectedMode]);

  // Find neighbor nodes and connected edges for currently clicked node
  const { neighborNodeIds, activeEdgeIds, activeNodeDetails, connectedReasons } = useMemo(() => {
    if (!activeNodeId) {
      return { neighborNodeIds: new Set<string>(), activeEdgeIds: new Set<string>(), activeNodeDetails: null, connectedReasons: [] };
    }
    const currentIdNum = parseInt(activeNodeId.replace('node-', ''), 10);
    const receipt = receipts.find(r => r.id === currentIdNum);

    const neighbors = new Set<string>();
    const edgeIds = new Set<string>();
    const reasonsList: Array<{ targetReceipt: Receipt; score: number; reasons: string[] }> = [];

    activeConnections.forEach(c => {
      if (c.source === currentIdNum) {
        neighbors.add(`node-${c.target}`);
        edgeIds.add(c.id);
        reasonsList.push({ targetReceipt: c.targetReceipt, score: c.score, reasons: c.reasons });
      } else if (c.target === currentIdNum) {
        neighbors.add(`node-${c.source}`);
        edgeIds.add(c.id);
        reasonsList.push({ targetReceipt: c.sourceReceipt, score: c.score, reasons: c.reasons });
      }
    });

    return {
      neighborNodeIds: neighbors,
      activeEdgeIds: edgeIds,
      activeNodeDetails: receipt || null,
      connectedReasons: reasonsList,
    };
  }, [activeNodeId, activeConnections, receipts]);

  // Generate nodes layout
  const rawNodes: Node[] = useMemo(() => {
    // If moment is selected, layout in a nice concentric star or organic circle
    const count = currentReceipts.length;
    const cols = Math.ceil(Math.sqrt(count * 1.5));
    const spacingX = 280;
    const spacingY = 170;

    return currentReceipts.map((r, index) => {
      const nodeId = `node-${r.id}`;
      const isSelected = activeNodeId === nodeId;
      const isHighlighted = neighborNodeIds.has(nodeId);
      const isDimmed = activeNodeId !== null && !isSelected && !isHighlighted;

      let x = (index % cols) * spacingX;
      let y = Math.floor(index / cols) * spacingY;

      // In unconnected mode, add slight organic scatter
      if (!isConnectedMode) {
        x += (index % 3 - 1) * 35;
        y += (index % 2 === 0 ? 25 : -25);
      }

      return {
        id: nodeId,
        type: 'receiptNode',
        position: { x, y },
        data: {
          receipt: r,
          isConnectedMode,
          isHighlighted,
          isDimmed,
        },
        selected: isSelected,
      };
    });
  }, [currentReceipts, isConnectedMode, activeNodeId, neighborNodeIds]);

  // Generate edges
  const rawEdges: Edge[] = useMemo(() => {
    if (!isConnectedMode) return [];

    return activeConnections.map(c => {
      const isHighlighted = activeEdgeIds.has(c.id);
      const isDimmed = activeNodeId !== null && !isHighlighted;

      return {
        id: c.id,
        source: `node-${c.source}`,
        target: `node-${c.target}`,
        animated: isHighlighted || c.score >= 70,
        style: {
          stroke: isHighlighted ? '#161D26' : c.score >= 75 ? '#2B6CB0' : '#CBD5E1',
          strokeWidth: isHighlighted ? 3 : c.score >= 75 ? 2.5 : 1.5,
          opacity: isDimmed ? 0.15 : 0.85,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isHighlighted ? '#161D26' : '#94A3B8',
          width: 14,
          height: 14,
        },
        label: isHighlighted ? `${c.score} pts` : undefined,
        labelStyle: { fill: '#161D26', fontWeight: 700, fontSize: 10 },
        labelBgStyle: { fill: '#FAF9F5', rx: 4, ry: 4 },
      };
    });
  }, [activeConnections, isConnectedMode, activeEdgeIds, activeNodeId]);

  const [nodes, setNodes, onNodesChange] = useNodesState(rawNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(rawEdges);

  useEffect(() => {
    setNodes(rawNodes);
  }, [rawNodes, setNodes]);

  useEffect(() => {
    setEdges(rawEdges);
  }, [rawEdges, setEdges]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      playClick();
      const newId = activeNodeId === node.id ? null : node.id;
      setActiveNodeId(newId);
      if (newId) {
        const idNum = parseInt(newId.replace('node-', ''), 10);
        onSelectReceipt?.(idNum);
      } else {
        onSelectReceipt?.(null);
      }
    },
    [activeNodeId, onSelectReceipt]
  );

  const handleConnectToggle = () => {
    playClick();
    if (!isConnectedMode) {
      playConnectHarmonics();
    }
    setIsConnectedMode(!isConnectedMode);
  };

  return (
    <section id="graph-section" className="py-16 md:py-20 bg-[#FAF9F5] border-b border-[#E7E2DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header and Controls Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0EDFB] text-xs font-semibold text-[#2B6CB0] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Connect The Dots Engine</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#161D26] tracking-tight font-['Plus_Jakarta_Sans']">
              Interactive Relationship Graph
            </h2>
            <p className="text-sm sm:text-base text-[#6B7280] mt-1 max-w-2xl">
              Switch between isolated raw receipts and synthesized connections. Click any node to inspect calculated affinity scores and reasons.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Primary Connect The Dots Toggle */}
            <button
              type="button"
              id="graph-btn-toggle-connection"
              onClick={handleConnectToggle}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                isConnectedMode
                  ? 'bg-[#161D26] text-[#FAF9F5] hover:bg-[#283342]'
                  : 'bg-white text-[#161D26] border-2 border-[#161D26] hover:bg-[#F2ECE1]'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${isConnectedMode ? 'text-[#FDE68A]' : 'text-[#B45309]'}`} />
              <span>{isConnectedMode ? 'Connected Mode Active' : '✨ Connect the Dots'}</span>
            </button>

            {/* Threshold Slider and Presets */}
            {isConnectedMode && (
              <div className="flex flex-wrap items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#DDD6CA] shadow-2xs">
                <Sliders className="w-3.5 h-3.5 text-[#7C7469]" />
                <span className="text-[11px] font-medium text-[#4B5563]">Min Score:</span>
                <input
                  type="range"
                  min="40"
                  max="80"
                  step="5"
                  value={threshold}
                  onChange={e => setThreshold(Number(e.target.value))}
                  className="w-20 accent-[#161D26] cursor-pointer"
                  title={`Connection threshold: ${threshold} pts`}
                />
                <span className="text-xs font-mono font-bold text-[#161D26] w-6">{threshold}</span>

                <div className="flex items-center gap-1 border-l border-[#E5E0D6] pl-2 ml-1">
                  <button
                    type="button"
                    onClick={() => { playClick(); setThreshold(40); }}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${threshold === 40 ? 'bg-[#161D26] text-white' : 'bg-[#FAF9F5] text-[#6B7280] hover:text-[#161D26]'}`}
                  >
                    Loose 40
                  </button>
                  <button
                    type="button"
                    onClick={() => { playClick(); setThreshold(50); }}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${threshold === 50 ? 'bg-[#161D26] text-white' : 'bg-[#FAF9F5] text-[#6B7280] hover:text-[#161D26]'}`}
                  >
                    Balanced 50
                  </button>
                  <button
                    type="button"
                    onClick={() => { playClick(); setThreshold(70); }}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${threshold === 70 ? 'bg-[#161D26] text-white' : 'bg-[#FAF9F5] text-[#6B7280] hover:text-[#161D26]'}`}
                  >
                    Strict 70
                  </button>
                </div>
              </div>
            )}

            {/* Engine Formula Modal Trigger */}
            <button
              type="button"
              id="btn-inspect-affinity-formula"
              onClick={() => {
                playClick();
                setShowMathFormula(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#DDD6CA] text-xs font-medium text-[#4B5563] hover:text-[#161D26] hover:bg-[#F2ECE1] shadow-2xs transition-colors"
            >
              <Info className="w-3.5 h-3.5 text-[#2B6CB0]" />
              <span>Affinity Math</span>
            </button>
          </div>
        </div>

        {/* Moment Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-[#8C8275] flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3" /> Focus Moment:
          </span>
          <button
            type="button"
            id="filter-moment-all"
            onClick={() => {
              playClick();
              setActiveMomentFilter('all');
              setActiveNodeId(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
              activeMomentFilter === 'all'
                ? 'bg-[#161D26] text-white'
                : 'bg-white text-[#544F49] border border-[#DDD6CA] hover:bg-[#F2ECE1]'
            }`}
          >
            All Receipts ({receipts.length})
          </button>
          {moments.map(m => (
            <button
              key={m.id}
              type="button"
              id={`filter-moment-${m.id}`}
              onClick={() => {
                playClick();
                setActiveMomentFilter(m.id);
                setActiveNodeId(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
                activeMomentFilter === m.id
                  ? 'bg-[#161D26] text-white'
                  : 'bg-white text-[#544F49] border border-[#DDD6CA] hover:bg-[#F2ECE1]'
              }`}
            >
              <span>{m.title}</span>
              <span className="text-[10px] font-mono px-1 py-0.2 rounded-full bg-[#E8DFD0]/60 text-[#544F49]">
                {m.receiptIds.length}
              </span>
            </button>
          ))}
        </div>

        {/* React Flow Container + Side Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl border border-[#DDD6CA] shadow-sm overflow-hidden min-h-[600px] h-[650px] relative">
          {/* Main Graph Area */}
          <div className={`${activeNodeDetails ? 'lg:col-span-8' : 'lg:col-span-12'} h-full relative transition-all duration-300`}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              minZoom={0.2}
              maxZoom={1.8}
              attributionPosition="bottom-left"
            >
              <Background color="#D5CEC2" gap={20} size={1} />
              <Controls className="!bg-white !border !border-[#DDD6CA] !rounded-xl !shadow-sm" />
              <MiniMap
                nodeColor="#B45309"
                maskColor="rgba(245, 242, 235, 0.7)"
                className="!bg-[#FAF9F5] !border !border-[#DDD6CA] !rounded-xl overflow-hidden"
              />
            </ReactFlow>

            {/* Floating Quick Legend */}
            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl border border-[#E7E2DA] shadow-xs text-[11px] text-[#6B7280] space-y-1 hidden sm:block">
              <p className="font-semibold text-[#161D26]">Legend</p>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-[#2B6CB0]" /> Strong link (≥75)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-[#94A3B8]" /> Moderate link (≥50)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#161D26]" /> Click node to isolate
                </span>
              </div>
            </div>
          </div>

          {/* Side Connection Inspector */}
          {activeNodeDetails && (
            <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[#EAE5DC] bg-[#FCFBF8] p-6 overflow-y-auto space-y-5 animate-in fade-in slide-in-from-right duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DC]">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EFECE6] text-[#4B5563]">
                    Inspector
                  </span>
                  <span className="text-xs font-mono text-[#8C8275]">
                    #{String(activeNodeDetails.id).padStart(4, '0')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveNodeId(null)}
                  className="text-xs text-[#8C8275] hover:text-[#161D26] font-medium"
                >
                  Close
                </button>
              </div>

              {/* Selected Node Header */}
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-[#161D26] font-['Playfair_Display']">
                  {activeNodeDetails.title}
                </h3>
                <p className="text-xs text-[#525B6A] leading-relaxed">
                  {activeNodeDetails.description}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-[#6B7280] font-mono pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {activeNodeDetails.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {activeNodeDetails.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#E07A5F]" /> {activeNodeDetails.location}
                  </span>
                </div>
              </div>

              {/* Parent Moment Link */}
              {(() => {
                const parentMoment = moments.find(m => m.receiptIds.includes(activeNodeDetails.id));
                if (!parentMoment) return null;
                return (
                  <div className="p-3.5 rounded-2xl bg-[#F0F7FF] border border-[#BFDBFE] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D4ED8]">
                        Part of Life Moment
                      </span>
                      <span className="text-[10px] font-mono text-[#6B7280]">
                        {parentMoment.receipts.length} activities
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#161D26] line-clamp-1">{parentMoment.title}</p>
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        onExploreMoment?.(parentMoment);
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-[#161D26] text-[#FAF9F5] text-xs font-semibold hover:bg-[#283342] shadow-2xs transition-all"
                    >
                      <span>▶ Start Story for This Moment</span>
                    </button>
                  </div>
                );
              })()}

              {/* Why Connected? Explanation Section */}
              <div className="space-y-3 pt-3 border-t border-[#EAE5DC]">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#161D26] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#B45309]" />
                    Connected Relationships ({connectedReasons.length})
                  </h4>
                </div>

                {connectedReasons.length > 0 ? (
                  <div className="space-y-2.5">
                    {connectedReasons.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-white border border-[#E5E0D6] shadow-2xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#161D26] truncate max-w-[170px]">
                            {item.targetReceipt.title}
                          </span>
                          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#E0EDFB] text-[#2B6CB0]">
                            Score: {item.score}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#544F49] font-medium">
                          Why the engine connected these:
                        </p>
                        <ul className="text-[11px] text-[#6B7280] space-y-1 pl-3 list-disc">
                          {item.reasons.map((r, rIdx) => (
                            <li key={rIdx}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-800 space-y-1">
                    <p className="font-semibold">No active connections above {threshold} pts.</p>
                    <p className="text-[11px] text-amber-700">
                      Try lowering the minimum score slider to reveal weaker latent relationships.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Affinity Math Formula Modal */}
      {showMathFormula && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-[#DDD6CA] shadow-2xl max-w-lg w-full p-6 space-y-5 relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DC]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E0EDFB] text-[#2B6CB0] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#161D26] font-['Plus_Jakarta_Sans']">
                    Affinity Scoring Formula
                  </h3>
                  <p className="text-[11px] text-[#6B7280]">
                    Deterministic 5-factor mathematical model
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMathFormula(false)}
                className="text-xs text-[#8C8275] hover:text-[#161D26] font-semibold px-2 py-1 rounded-lg hover:bg-[#F2ECE1]"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#4B5563]">
              <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#ECE6DC] space-y-1">
                <div className="flex items-center justify-between font-bold text-[#161D26]">
                  <span>1. Date Proximity</span>
                  <span className="font-mono text-[#2B6CB0]">+30 pts</span>
                </div>
                <p className="text-[11px] text-[#6B7280]">
                  Occurring on the exact same date (+30) or within 24 hours overnight rollover (+15).
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#ECE6DC] space-y-1">
                <div className="flex items-center justify-between font-bold text-[#161D26]">
                  <span>2. Spatial Co-location</span>
                  <span className="font-mono text-[#2B6CB0]">+30 pts</span>
                </div>
                <p className="text-[11px] text-[#6B7280]">
                  Shared geographical coordinate city or locality matching within 5km radius.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#ECE6DC] space-y-1">
                <div className="flex items-center justify-between font-bold text-[#161D26]">
                  <span>3. Temporal Continuity</span>
                  <span className="font-mono text-[#2B6CB0]">+10 to +20 pts</span>
                </div>
                <p className="text-[11px] text-[#6B7280]">
                  Occurring within 35 minutes (+20 pts), within 2 hours (+15 pts), or same daypart (+10 pts).
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#ECE6DC] space-y-1">
                <div className="flex items-center justify-between font-bold text-[#161D26]">
                  <span>4. Semantic Context Keywords</span>
                  <span className="font-mono text-[#2B6CB0]">+10 to +20 pts</span>
                </div>
                <p className="text-[11px] text-[#6B7280]">
                  Shared context tags, playlist moods, search queries, or place descriptions.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#ECE6DC] space-y-1">
                <div className="flex items-center justify-between font-bold text-[#161D26]">
                  <span>5. Complementary Categories</span>
                  <span className="font-mono text-[#2B6CB0]">+10 pts</span>
                </div>
                <p className="text-[11px] text-[#6B7280]">
                  Natural narrative pairs (Music + Driving, Coffee + Dialogue, Ticket + Photo).
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#E6F4EA] border border-[#CEEAD6] text-xs text-[#2D7A4C] flex items-center justify-between">
              <span className="font-semibold">Threshold: Default 50 pts qualifies as a connected relationship</span>
              <span className="font-mono font-bold">Max: 110 pts</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
