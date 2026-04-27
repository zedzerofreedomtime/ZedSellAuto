"use client";

import { useSyncExternalStore } from "react";

import {
  AUTH_STORAGE_EVENT,
  CURRENT_USER_STORAGE_KEY
} from "@/lib/auth-storage";
import type { ApiUser } from "@/lib/api-types";

export function useCurrentUser() {
  const userSnapshot = useSyncExternalStore(
    subscribeToAuthChanges,
    getAuthSnapshot,
    getServerSnapshot
  );

  return parseUserSnapshot(userSnapshot);
}

function subscribeToAuthChanges(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(AUTH_STORAGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(AUTH_STORAGE_EVENT, onStoreChange);
  };
}

function getAuthSnapshot() {
  return window.localStorage.getItem(CURRENT_USER_STORAGE_KEY);
}

function getServerSnapshot() {
  return null;
}

function parseUserSnapshot(snapshot: string | null) {
  if (!snapshot) {
    return null;
  }

  try {
    return JSON.parse(snapshot) as ApiUser;
  } catch {
    return null;
  }
}
