import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { CarCard } from "@/components/cars/car-card";
import { Button } from "@/components/ui/button";
import type { CarCategorySlug, Vehicle } from "@/lib/car-data";

type CategoryInventoryProps = {
  activeCategory: CarCategorySlug;
  vehicles: Vehicle[];
};

export function CategoryInventory({
  activeCategory,
  vehicles
}: CategoryInventoryProps) {
  const shouldShowAllCarsButton = activeCategory !== "all";

  return (
    <section className="container pb-12">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-600">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          ทุกคันผ่านการตรวจสภาพและตรวจประวัติก่อนลงประกาศ
        </div>
        {shouldShowAllCarsButton ? (
          <Button variant="premium" asChild>
            <Link href="/cars/all">ดูรวมรถทุกประเภท</Link>
          </Button>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {vehicles.map((vehicle) => (
          <CarCard key={vehicle.name} vehicle={vehicle} />
        ))}
      </div>
    </section>
  );
}
