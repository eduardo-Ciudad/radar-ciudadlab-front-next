"use client";

import { FileText, LoaderCircle, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { formatDateTime, formatNumber } from "@/lib/format";
import { redirectIfUnauthorized } from "@/lib/client-session";
import type { ImportBatch, ImportIssue, ImportReport, LeadsProblemDetail } from "@/types/leads";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
type Result = { kind: "success"; report: ImportReport } | { kind: "duplicate" | "error"; message: string };

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  return `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(bytes / 1024)} KB`;
}

function IssueList({ title, issues }: { title: string; issues: ImportIssue[] }) {
  if (issues.length === 0) return null;
  const items = (values: ImportIssue[]) => <ul className="mt-2 space-y-1.5 text-sm text-muted">{values.map((issue, index) => <li key={`${issue.line}-${index}`}><span className="font-semibold text-primary">Linha {issue.line}</span> — {issue.reason}</li>)}</ul>;
  return <section><h3 className="text-sm font-semibold text-primary">{title}</h3>{items(issues.slice(0, 5))}{issues.length > 5 && <details className="mt-3 text-sm"><summary className="focus-ring w-fit cursor-pointer rounded font-semibold text-accent">Ver todos ({issues.length})</summary><div className="mt-2 border-l border-divider pl-4">{items(issues.slice(5))}</div></details>}</section>;
}

