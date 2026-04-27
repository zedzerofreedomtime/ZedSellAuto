"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";

import { CarCard } from "@/components/cars/car-card";
import { Button } from "@/components/ui/button";
import type { ApiVehicle } from "@/lib/api-types";
import { sellerListingToApiVehicle } from "@/lib/seller-vehicle-mapper";
import {
  getSellerListingsSnapshot,
  getServerSellerListingsSnapshot,
  parseSellerListings,
  subscribeToSellerListings
} from "@/lib/valuation-storage";

type CategoryInventoryProps = {
  activeCategory: string;
  vehicles: ApiVehicle[];
};

export function CategoryInventory({
  activeCategory,
  vehicles
}: CategoryInventoryProps) {
  const shouldShowAllCarsButton = activeCategory !== "all";
  const sellerListingsSnapshot = useSyncExternalStore(
    subscribeToSellerListings,
    getSellerListingsSnapshot,
    getServerSellerListingsSnapshot
  );
  const sellerVehicles = useMemo(() => {
    const mappedVehicles = parseSellerListings(sellerListingsSnapshot)
      .filter((listing) => listing.status === "published")
      .map(sellerListingToApiVehicle);

    if (activeCategory === "all") {
      return mappedVehicles;
    }

    return mappedVehicles.filter(
      (vehicle) => vehicle.categorySlug === activeCategory
    );
  }, [activeCategory, sellerListingsSnapshot]);
  const visibleVehicles = useMemo(() => {
    const sellerVehicleIds = new Set(sellerVehicles.map((vehicle) => vehicle.id));

    return [
      ...sellerVehicles,
      ...vehicles.filter((vehicle) => !sellerVehicleIds.has(vehicle.id))
    ];
  }, [sellerVehicles, vehicles]);

  return (
    <section className="container pb-12">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-600">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          ทุกคันผ่านการตรวจสภาพและตรวจประวัติก่อนลงประกาศ
        </div>
        {shouldShowAllCarsButton ? (
          <Button asChild variant="premium">
            <Link href="/cars/all">ดูรวมรถทุกประเภท</Link>
          </Button>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {visibleVehicles.map((vehicle) => (
          <CarCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </section>
  );
}
