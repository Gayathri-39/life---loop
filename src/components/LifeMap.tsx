import React, { useState, useMemo } from 'react';
import { LifeMoment, Receipt } from '../types';
import { CATEGORIES } from '../data/categories';
import {
  MapPin,
  Camera,
  ShoppingBag,
  Ticket,
  Search,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { playClick } from '../utils/soundEffects';

interface LifeMapProps {
  receipts: Receipt[];
  moments: LifeMoment[];
  onSelectReceipt?: (receipt: Receipt) => void;
  onExploreMoment?: (moment: LifeMoment) => void;
}

export const LifeMap: React.FC<LifeMapProps> = ({
  receipts,
  moments,
  onSelectReceipt,
  onExploreMoment,
}) => {
  // Aggregate data by unique locations
  const locationStats = useMemo(() => {
    const map = new Map<
      string,
      {
        location: string;
        coordinates?: { lat: number; lng: number };
        receipts: Receipt[];
        categories: Set<string>;
        photos: number;
        purchases: number;
        events: number;
        searches: number;
        totalSpend: number;
        moments: LifeMoment[];
      }
    >();

    receipts.forEach(r => {
      const loc = r.location || 'Unknown';
      if (!map.has(loc)) {
        map.set(loc, {
          location: loc,
          coordinates: r.coordinates,
          receipts: [],
          categories: new Set(),
          photos: 0,
          purchases: 0,
          events: 0,
          searches: 0,
          totalSpend: 0,
          moments: [],
        });
      }
      const entry = map.get(loc)!;
      entry.receipts.push(r);
      entry.categories.add(r.type);
      if (r.type === 'photo') entry.photos++;
      if (r.type === 'purchase') {
        entry.purchases++;
        if (r.metadata?.amount) entry.totalSpend += r.metadata.amount;
      }
      if (r.type === 'event') entry.events++;
      if (r.type === 'search') entry.searches++;
    });

    // Attach moments
    moments.forEach(m => {
      const entry = map.get(m.location);
      if (entry) {
        entry.moments.push(m);
      }
    });

    return Array.from(map.values()).sort((a, b) => b.receipts.length - a.receipts.length);
  }, [receipts, moments]);

  const [selectedLocationName, setSelectedLocationName] = useState<string>(
    locationStats[0]?.location || 'Coimbatore'
  );

  const selectedLocData = useMemo(() => {
    return locationStats.find(l => l.location === selectedLocationName) || locationStats[0];
  }, [locationStats, selectedLocationName]);

  // Spatial coordinates for abstract geographical canvas
  const mapCoordinates: Record<string, { x: number; y: number; label: string }> = {
    Bengaluru: { x: 340, y: 110, label: 'Silicon Corridor' },
    Nilgiris: { x: 190, y: 220, label: 'Cloud Forest' },
    Ooty: { x: 220, y: 250, label: '2,600m Peak' },
    Coimbatore: { x: 250, y: 310, label: 'Cultural Heart' },
    Chennai: { x: 440, y: 190, label: 'Bay of Bengal' },
    Transit: { x: 310, y: 210, label: 'Vande Bharat Transit' },
  };

  return (
    <section id="map-section" className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#E7E2DA]">
      <div className="space-y-4 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] text-xs font-semibold text-[#10B981]">
          <MapPin className="w-3.5 h-3.5" />
          <span>Spatial Cartography</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#161D26] tracking-tight font-['Plus_Jakarta_Sans']">
              Life Footprint & Map
            </h2>
            <p className="text-sm sm:text-base text-[#6B7280] mt-1 max-w-2xl">
              An abstract geographical topology linking your physical movements to the digital receipts and memories generated at each locale.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-white border border-[#DDD6CA] text-[#6B7280]">
            {locationStats.length} Anchor Coordinates
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-3xl border border-[#E5E0D6] shadow-xs overflow-hidden">
        {/* Left Column: Interactive Abstract Map Canvas */}
        <div className="lg:col-span-7 p-6 sm:p-8 bg-[#FAF8F5] relative flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#EAE5DC]">
          <div className="flex items-center justify-between text-xs text-[#8C8275] mb-4">
            <span className="font-mono uppercase tracking-wider">Topological Network Map</span>
            <span>Click any node to inspect footprint</span>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full h-[380px] bg-white rounded-2xl border border-[#E7E2DA] overflow-hidden flex items-center justify-center shadow-inner">
            {/* Topographic background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#EFECE6_1px,transparent_1px),linear-gradient(to_bottom,#EFECE6_1px,transparent_1px)] bg-[size:28px_28px] opacity-60" />

            <svg className="w-full h-full absolute inset-0 z-0">
              {/* Inter-city transit lines */}
              <line x1="340" y1="110" x2="440" y2="190" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="340" y1="110" x2="310" y2="210" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="310" y1="210" x2="250" y2="310" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="250" y1="310" x2="220" y2="250" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="220" y1="250" x2="190" y2="220" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />
            </svg>

            {/* Location interactive pins */}
            {locationStats.map(loc => {
              const coords = mapCoordinates[loc.location] || { x: 280, y: 200, label: 'Coordinates' };
              const isSelected = selectedLocationName === loc.location;

              return (
                <div
                  key={loc.location}
                  id={`map-node-${loc.location}`}
                  onClick={() => {
                    playClick();
                    setSelectedLocationName(loc.location);
                  }}
                  className={`absolute z-10 cursor-pointer -translate-x-1/2 -translate-y-1/2 group transition-all duration-300`}
                  style={{ left: `${coords.x}px`, top: `${coords.y}px` }}
                >
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all shadow-xs ${
                      isSelected
                        ? 'bg-[#161D26] text-white border-[#161D26] scale-110 shadow-md ring-4 ring-[#161D26]/10'
                        : 'bg-white text-[#161D26] border-[#DDD6CA] hover:border-[#161D26]/60 hover:scale-105'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSelected ? 'bg-[#10B981] animate-pulse' : 'bg-[#E07A5F]'
                      }`}
                    />
                    <span className="text-xs font-bold whitespace-nowrap">{loc.location}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#EFECE6] text-[#6B7280]'
                      }`}
                    >
                      {loc.receipts.length}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8C8275] block text-center mt-1 group-hover:text-[#161D26] transition-colors">
                    {coords.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick city selector pills */}
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-[#EAE5DC]">
            {locationStats.map(loc => (
              <button
                key={loc.location}
                type="button"
                onClick={() => {
                  playClick();
                  setSelectedLocationName(loc.location);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  selectedLocationName === loc.location
                    ? 'bg-[#161D26] text-white'
                    : 'bg-white text-[#544F49] border border-[#DDD6CA] hover:bg-[#F2ECE1]'
                }`}
              >
                {loc.location} ({loc.receipts.length})
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Selected Location Detailed Inspector */}
        {selectedLocData && (
          <div className="lg:col-span-5 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE1]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#E0EDFB] text-[#2B6CB0] flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#161D26] font-['Playfair_Display']">
                      {selectedLocData.location}
                    </h3>
                    <p className="text-xs text-[#8C8275] font-mono">
                      {selectedLocData.receipts.length} receipts captured
                    </p>
                  </div>
                </div>
              </div>

              {/* Aggregated Stats Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#EAE5DC] space-y-1">
                  <span className="text-[11px] text-[#8C8275] flex items-center gap-1 font-medium">
                    <Camera className="w-3.5 h-3.5 text-[#EC4899]" /> Photos Captured
                  </span>
                  <p className="text-lg font-bold text-[#161D26] font-mono">
                    {selectedLocData.photos}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#EAE5DC] space-y-1">
                  <span className="text-[11px] text-[#8C8275] flex items-center gap-1 font-medium">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#F59E0B]" /> Total Purchases
                  </span>
                  <p className="text-lg font-bold text-[#161D26] font-mono">
                    {selectedLocData.purchases > 0 ? `₹${selectedLocData.totalSpend}` : 'None'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#EAE5DC] space-y-1">
                  <span className="text-[11px] text-[#8C8275] flex items-center gap-1 font-medium">
                    <Ticket className="w-3.5 h-3.5 text-[#EA580C]" /> Events Attended
                  </span>
                  <p className="text-lg font-bold text-[#161D26] font-mono">
                    {selectedLocData.events}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#EAE5DC] space-y-1">
                  <span className="text-[11px] text-[#8C8275] flex items-center gap-1 font-medium">
                    <Search className="w-3.5 h-3.5 text-[#6366F1]" /> Pre-Searches
                  </span>
                  <p className="text-lg font-bold text-[#161D26] font-mono">
                    {selectedLocData.searches}
                  </p>
                </div>
              </div>

              {/* Anchored Life Moments */}
              {selectedLocData.moments.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold text-[#8C8275] uppercase tracking-wider block">
                    Anchored Life Moments ({selectedLocData.moments.length})
                  </span>
                  <div className="space-y-2">
                    {selectedLocData.moments.map(m => (
                      <div
                        key={m.id}
                        className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-[#161D26]">{m.title}</p>
                          <p className="text-[11px] text-[#6B7280]">{m.date}</p>
                        </div>
                        {onExploreMoment && (
                          <button
                            type="button"
                            onClick={() => {
                              playClick();
                              onExploreMoment(m);
                            }}
                            className="text-[#2B6CB0] font-semibold hover:underline flex items-center gap-1 text-[11px]"
                          >
                            <span>Story</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories Active in this City */}
              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-semibold text-[#8C8275] uppercase tracking-wider block">
                  Active Categories
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from(selectedLocData.categories).map(catKey => {
                    const cat = CATEGORIES[catKey as keyof typeof CATEGORIES];
                    if (!cat) return null;
                    return (
                      <span
                        key={catKey}
                        className="text-xs px-2.5 py-1 rounded-lg"
                        style={{ backgroundColor: cat.bgLight, color: cat.color }}
                      >
                        {cat.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
