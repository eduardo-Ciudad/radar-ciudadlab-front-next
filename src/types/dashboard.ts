export type Summary = {
  sessions: number;
  engagedSessions: number;
  newUsers: number;
  pageViews: number;
  keyEvents: number;
  engagementRate: number;
  conversionRate: number;
  pagesPerSession: number;
  averageEngagementSeconds: number;
};

export type Breakdown = {
  value: string;
  sessions: number;
  engagedSessions: number;
  pageViews: number;
  eventCount: number;
  keyEvents: number;
  engagementRate: number;
  sharePercent: number | null;
};

export type DailyMetric = {
  date: string;
  sessions: number;
  engagedSessions: number;
  newUsers: number;
  pageViews: number;
  keyEvents: number;
};

export type DashboardResponse = {
  site: { id: number; name: string };
  period: { from: string; to: string; days: number };
  current: Summary;
  previous: Summary;
  comparison: {
    sessionsChangePercent: number | null;
    newUsersChangePercent: number | null;
    pageViewsChangePercent: number | null;
    keyEventsChangePercent: number | null;
    engagementRateChangePoints: number | null;
  };
  daily: DailyMetric[];
  channels: Breakdown[];
  landingPages: Breakdown[];
  devices: Breakdown[];
  events: Breakdown[];
};

export type SyncResult = {
  siteId: number;
  siteName: string;
  success: boolean;
  status: string;
  requestsMade: number;
  quota: {
    tokensConsumed: number;
    tokensRemainingToday: number;
  };
  error: string | null;
};
