"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

type ErrorStateProps = {
  reset: () => void;
};

export function ErrorState({ reset }: ErrorStateProps) {
  const router = useRouter();

  function tryAgain() {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

  return (
    <div className="flex min-h-[calc(100dvh-64px)] items-center justify-center px-5 py-10 md:min-h-dvh md:px-12">
      <section className="w-full max-w-xl rounded-2xl border border-card-border bg-card px-7 py-10 text-center shadow-[0_8px_32px_rgba(0,0,0,0.04)] sm:px-12">
        <span className="label text-accent">Conexão interrompida</span>
        <h1 className="mt-3 font-heading text-4xl leading-tight font-semibold tracking-tight">
          Não foi possível falar com o Radar agora
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
          Pode ser uma instabilidade passageira. Tente novamente em alguns instantes.
        </p>
        <button
          type="button"
          onClick={tryAgain}
          className="focus-ring mx-auto mt-7 flex min-h-11 items-center justify-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-white transition hover:brightness-110"
        >
          <RefreshCw size={16} strokeWidth={1.8} />
          Tentar de novo
        </button>
      </section>
    </div>
  );
}
