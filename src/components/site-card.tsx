import Link from "next/link";
import { SyncButton } from "@/components/sync-button";
import { formatChange, formatDateTime, formatNumber, formatPercent, getDomain } from "@/lib/format";
import { fillDaily } from "@/lib/period";
import type { DashboardResponse, SiteOverview } from "@/types/dashboard";

function sparklinePath(values: number[]) {
  if (!values.length) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  return values.map((value, index) => {
    const x = values.length === 1 ? 2 : 2 + index * (146 / (values.length - 1));
    const y = 44 - ((value - min) / (max - min || 1)) * 40;
    return `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
}

function StateMessage({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return <div className="flex min-h-28 flex-col justify-center rounded-xl border border-dashed border-black/14 px-4 py-5"><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-[13px] leading-5 text-muted">{body}</p>{action && <div className="mt-4 self-start">{action}</div>}</div>;
}

export function SiteCard({ site, dashboard, dashboardError = false, admin = false }: { site: SiteOverview; dashboard?: DashboardResponse; dashboardError?: boolean; admin?: boolean }) {
  const domain = getDomain(site.url);
  const canOpen = site.gaConfigured && Boolean(site.dataSince);
  const ownership = site.type === "OWN" ? "próprio" : site.clientName ?? "cliente";
  const variation = dashboard ? formatChange(dashboard.comparison.sessionsChangePercent) : null;
  const daily = dashboard ? fillDaily(dashboard.daily, dashboard.period.from, dashboard.period.to) : [];
  const status = !site.gaConfigured ? { label: "Não configurado", color: "bg-black/[0.05] text-muted", dot: "bg-[#8a8a8a]" }
    : site.gaStatus === "OK" ? { label: "GA ok", color: "bg-up/[0.09] text-up", dot: "bg-up" }
    : site.gaStatus === "PENDING" ? { label: "Aguardando", color: "bg-black/[0.05] text-muted", dot: "bg-[#8a8a8a]" }
    : site.gaStatus === "NO_ACCESS" ? { label: "Sem acesso", color: "bg-down/10 text-down", dot: "bg-down" }
    : { label: "Erro", color: "bg-[#B91C1C]/10 text-[#B91C1C]", dot: "bg-[#B91C1C]" };
  const metrics = dashboard && <>
    <div><span className="label">Sessões</span><strong className="mt-1 block text-[34px] leading-none font-semibold tracking-tight tabular-nums">{formatNumber(dashboard.current.sessions)}</strong>{variation && <span className={`mt-1.5 block text-[13px] font-semibold ${variation.direction === "up" ? "text-up" : variation.direction === "down" ? "text-down" : "text-muted"}`}>{variation.text}</span>}</div>
    <svg viewBox="0 0 150 48" width="150" height="48" className="max-w-[45%]" aria-hidden="true"><path d={sparklinePath(daily.map((day) => day.sessions))} fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" /></svg>
  </>;

  return (
    <article className="group flex min-w-0 flex-col gap-5 rounded-2xl border border-card-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-black/10 hover:shadow-[0_10px_30px_rgba(0,0,0,0.045)] sm:p-6">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">{canOpen ? <Link href={`/sites/${site.id}`} className="focus-ring rounded-sm"><h2 className="truncate text-[17px] font-semibold group-hover:text-accent">{site.name}</h2></Link> : <h2 className="truncate text-[17px] font-semibold">{site.name}</h2>}<p className="mt-0.5 truncate text-[13px] text-muted">{domain} · {ownership}</p></div>
        <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.color}`}><i className={`size-1.5 rounded-full ${status.dot}`} />{status.label}</span>
      </div>

      {dashboard ? <>
        {(site.gaStatus === "NO_ACCESS" || site.gaStatus === "ERROR") && <p className="text-[13px] font-medium leading-5 text-down">Sync parado — dados até a última coleta{site.lastSyncError ? ` · ${site.lastSyncError}` : ""}</p>}
        {canOpen ? <Link href={`/sites/${site.id}`} className="focus-ring flex items-end justify-between gap-4 rounded-lg">{metrics}</Link> : <div className="flex items-end justify-between gap-4">{metrics}</div>}
        <div className="flex flex-wrap gap-x-5 gap-y-1 border-t border-card-border pt-3.5 text-[13px] text-muted"><span><strong className="text-primary tabular-nums">{formatNumber(dashboard.current.keyEvents)}</strong> conversões</span><span><strong className="text-primary tabular-nums">{formatPercent(dashboard.current.engagementRate)}</strong> engajamento</span>{site.lastSyncAt && <span className="ml-auto">sync {formatDateTime(site.lastSyncAt)}</span>}</div>
      </> : !site.gaConfigured ? <StateMessage title="Google Analytics não configurado" body="Este site ainda não tem uma propriedade do Analytics vinculada." />
        : site.gaStatus === "PENDING" ? <StateMessage title="Aguardando a primeira coleta" body="Sincronize o site para começar a preencher o histórico." action={admin ? <SyncButton siteId={site.id} /> : undefined} />
        : site.gaStatus === "NO_ACCESS" ? <StateMessage title="Sem acesso ao Google Analytics" body="A conta conectada não tem permissão para ler esta propriedade." />
        : <StateMessage title="Erro na sincronização" body={site.lastSyncError || (dashboardError ? "Não foi possível carregar os dados deste site." : "A última coleta não foi concluída.")} action={admin ? <SyncButton siteId={site.id} label="Tentar novamente" /> : undefined} />}
    </article>
  );
}
