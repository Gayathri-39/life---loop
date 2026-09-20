import { Connection, LifeMoment, Receipt } from '../types';

/**
 * Calculates time difference in minutes between two HH:mm strings on same or close dates
 */
export function getTimeDiffMinutes(date1: string, time1: string, date2: string, time2: string): number {
  const dt1 = new Date(`${date1}T${time1}:00`);
  const dt2 = new Date(`${date2}T${time2}:00`);
  const diffMs = Math.abs(dt2.getTime() - dt1.getTime());
  return Math.round(diffMs / (1000 * 60));
}

/**
 * Complementary category pairs that naturally signify coherent human experiences
 */
const COMPLEMENTARY_PAIRS: Record<string, string[]> = {
  music: ['place', 'event', 'note', 'photo', 'purchase'],
  movie: ['purchase', 'place', 'photo', 'search'],
  place: ['photo', 'purchase', 'event', 'music', 'note'],
  purchase: ['place', 'event', 'coffee', 'photo'],
  photo: ['place', 'event', 'music', 'movie'],
  message: ['event', 'photo', 'place'],
  search: ['purchase', 'event', 'place', 'movie', 'note'],
  event: ['photo', 'message', 'place', 'purchase', 'music'],
  note: ['music', 'search', 'place', 'photo'],
};

/**
 * Connection scoring engine based on:
 * - Same Date: +30
 * - Same Location: +30
 * - Temporal Proximity: +10 to +20
 * - Keyword Overlap: +10 to +20
 * - Complementary Categories: +10
 */
export function scoreConnection(r1: Receipt, r2: Receipt): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // 1. Date proximity
  const sameDate = r1.date === r2.date;
  if (sameDate) {
    score += 30;
    reasons.push(`Occurred on the same date (${r1.date})`);
  } else {
    // Check if within 1 day (e.g. midnight rollover)
    const d1 = new Date(r1.date).getTime();
    const d2 = new Date(r2.date).getTime();
    const dayDiff = Math.abs(d1 - d2) / (1000 * 60 * 60 * 24);
    if (dayDiff <= 1) {
      score += 15;
      reasons.push('Happened within 24 hours (continuous night)');
    }
  }

  // 2. Spatial proximity (Location)
  const loc1 = r1.location.trim().toLowerCase();
  const loc2 = r2.location.trim().toLowerCase();
  if (loc1 && loc2 && (loc1 === loc2 || loc1.includes(loc2) || loc2.includes(loc1))) {
    score += 30;
    reasons.push(`Shared geographical location: ${r1.location}`);
  }

  // 3. Time proximity
  const timeDiff = getTimeDiffMinutes(r1.date, r1.time, r2.date, r2.time);
  if (timeDiff <= 35) {
    score += 20;
    reasons.push(`Happened just ${timeDiff} minutes apart`);
  } else if (timeDiff <= 120) {
    score += 15;
    reasons.push(`Occurred within ~${Math.round(timeDiff / 60 * 10) / 10} hours of each other`);
  } else if (timeDiff <= 360) {
    score += 10;
    reasons.push(`Took place during the same daypart`);
  }

  // 4. Keyword overlap
  const words1 = new Set(r1.keywords.map(k => k.toLowerCase()));
  const commonKeywords = r2.keywords.filter(k => words1.has(k.toLowerCase()));
  if (commonKeywords.length >= 2) {
    score += 20;
    reasons.push(`Shared context keywords: "${commonKeywords.slice(0, 3).join(', ')}"`);
  } else if (commonKeywords.length === 1) {
    score += 10;
    reasons.push(`Matching keyword: "${commonKeywords[0]}"`);
  }

  // 5. Complementary categories
  const comp = COMPLEMENTARY_PAIRS[r1.type] || [];
  if (comp.includes(r2.type)) {
    score += 10;
    reasons.push(`Complementary moment dynamic (${r1.type} + ${r2.type})`);
  }

  return { score, reasons };
}

/**
 * Analyzes all receipt pairs and builds the connection network
 */
