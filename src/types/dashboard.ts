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
  gaStatus: GaStatus;
  dataSince: string | null;
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

export type GaStatus = "PENDING" | "OK" | "NO_ACCESS" | "ERROR";

export type SiteOverview = {
  id: number;
  name: string;
  url: string;
  type: "OWN" | "CLIENT";
  clientName: string | null;
  gaConfigured: boolean;
  gaStatus: GaStatus;
  lastSyncAt: string | null;
  lastSyncError: string | null;
  dataSince: string | null;
};

export type Insight = {
  id: number;
  type: "WEEKLY_SUMMARY" | "MONTHLY_SUMMARY" | "ALERT";
  severity: "INFO" | "WARNING" | "CRITICAL" | null;
  periodStart: string | null;
  periodEnd: string | null;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
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
