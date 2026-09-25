import type { Metadata } from "next";
import { EmptyPage } from "@/components/empty-page";

export const metadata: Metadata = { title: "Leads" };

export default function LeadsPage() {
  return <EmptyPage eyebrow="Prospecção · CiudadLab" title="Funil de leads" description="Organize oportunidades e acompanhe cada conversa do primeiro contato ao fechamento." badge="Em breve" />;
}
