import { LifeChapter, LifeMoment, Receipt } from '../types';

export function generateLifeChapters(moments: LifeMoment[], receipts: Receipt[]): LifeChapter[] {
  if (receipts.length === 0) return [];

  // Check if this is the default sample dataset by checking known IDs
  const isDefaultDataset = receipts.some(r => r.id === 1) && receipts.some(r => r.id === 8);

  if (isDefaultDataset && moments.length >= 4) {
    return [
      {
        id: 'chapter-1',
        title: 'Seeds of Craft & Morning Rituals',
        badge: '🌱 Discovery & Rhythm',
        dateRange: 'Early July 2026',
        description:
          'A period defined by dialing in specialty coffee recipes, acoustic morning playlists, and curating ideas before major public sprints began.',
        keyPattern: 'Morning searches for artisanal brewing swiftly turned into beans orders, tasting logs, and quiet focus sessions.',
        connectedMoments: ['Coffee Tasting & Morning Rituals'],
        importantReceipts: [38, 39, 40, 41].filter(id => receipts.some(r => r.id === id)),
        themeColor: '#10B981',
      },
      {
        id: 'chapter-2',
        title: 'Campus Nights & The Electric Stage',
        badge: '🎓 Youth & Live Resonance',
        dateRange: 'Mid July 2026',
        description:
          'Auditorium decibels, afternoon filter coffee runs, and friends screaming encore requests under amber stage lights in Coimbatore.',
        keyPattern: 'High inter-category density: search queries converted into passes, photos, midnight drives, and saved voice notes within 6 hours.',
        connectedMoments: ['An Electric Evening in Coimbatore'],
        importantReceipts: [1, 2, 3, 4, 5, 6, 7].filter(id => receipts.some(r => r.id === id)),
        themeColor: '#F59E0B',
      },
      {
        id: 'chapter-3',
        title: 'Midnight Mind & The 2 AM Sprint',
        badge: '🌙 Flow State & Systems',
        dateRange: 'Late July 2026',
        description:
          'The feverish hackathon energy in Bengaluru where empty espresso cups, lo-fi synthwave, and algorithm breakthroughs filled the hours between 10 PM and 4 AM.',
        keyPattern: '90% of activity concentrated in deep night; whiteboard architectural breakthroughs directly followed by triumphant production broadcasts.',
        connectedMoments: ['The 2 AM Breakthrough Sprint'],
        importantReceipts: [8, 9, 10, 11, 12, 13].filter(id => receipts.some(r => r.id === id)),
        themeColor: '#6366F1',
      },
      {
        id: 'chapter-4',
        title: 'The Misty Altitude & Mountain Road',
        badge: '✈️ Solitude & Horizons',
        dateRange: 'Early August 2026',
        description:
          'Trading screen glow for wet pine needles, steaming roadside cardamom tea, and standing at 2,600 meters watching clouds swallow the valley.',
        keyPattern: 'Sharp category shift towards nature photography, acoustic Bon Iver tracks, and reflective notebook entries on silence.',
        connectedMoments: ['The Foggy Ascent to Ooty'],
        importantReceipts: [14, 15, 16, 17, 18, 19].filter(id => receipts.some(r => r.id === id)),
        themeColor: '#06B6D4',
      },
      {
        id: 'chapter-5',
        title: 'Sensory Sundays & 35mm Grain',
        badge: '🎬 Vintage Art & Courtyards',
        dateRange: 'Mid August 2026',
        description:
          'Restored Wong Kar-wai screenings, vintage jazz vinyl discoveries, colonial courtyard foliage, and pre-dawn seaside running milestones in Chennai.',
        keyPattern: 'Harmonious leisure pacing: artistic cinema paired with cafe record collectors and physical endurance achievements along the Bay of Bengal.',
        connectedMoments: ['Indie Cinema & Vinyl Haven', 'Sunrise Shoreline & 10K Stride'],
        importantReceipts: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].filter(id => receipts.some(r => r.id === id)),
        themeColor: '#EC4899',
      },
    ];
  }

  // Dynamic Synthesis for Custom or Uploaded Datasets:
  // Sort receipts by date & time
  const sorted = [...receipts].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  const chunkSize = Math.max(3, Math.ceil(sorted.length / 3));
  const chapters: LifeChapter[] = [];

  const themePalettes = [
    { color: '#10B981', badge: '🌱 Genesis & Awakening' },
    { color: '#3B82F6', badge: '⚡ Momentum & Execution' },
    { color: '#8B5CF6', badge: '🌌 Reflection & Mastery' },
    { color: '#F59E0B', badge: '🔥 Synthesis & Climax' },
  ];

  for (let i = 0; i < sorted.length; i += chunkSize) {
    const chunk = sorted.slice(i, i + chunkSize);
    const chapterIndex = chapters.length;
    const palette = themePalettes[chapterIndex % themePalettes.length];

    const startDate = chunk[0].date;
    const endDate = chunk[chunk.length - 1].date;
    const dateRange = startDate === endDate ? startDate : `${startDate} — ${endDate}`;

    // Locations involved
    const locs = Array.from(new Set(chunk.map(r => r.location).filter(Boolean)));
    const locString = locs.slice(0, 2).join(' & ') || 'Everyday Moments';

    // Find moments overlapping with these receipts
    const chunkIds = new Set(chunk.map(r => r.id));
    const matchingMoments = moments.filter(m => m.receiptIds.some(id => chunkIds.has(id)));
    const momentTitles = matchingMoments.map(m => m.title);

    chapters.push({
      id: `dynamic-chapter-${chapterIndex + 1}`,
      title: `Chapter ${chapterIndex + 1}: Footsteps Across ${locString}`,
      badge: palette.badge,
      dateRange,
      description: `Spanning ${chunk.length} digital records across ${locs.join(', ') || 'various locales'}, documenting a vibrant cluster of daily life activities.`,
      keyPattern: `Correlated ${chunk.length} activities encompassing ${Array.from(new Set(chunk.map(r => r.type))).join(', ')}.`,
      connectedMoments: momentTitles.length > 0 ? momentTitles.slice(0, 2) : ['Spontaneous Daily Rhythm'],
      importantReceipts: chunk.map(r => r.id),
      themeColor: palette.color,
    });
  }

  return chapters;
}

