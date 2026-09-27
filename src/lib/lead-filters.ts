export type LeadSearchParams = Record<string, string | string[] | undefined>;
const translations: Record<string, string> = { categoria: "category", bairro: "neighborhood", busca: "q" };
const filterKeys = ["categoria", "bairro", "semSite", "whatsapp", "score70", "busca"] as const;
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export function leadBackendQuery(searchParams: LeadSearchParams) {
  const query = new URLSearchParams();
  for (const [front, back] of Object.entries(translations)) { const value = first(searchParams[front]); if (value) query.set(back, value); }
  if (first(searchParams.semSite) === "1") query.set("withoutWebsite", "true");
  if (first(searchParams.whatsapp) === "1") query.set("mobile", "true");
  if (first(searchParams.score70) === "1") query.set("minScore", "70");
  return query;
}
export function leadFilterQuery(searchParams: LeadSearchParams) { const query = new URLSearchParams(); for (const key of filterKeys) { const value = first(searchParams[key]); if (value) query.set(key, value); } return query; }
export function leadHref(pathname: string, searchParams: LeadSearchParams, changes: Record<string, string | number | null | undefined> = {}) { const query = leadFilterQuery(searchParams); for (const [key, value] of Object.entries(changes)) { if (value === null || value === undefined || value === "") query.delete(key); else query.set(key, String(value)); } const suffix = query.toString(); return suffix ? `${pathname}?${suffix}` : pathname; }
export function hasLeadFilters(searchParams: LeadSearchParams) { return filterKeys.some((key) => Boolean(first(searchParams[key]))); }
