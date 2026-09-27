import type { Metadata } from "next";
import Link from "next/link";
import { LeadCard } from "@/components/lead-card";
import { ApiError, apiFetch } from "@/lib/api";
import { formatNumber } from "@/lib/format";
import { leadBackendQuery, leadHref, type LeadSearchParams } from "@/lib/lead-filters";
import type { LeadPage, LeadStatus } from "@/types/leads";
import { statusLabels } from "@/types/leads";

export const metadata: Metadata = { title: "Leads · Lista" };
const statuses = Object.keys(statusLabels) as LeadStatus[];
const sorts = ["score", "rating", "name", "recent"] as const;
const sortLabels = { score: "Score", rating: "Nota", name: "Nome", recent: "Mais recentes" };
const one = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export default async function LeadListPage({ searchParams }: { searchParams: Promise<LeadSearchParams> }) {
  const params = await searchParams; const statusValue = one(params.status); const status = statuses.includes(statusValue as LeadStatus) ? statusValue as LeadStatus : undefined;
  const sortValue = one(params.sort); const sort = sorts.includes(sortValue as typeof sorts[number]) ? sortValue as typeof sorts[number] : "score"; const parsedPage = Number.parseInt(one(params.page) ?? "0", 10); const page = Number.isFinite(parsedPage) && parsedPage >= 0 ? parsedPage : 0;
  let error: string | undefined; let result: LeadPage = { items: [], page, size: 20, totalElements: 0, totalPages: 0 };
  if (statusValue && !status) error = "Status de lead inválido.";
  else { const query = leadBackendQuery(params); if (status) query.set("status", status); query.set("sort", sort); query.set("page", String(page)); query.set("size", "20"); try { result = await apiFetch<LeadPage>(`/api/leads?${query}`); } catch (caught) { if (caught instanceof ApiError && caught.status === 400) error = caught.detail || "Parâmetro inválido"; else throw caught; } }
  const backHref = leadHref("/leads/funil", params); const title = status ? statusLabels[status] : "Todos os leads";
  return <div className="flex min-w-0 flex-col gap-5"><header><Link href={backHref} className="focus-ring inline-flex min-h-11 items-center rounded-lg text-sm font-semibold text-accent">← Voltar ao funil</Link><div className="mt-1 flex flex-wrap items-end justify-between gap-3"><div><p className="label">Lista</p><h2 className="mt-1 font-heading text-3xl font-semibold">{title} <span className="font-body text-sm font-medium text-muted tabular-nums">{formatNumber(result.totalElements)}</span></h2></div><form><label className="sr-only" htmlFor="sort">Ordenação</label><select id="sort" name="sort" defaultValue={sort} className="focus-ring min-h-11 rounded-full border border-black/10 bg-white px-4 text-sm font-semibold" onChange={undefined}>{sorts.map((value) => <option key={value} value={value}>{sortLabels[value]}</option>)}</select>{Object.entries(params).filter(([key]) => key !== "sort" && key !== "page").map(([key, value]) => <input key={key} type="hidden" name={key} value={one(value) ?? ""} />)}<button className="focus-ring ml-2 min-h-11 rounded-full border border-black/10 bg-white px-4 text-sm font-semibold" type="submit">Ordenar</button></form></div></header>
    <nav aria-label="Status dos leads" className="flex min-w-0 gap-1 overflow-x-auto border-b border-divider">{statuses.map((item) => <Link key={item} href={leadHref("/leads/lista", params, { status: item, sort, page: null })} aria-current={status === item ? "page" : undefined} className={`focus-ring flex min-h-11 shrink-0 items-center border-b-2 px-3 text-sm font-semibold ${status === item ? "border-accent text-primary" : "border-transparent text-muted"}`}>{statusLabels[item]}</Link>)}</nav>
    {error ? <div role="alert" className="rounded-xl border border-down/20 bg-down/[0.06] px-4 py-3 text-sm font-medium text-down">{error}</div> : result.items.length === 0 ? <p className="rounded-2xl border border-dashed border-black/12 py-14 text-center text-sm text-muted">Nenhum lead encontrado.</p> : <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{result.items.map((lead) => <LeadCard key={lead.id} lead={lead} />)}</div>}
    {!error && result.totalPages > 0 && <nav aria-label="Paginação" className="flex items-center justify-center gap-3"><Link aria-disabled={result.page <= 0} tabIndex={result.page <= 0 ? -1 : undefined} href={result.page > 0 ? leadHref("/leads/lista", params, { status, sort, page: result.page - 1 }) : "#"} className={`focus-ring flex min-h-11 items-center rounded-full border border-black/10 bg-white px-4 text-sm font-semibold ${result.page <= 0 ? "pointer-events-none opacity-40" : ""}`}>Anterior</Link><span className="text-sm text-muted tabular-nums">Página {result.page + 1} de {result.totalPages}</span><Link aria-disabled={result.page + 1 >= result.totalPages} tabIndex={result.page + 1 >= result.totalPages ? -1 : undefined} href={result.page + 1 < result.totalPages ? leadHref("/leads/lista", params, { status, sort, page: result.page + 1 }) : "#"} className={`focus-ring flex min-h-11 items-center rounded-full border border-black/10 bg-white px-4 text-sm font-semibold ${result.page + 1 >= result.totalPages ? "pointer-events-none opacity-40" : ""}`}>Próxima</Link></nav>}
  </div>;
}
