import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_COOKIE } from "@/lib/session";

const API_URL = (process.env.RADAR_API_URL ?? "http://localhost:8080").replace(/\/$/, "");

export async function POST(request: Request) {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) return NextResponse.json({ title: "Não autorizado", detail: "Sua sessão expirou." }, { status: 401 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ title: "Upload inválido", detail: "Não foi possível ler o arquivo enviado." }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_URL}/api/leads/import`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
      cache: "no-store",
    });
    const payload = await response.json().catch(() => ({}));
    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json({ title: "Serviço indisponível", detail: "Não foi possível falar com o Radar agora." }, { status: 503 });
  }
}
