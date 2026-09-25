export const sites = [
  // TODO: substituir este catálogo pelo GET /api/sites quando o endpoint existir.
  {
    id: 4,
    name: "CiudadLab",
    domain: "ciudadlab.com.br",
    tipo: "próprio",
  },
] as const satisfies ReadonlyArray<{
  id: number;
  name: string;
  domain: string;
  tipo: "próprio" | "cliente";
}>;

export type Site = (typeof sites)[number];
