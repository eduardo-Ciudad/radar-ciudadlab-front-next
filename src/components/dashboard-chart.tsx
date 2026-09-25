"use client";

import { useMemo, useState } from "react";
import { formatDate, formatNumber } from "@/lib/format";
import type { DailyMetric } from "@/types/dashboard";

type Metric = "sessions" | "newUsers" | "pageViews" | "keyEvents";

const metrics: Array<{ key: Metric; label: string; singular: string }> = [
  { key: "sessions", label: "Sessões", singular: "sessões" },
  { key: "newUsers", label: "Novos usuários", singular: "novos usuários" },
  { key: "pageViews", label: "Visualizações", singular: "visualizações" },
  { key: "keyEvents", label: "Conversões", singular: "conversões" },
];

const W = 1000;
const H = 260;
const LEFT = 42;
const RIGHT = 988;
const TOP = 12;
const BOTTOM = 222;

function pointsFor(data: DailyMetric[], metric: Metric, max: number) {
  return data.map((item, index) => ({
    x: data.length <= 1 ? LEFT : LEFT + index * ((RIGHT - LEFT) / (data.length - 1)),
    y: BOTTOM - (item[metric] / max) * (BOTTOM - TOP),
    item,
  }));
}

function pathFor(points: ReturnType<typeof pointsFor>) {
  return points.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
}

export function DashboardChart({ current, previous }: { current: DailyMetric[]; previous?: DailyMetric[] }) {
  const [metric, setMetric] = useState<Metric>("sessions");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const values = [...current, ...(previous ?? [])].map((item) => item[metric]);
  const max = Math.max(1, ...values);
  const axisMax = Math.max(1, Math.ceil(max / 3) * 3);
  const currentPoints = useMemo(() => pointsFor(current, metric, axisMax), [current, metric, axisMax]);
  const previousPoints = useMemo(() => pointsFor(previous ?? [], metric, axisMax), [previous, metric, axisMax]);
  const currentPath = pathFor(currentPoints);
  const currentArea = currentPath ? `${currentPath} L${RIGHT} ${BOTTOM} L${LEFT} ${BOTTOM} Z` : "";
  const selected = activeIndex === null ? null : currentPoints[activeIndex];
  const selectedMetric = metrics.find((item) => item.key === metric)!;
  const xLabelIndexes = current.length ? [0, .25, .5, .75, 1].map((ratio) => Math.round((current.length - 1) * ratio)) : [];

  return (
    <section className="rounded-2xl border border-card-border bg-card p-5 sm:p-7">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
        <div>
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-[30px]">Sessões por dia</h2>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#5a5a5a] sm:text-[13px]">
            <span className="inline-flex items-center gap-2"><i className="h-0.5 w-5 bg-accent" />Período atual</span>
            {previous?.length ? <span className="inline-flex items-center gap-2"><i className="w-5 border-t-2 border-dashed border-[#9A9A9A]" />Período anterior</span> : null}
          </div>
        </div>
        <div role="group" aria-label="Métrica do gráfico" className="flex flex-wrap gap-1.5">
          {metrics.map((item) => <button key={item.key} type="button" aria-pressed={metric === item.key} onClick={() => { setMetric(item.key); setActiveIndex(null); }} className={`focus-ring min-h-9 rounded-full border px-3.5 text-[13px] transition ${metric === item.key ? "border-accent-border bg-accent-light font-semibold text-accent" : "border-black/10 bg-white font-medium text-[#5a5a5a]"}`}>{item.label}</button>)}
        </div>
      </div>

      <div className="mt-5 w-full">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" role="img" aria-label={`${selectedMetric.label} por dia, de ${current[0] ? formatDate(current[0].date) : "--"} a ${current.at(-1) ? formatDate(current.at(-1)!.date) : "--"}`} onMouseLeave={() => setActiveIndex(null)}>
          {[0, 1, 2, 3].map((index) => {
            const y = TOP + index * ((BOTTOM - TOP) / 3);
            const value = Math.round(axisMax * (1 - index / 3));
            return <g key={index}><line x1={LEFT} x2={RIGHT} y1={y} y2={y} stroke={index === 3 ? "rgba(0,0,0,.14)" : "rgba(0,0,0,.06)"} /><text x={30} y={y + 4} textAnchor="end" className="fill-muted text-[11px]">{formatNumber(value)}</text></g>;
          })}
          {previousPoints.length ? <path d={pathFor(previousPoints)} fill="none" stroke="#9A9A9A" strokeWidth="1.5" strokeDasharray="5 5" /> : null}
          {currentArea ? <path d={currentArea} fill="var(--color-accent-light)" /> : null}
          {currentPath ? <path d={currentPath} fill="none" stroke="var(--color-accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /> : null}
          {currentPoints.map((point, index) => (
            <circle key={point.item.date} cx={point.x} cy={point.y} r={9} fill="transparent" tabIndex={0} aria-label={`${formatDate(point.item.date)}: ${formatNumber(point.item[metric])} ${selectedMetric.singular}`} onMouseEnter={() => setActiveIndex(index)} onFocus={() => setActiveIndex(index)} onBlur={() => setActiveIndex(null)} />
          ))}
          {selected && <g pointerEvents="none"><line x1={selected.x} x2={selected.x} y1={TOP} y2={BOTTOM} stroke="rgba(0,0,0,.2)" strokeDasharray="3 4" /><circle cx={selected.x} cy={selected.y} r="5" fill="#fff" stroke="var(--color-accent)" strokeWidth="2.2" /><g transform={`translate(${Math.min(Math.max(selected.x - 62, LEFT), RIGHT - 124)} ${Math.max(TOP, selected.y - 60)})`}><rect width="124" height="48" rx="8" fill="#1a1a1a" /><text x="12" y="18" fill="#bdbdbd" fontSize="11">{formatDate(selected.item.date)}</text><text x="12" y="37" fill="#fff" fontSize="13" fontWeight="600">{formatNumber(selected.item[metric])} {selectedMetric.singular}</text></g></g>}
          {xLabelIndexes.map((index, position) => {
            const point = currentPoints[index];
            if (!point) return null;
            return <text key={`${index}-${position}`} x={point.x} y="250" textAnchor={position === 0 ? "start" : position === 4 ? "end" : "middle"} className="fill-muted text-[11px]">{formatDate(point.item.date)}</text>;
          })}
        </svg>
      </div>
    </section>
  );
}
