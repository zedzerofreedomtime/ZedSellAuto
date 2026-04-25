import {
  Armchair,
  BatteryCharging,
  Fuel,
  Gauge,
  Paintbrush,
  Route,
  Settings2,
  UserRound
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatMileageKM } from "@/lib/formatters";
import type { ApiVehicle } from "@/lib/api-types";

export function ListingDetails({ vehicle }: { vehicle: ApiVehicle }) {
  const detailItems = [
    { icon: Gauge, label: "เลขไมล์", value: formatMileageKM(vehicle.mileageKM) },
    { icon: Settings2, label: "เกียร์", value: vehicle.transmission },
    { icon: Fuel, label: "เชื้อเพลิง", value: vehicle.fuelType },
    { icon: Route, label: "ระบบขับเคลื่อน", value: vehicle.driveTrain },
    { icon: BatteryCharging, label: "เครื่องยนต์", value: vehicle.engine },
    { icon: Paintbrush, label: "สีภายนอก", value: vehicle.exteriorColor },
    { icon: Armchair, label: "ภายใน", value: vehicle.interiorColor },
    { icon: UserRound, label: "ประวัติผู้ครอบครอง", value: vehicle.ownerSummary }
  ];

  return (
    <section className="container pb-8">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-2xl">รายละเอียดรถ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {detailItems.map((item) => (
              <div className="flex gap-3" key={item.label}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{item.value}</p>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          <div>
            <h2 className="text-xl font-semibold">คำอธิบาย</h2>
            <p className="mt-2 max-w-4xl leading-7 text-muted-foreground">
              {vehicle.description}
            </p>
          </div>

          <div className="mt-6 divide-y divide-zinc-200 rounded-lg border border-zinc-200">
            <div className="flex items-center justify-between p-4 text-sm font-semibold">
              ข้อมูลเพิ่มเติม
              <span>+</span>
            </div>
            <div className="flex items-center justify-between p-4 text-sm font-semibold">
              รายงานจากผู้ขาย
              <span>+</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
