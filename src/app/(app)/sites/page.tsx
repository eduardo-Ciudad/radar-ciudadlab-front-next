import type { Metadata } from "next";
import { SiteSummaryCard } from "@/components/site-summary-card";
import { SyncButton } from "@/components/sync-button";
import { sites } from "@/data/sites";
import { getUserRole } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { formatChange, formatNumber } from "@/lib/format";
import { getPeriod } from "@/lib/period";
import type { DashboardResponse } from "@/types/dashboard";

export const metadata: Metadata = { title: "Sites" };

export default async function SitesPage() {
  const period = getPeriod(28);
  const [role, results] = await Promise.all([
    getUserRole(),
    Promise.allSettled(sites.map((site) => apiFetch<DashboardResponse>(`/api/sites/${site.id}/dashboard?from=${period.from}&to=${period.to}`))),
  ]);
  const dashboards = results.flatMap((result) => result.status === "fulfilled" ? [result.value] : []);
  const sessions = dashboards.reduce((sum, item) => sum + item.current.sessions, 0);
  const previousSessions = dashboards.reduce((sum, item) => sum + item.previous.sessions, 0);
  const conversions = dashboards.reduce((sum, item) => sum + item.current.keyEvents, 0);
  const sessionChange = previousSessions === 0 ? null : (sessions - previousSessions) / previousSessions * 100;
  const formattedChange = formatChange(sessionChange);

  return (
    <div className="mx-auto flex w-full max-w-[1280px] min-w-0 flex-col gap-6 px-4 py-5 sm:px-7 sm:py-8 lg:px-12 lg:py-10">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><p className="label">Visão geral · últimos 28 dias</p><h1 className="mt-2 font-heading text-[38px] leading-[1.05] font-semibold tracking-tight sm:text-[46px]">Sites monitorados</h1><p className="mt-2 text-sm text-muted sm:text-[15px]">{sites.length} {sites.length === 1 ? "site" : "sites"} · dados do Google Analytics</p></div>
        {role === "ADMIN" && <SyncButton label="Sincronizar todos" />}
      </header>

      <section aria-label="Resumo" className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        <article className="rounded-2xl border border-card-border bg-card px-5 py-5"><span className="label">Sessões somadas</span><strong className="mt-1.5 block text-3xl font-semibold tracking-tight tabular-nums">{formatNumber(sessions)}</strong><span className={`mt-1.5 block text-[13px] font-semibold ${formattedChange.direction === "up" ? "text-up" : formattedChange.direction === "down" ? "text-down" : "text-muted"}`}>{formattedChange.text}</span></article>
        <article className="rounded-2xl border border-card-border bg-card px-5 py-5"><span className="label">Conversões somadas</span><strong className="mt-1.5 block text-3xl font-semibold tracking-tight tabular-nums">{formatNumber(conversions)}</strong><span className="mt-1.5 block text-[13px] text-muted">nos últimos 28 dias</span></article>
        <article className="rounded-2xl border border-card-border bg-card px-5 py-5"><span className="label">Sites com dados</span><strong className="mt-1.5 block text-3xl font-semibold tracking-tight tabular-nums">{dashboards.length} <small className="text-lg font-medium text-muted">de {sites.length}</small></strong><span className="mt-1.5 block text-[13px] text-muted">{sites.length - dashboards.length ? `${sites.length - dashboards.length} com erro` : "todos disponíveis"}</span></article>
      </section>

      <section aria-label="Sites" className="grid min-w-0 gap-4 xl:grid-cols-2 xl:gap-5">{sites.map((site, index) => <SiteSummaryCard key={site.id} site={site} result={results[index]} />)}</section>
    </div>
  );
}
