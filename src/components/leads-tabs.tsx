"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const tabs = [{ label: "Funil", href: "/leads/funil" }, { label: "Importar", href: "/leads/importar" }];
export function LeadsTabs() { const pathname = usePathname(); return <nav aria-label="Seções de leads" className="mt-6 flex border-b border-divider">{tabs.map((tab) => { const active = pathname.startsWith(tab.href); return <Link key={tab.href} href={tab.href} aria-current={active ? "page" : undefined} className={`focus-ring flex min-h-11 items-center border-b-2 px-4 text-sm font-semibold ${active ? "border-accent text-primary" : "border-transparent text-muted hover:text-primary"}`}>{tab.label}</Link>; })}</nav>; }
