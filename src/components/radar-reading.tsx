import type { Insight } from "@/types/dashboard";

const severityStyle = { INFO: "bg-accent-light text-accent", WARNING: "bg-down/[0.07] text-down", CRITICAL: "bg-red-700/[0.07] text-red-700" } as const;

export function RadarReading({ insights }: { insights: Insight[] }) {
  const ordered = [...insights].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const summary = ordered.find((insight) => insight.type === "WEEKLY_SUMMARY" || insight.type === "MONTHLY_SUMMARY");
  const alerts = ordered.filter((insight) => insight.type === "ALERT").slice(0, 2);
  if (!summary && alerts.length === 0) return <section className="rounded-2xl border border-card-border bg-card px-5 py-4 sm:px-7"><span className="label text-accent">Leitura do Radar</span><p className="mt-2 text-sm leading-6 text-muted">Nenhuma leitura ainda — os resumos semanais e alertas aparecem aqui assim que forem gerados.</p></section>;
  return (
    <section className={`grid gap-6 rounded-2xl border border-card-border bg-card p-5 sm:p-7 ${alerts.length ? "lg:grid-cols-[minmax(0,1fr)_320px]" : ""}`}>
      <div>
        <span className="label text-accent">Leitura do Radar</span>
        <p className="mt-3 max-w-[65ch] font-heading text-[25px] leading-[1.3] font-semibold tracking-tight sm:text-[27px]">{summary?.body ?? "Há alertas recentes que merecem atenção."}</p>
      </div>
      {alerts.length > 0 && <aside className="flex flex-col gap-2.5">{alerts.map((alert) => <div key={alert.id} className={`rounded-xl px-5 py-4 ${severityStyle[alert.severity ?? "INFO"]}`}><span className="label text-current">{alert.title || "Alerta"}</span><p className="mt-2 text-sm leading-6 text-primary">{alert.body}</p></div>)}</aside>}
    </section>
  );
}
