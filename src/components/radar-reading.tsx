type RadarReadingProps = {
  summary: string;
  alert?: string;
  periodLabel?: string;
};

export function RadarReading({ summary, alert, periodLabel }: RadarReadingProps) {
  return (
    <section className="grid gap-6 rounded-2xl border border-card-border bg-card p-7 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div>
        <div className="flex flex-wrap items-center gap-3"><span className="label text-accent">Leitura do Radar</span>{periodLabel && <span className="text-xs text-muted">{periodLabel}</span>}</div>
        <p className="mt-3 font-heading text-[27px] leading-[1.3] font-semibold tracking-tight">{summary}</p>
      </div>
      {alert && <div className="rounded-xl bg-down/[0.07] px-5 py-4"><span className="label text-down">Alerta</span><p className="mt-2 text-sm leading-6">{alert}</p></div>}
    </section>
  );
}
