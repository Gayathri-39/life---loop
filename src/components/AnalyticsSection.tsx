import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Connection, Receipt } from '../types';
import { CATEGORIES } from '../data/categories';
import { BarChart3, Clock, Sparkles } from 'lucide-react';

interface AnalyticsSectionProps {
  receipts: Receipt[];
  connections: Connection[];
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  receipts,
  connections,
}) => {
  // 1. Activity by Category
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    receipts.forEach(r => {
      counts[r.type] = (counts[r.type] || 0) + 1;
    });

    return Object.entries(counts).map(([catKey, value]) => ({
      name: CATEGORIES[catKey as keyof typeof CATEGORIES]?.name || catKey,
      value,
      color: CATEGORIES[catKey as keyof typeof CATEGORIES]?.color || '#4B5563',
    })).sort((a, b) => b.value - a.value);
  }, [receipts]);

  // 2. Activity by Time of Day
  const timeOfDayData = useMemo(() => {
    let morning = 0; // 05:00 - 11:59
    let afternoon = 0; // 12:00 - 16:59
    let evening = 0; // 17:00 - 21:59
    let night = 0; // 22:00 - 04:59

    receipts.forEach(r => {
      const hour = parseInt(r.time.split(':')[0], 10);
      if (hour >= 5 && hour < 12) morning++;
      else if (hour >= 12 && hour < 17) afternoon++;
      else if (hour >= 17 && hour < 22) evening++;
      else night++;
    });

    return [
      { daypart: 'Morning (5A-12P)', count: morning, fill: '#10B981' },
      { daypart: 'Afternoon (12P-5P)', count: afternoon, fill: '#F59E0B' },
      { daypart: 'Evening (5P-10P)', count: evening, fill: '#3B82F6' },
      { daypart: 'Night (10P-5A)', count: night, fill: '#8B5CF6' },
    ];
  }, [receipts]);

  // 3. Connection Score Distribution
  const connectionDistribution = useMemo(() => {
    let strong = 0; // >= 75
    let moderate = 0; // 60 - 74
    let standard = 0; // 50 - 59

    connections.forEach(c => {
      if (c.score >= 75) strong++;
      else if (c.score >= 60) moderate++;
      else standard++;
    });

    return [
      { name: 'High Affinity (75-100)', count: strong, color: '#2B6CB0' },
      { name: 'Moderate (60-74)', count: moderate, color: '#D4AF37' },
      { name: 'Standard (50-59)', count: standard, color: '#94A3B8' },
    ];
  }, [connections]);

  return (
    <section id="insights-section" className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#E7E2DA]">
      <div className="space-y-4 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0E6] text-xs font-semibold text-[#A05A2C]">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Telemetry Insights</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#161D26] tracking-tight font-['Plus_Jakarta_Sans']">
              Data Story Behind The Receipts
            </h2>
            <p className="text-sm sm:text-base text-[#6B7280] mt-1 max-w-2xl">
              Selected visualizations highlighting how your habits synchronize across daytime hours and connection density.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Chart 1: Category Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5E0D6] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#161D26] uppercase tracking-wider">
              Category Distribution
            </h3>
            <span className="text-xs font-mono text-[#8C8275]">
              {receipts.length} records
            </span>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} receipts`, name]}
                  contentStyle={{
                    backgroundColor: '#FAF9F5',
                    borderRadius: '12px',
                    borderColor: '#DDD6CA',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-1.5 text-[10px] justify-center">
            {categoryData.slice(0, 5).map(cat => (
              <span
                key={cat.name}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FAF9F5] border border-[#EFECE6] text-[#4B5563]"
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
                {cat.name}: {cat.value}
              </span>
            ))}
          </div>
        </div>

        {/* Chart 2: Time of Day Cadence */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5E0D6] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#161D26] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#3B82F6]" />
              Time-of-Day Rhythm
            </h3>
            <span className="text-xs font-mono text-[#8C8275]">24h clock</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeOfDayData} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
                <XAxis
                  dataKey="daypart"
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} allowDecimals={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} moments`, 'Frequency']}
                  contentStyle={{
                    backgroundColor: '#FAF9F5',
                    borderRadius: '12px',
                    borderColor: '#DDD6CA',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {timeOfDayData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-center text-[#7C7469] italic">
            Evenings & nights account for over 65% of recorded creative output.
          </p>
        </div>

        {/* Chart 3: Connection Affinity Strength */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5E0D6] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#161D26] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              Connection Strength
            </h3>
            <span className="text-xs font-mono text-[#8C8275]">
              {connections.length} pairs
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {connectionDistribution.map(item => {
              const pct = connections.length > 0
                ? Math.round((item.count / connections.length) * 100)
                : 0;

              return (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#161D26]">{item.name}</span>
                    <span className="font-mono text-[#6B7280]">{item.count} pairs ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#EFECE6] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#EAE5DC] text-[11px] text-[#6B7280]">
            The high concentration of score &gt;75 demonstrates intentional real-world clusters rather than random scatter.
          </div>
        </div>
      </div>
    </section>
  );
};
