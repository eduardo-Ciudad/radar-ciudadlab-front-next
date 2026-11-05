import "server-only";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_COOKIE } from "@/lib/session";
import { unauthorizedResponse } from "@/lib/session-response";

const API_URL = (process.env.RADAR_API_URL ?? "http://localhost:8080").replace(/\/$/, "");

export async function proxySync(path: string) {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) return unauthorizedResponse();

  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (response.status === 401) return unauthorizedResponse();
    const payload = await response.json().catch(() => ({}));

    if (response.status === 403) {
      return NextResponse.json(
        { title: "Acesso negado", detail: "Apenas administradores podem sincronizar" },
        { status: 403 },
      );
    }

    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(
      { title: "Serviço indisponível", detail: "Não foi possível falar com o Radar agora." },
      { status: 503 },
    );
  }
}
