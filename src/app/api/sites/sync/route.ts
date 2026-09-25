import { proxySync } from "@/lib/sync-proxy";

export async function POST() {
  return proxySync("/api/sites/sync");
}
