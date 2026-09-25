import "server-only";

import { cookies } from "next/headers";
import { ROLE_COOKIE, type UserRole } from "@/lib/session";

export async function getUserRole(): Promise<UserRole> {
  return (await cookies()).get(ROLE_COOKIE)?.value === "ADMIN" ? "ADMIN" : "VIEWER";
}
