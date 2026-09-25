import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_COOKIE } from "@/lib/session";
import type { ProblemDetail } from "@/lib/session";

const API_URL = (process.env.RADAR_API_URL ?? "http://localhost:8080").replace(/\/$/, "");

export class ApiError extends Error {
  readonly status: number;
  readonly title: string;
  readonly detail?: string;

  constructor(status: number, title: string, detail?: string) {
    super(detail ?? title);
    this.name = "ApiError";
    this.status = status;
    this.title = title;
    this.detail = detail;
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE)?.value;

  if (!token) redirect("/login");

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_URL}${path.startsWith("/") ? path : `/${path}`}`, {
    ...init,
    headers,
    cache: init.cache ?? "no-store",
  });

  if (response.status === 401) redirect("/api/session?expired=1");
  if (!response.ok) {
    const problem = (await response.json().catch(() => ({}))) as ProblemDetail;
    throw new ApiError(
      response.status,
      problem.title ?? response.statusText ?? "Erro na API",
      problem.detail,
    );
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
