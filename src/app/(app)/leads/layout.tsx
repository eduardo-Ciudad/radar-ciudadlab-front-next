import { redirect } from "next/navigation";
import { LeadsTabs } from "@/components/leads-tabs";
import { getUserRole } from "@/lib/auth";
export default async function LeadsLayout({ children }: { children: React.ReactNode }) { if (await getUserRole() !== "ADMIN") redirect("/sites"); return <div className="mx-auto flex w-full max-w-[1440px] min-w-0 flex-col px-4 py-5 sm:px-7 sm:py-8 lg:px-10 lg:py-10"><header><p className="label">Prospecção</p><h1 className="mt-2 font-heading text-[42px] leading-none font-semibold tracking-tight sm:text-[50px]">Leads</h1><LeadsTabs /></header><div className="min-w-0 pt-6">{children}</div></div>; }
