import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChannelsCard, DevicesCard, EmptyDashboard, EventsCard, KpiGrid, LandingPagesCard } from "@/components/dashboard-sections";
import { DashboardChart } from "@/components/dashboard-chart";
import { PeriodSelector } from "@/components/period-selector";
import { SyncButton } from "@/components/sync-button";
import { sites } from "@/data/sites";
import { getUserRole } from "@/lib/auth";
import { ApiError, apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { fillDaily, getPeriod, parsePeriod } from "@/lib/period";
import type { DashboardResponse } from "@/types/dashboard";

export const metadata: Metadata = { title: "Analytics" };

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ periodo?: string | string[] }>;
};

function dashboardPath(id: string, from: string, to: string) {
  return `/api/sites/${encodeURIComponent(id)}/dashboard?from=${from}&to=${to}`;
}

export default async function SitePage({ params, searchParams }: Props) {
  const [{ id }, query, role] = await Promise.all([params, searchParams, getUserRole()]);
  const site = sites.find((candidate) => String(candidate.id) === id);
  if (!site) notFound();

  const days = parsePeriod(query.periodo);
  const period = getPeriod(days);
  let dashboard: DashboardResponse;
  let previousDashboard: DashboardResponse | undefined;

  try {
    dashboard = await apiFetch<DashboardResponse>(dashboardPath(id, period.from, period.to));
    if (dashboard.previous.sessions > 0) {
      [previousDashboard] = await Promise.all([
        apiFetch<DashboardResponse>(dashboardPath(id, period.previousFrom, period.previousTo)),
      ]);
    }
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  const admin = role === "ADMIN";
  const currentDaily = fillDaily(dashboard.daily, period.from, period.to);
  const previousDaily = dashboard.previous.sessions > 0 && previousDashboard
    ? fillDaily(previousDashboard.daily, period.previousFrom, period.previousTo)
    : undefined;

  return (
    <div className="mx-auto flex w-full max-w-[1280px] min-w-0 flex-col gap-4 px-4 py-5 sm:gap-6 sm:px-7 sm:py-8 lg:px-12 lg:py-10">
      <header className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <nav aria-label="Trilha" className="flex items-center gap-2 text-[13px] text-muted"><Link href="/sites" className="focus-ring rounded text-muted hover:text-primary">Sites</Link><span aria-hidden="true">/</span><span className="truncate text-primary">{site.domain}</span></nav>
          <h1 className="mt-2 truncate font-heading text-[34px] leading-[1.08] font-semibold tracking-tight sm:text-[46px]">{site.domain}</h1>
          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-muted sm:text-[13px]"><span className="inline-flex items-center rounded-full bg-accent-light px-2.5 py-1 font-semibold text-accent">Dados até {formatDate(period.to)}</span><span>{dashboard.site.name}</span></div>
        </div>
        <div className="flex w-full min-w-0 flex-col items-stretch gap-2.5 lg:w-auto lg:items-end">
          <div className="flex min-w-0 flex-col gap-2.5 sm:flex-row sm:items-start"><PeriodSelector siteId={site.id} active={days} />{admin && <SyncButton siteId={site.id} />}</div>
          <span className="text-xs text-muted sm:text-[13px]">{formatDate(period.from)} – {formatDate(period.to)} · comparado a {formatDate(period.previousFrom)} – {formatDate(period.previousTo)}</span>
        </div>
      </header>

      {dashboard.current.sessions === 0 ? <EmptyDashboard admin={admin} siteId={site.id} /> : <>
        <KpiGrid dashboard={dashboard} />
        <DashboardChart current={currentDaily} previous={previousDaily} />
        <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-6"><ChannelsCard channels={dashboard.channels} /><DevicesCard devices={dashboard.devices} /></div>
        <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-6"><LandingPagesCard pages={dashboard.landingPages} /><EventsCard events={dashboard.events} /></div>
      </>}
    </div>
  );
}
