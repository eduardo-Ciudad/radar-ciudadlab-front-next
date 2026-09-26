import { AppShell } from "@/components/app-shell";
import { apiFetch } from "@/lib/api";
import { getSites } from "@/lib/sites";
import type { SessionUser } from "@/lib/session";

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const [user, sites] = await Promise.all([
    apiFetch<SessionUser>("/api/auth/me"),
    getSites(),
  ]);
  const role = user.roles.includes("ADMIN") ? "ADMIN" : "VIEWER";
  return <AppShell email={user.email} role={role} sites={sites}>{children}</AppShell>;
}
