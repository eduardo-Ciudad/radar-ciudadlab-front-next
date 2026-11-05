import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_COOKIE } from "@/lib/session";
import { unauthorizedResponse } from "@/lib/session-response";

const API_URL = (process.env.RADAR_API_URL ?? "http://localhost:8080").replace(/\/$/, "");

export async function proxyToBackend(path: string, init: RequestInit = {}) {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) return unauthorizedResponse();
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  try {
    const response = await fetch(`${API_URL}${path.startsWith("/") ? path : `/${path}`}`, { ...init, headers, cache: "no-store" });
    if (response.status === 401) return unauthorizedResponse();
    if (response.status === 204) return new NextResponse(null, { status: 204 });
    const payload = await response.json().catch(() => ({}));
    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json({ title: "Serviço indisponível", detail: "Não foi possível falar com o Radar agora." }, { status: 503 });
  }
}
