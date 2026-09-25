import { changePercent, channelNames, deviceNames, formatChange, formatDecimal, formatDuration, formatNumber, formatPercent } from "@/lib/format";
import { SyncButton } from "@/components/sync-button";
import type { Breakdown, DashboardResponse } from "@/types/dashboard";

type Kpi = {
  label: string;
  value: string;
  previous: string;
  change: ReturnType<typeof formatChange>;
};

function KpiCard({ item }: { item: Kpi }) {
  const color = item.change.direction === "up" ? "text-up" : item.change.direction === "down" ? "text-down" : "text-muted";
  return (
    <article className="flex min-w-0 flex-col gap-2 rounded-2xl border border-card-border bg-card p-4 sm:p-5">
      <span className="label truncate">{item.label}</span>
      <strong className="tabular-nums text-[28px] leading-[1.1] font-semibold tracking-tight sm:text-[32px]">{item.value}</strong>
      <div className="flex flex-col gap-0.5 text-xs sm:flex-row sm:items-center sm:gap-2 sm:text-[13px]">
        <span className={`font-semibold ${color}`}>{item.change.text}</span>
        <span className="truncate text-muted">antes {item.previous}</span>
      </div>
    </article>
  );
}

export function KpiGrid({ dashboard }: { dashboard: DashboardResponse }) {
  const { current, previous, comparison } = dashboard;
  const conversionPoints = current.conversionRate - previous.conversionRate;
  const kpis: Kpi[] = [
    { label: "Sessões", value: formatNumber(current.sessions), previous: formatNumber(previous.sessions), change: formatChange(comparison.sessionsChangePercent) },
    { label: "Novos usuários", value: formatNumber(current.newUsers), previous: formatNumber(previous.newUsers), change: formatChange(comparison.newUsersChangePercent) },
    { label: "Visualizações", value: formatNumber(current.pageViews), previous: formatNumber(previous.pageViews), change: formatChange(comparison.pageViewsChangePercent) },
    { label: "Conversões", value: formatNumber(current.keyEvents), previous: formatNumber(previous.keyEvents), change: formatChange(comparison.keyEventsChangePercent) },
    { label: "Taxa de engajamento", value: formatPercent(current.engagementRate), previous: formatPercent(previous.engagementRate), change: formatChange(comparison.engagementRateChangePoints, true) },
    { label: "Taxa de conversão", value: formatPercent(current.conversionRate), previous: formatPercent(previous.conversionRate), change: formatChange(previous.sessions === 0 ? null : conversionPoints, true) },
    { label: "Páginas por sessão", value: formatDecimal(current.pagesPerSession), previous: formatDecimal(previous.pagesPerSession), change: formatChange(changePercent(current.pagesPerSession, previous.pagesPerSession)) },
    { label: "Tempo médio engajado", value: formatDuration(current.averageEngagementSeconds), previous: formatDuration(previous.averageEngagementSeconds), change: formatChange(changePercent(current.averageEngagementSeconds, previous.averageEngagementSeconds)) },
  ];
  return <section aria-label="Indicadores" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">{kpis.map((item) => <KpiCard key={item.label} item={item} />)}</section>;
}

function CardHeading({ title, description }: { title: string; description: string }) {
  return <div><h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-[30px]">{title}</h2><p className="mt-1 text-sm text-muted">{description}</p></div>;
}

