"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildApiUrl } from "@/lib/api-config";
import {
  getAuthDestination,
  loginLocalUser,
  registerLocalUser,
  storeAuthSession
} from "@/lib/auth-storage";
import type { ApiAuthResponse } from "@/lib/api-types";

type AuthFormProps = {
  audience?: "admin" | "any" | "user";
  mode: "login" | "signup";
  passwordLabel: string;
  submitLabel: string;
};

class ApiUnavailableError extends Error {}

export function AuthForm({
  audience = "any",
  mode,
  passwordLabel,
  submitLabel
}: AuthFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignup = mode === "signup";
  const endpoint = useMemo(
    () => (isSignup ? "/auth/signup" : "/auth/login"),
    [isSignup]
  );

  async function submitToApi() {
    let response: Response;

    try {
      response = await fetch(buildApiUrl(endpoint), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          email,
          password,
          fullName
        })
      });
    } catch {
      throw new ApiUnavailableError("ไม่สามารถเชื่อมต่อ API ได้");
    }

    const payload = (await response.json().catch(() => null)) as (ApiAuthResponse & {
      error?: string;
    }) | null;

    if (!response.ok) {
      throw new Error(payload?.error || "ไม่สามารถดำเนินการได้ในตอนนี้");
    }

    if (!payload) {
      throw new Error("รูปแบบข้อมูลตอบกลับไม่ถูกต้อง");
    }

    if (audience === "admin" && payload.user.role !== "admin") {
      throw new Error("บัญชีนี้ไม่มีสิทธิ์เข้าสู่ระบบแอดมิน");
    }

    if (audience === "user" && payload.user.role === "admin") {
      throw new Error("บัญชีแอดมินต้องเข้าใช้งานผ่านหน้าแอดมิน");
    }

    return payload;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      let payload: ApiAuthResponse;
      let usedLocalFallback = false;

      try {
        payload = await submitToApi();
      } catch (error) {
        if (!(error instanceof ApiUnavailableError)) {
          throw error;
        }

        usedLocalFallback = true;
        payload = isSignup
          ? registerLocalUser({
              email,
              fullName,
              password
            })
          : loginLocalUser({
              audience,
              email,
              password
            });
      }

      if (rememberMe) {
        storeAuthSession(payload.accessToken, payload.user);
      }

      setSuccessMessage(
        isSignup
          ? usedLocalFallback
            ? "สมัครสมาชิกสำเร็จแล้วในโหมดใช้งานบนเครื่อง"
            : "สมัครสมาชิกสำเร็จแล้ว"
          : usedLocalFallback
            ? "เข้าสู่ระบบสำเร็จแล้วในโหมดใช้งานบนเครื่อง"
            : "เข้าสู่ระบบสำเร็จแล้ว"
      );

      router.push(getAuthDestination(payload.user));
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการเข้าสู่ระบบ"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {isSignup ? (
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700" htmlFor="fullName">
            ชื่อ - นามสกุล
          </label>
          <Input
            id="fullName"
            onChange={(event) => setFullName(event.target.value)}
            placeholder="ชื่อของคุณ"
            type="text"
            value={fullName}
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700" htmlFor="email">
          อีเมล
        </label>
        <Input
          id="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          type="email"
          value={email}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-medium text-zinc-700" htmlFor="password">
            {passwordLabel}
          </label>
          {!isSignup ? (
            <span className="text-sm font-medium text-emerald-700">
              ลืมรหัสผ่าน?
            </span>
          ) : null}
        </div>
        <Input
          id="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="อย่างน้อย 8 ตัวอักษร"
          type="password"
          value={password}
        />
      </div>

      <label className="flex items-center gap-3 rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-700">
        <input
          checked={rememberMe}
          className="h-4 w-4 accent-emerald-600"
          onChange={(event) => setRememberMe(event.target.checked)}
          type="checkbox"
        />
        จดจำการเข้าสู่ระบบบนอุปกรณ์นี้
      </label>

      {errorMessage ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      {successMessage ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {successMessage}
        </p>
      ) : null}

      <Button
        className="h-12 w-full text-base"
        disabled={isSubmitting}
        type="submit"
        variant="premium"
      >
        {isSubmitting ? "กำลังดำเนินการ..." : submitLabel}
      </Button>

      {mode === "login" ? (
        <div className="grid gap-3">
          <Button className="w-full" type="button" variant="outline">
            เข้าสู่ระบบด้วย Google
          </Button>
        </div>
      ) : null}
    </form>
  );
}
