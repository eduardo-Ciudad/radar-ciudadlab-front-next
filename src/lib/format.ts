const numberFormatter = new Intl.NumberFormat("pt-BR");
const decimalFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const twoDecimalFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatNumber(value: number) {
  return numberFormatter.format(value);
}

export function formatDecimal(value: number) {
  return twoDecimalFormatter.format(value);
}

export function formatPercent(value: number) {
  return `${decimalFormatter.format(value)}%`;
}

export function formatChange(value: number | null, points = false) {
  if (value === null) return { text: "sem base de comparação", direction: "neutral" as const };
  const suffix = points ? " p.p." : "%";
  if (value > 0) return { text: `↑ ${decimalFormatter.format(Math.abs(value))}${suffix}`, direction: "up" as const };
  if (value < 0) return { text: `↓ ${decimalFormatter.format(Math.abs(value))}${suffix}`, direction: "down" as const };
  return { text: `0,0${suffix}`, direction: "neutral" as const };
}

export function changePercent(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export function formatDuration(totalSeconds: number) {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return minutes > 0 ? `${minutes}m ${remainder.toString().padStart(2, "0")}s` : `${remainder}s`;
}

export function formatDate(value: string) {
  const [, month, day] = value.slice(0, 10).split("-");
  return `${day}/${month}`;
}

export function formatFullDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}

const saoPauloDateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const saoPauloDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Sao_Paulo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function formatDateTime(value: string, now = new Date()) {
  const date = new Date(value);
  const parts = saoPauloDateTimeFormatter.formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";
  const time = `${part("hour")}:${part("minute")}`;
  const dateKey = saoPauloDateFormatter.format(date);
  const todayKey = saoPauloDateFormatter.format(now);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = saoPauloDateFormatter.format(yesterday);

  if (dateKey === todayKey) return `hoje, ${time}`;
  if (dateKey === yesterdayKey) return `ontem, ${time}`;
  return `${part("day")}/${part("month")}, ${time}`;
}

export function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0].replace(/^www\./, "");
  }
}

export const channelNames: Record<string, string> = {
  "Organic Search": "Busca orgânica",
  Direct: "Direto",
  "Organic Social": "Social orgânico",
  Referral: "Referência",
  Unassigned: "Não atribuído",
};

export const deviceNames: Record<string, string> = {
  mobile: "Celular",
  desktop: "Desktop",
  tablet: "Tablet",
};
