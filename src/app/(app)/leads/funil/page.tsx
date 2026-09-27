import type { Metadata } from "next";
import { LeadBoard } from "@/components/lead-board";
import { apiFetch } from "@/lib/api";
import { hasLeadFilters, leadBackendQuery, type LeadSearchParams } from "@/lib/lead-filters";
import type { ImportBatch, LeadBoard as Board, LeadFilters } from "@/types/leads";
export const metadata: Metadata = { title: "Leads · Funil" };
export default async function LeadBoardPage({ searchParams }: { searchParams: Promise<LeadSearchParams> }) {
  const params = await searchParams; const query = leadBackendQuery(params); query.set("perColumn", "20");
  const [board, filters, imports] = await Promise.all([apiFetch<Board>(`/api/leads/board?${query}`), apiFetch<LeadFilters>("/api/leads/filters"), apiFetch<ImportBatch[]>("/api/leads/imports?limit=1").catch(() => [] as ImportBatch[])]);
  return <LeadBoard initialBoard={board} params={params} filters={filters} latest={imports[0]} filtered={hasLeadFilters(params)} />;
}
