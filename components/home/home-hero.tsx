import {
  ArrowRight,
  Car,
  ChevronDown,
  Heart,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Timer
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const quickFilters = [
  { label: "SUV", href: "/cars/suv" },
  { label: "Sedan", href: "/cars/sedan" },
  { label: "EV", href: "/cars/ev" },
  { label: "Pickup", href: "/cars/pickup" },
  { label: "Luxury", href: "/cars/luxury" }
];

const trustItems = [
  {
    label: "ตรวจสภาพ 214 จุด",
    value: "Certified",
    icon: ShieldCheck
  },
  {
    label: "อนุมัติไฟแนนซ์ไว",
    value: "24 ชม.",
    icon: Timer
  },
  {
    label: "รถพร้อมส่งมอบ",
    value: "1,240 คัน",
    icon: Car
  }
];

export function HomeHero() {
  return (
    <section className="container grid gap-8 pb-8 pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(460px,0.85fr)] lg:pb-12 lg:pt-10 xl:gap-10 2xl:gap-12">
      <div className="flex min-h-[620px] flex-col justify-between gap-6">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success" className="gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              รถมือสองคัดเกรดพรีเมียม
            </Badge>
            <Badge variant="outline" className="bg-white/70">
              รับประกันไมล์แท้
            </Badge>
          </div>
          <div className="max-w-3xl space-y-4">
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-normal text-zinc-950 sm:text-5xl lg:text-6xl">
              ซื้อรถมือสองให้รู้สึกเหมือนได้รถใหม่
            </h1>
            <p className="max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
              ค้นหารถคุณภาพจากดีลเลอร์ที่ผ่านการตรวจสอบ เปรียบเทียบราคาไฟแนนซ์
              นัดดูรถ และจองออนไลน์ได้ในประสบการณ์เดียวที่เรียบง่าย
            </p>
          </div>
        </div>

        <Card className="glass-panel border-white/80 shadow-soft">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-xl">ค้นหารถที่ใช่</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  เลือกงบ รุ่นรถ และเงื่อนไขที่ต้องการ
                </p>
              </div>
              <Button variant="outline" className="w-full sm:w-auto">
                <SlidersHorizontal />
                ตัวกรอง
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 lg:grid-cols-[1.2fr_0.85fr_0.85fr_auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="h-12 bg-white pl-10"
                  placeholder="ค้นหา BMW, Benz, Toyota..."
                />
              </div>
              <SelectLike label="งบประมาณ" value="ไม่เกิน 2 ล้าน" />
              <SelectLike label="พื้นที่" value="กรุงเทพฯ" />
              <Button variant="premium" className="h-12 px-6" asChild>
                <Link href="/cars/all">ค้นหา</Link>
              </Button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {quickFilters.map((filter) => (
                <Link
                  className="shrink-0 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950"
                  href={filter.href}
                  key={filter.href}
                >
                  {filter.label}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-3 sm:grid-cols-3">
          {trustItems.map((item) => (
            <div
              className="rounded-lg border border-zinc-200 bg-white p-4 shadow-line"
              key={item.label}
            >
              <item.icon className="h-5 w-5 text-emerald-600" />
              <p className="mt-3 text-lg font-semibold">{item.value}</p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <aside className="relative min-h-[560px] overflow-hidden rounded-lg border border-white/80 bg-zinc-950 shadow-soft xl:min-h-[620px]">
        <Image
          alt="รถสปอร์ตพรีเมียมสีเข้ม"
          className="object-cover opacity-78"
          fill
          priority
          sizes="(min-width: 1024px) 40vw, 100vw"
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=82"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.12)_0%,rgba(9,9,11,0.82)_76%)]" />
        <div className="relative flex h-full flex-col justify-between p-5 text-white sm:p-7">
          <div className="flex items-center justify-between">
            <Badge className="border-white/20 bg-white/16 text-white backdrop-blur">
              Featured Deal
            </Badge>
            <Button
              className="border-white/20 bg-white/15 text-white hover:bg-white/25"
              size="icon"
              variant="outline"
              aria-label="บันทึกรถคันนี้"
            >
              <Heart />
            </Button>
          </div>
          <div className="space-y-5">
            <div>
              <p className="text-sm text-white/74">พร้อมส่งมอบสัปดาห์นี้</p>
              <h2 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">
                Audi Q5 Sportback quattro
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Metric label="ปี" value="2023" />
              <Metric label="ไมล์" value="18K" />
              <Metric label="ผ่อน" value="42.9K" />
            </div>
            <div className="flex flex-col gap-3 rounded-lg border border-white/16 bg-white/12 p-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-white/72">ราคาพิเศษ</p>
                <p className="text-2xl font-semibold">฿2,490,000</p>
              </div>
              <Button className="bg-white text-zinc-950 hover:bg-zinc-100">
                จองทดลองขับ
                <ArrowRight />
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
}

function SelectLike({ label, value }: { label: string; value: string }) {
  return (
    <button className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-white px-3 text-left text-sm transition hover:border-zinc-950">
      <span>
        <span className="block text-xs text-muted-foreground">{label}</span>
        <span className="font-semibold text-zinc-900">{value}</span>
      </span>
      <ChevronDown className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/14 bg-white/12 p-3 backdrop-blur">
      <p className="text-xs text-white/62">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}
