import { LifeMoment, Receipt, StoryData, StoryScene } from '../types';

export function buildStoryFromMoment(moment?: LifeMoment): StoryData {
  if (!moment || !moment.receipts || moment.receipts.length === 0) {
    return {
      momentId: 'moment-empty',
      momentTitle: 'Spontaneous Day',
      location: 'Everyday',
      date: 'Recent',
      scenes: [],
      climaxStatement: 'Moments unfold into memory.',
      revelation: 'Every day is a story.',
    };
  }

  const receipts = [...moment.receipts];

  // Map category to a evocative narrative storytelling lead
  const hookMap: Record<string, string> = {
    search: 'It began with a spark of curiosity.',
    purchase: 'A small purchase set the stage.',
    place: 'Then came a place.',
    event: 'An event brought people together.',
    photo: 'A photo captured the moment forever.',
    music: 'Music gave the night its rhythm.',
    message: 'A saved message held the feeling.',
    note: 'An insight was jotted down in the quiet.',
    movie: 'The cinematic world enveloped the afternoon.',
  };

  // Sort receipts intelligently for storytelling arc:
  // (Search/Curiosity -> Place/Setup -> Purchase -> Event/Climax -> Photo -> Music -> Message/Note)
  const categoryOrder: Record<string, number> = {
    search: 1,
    purchase: 2,
    place: 3,
    movie: 4,
    event: 5,
    photo: 6,
    music: 7,
    message: 8,
    note: 9,
  };

  const sorted = [...receipts].sort((a, b) => {
    const oA = categoryOrder[a.type] ?? 10;
    const oB = categoryOrder[b.type] ?? 10;
    if (oA !== oB) return oA - oB;
    return a.time.localeCompare(b.time);
  });

  const scenes: StoryScene[] = sorted.slice(0, 6).map((receipt, index) => {
    let hook = hookMap[receipt.type] || `Moment ${index + 1} occurred.`;
    if (index === 0 && receipt.type === 'music') hook = 'It started with music.';
    else if (index === sorted.length - 1 && receipt.type === 'event') hook = 'And finally, an unforgettable event.';

    return {
      step: index + 1,
      hook,
      receipt,
      contextNote: receipt.description,
    };
  });

  return {
    momentId: moment.id,
    momentTitle: moment.title,
    location: moment.location,
    date: moment.date,
    scenes,
    climaxStatement: `These weren't ${scenes.length} separate moments.`,
    revelation: 'They were one story.',
  };
}
