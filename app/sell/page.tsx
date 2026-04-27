import { Sparkles } from "lucide-react";
import Link from "next/link";

import { SiteHeader } from "@/components/layout/site-header";
import { SellCarForm } from "@/components/sell/sell-car-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SellPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf8f3_0%,#f8fafc_45%,#ffffff_100%)]">
      <SiteHeader backHref="/" backLabel="กลับหน้าแรก" />

      <section className="container py-8 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div className="max-w-4xl">
            <Badge variant="success">Sell your car</Badge>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-normal text-zinc-950 sm:text-5xl">
              ลงขายรถกับ Zed Auto
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600 sm:text-lg">
              กรอกรายละเอียดรถ รูปภาพ และข้อมูลติดต่อให้ครบ ทีมงานจะช่วยคัดกรองประกาศและประเมินความพร้อมก่อนเผยแพร่
            </p>
          </div>

          <Card className="bg-white">
            <CardContent className="p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-zinc-950">
                อยากรู้ราคาก่อนลงขาย?
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                ส่งข้อมูลรถให้แอดมินประเมินราคาเบื้องต้น พร้อมแชตคุยเรื่องราคาตลาดและราคาที่ควรตั้งขาย
              </p>
              <Button asChild className="mt-5 h-11 w-full" variant="premium">
                <Link href="/sell/valuation">
                  <Sparkles />
                  ประเมินราคาเบื้องต้น
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <SellCarForm />
    </main>
  );
}
