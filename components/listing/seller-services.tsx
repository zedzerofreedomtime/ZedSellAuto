import {
  BadgeDollarSign,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Umbrella,
  Wrench
} from "lucide-react";

import { FinanceApplicationCard } from "@/components/listing/finance-application-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ApiVehicle, ApiVehicleDetailResponse } from "@/lib/api-types";

type SellerServicesProps = {
  services?: ApiVehicleDetailResponse["services"];
  vehicle: ApiVehicle;
};

const serviceMeta = {
  Inspection: {
    icon: Wrench,
    title: "Inspection",
    description: "นัดตรวจรถซ้ำโดยผู้เชี่ยวชาญก่อนวันรับรถได้",
    action: "นัดตรวจ"
  },
  Insurance: {
    icon: Umbrella,
    title: "Insurance",
    description: "เปรียบเทียบประกันชั้นนำและรับใบเสนอราคาแบบดิจิทัล",
    action: "ขอราคา"
  },
  Protection: {
    icon: ShieldCheck,
    title: "Protection",
    description: "แพ็กเกจคุ้มครองเครื่องยนต์ เกียร์ และระบบไฟฟ้าเพิ่มเติม",
    action: "ดูแพ็กเกจ"
  },
  Shipping: {
    icon: Truck,
    title: "Shipping",
    description: "จัดส่งรถถึงบ้านหรือนัดรับที่โชว์รูมพร้อมประกันระหว่างขนส่ง",
    action: "ดูรายละเอียด"
  }
} as const;

const fallbackServices = Object.values(serviceMeta);

export function SellerServices({ services, vehicle }: SellerServicesProps) {
  const resolvedServices =
    services
      ?.map((service) => serviceMeta[service.title as keyof typeof serviceMeta])
      .filter(Boolean) ?? fallbackServices;

  return (
    <section className="container space-y-8 pb-8">
      <Card className="bg-white">
        <CardContent className="grid gap-5 p-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm text-muted-foreground">ผู้ขาย</p>
            <h2 className="mt-1 text-2xl font-semibold">{vehicle.sellerName}</h2>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              {vehicle.sellerEmailVerified ? (
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ยืนยันอีเมล
                </span>
              ) : null}
              {vehicle.sellerPhoneVerified ? (
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ยืนยันเบอร์โทร
                </span>
              ) : null}
              {vehicle.sellerZedPayReady ? (
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Zed Pay พร้อมใช้งาน
                </span>
              ) : null}
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
          {resolvedServices.map((service) => (
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
              <Button size="sm" variant="outline">
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
        <CardContent>
          <FinanceApplicationCard
            monthlyPaymentTHB={vehicle.monthlyPaymentTHB}
            priceTHB={vehicle.priceTHB}
            vehicleId={vehicle.id}
          />
        </CardContent>
      </Card>
    </section>
  );
}
