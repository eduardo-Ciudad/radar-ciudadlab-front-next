import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardChart } from "@/components/dashboard-chart";
import { ChannelsCard, DevicesCard, EmptyDashboard, EventsCard, KpiGrid, LandingPagesCard } from "@/components/dashboard-sections";
import { PeriodSelector } from "@/components/period-selector";
import { RadarReading } from "@/components/radar-reading";
import { SyncButton } from "@/components/sync-button";
import { ApiError, apiFetch } from "@/lib/api";
import { getUserRole } from "@/lib/auth";
import { formatDate, formatFullDate, getDomain } from "@/lib/format";
import { fillDaily, getPeriod, parsePeriod } from "@/lib/period";
import { getSites } from "@/lib/sites";
import type { DashboardResponse, GaStatus, Insight } from "@/types/dashboard";

export const metadata: Metadata = { title: "Analytics" };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ periodo?: string | string[] }> };

function dashboardPath(id: string, from: string, to: string) {
  return `/api/sites/${encodeURIComponent(id)}/dashboard?from=${from}&to=${to}`;
}

const statusChip: Record<GaStatus, { label: string; className: string }> = {
  OK: { label: "GA conectado", className: "bg-up/[0.09] text-up" },
  PENDING: { label: "Aguardando coleta", className: "bg-black/[0.05] text-muted" },
  NO_ACCESS: { label: "Sem acesso", className: "bg-down/10 text-down" },
  ERROR: { label: "Erro no sync", className: "bg-[#B91C1C]/10 text-[#B91C1C]" },
};

export default async function SitePage({ params, searchParams }: Props) {
  // eslint-disable-next-line react-hooks/purity -- development-only server render timing
  const startedAt = performance.now();
  const [{ id }, query, role, sites] = await Promise.all([params, searchParams, getUserRole(), getSites()]);
  const days = parsePeriod(query.periodo);
  const period = getPeriod(days);
  let dashboard: DashboardResponse;
  let insights: Insight[];

  try {
    [dashboard, insights] = await Promise.all([
      apiFetch<DashboardResponse>(dashboardPath(id, period.from, period.to)),
      apiFetch<Insight[]>(`/api/sites/${encodeURIComponent(id)}/insights?limit=5`).catch(() => []),
    ]);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  let previousDashboard: DashboardResponse | undefined;
  if (dashboard.previous.sessions > 0) previousDashboard = await apiFetch<DashboardResponse>(dashboardPath(id, period.previousFrom, period.previousTo));

  const site = sites.find((candidate) => String(candidate.id) === id);
  const siteId = dashboard.site.id;
  const domain = site ? getDomain(site.url) : dashboard.site.name;
  const dataSince = site?.dataSince ?? dashboard.dataSince;
  const gaStatus = site?.gaStatus ?? dashboard.gaStatus;
  const chip = statusChip[gaStatus];
  const incompleteMessage = dataSince && dataSince > period.from
    ? `Período atual incompleto: a coleta começou em ${formatFullDate(dataSince)}.`
    : dataSince && dataSince > period.previousFrom
      ? `Período anterior incompleto: a coleta começou em ${formatFullDate(dataSince)}.`
      : null;
  const admin = role === "ADMIN";
  const currentDaily = fillDaily(dashboard.daily, period.from, period.to);
  const previousDaily = dashboard.previous.sessions > 0 && previousDashboard ? fillDaily(previousDashboard.daily, period.previousFrom, period.previousTo) : undefined;

  // eslint-disable-next-line react-hooks/purity -- development-only server render timing
  if (process.env.NODE_ENV !== "production") console.info(`[render] /sites/${id} ${(performance.now() - startedAt).toFixed(1)}ms`);

  return (
    <div className="mx-auto flex w-full max-w-[1280px] min-w-0 flex-col gap-4 px-4 py-5 sm:gap-6 sm:px-7 sm:py-8 lg:px-12 lg:py-10">
      <header className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <nav aria-label="Trilha" className="flex items-center gap-2 text-[13px] text-muted"><Link href="/sites" className="focus-ring rounded text-muted hover:text-primary">Sites</Link><span aria-hidden="true">/</span><span className="truncate text-primary">{domain}</span></nav>
          <h1 className="mt-2 truncate font-heading text-[34px] leading-[1.08] font-semibold tracking-tight sm:text-[46px]">{domain}</h1>
          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-muted sm:text-[13px]"><span className={`inline-flex items-center rounded-full px-2.5 py-1 font-semibold ${chip.className}`}>{chip.label}</span>{dataSince && <span>Coletando desde {formatFullDate(dataSince)}</span>}</div>
        </div>
        <div className="flex w-full min-w-0 flex-col items-stretch gap-2.5 lg:w-auto lg:items-end">
          <div className="flex min-w-0 flex-col gap-2.5 sm:flex-row sm:items-start"><PeriodSelector siteId={siteId} active={days} />{admin && <SyncButton siteId={siteId} />}</div>
          <span className="text-xs text-muted sm:text-[13px]">{formatDate(period.from)} – {formatDate(period.to)} · comparado a {formatDate(period.previousFrom)} – {formatDate(period.previousTo)}</span>
          {incompleteMessage && <span className="text-xs text-muted">{incompleteMessage}</span>}
        </div>
      </header>

      <RadarReading insights={insights} />
      {dashboard.current.sessions === 0 ? <EmptyDashboard admin={admin} siteId={siteId} gaStatus={gaStatus} /> : <>
        <KpiGrid dashboard={dashboard} />
        <DashboardChart current={currentDaily} previous={previousDaily} />
        <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-6"><ChannelsCard channels={dashboard.channels} /><DevicesCard devices={dashboard.devices} /></div>
        <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-6"><LandingPagesCard pages={dashboard.landingPages} /><EventsCard events={dashboard.events} /></div>
      </>}
    </div>
  );
}
