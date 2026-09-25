import { AppShell } from "@/components/app-shell";
import { apiFetch } from "@/lib/api";
import type { SessionUser } from "@/lib/session";

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const user = await apiFetch<SessionUser>("/api/auth/me");
  const role = user.roles.includes("ADMIN") ? "ADMIN" : "VIEWER";
  return <AppShell email={user.email} role={role}>{children}</AppShell>;
}
