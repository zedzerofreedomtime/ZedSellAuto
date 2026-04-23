import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { CarCard } from "@/components/cars/car-card";
import { Button } from "@/components/ui/button";
import type { Vehicle } from "@/lib/car-data";

export function FeaturedInventory({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <section className="container py-9 lg:py-12" id="inventory">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Inventory</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-normal sm:text-3xl">
            รถเด่นที่คัดมาให้วันนี้
          </h2>
        </div>
        <Button asChild className="w-full sm:w-auto" variant="outline">
          <Link href="/cars/all">
            ดูรถทั้งหมด
            <ArrowRight />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {vehicles.map((vehicle) => (
          <CarCard key={vehicle.slug} vehicle={vehicle} />
        ))}
      </div>
    </section>
  );
}

