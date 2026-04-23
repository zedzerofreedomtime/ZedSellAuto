const ACCESS_TOKEN_KEY = "zed_auto_access_token";

export function getStoredAccessToken() {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    return window.localStorage.getItem(ACCESS_TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setStoredAccessToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch {}
}

export function clearStoredAccessToken() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {}
}

