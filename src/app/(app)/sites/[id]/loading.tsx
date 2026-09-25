function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-black/[0.055] ${className}`} />;
}

export default function DashboardLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-4 py-5 sm:gap-6 sm:px-7 sm:py-8 lg:px-12 lg:py-10" aria-label="Carregando analytics">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><Skeleton className="h-4 w-36" /><Skeleton className="mt-3 h-12 w-72 max-w-full" /><Skeleton className="mt-3 h-6 w-48" /></div><Skeleton className="h-12 w-full sm:w-80" /></div>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <Skeleton key={index} className="h-32" />)}</div>
      <Skeleton className="h-[360px]" />
      <div className="grid gap-4 lg:grid-cols-[3fr_2fr]"><Skeleton className="h-80" /><Skeleton className="h-80" /></div>
      <div className="grid gap-4 lg:grid-cols-[3fr_2fr]"><Skeleton className="h-80" /><Skeleton className="h-80" /></div>
    </div>
  );
}