export function LeadsImport({ batches }: { batches: ImportBatch[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string>();
  const [result, setResult] = useState<Result>();

  function chooseFile(selected?: File) {
    if (!selected || submitting) return;
    const error = !selected.name.toLowerCase().endsWith(".csv") ? "Escolha um arquivo .csv" : selected.size > MAX_FILE_SIZE ? "O arquivo passa de 2 MB" : undefined;
    setValidationError(error);
    setFile(error ? null : selected);
    setResult(undefined);
    if (error && inputRef.current) inputRef.current.value = "";
  }

  function reset() {
    setFile(null); setResult(undefined); setValidationError(undefined); setDragging(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function submit() {
    if (!file || submitting) return;
    setSubmitting(true); setValidationError(undefined);
    const form = new FormData(); form.append("file", file);
    try {
      const response = await fetch("/api/leads/import", { method: "POST", body: form });
      if (redirectIfUnauthorized(response)) return;
      const data = await response.json().catch(() => ({})) as ImportReport & LeadsProblemDetail;
      if (response.status === 201) {
        setResult({ kind: "success", report: data });
        router.replace(`/leads/importar?destaque=${data.batchId}`);
        router.refresh();
        return;
      }
      if (response.status === 409) {
        const batch = batches.find((b) => b.id === data.batchId);
        setResult({ kind: "duplicate", message: `Este arquivo já foi importado em ${batch ? formatDateTime(batch.importedAt) : "anteriormente"}.` });
        if (data.batchId !== undefined) {
          router.replace(`/leads/importar?destaque=${data.batchId}`);
          router.refresh();
        }
      } else if (response.status === 403) setResult({ kind: "error", message: "Somente administradores podem importar arquivos." });
      else if (response.status === 413) setResult({ kind: "error", message: "O arquivo passa de 2 MB." });
      else if (response.status === 400 && data.title === "Arquivo inválido") setResult({ kind: "error", message: data.detail || "O arquivo é inválido." });
      else if (response.status === 400 && (data.title === "Arquivo ausente" || data.title === "Upload inválido")) {
        if (process.env.NODE_ENV === "development") console.error("Falha de integração no upload:", data.title, data.detail);
        setResult({ kind: "error", message: "Não foi possível enviar o arquivo. Tente novamente." });
      } else if (response.status === 503) setResult({ kind: "error", message: "Não foi possível falar com o Radar agora." });
      else setResult({ kind: "error", message: data.detail || "Não foi possível importar o arquivo." });
    } catch {
      setResult({ kind: "error", message: "Não foi possível falar com o Radar agora." });
    } finally { setSubmitting(false); }
  }

  const fileInput = <input ref={inputRef} type="file" accept=".csv,text/csv" className="sr-only" onChange={(event) => chooseFile(event.target.files?.[0])} />;

  return (
    <section aria-labelledby="import-title" className="rounded-2xl border border-card-border bg-card p-5 sm:p-6">
      <div><p className="label">Novo lote</p><h2 id="import-title" className="mt-1 font-heading text-[28px] leading-tight font-semibold">Importar leads</h2><p className="mt-1.5 text-sm text-muted">Envie o CSV exportado pela sua ferramenta de prospecção.</p></div>
      {!file && !result && <label onDragEnter={(event) => { event.preventDefault(); setDragging(true); }} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={(event) => { event.preventDefault(); if (!event.currentTarget.contains(event.relatedTarget as Node)) setDragging(false); }} onDrop={(event) => { event.preventDefault(); setDragging(false); chooseFile(event.dataTransfer.files[0]); }} className={`focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 mt-5 flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-5 py-8 text-center transition ${dragging ? "border-accent bg-accent-light" : "border-black/14 bg-surface/35 hover:border-accent/60 hover:bg-accent-light/40"}`}>
        {fileInput}<span className={`flex size-12 items-center justify-center rounded-full ${dragging ? "bg-white text-accent" : "bg-white text-primary"}`}><Upload size={21} strokeWidth={1.8} /></span><span className="mt-4 max-w-md text-sm font-semibold sm:text-base">Arraste o CSV da ferramenta de prospecção ou clique para escolher</span><span className="mt-1.5 text-xs text-muted">CSV de até 2 MB</span>
      </label>}
      {validationError && <p role="alert" className="mt-4 text-sm font-medium text-down">{validationError}</p>}
      {file && !result && <div className="mt-5 rounded-2xl border border-card-border bg-surface/45 p-4 sm:flex sm:items-center sm:justify-between sm:gap-5">
        <div className="flex min-w-0 items-center gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-accent"><FileText size={19} /></span><span className="min-w-0"><span className="block truncate font-mono text-sm font-semibold" title={file.name}>{file.name}</span><span className="mt-0.5 block text-xs text-muted">{formatFileSize(file.size)}</span></span></div>
        <div className="mt-4 flex gap-2 sm:mt-0 sm:shrink-0"><label className={`focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 flex min-h-11 cursor-pointer items-center rounded-full border border-black/14 bg-white px-4 text-sm font-semibold ${submitting ? "pointer-events-none opacity-50" : ""}`}>Trocar arquivo{fileInput}</label><button type="button" disabled={submitting} onClick={submit} className="focus-ring flex min-h-11 min-w-28 items-center justify-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-65">{submitting && <LoaderCircle size={17} className="animate-spin" />}{submitting ? "Importando" : "Importar"}</button></div>
      </div>}
      {result?.kind === "success" && <div className="mt-5" aria-live="polite"><div className="rounded-2xl border border-accent-border bg-accent-light p-4 sm:p-5"><p className="text-sm font-semibold text-primary">Importação concluída</p><div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">{[["Linhas no arquivo", result.report.totalRows, ""], ["Novos", result.report.created, "text-up"], ["Atualizados", result.report.updated, ""], ["Pulados", result.report.skipped, result.report.skipped > 0 ? "text-down" : ""]].map(([label, value, color]) => <div key={label as string}><span className="label block">{label}</span><strong className={`mt-1 block text-2xl font-semibold tabular-nums ${color}`}>{formatNumber(value as number)}</strong></div>)}</div></div>{(result.report.errors.length > 0 || result.report.warnings.length > 0) && <div className="mt-5 grid gap-5 border-t border-divider pt-5 lg:grid-cols-2"><IssueList title="Erros (linhas puladas)" issues={result.report.errors} /><IssueList title="Avisos (importadas com dado descartado)" issues={result.report.warnings} /></div>}<button type="button" onClick={reset} className="focus-ring mt-5 min-h-11 rounded-full border border-black/14 bg-white px-4 text-sm font-semibold">Nova importação</button></div>}
      {result?.kind === "duplicate" && <div className="mt-5" aria-live="polite"><p className="rounded-xl border border-accent-border bg-accent-light px-4 py-3 text-sm font-medium text-primary">{result.message}</p><button type="button" onClick={reset} className="focus-ring mt-4 min-h-11 rounded-full border border-black/14 bg-white px-4 text-sm font-semibold">Nova importação</button></div>}
      {result?.kind === "error" && <div className="mt-5" aria-live="assertive"><p className="text-sm font-medium text-down">{result.message}</p><button type="button" onClick={reset} className="focus-ring mt-4 min-h-11 rounded-full border border-black/14 bg-white px-4 text-sm font-semibold">Nova importação</button></div>}
    </section>
  );
}
