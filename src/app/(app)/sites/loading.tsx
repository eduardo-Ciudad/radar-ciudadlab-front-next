import { sites } from "@/data/sites";

export default function SitesLoading() {
  return <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-5 sm:px-7 sm:py-8 lg:px-12 lg:py-10" aria-label="Carregando sites"><div className="h-24 animate-pulse rounded-2xl bg-black/[0.055]" /><div className="grid gap-3 sm:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-32 animate-pulse rounded-2xl bg-black/[0.055]" />)}</div><div className="grid gap-4 xl:grid-cols-2">{sites.map((site) => <div key={site.id} className="h-64 animate-pulse rounded-2xl bg-black/[0.055]" />)}</div></div>;
}
