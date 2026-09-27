export type ImportIssue = { line: number; reason: string };

export type ImportReport = {
  batchId: number;
  fileName: string;
  totalRows: number;
  created: number;
  updated: number;
  skipped: number;
  errors: ImportIssue[];
  warnings: ImportIssue[];
};

export type ImportBatch = {
  id: number;
  fileName: string;
  fileHash: string;
  importedAt: string;
  totalRows: number;
  createdCount: number;
  updatedCount: number;
  skippedCount: number;
};

export type LeadsProblemDetail = {
  title?: string;
  status?: number;
  detail?: string;
  batchId?: number;
};

export type LeadStatus = "NOVO" | "CONTATADO" | "REUNIAO" | "PROPOSTA" | "FECHADO" | "PERDIDO" | "DESCARTADO";
export type LeadCard = { id: number; name: string; category: string | null; neighborhood: string | null; city: string | null; phoneE164: string | null; mobile: boolean | null; websiteUrl: string | null; instagramHandle: string | null; rating: number | null; reviewsCount: number | null; status: LeadStatus; score: number | null; scoreOverridden: boolean; updatedAt: string };
export type LeadBoard = { columns: { status: LeadStatus; count: number; leads: LeadCard[] }[]; active: number; outOfFunnel: number; lost: number; discarded: number };
export type LeadFilters = { categories: { value: string; count: number }[]; neighborhoods: { value: string; count: number }[] };
export type LeadPage = { items: LeadCard[]; page: number; size: number; totalElements: number; totalPages: number };
export const statusLabels: Record<LeadStatus, string> = { NOVO: "Novo", CONTATADO: "Contatado", REUNIAO: "Reunião", PROPOSTA: "Proposta", FECHADO: "Fechado", PERDIDO: "Perdido", DESCARTADO: "Descartado" };

export type LeadDetail = {
  id: number;
  name: string;
  category: string | null;
  phoneE164: string | null;
  mobile: boolean | null;
  address: { raw: string | null; street: string | null; number: string | null; complement: string | null; neighborhood: string | null; city: string | null; state: string | null; zipCode: string | null };
  websiteUrl: string | null;
  instagramHandle: string | null;
  rating: number | null;
  reviewsCount: number | null;
  status: LeadStatus;
  score: number | null;
  calculatedScore: number | null;
  scoreOverride: number | null;
  scoreBreakdown: { criterion: string; label: string; points: number; max: number; reason: string }[];
  notes: string | null;
  aiSummary: string | null;
  ratingHistory: { batchId: number; rating: number | null; reviewsCount: number | null; capturedAt: string }[];
  statusHistory: { from: LeadStatus | null; to: LeadStatus; changedAt: string; note: string | null }[];
  sameLocation: { id: number; name: string; status: LeadStatus; matchType: "PHONE" | "ADDRESS" }[];
  createdAt: string;
  updatedAt: string;
};
