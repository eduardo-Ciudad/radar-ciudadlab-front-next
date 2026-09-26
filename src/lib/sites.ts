import "server-only";

import { cache } from "react";
import { apiFetch } from "@/lib/api";
import type { SiteOverview } from "@/types/dashboard";

export const getSites = cache(async () => apiFetch<SiteOverview[]>("/api/sites"));
