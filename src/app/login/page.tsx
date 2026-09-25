import type { Metadata } from "next";
import { Brand } from "@/components/brand";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <section className="hidden border-r border-divider px-10 py-10 lg:flex lg:flex-col lg:justify-between xl:px-[72px] xl:py-14">
        <Brand linked={false} />
        <div className="flex flex-col gap-7">
          <h1 className="max-w-[560px] font-heading text-5xl leading-[1.05] font-semibold tracking-tight xl:text-6xl">
            Seus sites e seus leads, <span className="text-accent">lidos num só lugar.</span>
          </h1>
          <p className="max-w-[470px] text-[17px] leading-[1.6] text-[#4a4a4a]">Google Analytics dos sites próprios e de clientes, resumido em números que dá pra agir — e o funil de prospecção logo ao lado.</p>
          <div className="w-[400px] rotate-1 overflow-hidden rounded-xl border border-card-border shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-2 bg-[#161B22] px-4 py-3">
              <i className="size-3 rounded-full bg-[#FF5F56]" /><i className="size-3 rounded-full bg-[#FFBD2E]" /><i className="size-3 rounded-full bg-[#27C93F]" />
              <span className="ml-2.5 font-mono text-xs text-[#8B949E]">radar — status</span>
            </div>
            <div className="flex flex-col gap-3 bg-[#0D1117] px-7 py-6 font-mono text-[13px]">
              {[['google analytics', 'conectado'], ['sync diário', '06:00'], ['sessão', 'JWT · 12h']].map(([label, value]) => <div key={label} className="flex justify-between"><span className="text-[#8B949E]">{label}</span><span className="font-semibold text-[#4ADE80]">{value}</span></div>)}
              <div className="my-1.5 h-px bg-[#8B949E]/25" />
              <div className="text-[#4ADE80]">█ aguardando login</div>
            </div>
          </div>
        </div>
        <p className="text-[13px] text-muted">© 2026 CiudadLab · Da ideia ao ar.</p>
      </section>
      <section className="flex min-h-dvh flex-col items-center justify-center px-5 py-8 sm:px-12">
        <div className="mb-10 lg:hidden"><Brand linked={false} /></div>
        <LoginForm />
        <p className="mt-8 text-xs text-muted lg:hidden">© 2026 CiudadLab · Da ideia ao ar.</p>
      </section>
    </main>
  );
}
