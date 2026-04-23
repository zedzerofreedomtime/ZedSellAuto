import {
  BadgeDollarSign,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Umbrella,
  Wrench
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Vehicle } from "@/lib/car-data";

const services = [
  {
    icon: Truck,
    title: "Shipping",
    description: "จัดส่งรถถึงบ้านหรือนัดรับที่โชว์รูม พร้อมประกันระหว่างขนส่ง",
    action: "ดูรายละเอียด"
  },
  {
    icon: Umbrella,
    title: "Insurance",
    description: "เปรียบเทียบประกันชั้นนำและรับใบเสนอราคาแบบดิจิทัล",
    action: "ขอราคา"
  },
  {
    icon: ShieldCheck,
    title: "Protection",
    description: "แพ็กเกจคุ้มครองเครื่องยนต์ เกียร์ และระบบไฟฟ้าเพิ่มเติม",
    action: "ดูแพ็กเกจ"
  },
  {
    icon: Wrench,
    title: "Inspection",
    description: "นัดตรวจรถซ้ำโดยผู้เชี่ยวชาญก่อนวันรับรถได้",
    action: "นัดตรวจ"
  }
];

export function SellerServices({ vehicle }: { vehicle: Vehicle }) {
  return (
    <section className="container space-y-8 pb-8">
      <Card className="bg-white">
        <CardContent className="grid gap-5 p-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm text-muted-foreground">ผู้ขาย</p>
            <h2 className="mt-1 text-2xl font-semibold">{vehicle.sellerName}</h2>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ยืนยันอีเมล
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ยืนยันเบอร์โทร
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Zed Pay พร้อมใช้
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">เสนอราคา</Button>
            <Button variant="accent">ติดต่อผู้ขาย</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-2xl">บริการเสริม</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {services.map((service) => (
            <div
              className="grid gap-4 rounded-lg border border-zinc-200 p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center"
              key={service.title}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                <service.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">{service.title}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {service.description}
                </p>
              </div>
              <Button variant="outline" size="sm">
                {service.action}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <BadgeDollarSign className="h-6 w-6 text-emerald-600" />
            คำนวณไฟแนนซ์
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 lg:grid-cols-[0.5fr_1fr]">
          <div>
            <p className="text-sm text-muted-foreground">ค่างวดประมาณ</p>
            <p className="mt-2 text-4xl font-semibold">{vehicle.monthly}</p>
            <p className="mt-1 text-sm text-muted-foreground">ระยะเวลา 72 เดือน</p>
          </div>
          <div className="grid gap-3">
            <Input value={vehicle.numericPrice.toLocaleString("th-TH")} readOnly />
            <Input value="20%" readOnly />
            <Input value="เครดิตดี" readOnly />
            <Button variant="premium" className="mt-2 w-full sm:w-fit">
              ยื่นขอไฟแนนซ์
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
