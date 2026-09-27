import type { Metadata } from "next";
import { LeadsHistory } from "@/components/leads-history";
import { LeadsImport } from "@/components/leads-import";
import { apiFetch } from "@/lib/api";
import { getUserRole } from "@/lib/auth";
import type { ImportBatch } from "@/types/leads";

export const metadata: Metadata = { title: "Leads · Importar" };

export default async function LeadsImportPage({ searchParams }: { searchParams: Promise<{ destaque?: string | string[] }> }) {
  const params = await searchParams;
  const highlightedId = Array.isArray(params.destaque) ? params.destaque[0] : params.destaque;
  const [role, historyResult] = await Promise.all([
    getUserRole(),
    apiFetch<ImportBatch[]>("/api/leads/imports?limit=20").then(
      (batches) => ({ batches, error: false }),
      () => ({ batches: [] as ImportBatch[], error: true }),
    ),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-[1280px] min-w-0 flex-col gap-6 px-4 py-5 sm:px-7 sm:py-8 lg:px-12 lg:py-10">
      <header>
        <p className="label">Prospecção</p>
        <h1 className="mt-2 font-heading text-[42px] leading-none font-semibold tracking-tight sm:text-[50px]">Leads</h1>
        <nav aria-label="Seções de leads" className="mt-6 flex border-b border-divider">
          <span aria-disabled="true" className="flex min-h-11 cursor-not-allowed items-center gap-2 border-b-2 border-transparent px-3 text-sm font-semibold text-muted/55">Funil <span className="rounded-full bg-black/[0.055] px-2 py-0.5 text-[10px] uppercase tracking-wide">em breve</span></span>
          <span aria-current="page" className="flex min-h-11 items-center border-b-2 border-accent px-4 text-sm font-semibold text-primary">Importar</span>
        </nav>
      </header>
      <LeadsImport admin={role === "ADMIN"} batches={historyResult.batches} />
      <LeadsHistory batches={historyResult.batches} highlightedId={highlightedId} error={historyResult.error} />
    </div>
  );
}
