import type { Metadata } from "next";
import { SiteCard } from "@/components/site-card";
import { SyncButton } from "@/components/sync-button";
import { apiFetch } from "@/lib/api";
import { getUserRole } from "@/lib/auth";
import { formatChange, formatDateTime, formatNumber } from "@/lib/format";
import { getPeriod } from "@/lib/period";
import { getSites } from "@/lib/sites";
import type { DashboardResponse } from "@/types/dashboard";

export const metadata: Metadata = { title: "Sites" };

export default async function SitesPage() {
  const period = getPeriod(28);
  const [role, sites] = await Promise.all([getUserRole(), getSites()]);
  const eligibleSites = sites.filter((site) => site.gaConfigured && site.dataSince);
  const results = await Promise.allSettled(eligibleSites.map((site) => apiFetch<DashboardResponse>(`/api/sites/${site.id}/dashboard?from=${period.from}&to=${period.to}`)));
  const resultsById = new Map(eligibleSites.map((site, index) => [site.id, results[index]]));
  const dashboards = results.flatMap((result) => result.status === "fulfilled" ? [result.value] : []);
  const sessions = dashboards.reduce((sum, item) => sum + item.current.sessions, 0);
  const previousSessions = dashboards.reduce((sum, item) => sum + item.previous.sessions, 0);
  const conversions = dashboards.reduce((sum, item) => sum + item.current.keyEvents, 0);
  const formattedChange = formatChange(previousSessions === 0 ? null : (sessions - previousSessions) / previousSessions * 100);
  const synchronized = sites.filter((site) => site.gaStatus === "OK" && site.dataSince).length;
  const unavailable = sites.filter((site) => site.gaStatus === "NO_ACCESS").length;
  const pending = sites.filter((site) => site.gaStatus === "PENDING").length;
  const latestSync = sites.reduce<string | null>((latest, site) => !site.lastSyncAt || (latest && latest >= site.lastSyncAt) ? latest : site.lastSyncAt, null);

  return (
    <div className="mx-auto flex w-full max-w-[1280px] min-w-0 flex-col gap-6 px-4 py-5 sm:px-7 sm:py-8 lg:px-12 lg:py-10">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><p className="label">Visão geral · últimos 28 dias</p><h1 className="mt-2 font-heading text-[38px] leading-[1.05] font-semibold tracking-tight sm:text-[46px]">Sites monitorados</h1><p className="mt-2 text-sm text-muted sm:text-[15px]">{sites.length} {sites.length === 1 ? "site" : "sites"} · dados do Google Analytics</p></div>
        {role === "ADMIN" && <SyncButton label="Sincronizar todos" />}
      </header>
      <section aria-label="Resumo" className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <article className="rounded-2xl border border-card-border bg-card px-5 py-5"><span className="label">Sessões somadas</span><strong className="mt-1.5 block text-3xl font-semibold tracking-tight tabular-nums">{formatNumber(sessions)}</strong><span className={`mt-1.5 block text-[13px] font-semibold ${formattedChange.direction === "up" ? "text-up" : formattedChange.direction === "down" ? "text-down" : "text-muted"}`}>{formattedChange.text}</span></article>
        <article className="rounded-2xl border border-card-border bg-card px-5 py-5"><span className="label">Conversões somadas</span><strong className="mt-1.5 block text-3xl font-semibold tracking-tight tabular-nums">{formatNumber(conversions)}</strong><span className="mt-1.5 block text-[13px] text-muted">nos últimos 28 dias</span></article>
        <article className="rounded-2xl border border-card-border bg-card px-5 py-5"><span className="label">Sites sincronizados</span><strong className="mt-1.5 block text-3xl font-semibold tracking-tight tabular-nums">{synchronized} <small className="text-lg font-medium text-muted">de {sites.length}</small></strong><span className="mt-1.5 block text-[13px] text-muted">{unavailable} sem acesso · {pending} aguardando</span></article>
        <article className="rounded-2xl border border-card-border bg-card px-5 py-5"><span className="label">Último sync</span><strong className="mt-1.5 block text-[22px] font-semibold tracking-tight">{latestSync ? formatDateTime(latestSync) : "—"}</strong><span className="mt-1.5 block text-[13px] text-muted">entre todos os sites</span></article>
      </section>
      <section aria-label="Sites" className="grid min-w-0 gap-4 xl:grid-cols-2 xl:gap-5">{sites.map((site) => { const result = resultsById.get(site.id); return <SiteCard key={site.id} site={site} dashboard={result?.status === "fulfilled" ? result.value : undefined} dashboardError={result?.status === "rejected"} admin={role === "ADMIN"} />; })}</section>
    </div>
  );
}
