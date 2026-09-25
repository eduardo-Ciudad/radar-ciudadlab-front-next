import Link from "next/link";
import { formatChange, formatNumber, formatPercent } from "@/lib/format";
import { fillDaily } from "@/lib/period";
import type { Site } from "@/data/sites";
import type { DashboardResponse } from "@/types/dashboard";

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

export function SiteSummaryCard({ site, result }: { site: Site; result: PromiseSettledResult<DashboardResponse> }) {
  const dashboard = result.status === "fulfilled" ? result.value : null;
  const variation = dashboard ? formatChange(dashboard.comparison.sessionsChangePercent) : null;
  const daily = dashboard ? fillDaily(dashboard.daily, dashboard.period.from, dashboard.period.to) : [];

  return (
    <Link href={`/sites/${site.id}`} className="focus-ring group flex min-w-0 flex-col gap-5 rounded-2xl border border-card-border bg-card p-5 text-primary transition hover:-translate-y-0.5 hover:border-black/10 hover:shadow-[0_10px_30px_rgba(0,0,0,0.045)] sm:p-6">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0"><h2 className="truncate text-[17px] font-semibold">{site.name}</h2><p className="mt-0.5 truncate text-[13px] text-muted">{site.domain} · {site.tipo}</p></div>
        <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${dashboard ? "bg-up/[0.09] text-up" : "bg-down/10 text-down"}`}><i className={`size-1.5 rounded-full ${dashboard ? "bg-up" : "bg-down"}`} />{dashboard ? "GA ok" : "Erro"}</span>
      </div>

      {dashboard ? <>
        <div className="flex items-end justify-between gap-4">
          <div><span className="label">Sessões</span><strong className="mt-1 block text-[34px] leading-none font-semibold tracking-tight tabular-nums">{formatNumber(dashboard.current.sessions)}</strong>{variation && <span className={`mt-1.5 block text-[13px] font-semibold ${variation.direction === "up" ? "text-up" : variation.direction === "down" ? "text-down" : "text-muted"}`}>{variation.text}</span>}</div>
          <svg viewBox="0 0 150 48" width="150" height="48" className="max-w-[45%]" aria-hidden="true"><path d={sparklinePath(daily.map((day) => day.sessions))} fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" /></svg>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 border-t border-card-border pt-3.5 text-[13px] text-muted"><span><strong className="text-primary tabular-nums">{formatNumber(dashboard.current.keyEvents)}</strong> conversões</span><span><strong className="text-primary tabular-nums">{formatPercent(dashboard.current.engagementRate)}</strong> engajamento</span></div>
      </> : <div className="rounded-xl border border-dashed border-black/14 px-4 py-5"><p className="text-sm font-semibold">Não foi possível carregar os dados</p><p className="mt-1 text-[13px] leading-5 text-muted">Abra o site para tentar novamente.</p></div>}
    </Link>
  );
}
