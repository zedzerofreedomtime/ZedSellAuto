import { Check, Sparkles } from "lucide-react";
import Link from "next/link";

import { SiteHeader } from "@/components/layout/site-header";
import { ResourceHero } from "@/components/resources/resource-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPricingPageData } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const { faqs, highlights, plans } = await getPricingPageData();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf8f3_0%,#f7f8fa_45%,#ffffff_100%)]">
      <SiteHeader backHref="/" backLabel="กลับหน้าแรก" />

      <ResourceHero
        actions={[
          { href: "/how-it-works", label: "ดูขั้นตอนการใช้งาน", variant: "outline" },
          { href: "/login", label: "เริ่มใช้งาน", variant: "accent" }
        ]}
        description="โครงสร้างค่าบริการของ Zed Auto ถูกออกแบบให้เข้าใจง่าย จ่ายเท่าที่จำเป็น และเลือกเพิ่มเฉพาะบริการที่เหมาะกับประเภทดีลของคุณ"
        title="Pricing"
      />

      <section className="container grid gap-4 pb-8 lg:grid-cols-3">
        {highlights.map((item) => (
          <Card className="bg-white" key={item.label}>
            <CardContent className="p-6">
              <p className="text-sm text-zinc-500">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold text-zinc-950">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="container py-4 lg:py-8">
        <div>
          <Badge variant="outline">Plans</Badge>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-zinc-950 sm:text-4xl">
            เลือกแพ็กเกจตามรูปแบบการใช้งาน
          </h2>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card className="bg-white" key={plan.title}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-2xl">{plan.title}</CardTitle>
                    <p className="mt-3 text-3xl font-semibold text-zinc-950">{plan.price}</p>
                  </div>
                  {plan.highlight ? <Badge variant="success">{plan.highlight}</Badge> : null}
                </div>
                <p className="pt-3 text-sm leading-7 text-zinc-600">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {plan.features.map((feature) => (
                  <div className="flex gap-3" key={feature}>
                    <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-sm leading-7 text-zinc-700">{feature}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container grid gap-4 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-12">
        <Card className="bg-white">
          <CardHeader>
            <Badge variant="outline">What included</Badge>
            <CardTitle className="pt-3 text-2xl">สิ่งที่รวมอยู่ในประสบการณ์ของ Zed Auto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "การจัดหน้า listing ให้ข้อมูลอ่านง่ายและน่าเชื่อถือ",
              "เครื่องมือช่วยดูราคาและประมาณค่างวดเบื้องต้น",
              "ระบบนัดดูรถ ทดลองขับ และติดตามสถานะดีล",
              "ทีมช่วยประสานผู้ซื้อ ผู้ขาย และเอกสารสำคัญ"
            ].map((item) => (
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-7 text-zinc-700" key={item}>
                {item}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <Sparkles className="h-5 w-5" />
              </div>
              <CardTitle className="text-2xl">เหมาะกับใคร?</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "คนที่อยากเห็นต้นทุนรวมก่อนคุยไฟแนนซ์จริง",
              "เจ้าของรถที่อยากขายเร็วขึ้นแบบไม่ต้องจัดการเองทุกขั้นตอน",
              "รถพรีเมียมหรือรถไฟฟ้าที่ต้องการการเล่าเรื่องและภาพลักษณ์ที่ดี",
              "ลูกค้าที่ต้องการบริการเสริมอย่างตรวจสภาพ ขนส่ง หรือรับฝากขาย"
            ].map((item) => (
              <div className="flex gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3" key={item}>
                <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                <p className="text-sm leading-7 text-zinc-700">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="container pb-12 lg:pb-16">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-line sm:p-8">
          <div>
            <Badge variant="outline">FAQ</Badge>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-zinc-950">
              คำถามที่พบบ่อย
            </h2>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {faqs.map((faq) => (
              <Card className="bg-zinc-50" key={faq.question}>
                <CardHeader>
                  <CardTitle className="text-xl leading-snug">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-zinc-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="premium">
              <Link href="/login">เริ่มต้นใช้งาน</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/blog">อ่านคู่มือก่อนตัดสินใจ</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
