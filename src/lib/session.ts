export const ACCESS_COOKIE = "radar_access_token";
export const ROLE_COOKIE = "radar_role";

export type UserRole = "ADMIN" | "VIEWER";

export type SessionUser = {
  email: string;
  roles: string[];
  expiresAt: string;
};

export type LoginResponse = {
  accessToken: string;
  tokenType: string;
  expiresAt: string;
  email: string;
  role: UserRole;
};

export type ProblemDetail = {
  title?: string;
  status?: number;
  detail?: string;
};
