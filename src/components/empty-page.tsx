type Props = { eyebrow: string; title: string; description: string; badge?: string };

export function EmptyPage({ eyebrow, title, description, badge }: Props) {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-64px)] max-w-[1192px] flex-col px-5 py-8 sm:px-8 md:min-h-dvh md:px-12 md:py-10">
      <header>
        <p className="label">{eyebrow}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-[42px] leading-[1.05] font-semibold tracking-tight sm:text-[46px]">{title}</h1>
          {badge && <span className="rounded-full border border-accent-border bg-accent-light px-3 py-1 text-xs font-semibold text-accent">{badge}</span>}
        </div>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted">{description}</p>
      </header>
      <section className="mt-7 flex min-h-[360px] flex-1 items-center justify-center rounded-2xl border border-card-border bg-card px-6 text-center sm:px-10">
        <div className="max-w-md">
          <span className="label text-accent">{badge ?? "Radar"}</span>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight">{badge ? "Estamos preparando este espaço." : "Tudo pronto para os dados."}</h2>
          <p className="mt-3 text-sm leading-6 text-muted">{badge ? "O funil de prospecção entra na próxima fase do Radar CiudadLab." : "Esta página receberá os dados reais da API nas próximas etapas."}</p>
        </div>
      </section>
    </div>
  );
}
