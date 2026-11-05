import "server-only";

import { NextResponse } from "next/server";
import { ACCESS_COOKIE, ROLE_COOKIE } from "@/lib/session";

export function clearSession(response: NextResponse) {
  const secure = process.env.NODE_ENV === "production";

  response.cookies.set(ACCESS_COOKIE, "", {
    httpOnly: true,
    secure,
    sameSite: "lax",
    expires: new Date(0),
    path: "/",
  });
  response.cookies.set(ROLE_COOKIE, "", {
    httpOnly: false,
    secure,
    sameSite: "lax",
    expires: new Date(0),
    path: "/",
  });
}

export function unauthorizedResponse() {
  const response = NextResponse.json(
    { title: "Não autorizado", detail: "Sua sessão expirou." },
    { status: 401 },
  );
  clearSession(response);
  return response;
}
