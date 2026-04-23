"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { setStoredAccessToken } from "@/lib/auth-storage";
import { loginUser, signupUser } from "@/lib/client-api";

type AuthShellProps = {
  alternateHref: string;
  alternateLabel: string;
  alternateText: string;
  description: string;
  footerText: string;
  mode: "login" | "signup";
  passwordLabel: string;
  submitLabel: string;
  title: string;
};

const highlights = [
  "บันทึกรถที่สนใจและเปรียบเทียบได้ภายหลัง",
  "ติดตามสถานะการจอง ทดลองขับ และไฟแนนซ์ในที่เดียว",
  "รับข้อเสนอพิเศษสำหรับรถที่คุณสนใจ"
];

export function AuthShell({
  alternateHref,
  alternateLabel,
  alternateText,
  description,
  footerText,
  mode,
  passwordLabel,
  submitLabel,
  title
}: AuthShellProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");

    startTransition(async () => {
      try {
        const response =
          mode === "signup"
            ? await signupUser({ email, fullName, password })
            : await loginUser({ email, password });

        setStoredAccessToken(response.accessToken);
        setStatus("เชื่อมบัญชีเรียบร้อย กำลังพาไปหน้ารายการรถ...");
        router.push("/cars/all");
      } catch (submissionError) {
        setError(
          submissionError instanceof Error
            ? submissionError.message
            : "ไม่สามารถเชื่อมต่อ API ได้"
        );
      }
    });
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf8f3_0%,#f7f8fa_48%,#ffffff_100%)]">
      <SiteHeader backHref="/" backLabel="กลับหน้าแรก" />

      <section className="container grid gap-8 py-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.82fr)] lg:py-12">
        <div className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-white p-6 shadow-line sm:p-8">
          <div>
            <Badge variant="success">Account</Badge>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-normal text-zinc-950 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
              {description}
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {highlights.map((item) => (
              <div
                className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription>{footerText}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {mode === "signup" ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700" htmlFor="fullName">
                    ชื่อ - นามสกุล
                  </label>
                  <Input
                    id="fullName"
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="ชื่อจริง นามสกุล"
                    required
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
                  required
                  type="email"
                  value={email}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm font-medium text-zinc-700" htmlFor="password">
                    {passwordLabel}
                  </label>
                  <Link className="text-sm font-medium text-emerald-700 hover:text-emerald-800" href="#">
                    ลืมรหัสผ่าน?
                  </Link>
                </div>
                <Input
                  id="password"
                  minLength={8}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  required
                  type="password"
                  value={password}
                />
              </div>

              <label className="flex items-center gap-3 rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-700">
                <input className="h-4 w-4 accent-emerald-600" type="checkbox" />
                จดจำการเข้าสู่ระบบบนอุปกรณ์นี้
              </label>

              <Button className="h-12 w-full text-base" disabled={isPending} type="submit" variant="premium">
                {isPending ? "กำลังเชื่อมต่อ..." : submitLabel}
              </Button>
            </form>

            <div className="grid gap-3">
              <Button className="w-full" variant="outline">
                เข้าสู่ระบบด้วย Google
              </Button>
            </div>

            {status ? <p className="text-sm text-emerald-700">{status}</p> : null}
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}

            <p className="pt-2 text-center text-sm text-zinc-600">
              {alternateText}{" "}
              <Link className="font-semibold text-emerald-700 hover:text-emerald-800" href={alternateHref}>
                {alternateLabel}
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

