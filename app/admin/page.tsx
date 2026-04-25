"use client";

import {
  ClipboardList,
  Gauge,
  ShieldCheck,
  type LucideIcon,
  UsersRound
} from "lucide-react";

import { RoleGate } from "@/components/auth/role-gate";
import { SiteHeader } from "@/components/layout/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf8f3_0%,#f8fafc_45%,#ffffff_100%)]">
      <SiteHeader backHref="/" backLabel="กลับหน้าแรก" />
      <RoleGate allowedRoles={["admin"]}>
        {(user) => (
          <section className="container py-8 lg:py-12">
            <div className="mb-6">
              <p className="text-sm font-semibold text-emerald-700">Admin dashboard</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-normal text-zinc-950">
                ศูนย์จัดการของ {user.fullName}
              </h1>
              <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
                พื้นที่หลังบ้านสำหรับตรวจประกาศรถ คำขอจากลูกค้า และสถานะดีลสำคัญ
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <DashboardCard icon={ClipboardList} label="ประกาศรอตรวจ" value="0" />
              <DashboardCard icon={UsersRound} label="ลูกค้าใหม่" value="0" />
              <DashboardCard icon={Gauge} label="นัดทดลองขับ" value="0" />
              <DashboardCard icon={ShieldCheck} label="ดีลที่ต้องติดตาม" value="0" />
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
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-zinc-950 text-white">
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
