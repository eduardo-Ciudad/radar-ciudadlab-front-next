import type { DailyMetric } from "@/types/dashboard";

export type PeriodDays = 7 | 28 | 90;

export type DatePeriod = {
  days: PeriodDays;
  from: string;
  to: string;
  previousFrom: string;
  previousTo: string;
};

function dateInSaoPaulo(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return new Date(Date.UTC(Number(value.year), Number(value.month) - 1, Number(value.day)));
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + amount);
  return next;
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function parsePeriod(value?: string | string[]): PeriodDays {
  const candidate = Array.isArray(value) ? value[0] : value;
  return candidate === "7" || candidate === "90" ? Number(candidate) as PeriodDays : 28;
}

export function getPeriod(days: PeriodDays, now = new Date()): DatePeriod {
  const today = dateInSaoPaulo(now);
  const to = addDays(today, -1);
  const from = addDays(to, -(days - 1));
  const previousTo = addDays(from, -1);
  const previousFrom = addDays(previousTo, -(days - 1));

  return {
    days,
    from: toIsoDate(from),
    to: toIsoDate(to),
    previousFrom: toIsoDate(previousFrom),
    previousTo: toIsoDate(previousTo),
  };
}

export function fillDaily(daily: DailyMetric[], from: string, to: string): DailyMetric[] {
  const valuesByDate = new Map(daily.map((item) => [item.date, item]));
  const cursor = new Date(`${from}T00:00:00Z`);
  const end = new Date(`${to}T00:00:00Z`);
  const filled: DailyMetric[] = [];

  if (Number.isNaN(cursor.getTime()) || Number.isNaN(end.getTime()) || cursor > end) return filled;

  while (cursor <= end) {
    const date = toIsoDate(cursor);
    filled.push(valuesByDate.get(date) ?? {
      date,
      sessions: 0,
      engagedSessions: 0,
      newUsers: 0,
      pageViews: 0,
      keyEvents: 0,
    });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return filled;
}
