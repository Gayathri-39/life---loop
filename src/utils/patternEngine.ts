import { HiddenPattern, Receipt } from '../types';

export function computeHiddenPatterns(receipts: Receipt[]): HiddenPattern[] {
  const patterns: HiddenPattern[] = [];

  // 1. Late Night Activity Pattern
  const lateNightReceipts = receipts.filter(r => {
    const hour = parseInt(r.time.split(':')[0], 10);
    return hour >= 22 || hour < 5;
  });
  const lateNightPct = Math.round((lateNightReceipts.length / receipts.length) * 100);

  patterns.push({
    id: 'pattern-late-night',
    icon: 'Moon',
    title: 'Late Night Activity',
    headline: `${lateNightPct}% of your life activities happened after 10 PM.`,
    metric: `${lateNightReceipts.length} moments (${lateNightPct}%)`,
    description:
      'Your dataset exhibits high creative and focus peaks between 10 PM and 4 AM, primarily dominated by deep research queries, lo-fi tracks, and architecture notes.',
    supportedReceiptsCount: lateNightReceipts.length,
    categoryTags: ['music', 'note', 'search'],
    evidenceText: `Detected across ${lateNightReceipts.length} distinct records in Bengaluru & Coimbatore, including late-night sprints and reflective journal entries.`,
  });

  // 2. Frequent Anchor Locations Pattern
  const locationMap = new Map<string, { total: number; categories: Set<string> }>();
  receipts.forEach(r => {
    if (!locationMap.has(r.location)) {
      locationMap.set(r.location, { total: 0, categories: new Set() });
    }
    const item = locationMap.get(r.location)!;
    item.total += 1;
    item.categories.add(r.type);
  });

  const anchorLocations = Array.from(locationMap.entries())
    .map(([loc, data]) => ({ location: loc, count: data.total, catCount: data.categories.size }))
    .sort((a, b) => b.catCount - a.catCount || b.count - a.count);

  const topAnchor = anchorLocations[0];
  if (topAnchor) {
    patterns.push({
      id: 'pattern-anchor-location',
      icon: 'MapPin',
      title: 'Multifaceted Anchor Location',
      headline: `${topAnchor.location} bridges ${topAnchor.catCount} different life categories.`,
      metric: `${topAnchor.count} receipts across ${topAnchor.catCount} categories`,
      description: `Rather than a single-use spot, ${topAnchor.location} serves as your epicenter for music, purchases, photography, campus events, and introspective notes.`,
      supportedReceiptsCount: topAnchor.count,
      categoryTags: ['place', 'photo', 'purchase', 'event'],
      evidenceText: `${topAnchor.location} accounts for ${topAnchor.count} digital life receipts, anchoring cultural evenings and morning rituals.`,
    });
  }

  // 3. Curiosity Leads to Action (Search -> Purchase/Event within 24h)
  const searchReceipts = receipts.filter(r => r.type === 'search');
  const actionReceipts = receipts.filter(r => ['purchase', 'event', 'place', 'movie'].includes(r.type));
  let curiosityMatches = 0;

  searchReceipts.forEach(s => {
    const sDate = s.date;
    const hasFollowUp = actionReceipts.some(a => {
      if (a.date !== sDate) return false;
      const sKeywords = new Set(s.keywords);
      return a.keywords.some(k => sKeywords.has(k));
    });
    if (hasFollowUp) curiosityMatches++;
  });

  const curiosityRate = Math.round((curiosityMatches / Math.max(1, searchReceipts.length)) * 100);
  patterns.push({
    id: 'pattern-curiosity',
    icon: 'Search',
    title: 'Curiosity Precedes Experience',
    headline: `${curiosityRate}% of searches directly materialized into real-world moments.`,
    metric: `${curiosityMatches} actionable queries`,
    description:
      'Your searches are not idle browsing. Almost every query about festivals, film screenings, or road conditions directly led to an event attendance, cinema ticket, or journey.',
    supportedReceiptsCount: curiosityMatches,
    categoryTags: ['search', 'event', 'purchase'],
    evidenceText: `Queries regarding band lineups, 35mm film screenings, and specialty coffee beans were executed into tangible receipts on the same afternoon.`,
  });

  // 4. Memory Collector (Photos + Events/Travel)
  const photoReceipts = receipts.filter(r => r.type === 'photo');
  const eventOrTravelPhotos = photoReceipts.filter(p =>
    p.keywords.some(k => ['concert', 'crowd', 'mountains', 'nature', 'tech', 'sunset', 'sea'].includes(k))
  );

  patterns.push({
    id: 'pattern-memory-collector',
    icon: 'Camera',
    title: 'The Atmospheric Eye',
    headline: 'Photos consistently trigger around transitions and sensory climaxes.',
    metric: `${eventOrTravelPhotos.length} / ${photoReceipts.length} intentional photos`,
    description:
      'You rarely take random photos. Visual captures occur almost exclusively when stage lights flare, mist envelopes mountains, or morning waves break along the shore.',
    supportedReceiptsCount: eventOrTravelPhotos.length,
    categoryTags: ['photo', 'event', 'place'],
    evidenceText: `Documented with specific optics (Pixel 8 Pro 50mm, Fujifilm X100V classic chrome, Leica filters) capturing lighting and atmosphere.`,
  });

  // 5. Soundtrack of Movement
  const musicReceipts = receipts.filter(r => r.type === 'music');
  const travelOrMotionMusic = musicReceipts.filter(m =>
    m.keywords.some(k => ['drive', 'travel', 'train', 'running', 'chill', 'acoustic'].includes(k))
  );
  patterns.push({
    id: 'pattern-soundtrack',
    icon: 'Headphones',
    title: 'Soundtrack of Motion',
    headline: 'Music is your primary companion for transit, running, and night drives.',
    metric: `${travelOrMotionMusic.length} motion-anchored tracks`,
    description:
      'Music streaming synchronizes closely with location shifts: indie tracks on Avinashi Road, high-tempo brass for beach runs, and ambient soundscapes on intercity transit.',
    supportedReceiptsCount: travelOrMotionMusic.length,
    categoryTags: ['music', 'place'],
    evidenceText: `From The Local Train during evening drives to Hans Zimmer watching paddy fields blur from train windows.`,
  });

  return patterns;
}
