"use client";

import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { ReactNode, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ApiUser } from "@/lib/api-types";

const CURRENT_USER_KEY = "zed_auto_current_user";

type RoleGateProps = {
  allowedRoles: string[];
  children: (user: ApiUser) => ReactNode;
};

export function RoleGate({ allowedRoles, children }: RoleGateProps) {
  const userSnapshot = useSyncExternalStore(
    subscribeToAuthChanges,
    getAuthSnapshot,
    getServerSnapshot
  );
  const user = parseUserSnapshot(userSnapshot);

  if (!user) {
    return (
      <AccessCard
        description="กรุณาเข้าสู่ระบบก่อนเข้าใช้งานหน้านี้"
        href="/login"
        label="เข้าสู่ระบบ"
        title="ต้องเข้าสู่ระบบ"
      />
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <AccessCard
        description="บัญชีนี้ไม่มีสิทธิ์เข้าถึงหน้านี้ ระบบแยกสิทธิ์ระหว่างแอดมินและผู้ใช้ทั่วไป"
        href={user.role === "admin" ? "/admin" : "/account"}
        label="ไปหน้าของฉัน"
        title="ไม่มีสิทธิ์เข้าถึง"
      />
    );
  }

  return <>{children(user)}</>;
}

function subscribeToAuthChanges(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("zed-auto-auth", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("zed-auto-auth", onStoreChange);
  };
}

function getAuthSnapshot() {
  return window.localStorage.getItem(CURRENT_USER_KEY);
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

function AccessCard({
  description,
  href,
  label,
  title
}: {
  description: string;
  href: string;
  label: string;
  title: string;
}) {
  return (
    <section className="container py-12">
      <Card className="mx-auto max-w-xl bg-white">
        <CardHeader>
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-7 text-muted-foreground">{description}</p>
          <Button asChild className="mt-5" variant="premium">
            <Link href={href}>{label}</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
