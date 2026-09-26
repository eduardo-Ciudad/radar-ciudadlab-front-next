import { formatDateTime, formatNumber } from "@/lib/format";
import type { ImportBatch } from "@/types/leads";

type Props = { batches: ImportBatch[]; highlightedId?: string; error?: boolean };

function BatchStats({ batch }: { batch: ImportBatch }) {
  return (
    <dl className="grid grid-cols-2 gap-x-5 gap-y-3 border-t border-divider pt-4 text-sm sm:hidden">
      <div><dt className="label">Linhas</dt><dd className="mt-1 font-semibold tabular-nums">{formatNumber(batch.totalRows)}</dd></div>
      <div><dt className="label">Novos</dt><dd className="mt-1 font-semibold tabular-nums text-up">{formatNumber(batch.createdCount)}</dd></div>
      <div><dt className="label">Atualizados</dt><dd className="mt-1 font-semibold tabular-nums">{formatNumber(batch.updatedCount)}</dd></div>
      <div><dt className="label">Pulados</dt><dd className={`mt-1 font-semibold tabular-nums ${batch.skippedCount > 0 ? "text-down" : ""}`}>{formatNumber(batch.skippedCount)}</dd></div>
    </dl>
  );
}

export function LeadsHistory({ batches, highlightedId, error }: Props) {
  return (
    <section aria-labelledby="history-title" className="overflow-hidden rounded-2xl border border-card-border bg-card">
      <div className="border-b border-divider px-5 py-5 sm:px-6">
        <p className="label">Registro</p>
        <h2 id="history-title" className="mt-1 font-heading text-[28px] leading-tight font-semibold">Histórico de importações</h2>
      </div>
      {error ? (
        <div className="m-5 rounded-xl border border-down/15 bg-down/[0.06] px-4 py-3 text-sm text-down sm:m-6" role="status">Não foi possível carregar o histórico agora. Você ainda pode importar um arquivo.</div>
      ) : batches.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-muted sm:px-6">Nenhuma importação ainda. Envie o primeiro CSV para começar.</p>
      ) : <>
        <div className="hidden sm:block">
          <table className="w-full table-fixed border-collapse text-sm">
            <thead><tr className="border-b border-divider text-left">
              <th className="label w-[31%] px-6 py-3.5">Arquivo</th><th className="label w-[21%] px-3 py-3.5">Importado em</th><th className="label px-3 py-3.5 text-right">Linhas</th><th className="label px-3 py-3.5 text-right">Novos</th><th className="label px-3 py-3.5 text-right">Atualizados</th><th className="label px-6 py-3.5 text-right">Pulados</th>
            </tr></thead>
            <tbody>{batches.map((batch) => {
              const highlighted = String(batch.id) === highlightedId;
              return <tr id={`import-${batch.id}`} key={batch.id} className={`border-b border-divider last:border-b-0 ${highlighted ? "bg-accent-light shadow-[inset_3px_0_0_var(--color-accent)]" : ""}`}>
                <td className="px-6 py-4"><span className="block truncate font-mono text-[13px]" title={batch.fileName}>{batch.fileName}</span></td><td className="px-3 py-4 text-muted">{formatDateTime(batch.importedAt)}</td><td className="px-3 py-4 text-right tabular-nums">{formatNumber(batch.totalRows)}</td><td className="px-3 py-4 text-right font-medium tabular-nums text-up">{formatNumber(batch.createdCount)}</td><td className="px-3 py-4 text-right tabular-nums">{formatNumber(batch.updatedCount)}</td><td className={`px-6 py-4 text-right font-medium tabular-nums ${batch.skippedCount > 0 ? "text-down" : ""}`}>{formatNumber(batch.skippedCount)}</td>
              </tr>;
            })}</tbody>
          </table>
        </div>
        <div className="grid gap-3 p-4 sm:hidden">{batches.map((batch) => {
          const highlighted = String(batch.id) === highlightedId;
          return <article key={batch.id} className={`rounded-xl border p-4 ${highlighted ? "border-accent-border bg-accent-light shadow-[inset_3px_0_0_var(--color-accent)]" : "border-card-border bg-white"}`}><div className="mb-4 flex items-start justify-between gap-4"><span className="min-w-0 truncate font-mono text-[13px] font-medium" title={batch.fileName}>{batch.fileName}</span><time className="shrink-0 text-xs text-muted">{formatDateTime(batch.importedAt)}</time></div><BatchStats batch={batch} /></article>;
        })}</div>
      </>}
    </section>
  );
}
