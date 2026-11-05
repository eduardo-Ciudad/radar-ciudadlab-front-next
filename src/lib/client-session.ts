export function redirectIfUnauthorized(response: Response) {
  if (response.status !== 401) return false;

  // Full reload discards authenticated React Server Component state.
  window.location.assign("/login");
  return true;
}
