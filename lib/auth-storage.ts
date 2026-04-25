import type { ApiAuthResponse, ApiUser } from "@/lib/api-types";

const ACCESS_TOKEN_KEY = "zed_auto_access_token";
const CURRENT_USER_KEY = "zed_auto_current_user";
const LOCAL_USERS_KEY = "zed_auto_local_users";

type AuthAudience = "admin" | "any" | "user";

type StoredLocalUser = ApiUser & {
  password: string;
};

const defaultAdminUser: StoredLocalUser = {
  id: "local-admin",
  email: "admin@zedauto.local",
  fullName: "Zed Auto Admin",
  role: "admin",
  createdAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
  password: "admin12345"
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getStoredLocalUsers() {
  if (typeof window === "undefined") {
    return [] as StoredLocalUser[];
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_USERS_KEY);
    if (!raw) {
      return [] as StoredLocalUser[];
    }

    return JSON.parse(raw) as StoredLocalUser[];
  } catch {
    return [] as StoredLocalUser[];
  }
}

function storeLocalUsers(users: StoredLocalUser[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

function ensureDefaultAdminUser() {
  const users = getStoredLocalUsers();
  const alreadyExists = users.some(
    (user) => normalizeEmail(user.email) === defaultAdminUser.email
  );

  if (alreadyExists) {
    return users;
  }

  const nextUsers = [...users, defaultAdminUser];
  storeLocalUsers(nextUsers);
  return nextUsers;
}

function sanitizeUser(user: StoredLocalUser): ApiUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    createdAt: user.createdAt
  };
}

function assertAudience(user: ApiUser, audience: AuthAudience) {
  if (audience === "any") {
    return;
  }

  if (audience === "admin" && user.role !== "admin") {
    throw new Error("บัญชีนี้ไม่มีสิทธิ์เข้าสู่ระบบแอดมิน");
  }

  if (audience === "user" && user.role === "admin") {
    throw new Error("บัญชีแอดมินต้องเข้าใช้งานผ่านหน้าแอดมิน");
  }
}

export function getStoredAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredCurrentUser() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(CURRENT_USER_KEY);
    return raw ? (JSON.parse(raw) as ApiUser) : null;
  } catch {
    return null;
  }
}

export function getAuthDestination(user: ApiUser) {
  return user.role === "admin" ? "/admin" : "/account";
}

export function storeAuthSession(accessToken: string, user: unknown) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("zed-auto-auth"));
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(CURRENT_USER_KEY);
  window.dispatchEvent(new Event("zed-auto-auth"));
}

export function registerLocalUser(input: {
  email: string;
  fullName: string;
  password: string;
}): ApiAuthResponse {
  const email = normalizeEmail(input.email);
  const fullName = input.fullName.trim();
  const password = input.password;
  const users = ensureDefaultAdminUser();

  if (!fullName) {
    throw new Error("กรุณากรอกชื่อและนามสกุล");
  }

  if (password.length < 8) {
    throw new Error("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
  }

  const existingUser = users.find((user) => normalizeEmail(user.email) === email);

  if (existingUser) {
    throw new Error("อีเมลนี้ถูกใช้งานแล้ว");
  }

  const user: StoredLocalUser = {
    id: crypto.randomUUID(),
    email,
    fullName,
    role: "user",
    createdAt: new Date().toISOString(),
    password
  };

  storeLocalUsers([...users, user]);

  return {
    accessToken: `local-${user.id}`,
    user: sanitizeUser(user)
  };
}

export function loginLocalUser(input: {
  audience?: AuthAudience;
  email: string;
  password: string;
}): ApiAuthResponse {
  const email = normalizeEmail(input.email);
  const password = input.password;
  const users = ensureDefaultAdminUser();
  const matchedUser = users.find((user) => normalizeEmail(user.email) === email);

  if (!matchedUser) {
    throw new Error("ไม่พบบัญชีนี้ กรุณาตรวจสอบอีเมลอีกครั้ง");
  }

  if (matchedUser.password !== password) {
    throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
  }

  const user = sanitizeUser(matchedUser);
  assertAudience(user, input.audience ?? "any");

  return {
    accessToken: `local-${user.id}`,
    user
  };
}

export function getDefaultAdminCredentials() {
  return {
    email: defaultAdminUser.email,
    password: defaultAdminUser.password
  };
}
