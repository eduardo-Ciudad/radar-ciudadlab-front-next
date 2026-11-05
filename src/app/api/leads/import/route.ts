import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_COOKIE } from "@/lib/session";
import { unauthorizedResponse } from "@/lib/session-response";
import { backendFetch } from "@/lib/backend-fetch";

export async function POST(request: Request) {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) return unauthorizedResponse();

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ title: "Upload inválido", detail: "Não foi possível ler o arquivo enviado." }, { status: 400 });
  }

  try {
    const response = await backendFetch("/api/leads/import", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
      cache: "no-store",
    });
    if (response.status === 401) return unauthorizedResponse();
    const payload = await response.json().catch(() => ({}));
    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json({ title: "Serviço indisponível", detail: "Não foi possível falar com o Radar agora." }, { status: 503 });
  }
}