export function buildConnections(
  receipts: Receipt[],
  threshold = 50
): Connection[] {
  const connections: Connection[] = [];

  for (let i = 0; i < receipts.length; i++) {
    for (let j = i + 1; j < receipts.length; j++) {
      const r1 = receipts[i];
      const r2 = receipts[j];
      const { score, reasons } = scoreConnection(r1, r2);

      if (score >= threshold) {
        connections.push({
          id: `conn-${r1.id}-${r2.id}`,
          source: r1.id,
          target: r2.id,
          score,
          reasons,
          sourceReceipt: r1,
          targetReceipt: r2,
        });
      }
    }
  }

  return connections.sort((a, b) => b.score - a.score);
}

/**
 * Discovers Life Moments by clustering strongly connected receipts
 */
export function discoverLifeMoments(receipts: Receipt[], connections: Connection[]): LifeMoment[] {
  // Build adjacency graph
  const adj = new Map<number, Set<number>>();
  receipts.forEach(r => adj.set(r.id, new Set()));

  connections.forEach(c => {
    adj.get(c.source)?.add(c.target);
    adj.get(c.target)?.add(c.source);
  });

  // Find connected components
  const visited = new Set<number>();
  const clusters: number[][] = [];

  for (const r of receipts) {
    if (!visited.has(r.id)) {
      const currentCluster: number[] = [];
      const queue: number[] = [r.id];
      visited.add(r.id);

      while (queue.length > 0) {
        const curr = queue.shift()!;
        currentCluster.push(curr);

        const neighbors = adj.get(curr) || new Set();
        neighbors.forEach(neighbor => {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        });
      }

      // Only clusters with at least 3 receipts form a rich "Life Moment"
      if (currentCluster.length >= 3) {
        clusters.push(currentCluster);
      }
    }
  }

  const receiptMap = new Map(receipts.map(r => [r.id, r]));

  // Synthesize each cluster into an evocative human Life Moment
  const moments: LifeMoment[] = clusters.map((clusterIds, index) => {
    const clusterReceipts = clusterIds
      .map(id => receiptMap.get(id)!)
      .filter(Boolean)
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

    // Analyze predominant location, date range, and categories
    const locationCounts: Record<string, number> = {};
    clusterReceipts.forEach(r => {
      locationCounts[r.location] = (locationCounts[r.location] || 0) + 1;
    });
    const primaryLocation = Object.entries(locationCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';

    const categories = Array.from(new Set(clusterReceipts.map(r => r.type)));
    const dateRange = clusterReceipts[0].date === clusterReceipts[clusterReceipts.length - 1].date
      ? clusterReceipts[0].date
      : `${clusterReceipts[0].date} — ${clusterReceipts[clusterReceipts.length - 1].date}`;

    // Calculate internal cluster connection density score
    const clusterConns = connections.filter(
      c => clusterIds.includes(c.source) && clusterIds.includes(c.target)
    );
    const avgScore = clusterConns.length > 0
      ? Math.round(clusterConns.reduce((acc, c) => acc + c.score, 0) / clusterConns.length)
      : 70;

    // Narrative generation based on composition
    const titlesAndThemes = generateMomentMeta(clusterReceipts, primaryLocation, categories);

    return {
      id: `moment-${index + 1}`,
      title: titlesAndThemes.title,
      tagline: titlesAndThemes.tagline,
      date: dateRange,
      location: primaryLocation,
      description: titlesAndThemes.description,
      narrativeStory: titlesAndThemes.narrativeStory,
      receiptIds: clusterReceipts.map(r => r.id),
      categories,
      receipts: clusterReceipts,
      primaryTheme: titlesAndThemes.theme,
      connectionScore: avgScore,
    };
  });

  return moments.sort((a, b) => b.receipts.length - a.receipts.length);
}

function generateMomentMeta(
  receipts: Receipt[],
  location: string,
  categories: string[]
): {
  title: string;
  tagline: string;
  description: string;
  narrativeStory: string;
  theme: string;
} {
  const titles = receipts.map(r => r.title.toLowerCase());
  const allKeywords = receipts.flatMap(r => r.keywords);

  if (allKeywords.includes('fest') || allKeywords.includes('concert') || allKeywords.includes('bands')) {
    return {
      title: `An Electric Evening in ${location}`,
      tagline: 'Sound, Stage Lights & Open Air Memories',
      description: `A sequence of ${receipts.length} activities tracing an afternoon coffee run that evolved into an amphitheater battle of the bands.`,
      narrativeStory: `It began with a search for campus band lineups, led through filter coffee on RS Puram, and culminated under golden stage lights as acoustic chords reverberated down Avinashi Road.`,
      theme: 'Cultural & Live Music',
    };
  }

  if (allKeywords.includes('hackathon') || allKeywords.includes('algorithm') || receipts.some(r => r.time.startsWith('02:') || r.time.startsWith('03:'))) {
    return {
      title: `The 2 AM Breakthrough Sprint`,
      tagline: 'Late-Night Flow, Espresso & Graph Algorithms',
      description: `Spanning midnight in ${location}, where deep algorithmic curiosity met lo-fi synthwave and caffeine.`,
      narrativeStory: `Between research queries and empty espresso cups at Koramangala, architectural notes on digital receipts transformed into a passing production build as dawn arrived.`,
      theme: 'Deep Work & Discovery',
    };
  }

  if (location === 'Ooty' || allKeywords.includes('mist') || allKeywords.includes('mountains')) {
    return {
      title: `The Foggy Ascent to ${location}`,
      tagline: 'Hairpin Curves, Mountain Tea & High Peak Quiet',
      description: `A misty monsoon journey through eucalyptus groves and cloud summits above 2,600 meters.`,
      narrativeStory: `Checking mountain road visibility at dawn unfolded into steaming Nilgiri tea, pine silhouettes in dense mist, and Bon Iver echoing through damp mountain air.`,
      theme: 'Travel & Nature',
    };
  }

  if (categories.includes('movie') || allKeywords.includes('cinema') || allKeywords.includes('vinyl')) {
    return {
      title: `Indie Cinema & Vinyl Haven`,
      tagline: 'Colonial Courtyards, Scarlet Film & Turntable Jazz',
      description: `An afternoon in ${location} moving from retrospective 35mm cinema to courtyard coffee and vintage records.`,
      narrativeStory: `An early search for restored cinema led straight to an evening under courtyard trees with iced hibiscus tea, Miles Davis vinyl in hand, and rain drumming softly outside.`,
      theme: 'Art & Leisure',
    };
  }

  if (allKeywords.includes('running') || allKeywords.includes('sunrise') || allKeywords.includes('ocean')) {
    return {
      title: `Sunrise Shoreline & 10K Stride`,
      tagline: 'Lighthouse Dawn, High Cadence & Sea Spray',
      description: `An early morning pacing routine along ${location}'s coastline turning into a personal milestone.`,
      narrativeStory: `Pre-dawn pacing goals transformed into a rhythmic 10K sprint beside violet ocean waves, celebrated with roadside fresh coconut and warm podi idlis.`,
      theme: 'Vitality & Health',
    };
  }

  if (allKeywords.includes('meetup') || allKeywords.includes('networking') || allKeywords.includes('tech')) {
    return {
      title: `Community Sparks & Rooftop Jams`,
      tagline: 'Interactive Systems, Craft Slices & Shared Ideas',
      description: `A tech meetup in ${location} seamlessly transitioning to rooftop conversations and collaborative spark.`,
      narrativeStory: `Keynote talks on generative data interfaces sparked evening discussions over wood-fired sourdough, live acoustic covers, and a new collaborative partnership.`,
      theme: 'Community & Dialogue',
    };
  }

  return {
    title: `Synchronized Chapter in ${location}`,
    tagline: `${receipts.length} Interconnected Life Moments`,
    description: `A dense temporal sequence occurring on ${receipts[0].date} across ${categories.join(', ')}.`,
    narrativeStory: `Distinct digital receipts recorded across the day weave together into a unified experience anchored in ${location}.`,
    theme: 'Daily Rhythm',
  };
}
