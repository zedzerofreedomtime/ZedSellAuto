export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.API_BASE_URL ??
  "http://localhost:18081/api/v1";

export function buildApiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}
