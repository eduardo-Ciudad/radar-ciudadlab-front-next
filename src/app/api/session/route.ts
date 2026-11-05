import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_COOKIE, LoginResponse, ProblemDetail, ROLE_COOKIE } from "@/lib/session";
import { clearSession } from "@/lib/session-response";
import { backendFetch } from "@/lib/backend-fetch";

export async function POST(request: NextRequest) {
  let credentials: unknown;
  try {
    credentials = await request.json();
  } catch {
    return NextResponse.json({ title: "Requisição inválida", status: 400 }, { status: 400 });
  }

  try {
    const headers = new Headers({ "Content-Type": "application/json" });
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) headers.set("x-forwarded-for", forwardedFor);

    const backendResponse = await backendFetch("/api/auth/login", {
      method: "POST",
      headers,
      body: JSON.stringify(credentials),
      cache: "no-store",
    });

    if (!backendResponse.ok) {
      const problem = (await backendResponse.json().catch(() => ({}))) as ProblemDetail;
      return NextResponse.json(problem, { status: backendResponse.status });
    }

    const session = (await backendResponse.json()) as LoginResponse;
    const expires = new Date(session.expiresAt);
    if (Number.isNaN(expires.getTime())) {
      return NextResponse.json({ title: "Sessão inválida", status: 502 }, { status: 502 });
    }

    const response = NextResponse.json({ email: session.email, role: session.role });
    const secure = process.env.NODE_ENV === "production";
    response.cookies.set(ACCESS_COOKIE, session.accessToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      expires,
      path: "/",
    });
    response.cookies.set(ROLE_COOKIE, session.role, {
      httpOnly: false,
      secure,
      sameSite: "lax",
      expires,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json(
      { title: "Serviço indisponível", status: 503, detail: "Não foi possível acessar o Radar agora." },
      { status: 503 },
    );
  }
}

export async function DELETE() {
  const accessToken = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (accessToken) {
    try {
      await backendFetch("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
        signal: AbortSignal.timeout(5_000),
      });
    } catch {
      // A sessão local deve ser encerrada mesmo se o backend estiver indisponível.
    }
  }

  const response = NextResponse.json({ ok: true });
  clearSession(response);
  return response;
}

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  clearSession(response);
  return response;
}
