import type { Metadata } from "next";
import { LeadsHistory } from "@/components/leads-history";
import { LeadsImport } from "@/components/leads-import";
import { apiFetch } from "@/lib/api";
import type { ImportBatch } from "@/types/leads";
export const metadata: Metadata = { title: "Leads · Importar" };
export default async function LeadsImportPage({ searchParams }: { searchParams: Promise<{ destaque?: string | string[] }> }) {
  const params = await searchParams; const highlightedId = Array.isArray(params.destaque) ? params.destaque[0] : params.destaque;
  const historyResult = await apiFetch<ImportBatch[]>("/api/leads/imports?limit=20").then((batches) => ({ batches, error: false }), () => ({ batches: [] as ImportBatch[], error: true }));
  return <div className="flex min-w-0 flex-col gap-6"><LeadsImport batches={historyResult.batches} /><LeadsHistory batches={historyResult.batches} highlightedId={highlightedId} error={historyResult.error} /></div>;
}
