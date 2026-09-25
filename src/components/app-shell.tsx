"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BarChart3, LogOut, Menu, Settings2, UsersRound, X, AppWindow } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Brand } from "@/components/brand";
import { sites } from "@/data/sites";

type Props = { children: React.ReactNode; email: string; role: string };

const links = [
  { label: "Sites", href: "/sites", icon: AppWindow },
  { label: "Analytics", href: `/sites/${sites[0].id}`, icon: BarChart3 },
  { label: "Leads", href: "/leads", icon: UsersRound, badge: "em breve" },
];

function Sidebar({ email, role, onNavigate }: Omit<Props, "children"> & { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    try { await fetch("/api/session", { method: "DELETE" }); } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <aside className="flex h-full w-[248px] shrink-0 flex-col border-r border-divider bg-surface px-5 py-8">
      <div className="px-3"><Brand /></div>
      <nav aria-label="Principal" className="mt-9 flex flex-col gap-1">
        {links.map(({ label, href, icon: Icon, badge }) => {
          const active = label === "Sites"
            ? pathname === "/sites"
            : label === "Analytics"
              ? /^\/sites\/[^/]+\/?$/.test(pathname)
              : pathname.startsWith(href);
          return <Link key={label} href={href} onClick={onNavigate} aria-current={active ? "page" : undefined} className={`focus-ring flex min-h-11 items-center gap-3 rounded-[10px] px-3 text-sm transition ${active ? "border border-card-border bg-white font-semibold text-primary" : "font-medium text-[#5a5a5a] hover:bg-black/[0.025]"}`}><Icon size={18} strokeWidth={1.7} className={active ? "text-accent" : ""} /><span>{label}</span>{badge && <span className="ml-auto rounded-full bg-black/[0.06] px-2 py-0.5 text-[11px] font-semibold">{badge}</span>}</Link>;
        })}
        <span aria-disabled="true" className="flex min-h-11 cursor-not-allowed items-center gap-3 rounded-[10px] px-3 text-sm font-medium text-[#5a5a5a]/45"><Settings2 size={18} strokeWidth={1.7} />Usuários</span>
      </nav>
      <div className="mt-auto border-t border-divider px-3 pt-3.5">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-[13px] font-semibold text-surface">{email.charAt(0).toUpperCase()}</span>
          <span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-semibold" title={email}>{email}</span><span className="block text-[11px] text-muted">{role}</span></span>
          <button onClick={logout} disabled={loggingOut} aria-label="Sair" title="Sair" className="focus-ring flex size-11 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-white hover:text-primary disabled:opacity-50"><LogOut size={17} /></button>
        </div>
      </div>
    </aside>
  );
}

export function AppShell({ children, email, role }: Props) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  return (
    <div className="min-h-dvh md:flex">
      <div className="fixed inset-y-0 left-0 z-20 hidden md:block"><Sidebar email={email} role={role} /></div>
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-divider bg-surface/95 px-5 backdrop-blur md:hidden"><Brand /><button onClick={() => setOpen(true)} aria-label="Abrir menu" className="focus-ring flex size-11 items-center justify-center rounded-full border border-black/14 bg-white"><Menu size={20} /></button></header>
      <AnimatePresence>
        {open && <><motion.button aria-label="Fechar menu" className="fixed inset-0 z-30 bg-black/25 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }} onClick={() => setOpen(false)} /><motion.div className="fixed inset-y-0 left-0 z-40 md:hidden" initial={{ x: reduceMotion ? 0 : -248 }} animate={{ x: 0 }} exit={{ x: reduceMotion ? 0 : -248 }} transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}><Sidebar email={email} role={role} onNavigate={() => setOpen(false)} /><button onClick={() => setOpen(false)} aria-label="Fechar menu" className="absolute top-5 right-[-52px] flex size-11 items-center justify-center rounded-full bg-white text-primary shadow-sm"><X size={20} /></button></motion.div></>}
      </AnimatePresence>
      <main className="min-w-0 flex-1 md:ml-[248px]">{children}</main>
    </div>
  );
}
