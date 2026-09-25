"use client";

import { ArrowRight, LoaderCircle } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
      });

      if (!response.ok) {
        setError(response.status === 401 ? "E-mail ou senha incorretos." : "Não foi possível entrar. Tente novamente.");
        return;
      }

      router.replace("/sites");
      router.refresh();
    } catch {
      setError("Não foi possível entrar. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[420px] rounded-2xl border border-card-border bg-card p-7 shadow-[0_8px_32px_rgba(0,0,0,0.06)] sm:p-10">
      <div>
        <h1 className="font-heading text-[38px] leading-[1.1] font-semibold tracking-tight">Entrar</h1>
        <p className="mt-1.5 text-sm text-muted">Use o e-mail cadastrado no Radar.</p>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <label htmlFor="email" className="text-[13px] font-semibold">E-mail</label>
        <input id="email" name="email" type="email" required autoComplete="email" placeholder="voce@ciudadlab.com.br" className="h-12 rounded-xl border border-black/14 bg-white px-4 text-[15px] outline-none transition-shadow focus:border-accent focus:ring-2 focus:ring-accent/15" />
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-[13px] font-semibold">Senha</label>
          <button type="button" onClick={() => setShowPassword((value) => !value)} className="focus-ring min-h-11 rounded-md px-1 text-[13px] font-semibold text-accent">
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        <input id="password" name="password" type={showPassword ? "text" : "password"} required autoComplete="current-password" className="h-12 rounded-xl border border-black/14 bg-white px-4 text-[15px] outline-none transition-shadow focus:border-accent focus:ring-2 focus:ring-accent/15" />
      </div>

      {error && <p role="alert" className="mt-4 text-[13px] font-medium text-down">{error}</p>}

      <button type="submit" disabled={loading} className="focus-ring mt-6 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-accent px-5 text-[15px] font-semibold text-white transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70">
        {loading ? <><LoaderCircle size={17} className="animate-spin" /> Entrando...</> : <>Entrar <ArrowRight size={17} /></>}
      </button>
      <p className="mt-5 text-[13px] leading-[1.55] text-muted">A sessão dura 12 horas. Contas de cliente (VIEWER) veem só os sites liberados para elas.</p>
    </form>
  );
}
