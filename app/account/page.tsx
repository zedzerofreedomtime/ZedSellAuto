"use client";

import { Heart, ListChecks, type LucideIcon, WalletCards } from "lucide-react";

import { RoleGate } from "@/components/auth/role-gate";
import { SiteHeader } from "@/components/layout/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf8f3_0%,#f8fafc_45%,#ffffff_100%)]">
      <SiteHeader backHref="/" backLabel="กลับหน้าแรก" />
      <RoleGate allowedRoles={["user"]}>
        {(user) => (
          <section className="container py-8 lg:py-12">
            <div className="mb-6">
              <p className="text-sm font-semibold text-emerald-700">User dashboard</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-normal text-zinc-950">
                บัญชีของ {user.fullName}
              </h1>
              <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
                พื้นที่สำหรับติดตามรถที่สนใจ นัดทดลองขับ และคำขอไฟแนนซ์ของคุณ
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <DashboardCard icon={Heart} label="รถที่สนใจ" value="0 คัน" />
              <DashboardCard icon={ListChecks} label="นัดหมาย" value="0 รายการ" />
              <DashboardCard icon={WalletCards} label="คำขอไฟแนนซ์" value="0 รายการ" />
            </div>
          </section>
        )}
      </RoleGate>
    </main>
  );
}

function DashboardCard({
  icon: Icon,
  label,
  value
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
          <Icon className="h-5 w-5" />
        </div>
        <CardTitle className="pt-3 text-xl">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold text-zinc-950">{value}</p>
      </CardContent>
    </Card>
  );
}
