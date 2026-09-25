import { proxySync } from "@/lib/sync-proxy";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxySync(`/api/sites/${encodeURIComponent(id)}/sync`);
}
