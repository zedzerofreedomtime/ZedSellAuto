import { MapPin } from "lucide-react";

import { ListingContactCard } from "@/components/listing/listing-contact-card";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyTHB, formatMonthlyPaymentTHB } from "@/lib/formatters";
import type { ApiVehicle } from "@/lib/api-types";

export function ListingOverview({ vehicle }: { vehicle: ApiVehicle }) {
  return (
    <section className="container py-7">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={vehicle.tone === "success" ? "success" : "warning"}>
              {vehicle.tag}
            </Badge>
            <Badge className="bg-white" variant="outline">
              Certified
            </Badge>
          </div>
          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-normal text-zinc-950 sm:text-4xl">
            {vehicle.year} {vehicle.name}
          </h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {vehicle.location}
          </p>
          <p className="mt-5 text-3xl font-semibold">{formatCurrencyTHB(vehicle.priceTHB)}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatMonthlyPaymentTHB(vehicle.monthlyPaymentTHB)}
          </p>
        </div>

        <ListingContactCard vehicleId={vehicle.id} />
      </div>
    </section>
  );
}
