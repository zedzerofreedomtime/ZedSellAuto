import { CarCard } from "@/components/cars/car-card";
import type { ApiVehicle } from "@/lib/api-types";

export function RelatedVehicles({ vehicles }: { vehicles: ApiVehicle[] }) {
  if (vehicles.length === 0) {
    return null;
  }

  return (
    <section className="container pb-12">
      <div className="mb-5">
        <p className="text-sm font-semibold text-emerald-700">Recommended</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-normal sm:text-3xl">
          รถประเภทเดียวกันที่น่าสนใจ
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {vehicles.map((vehicle) => (
          <CarCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </section>
  );
}
