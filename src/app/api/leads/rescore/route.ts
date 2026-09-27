import { proxyToBackend } from "@/lib/backend-proxy";
export async function POST() {
  return proxyToBackend("/api/leads/rescore", { method: "POST" });
}
