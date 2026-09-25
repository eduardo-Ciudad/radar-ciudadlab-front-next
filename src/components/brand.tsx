import Link from "next/link";

export function Brand({ linked = true }: { linked?: boolean }) {
  const content = (
    <span className="flex items-baseline gap-2.5 whitespace-nowrap">
      <span className="font-heading text-[26px] leading-none font-bold tracking-tight">
        Ciudad<span className="text-accent">Lab</span>
      </span>
      <span className="label">Radar</span>
    </span>
  );

  return linked ? (
    <Link href="/sites" className="focus-ring rounded-md" aria-label="Radar CiudadLab — início">
      {content}
    </Link>
  ) : content;
}
