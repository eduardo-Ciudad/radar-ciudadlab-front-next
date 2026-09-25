import { NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE, LoginResponse, ProblemDetail, ROLE_COOKIE } from "@/lib/session";

const API_URL = (process.env.RADAR_API_URL ?? "http://localhost:8080").replace(/\/$/, "");

function clearSession(response: NextResponse) {
  response.cookies.set(ACCESS_COOKIE, "", { httpOnly: true, expires: new Date(0), path: "/" });
  response.cookies.set(ROLE_COOKIE, "", { expires: new Date(0), path: "/" });
}

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

    const backendResponse = await fetch(`${API_URL}/api/auth/login`, {
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
  const response = NextResponse.json({ ok: true });
  clearSession(response);
  return response;
}

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  clearSession(response);
  return response;
}
