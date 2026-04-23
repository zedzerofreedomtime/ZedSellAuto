import { ArrowRight, CircleCheck, ShieldCheck, Wallet } from "lucide-react";
import Link from "next/link";

import { SiteHeader } from "@/components/layout/site-header";
import { ResourceHero } from "@/components/resources/resource-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  buyerExperience,
  howItWorksSteps,
  sellerExperience
} from "@/lib/resources-data";

const trustSignals = [
  {
    icon: ShieldCheck,
    title: "ข้อมูลรถชัดเจน",
    description: "ดูประวัติรถ ภาพจริง และข้อมูลสำคัญก่อนตัดสินใจ"
  },
  {
    icon: Wallet,
    title: "คุมงบได้ง่าย",
    description: "มีเครื่องมือช่วยประเมินค่างวดและค่าใช้จ่ายรวม"
  },
  {
    icon: CircleCheck,
    title: "ปิดดีลเป็นขั้นตอน",
    description: "ช่วยดูเรื่องนัดหมาย เอกสาร และการส่งมอบรถ"
  }
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf8f3_0%,#f7f8fa_45%,#ffffff_100%)]">
      <SiteHeader backHref="/" backLabel="กลับหน้าแรก" />

      <ResourceHero
        actions={[
          { href: "/pricing", label: "ดู Pricing", variant: "outline" },
          { href: "/blog", label: "อ่านบทความ", variant: "accent" }
        ]}
        description="จากการค้นหารถจนถึงวันรับมอบ Zed Auto ออกแบบทุกขั้นตอนให้เรียบง่าย โปร่งใส และตัดสินใจได้มั่นใจขึ้นทั้งฝั่งผู้ซื้อและผู้ขาย"
        title="How it works"
      />

      <section className="container grid gap-4 pb-6 lg:grid-cols-3">
        {trustSignals.map((signal) => {
          const Icon = signal.icon;

          return (
            <Card className="bg-white" key={signal.title}>
              <CardHeader className="pb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="pt-4 text-xl">{signal.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-7 text-zinc-600">{signal.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="container py-8 lg:py-12">
        <div>
          <Badge variant="outline">Journey</Badge>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-zinc-950 sm:text-4xl">
            ภาพรวมการใช้งานบนแพลตฟอร์ม
          </h2>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {howItWorksSteps.map((step) => (
            <Card className="bg-white" key={step.label}>
              <CardHeader>
                <Badge className="w-fit" variant="success">
                  {step.label}
                </Badge>
                <CardTitle className="pt-3 text-2xl leading-snug">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-7 text-zinc-600 sm:text-base">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container grid gap-4 pb-12 lg:grid-cols-2 lg:pb-16">
        <Card className="bg-white">
          <CardHeader>
            <Badge variant="outline">สำหรับผู้ซื้อ</Badge>
            <CardTitle className="pt-3 text-2xl">ซื้อรถได้มั่นใจขึ้นในทุกจุดสำคัญ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {buyerExperience.map((item) => (
              <div className="flex gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3" key={item}>
                <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <p className="text-sm leading-7 text-zinc-700">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <Badge variant="outline">สำหรับผู้ขาย</Badge>
            <CardTitle className="pt-3 text-2xl">ขายรถง่ายขึ้นโดยไม่ต้องจัดการคนเดียว</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sellerExperience.map((item) => (
              <div className="flex gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3" key={item}>
                <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <p className="text-sm leading-7 text-zinc-700">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="container pb-12 lg:pb-16">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-line sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Badge variant="success">Next</Badge>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal text-zinc-950">
                อยากดูเรื่องราคาและค่าบริการต่อ?
              </h2>
              <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-600">
                ดูรายละเอียดแพ็กเกจ ค่าจอง และบริการเสริมทั้งหมดก่อนเริ่มใช้งานจริง
              </p>
            </div>

            <Button asChild className="h-12 px-5" variant="premium">
              <Link href="/pricing">
                ไปหน้า Pricing
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
