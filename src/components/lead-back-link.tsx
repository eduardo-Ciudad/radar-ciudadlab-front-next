"use client";
import { useRouter } from "next/navigation";
export function LeadBackLink() { const router = useRouter(); return <button type="button" onClick={() => { if (window.history.length > 1) router.back(); else router.push("/leads/funil"); }} className="focus-ring inline-flex min-h-11 items-center rounded-lg text-sm font-semibold text-accent">← Voltar ao funil</button>; }
