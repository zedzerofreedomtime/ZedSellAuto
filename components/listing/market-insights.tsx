import { FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Vehicle } from "@/lib/car-data";

export function MarketInsights({ vehicle }: { vehicle: Vehicle }) {
  const averagePrice = Math.round(vehicle.numericPrice * 1.04);

  return (
    <section className="container pb-8">
      <div className="grid gap-5 lg:grid-cols-[0.74fr_1fr]">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5 text-emerald-600" />
              รายงานประวัติรถ
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <p className="text-sm leading-6 text-muted-foreground">
              ตรวจสอบประวัติทะเบียน ประกันภัย และประวัติเข้าศูนย์ก่อนตัดสินใจ
            </p>
            <Button variant="outline">ดูรายงาน</Button>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-xl">Market Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52 rounded-lg border border-zinc-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4">
              <div className="relative h-full">
                {[18, 34, 52, 70, 86].map((top, index) => (
                  <span
                    className="absolute h-2.5 w-2.5 rounded-full bg-cyan-500"
                    key={top}
                    style={{ left: `${12 + index * 18}%`, top: `${top}%` }}
                  />
                ))}
                <span
                  className="absolute h-3.5 w-3.5 rounded-full border-2 border-white bg-amber-500 shadow-soft"
                  style={{ left: "58%", top: "46%" }}
                />
                <div className="absolute bottom-8 left-0 right-0 h-1 rounded-full bg-zinc-200">
                  <div className="h-full w-[64%] rounded-full bg-emerald-400" />
                </div>
              </div>
            </div>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <Insight label="ราคาเฉลี่ยตลาด" value={formatBaht(averagePrice)} />
              <Insight label="จำนวนรถใกล้เคียง" value="128 คัน" />
              <Insight label="วันเฉลี่ยในตลาด" value="12 วัน" />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function Insight({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

function formatBaht(value: number) {
  return new Intl.NumberFormat("th-TH", {
    currency: "THB",
    maximumFractionDigits: 0,
    style: "currency"
  }).format(value);
}
