"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  siteId?: number;
  label?: string;
};

type SyncPayload = {
  siteName?: string;
  success?: boolean;
  error?: string | null;
  detail?: string;
  title?: string;
};

export function SyncButton({ siteId, label = "Sincronizar" }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sync() {
    setLoading(true);
    setError(null);
    try {
      const path = siteId ? `/api/sites/${siteId}/sync` : "/api/sites/sync";
      const response = await fetch(path, { method: "POST" });
      const payload = (await response.json().catch(() => ({}))) as SyncPayload | SyncPayload[];
      if (Array.isArray(payload)) {
        const failed = payload.filter((item) => item.success === false);
        if (failed.length > 0) {
          const details = failed.map((item) => `${item.siteName ?? "Site"} (${item.error || "erro desconhecido"})`).join("; ");
          setError(`${failed.length} de ${payload.length} sites falharam: ${details}`);
        } else if (!response.ok) {
          setError("Não foi possível sincronizar os sites.");
        }
        router.refresh();
        return;
      }
      if (!response.ok || payload.success === false) {
        setError(payload.error || payload.detail || payload.title || "Não foi possível sincronizar.");
        return;
      }
      router.refresh();
    } catch {
      setError("Não foi possível falar com o Radar agora.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-w-0 flex-col items-end gap-1.5">
      <button
        type="button"
        onClick={sync}
        disabled={loading}
        className="focus-ring flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-black/14 bg-white px-5 text-sm font-semibold transition hover:brightness-[0.98] disabled:cursor-wait disabled:opacity-60"
      >
        <RefreshCw size={16} strokeWidth={1.8} className={loading ? "animate-spin" : ""} />
        {loading ? "Sincronizando..." : label}
      </button>
      {error && <p role="alert" className="max-w-72 text-right text-xs leading-4 text-down">{error}</p>}
    </div>
  );
}
