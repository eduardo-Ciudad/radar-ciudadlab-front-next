import { proxyToBackend } from "@/lib/backend-proxy";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyToBackend(`/api/leads/${encodeURIComponent(id)}`, { method: "PATCH", body: await request.text() });
}
