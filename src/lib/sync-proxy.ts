import "server-only";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_COOKIE } from "@/lib/session";

const API_URL = (process.env.RADAR_API_URL ?? "http://localhost:8080").replace(/\/$/, "");

export async function proxySync(path: string) {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) return NextResponse.json({ detail: "Sessão expirada." }, { status: 401 });

  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
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
