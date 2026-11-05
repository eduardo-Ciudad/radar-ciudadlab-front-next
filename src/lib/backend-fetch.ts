import "server-only";

const DEFAULT_API_URL = "http://localhost:8080";

export function backendFetch(path: string, init: RequestInit = {}) {
  const apiUrl = (process.env.RADAR_API_URL ?? DEFAULT_API_URL).replace(/\/$/, "");
  const clientKey = process.env.RADAR_CLIENT_KEY?.trim();

  if (process.env.NODE_ENV === "production") {
    if (!clientKey) {
      throw new Error("RADAR_CLIENT_KEY deve estar configurada no ambiente de produção.");
    }
    if (!apiUrl.startsWith("https://")) {
      throw new Error("RADAR_API_URL deve usar HTTPS no ambiente de produção.");
    }
  }

  const headers = new Headers(init.headers);
  if (clientKey) headers.set("X-Radar-Client-Key", clientKey);

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return fetch(`${apiUrl}${normalizedPath}`, {
    ...init,
    headers,
    cache: init.cache ?? "no-store",
  });
}
