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
