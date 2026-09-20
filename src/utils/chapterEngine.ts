import { LifeChapter, LifeMoment, Receipt } from '../types';

export function generateLifeChapters(moments: LifeMoment[], receipts: Receipt[]): LifeChapter[] {
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
      importantReceipts: [38, 39, 40, 41],
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
      importantReceipts: [1, 2, 3, 4, 5, 6, 7],
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
      importantReceipts: [8, 9, 10, 11, 12, 13],
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
      importantReceipts: [14, 15, 16, 17, 18, 19],
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
      importantReceipts: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
      themeColor: '#EC4899',
    },
  ];
}
