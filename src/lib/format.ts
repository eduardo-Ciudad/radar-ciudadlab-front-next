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
  const [, month, day] = value.split("-");
  return `${day}/${month}`;
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
