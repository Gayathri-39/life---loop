export type ReceiptCategory =
  | 'music'
  | 'movie'
  | 'place'
  | 'purchase'
  | 'photo'
  | 'message'
  | 'search'
  | 'event'
  | 'note';

export interface Receipt {
  id: number;
  type: ReceiptCategory;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  location: string;
  coordinates?: { lat: number; lng: number };
  description: string;
  keywords: string[];
  metadata?: {
    artist?: string;
    album?: string;
    amount?: number;
    currency?: string;
    sender?: string;
    query?: string;
    camera?: string;
    venue?: string;
    mood?: string;
    platform?: string;
    genre?: string;
    duration?: string;
  };
}

export interface CategoryInfo {
  id: ReceiptCategory;
  name: string;
  icon: string;
  color: string;
  bgLight: string;
  borderLight: string;
  badgeClass: string;
  description: string;
}

export interface Connection {
  id: string;
  source: number;
  target: number;
  score: number;
  reasons: string[];
  sourceReceipt: Receipt;
  targetReceipt: Receipt;
}

export interface LifeMoment {
  id: string;
  title: string;
  tagline: string;
  date: string;
  location: string;
  description: string;
  narrativeStory: string;
  receiptIds: number[];
  categories: ReceiptCategory[];
  receipts: Receipt[];
  primaryTheme: string;
  connectionScore: number;
}

export interface HiddenPattern {
  id: string;
  icon: string;
  title: string;
  headline: string;
  metric: string;
  description: string;
  supportedReceiptsCount: number;
  categoryTags: ReceiptCategory[];
  evidenceText: string;
}

export interface LifeChapter {
  id: string;
  title: string;
  badge: string;
  dateRange: string;
  description: string;
  keyPattern: string;
  connectedMoments: string[];
  importantReceipts: number[];
  themeColor: string;
}

export interface StoryScene {
  step: number;
  hook: string;
  receipt: Receipt;
  contextNote: string;
}

export interface StoryData {
  momentId: string;
  momentTitle: string;
  location: string;
  date: string;
  scenes: StoryScene[];
  climaxStatement: string;
  revelation: string;
}
