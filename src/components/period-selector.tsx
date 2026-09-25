import { CalendarDays } from "lucide-react";
import Link from "next/link";
import type { PeriodDays } from "@/lib/period";

export function PeriodSelector({ siteId, active }: { siteId: number; active: PeriodDays }) {
  return (
    <div role="group" aria-label="Período" className="grid w-full grid-cols-3 gap-0.5 rounded-full border border-card-border bg-white p-1 sm:flex sm:w-auto">
      {([7, 28, 90] as const).map((days) => (
        <Link
          key={days}
          href={`/sites/${siteId}?periodo=${days}`}
          aria-current={active === days ? "page" : undefined}
          className={`focus-ring flex min-h-10 items-center justify-center rounded-full px-3 text-sm whitespace-nowrap transition sm:px-4 ${active === days ? "bg-primary font-semibold text-white" : "font-medium text-[#5a5a5a] hover:bg-black/[0.03]"}`}
        >
          {days} dias
        </Link>
      ))}
      <button type="button" disabled className="hidden min-h-10 cursor-not-allowed items-center gap-1.5 rounded-full px-3 text-sm font-medium text-muted/50 sm:flex">
        <CalendarDays size={16} /> Personalizado
      </button>
    </div>
  );
}
