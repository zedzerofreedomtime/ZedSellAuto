import { ArrowRight, BadgeCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function SellSection() {
  return (
    <section className="container grid gap-5 py-10 lg:grid-cols-[1fr_0.75fr]" id="sell">
      <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-line sm:p-7">
        <div className="grid gap-5 lg:grid-cols-[1fr_260px] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-emerald-700">Sell with Zed Auto</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-normal">
              ขายรถของคุณในราคาที่ตลาดเชื่อถือ
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
              รับประเมินราคา นัดตรวจสภาพ ถ่ายรูปลงประกาศ และจับคู่ผู้ซื้อที่พร้อมจอง
              โดยทีมงานช่วยดูแลจนถึงวันโอน
            </p>
          </div>
          <Button variant="accent" className="h-11">
            เริ่มประเมินราคา
            <ArrowRight />
          </Button>
        </div>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-line">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">คะแนนความพึงพอใจ</p>
            <p className="text-3xl font-semibold">98%</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <BadgeCheck />
          </div>
        </div>
        <Separator className="my-4" />
        <p className="text-sm leading-6 text-muted-foreground">
          จากผู้ซื้อและผู้ขายที่ทำรายการสำเร็จ พร้อมรีวิวดีลเลอร์หลังส่งมอบ
        </p>
      </div>
    </section>
  );
}