export function ChannelsCard({ channels }: { channels: Breakdown[] }) {
  return (
    <section className="rounded-2xl border border-card-border bg-card p-5 sm:p-7">
      <CardHeading title="Canais" description="De onde vêm as sessões" />
      <div className="mt-5 hidden grid-cols-[150px_64px_minmax(0,1fr)_96px] gap-4 border-b border-divider pb-2.5 lg:grid"><span className="label">Canal</span><span className="label text-right">Sessões</span><span className="label">Participação</span><span className="label text-right">Engajamento</span></div>
      <div className="mt-4 flex flex-col gap-4">
        {channels.map((channel) => {
          const share = channel.sharePercent ?? 0;
          return <div key={channel.value} className="grid items-center gap-1.5 text-sm lg:grid-cols-[150px_64px_minmax(0,1fr)_96px] lg:gap-4"><div className="flex justify-between lg:block"><span className="font-medium">{channelNames[channel.value] ?? channel.value}</span><span className="tabular-nums font-semibold lg:hidden">{formatNumber(channel.sessions)}</span></div><span className="hidden text-right tabular-nums font-semibold lg:block">{formatNumber(channel.sessions)}</span><div className="flex items-center gap-2.5"><div className="h-2 flex-1 overflow-hidden rounded-full bg-track"><div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(100, Math.max(0, share))}%` }} /></div><span className="w-12 text-right text-xs tabular-nums text-[#5a5a5a]">{formatPercent(share)}</span></div><span className="hidden text-right tabular-nums text-[#5a5a5a] lg:block">{formatPercent(channel.engagementRate)}</span></div>;
        })}
      </div>
    </section>
  );
}

const deviceColors: Record<string, string> = { mobile: "#2563eb", desktop: "#1a1a1a", tablet: "#c9c2b4" };

export function DevicesCard({ devices }: { devices: Breakdown[] }) {
  const total = devices.reduce((sum, item) => sum + item.sessions, 0);
  const getShare = (item: Breakdown) => item.sharePercent ?? (total ? item.sessions / total * 100 : 0);
  return (
    <section className="rounded-2xl border border-card-border bg-card p-5 sm:p-7">
      <CardHeading title="Dispositivos" description="Como as visitas acessam o site" />
      <div className="mt-6 flex h-3.5 overflow-hidden rounded-full bg-track">
        {devices.map((device) => <span key={device.value} style={{ width: `${getShare(device)}%`, backgroundColor: deviceColors[device.value] ?? "#9a9a9a" }} />)}
      </div>
      <div className="mt-5 flex flex-col gap-3.5">
        {devices.map((device) => <div key={device.value} className="grid grid-cols-[12px_minmax(0,1fr)_auto_auto] items-center gap-3 text-sm"><i className="size-3 rounded-[3px]" style={{ backgroundColor: deviceColors[device.value] ?? "#9a9a9a" }} /><span className="truncate font-medium">{deviceNames[device.value] ?? device.value}</span><span className="tabular-nums font-semibold">{formatNumber(device.sessions)}</span><span className="w-14 text-right tabular-nums text-[#5a5a5a]">{formatPercent(getShare(device))}</span></div>)}
      </div>
    </section>
  );
}

export function LandingPagesCard({ pages }: { pages: Breakdown[] }) {
  return (
    <section className="min-w-0 rounded-2xl border border-card-border bg-card p-5 sm:p-7">
      <CardHeading title="Páginas de entrada" description="Onde a visita começa — e se ela converte" />
      <div className="mt-5 hidden grid-cols-[minmax(0,1fr)_72px_100px_96px] gap-4 border-b border-divider pb-2.5 sm:grid"><span className="label">Página</span><span className="label text-right">Sessões</span><span className="label text-right">Engajamento</span><span className="label text-right">Conversões</span></div>
      <div className="mt-2 flex flex-col">
        {pages.map((page) => <div key={page.value} className="flex min-h-12 min-w-0 items-center gap-3 border-b border-card-border text-sm last:border-0 sm:grid sm:grid-cols-[minmax(0,1fr)_72px_100px_96px] sm:gap-4"><span title={page.value} className="min-w-0 flex-1 truncate font-mono text-[13px]">{page.value}</span><span className="hidden text-right tabular-nums font-semibold sm:block">{formatNumber(page.sessions)}</span><span className="hidden text-right tabular-nums text-[#5a5a5a] sm:block">{formatPercent(page.engagementRate)}</span><span className="shrink-0 text-right tabular-nums font-semibold"><span className="sm:hidden">{formatNumber(page.sessions)} · </span>{formatNumber(page.keyEvents)} <span className="font-normal text-muted sm:hidden">conv.</span></span></div>)}
      </div>
    </section>
  );
}

export function EventsCard({ events }: { events: Breakdown[] }) {
  return (
    <section className="rounded-2xl border border-card-border bg-card p-5 sm:p-7">
      <CardHeading title="Eventos" description="Os marcados contam como conversão" />
      <div className="mt-4 flex flex-col gap-2">
        {events.map((event) => <div key={event.value} className="flex min-h-10 min-w-0 items-center gap-2.5 text-sm"><span className="min-w-0 truncate font-mono text-[13px]">{event.value}</span>{event.keyEvents > 0 && <span className="shrink-0 rounded-full bg-accent-light px-2 py-0.5 text-[11px] font-semibold text-accent">conversão</span>}<span className="ml-auto tabular-nums font-semibold">{formatNumber(event.eventCount)}</span></div>)}
      </div>
    </section>
  );
}

export function EmptyDashboard({ admin, siteId }: { admin: boolean; siteId: number }) {
  return (
    <section className="flex min-h-[420px] items-center justify-center rounded-2xl border border-card-border bg-card px-6 text-center">
      <div className="max-w-sm"><span className="label text-accent">Google Analytics</span><h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight">Ainda sem dados — sincronize o site</h2><p className="mt-3 text-sm leading-6 text-muted">Assim que a primeira coleta terminar, os indicadores aparecerão aqui.</p>{admin && <div className="mt-6 flex justify-center"><SyncButton siteId={siteId} /></div>}</div>
    </section>
  );
}
