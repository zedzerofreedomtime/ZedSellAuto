import { Gauge, Heart, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Vehicle } from "@/lib/car-data";

export function CarCard({ vehicle }: { vehicle: Vehicle }) {
  const listingHref = `/listing/${vehicle.slug}`;

  return (
    <Card className="overflow-hidden bg-white transition hover:-translate-y-1 hover:shadow-soft">
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
        <Image
          alt={vehicle.name}
          className="object-cover transition duration-500 hover:scale-105"
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          src={vehicle.image}
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge variant={vehicle.tone === "success" ? "success" : "warning"}>
            {vehicle.tag}
          </Badge>
          <Badge className="border-white/30 bg-white/86 text-zinc-950">
            {vehicle.year}
          </Badge>
        </div>
        <Button
          className="absolute right-3 top-3 bg-white/88 text-zinc-950 hover:bg-white"
          size="icon"
          variant="ghost"
          aria-label={`บันทึก ${vehicle.name}`}
        >
          <Heart />
        </Button>
      </div>
      <CardContent className="space-y-4 p-4">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold leading-6">{vehicle.name}</h3>
            <div className="flex items-center gap-1 text-sm font-semibold text-amber-600">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              4.9
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {vehicle.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Gauge className="h-3.5 w-3.5" />
              {vehicle.mileage}
            </span>
          </div>
        </div>

        <Separator />

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xl font-semibold">{vehicle.price}</p>
            <p className="text-sm text-muted-foreground">{vehicle.monthly}</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={listingHref}>รายละเอียด</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
