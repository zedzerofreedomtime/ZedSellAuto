"use client";

/* eslint-disable @next/next/no-img-element */
import { Calendar, Gauge, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSellerListings } from "@/lib/client-api";
import { formatCurrencyTHB, formatMileageKM } from "@/lib/formatters";
import { sellerListingToApiVehicle } from "@/lib/seller-vehicle-mapper";
import type { ApiVehicle } from "@/lib/api-types";

export function MySellerListings() {
  const [vehicles, setVehicles] = useState<ApiVehicle[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadListings() {
      try {
        const listings = await fetchSellerListings();

        if (!isMounted) {
          return;
        }

        setVehicles(
          listings
            .filter((listing) => listing.status === "published")
            .map(sellerListingToApiVehicle)
        );
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "ไม่สามารถโหลดประกาศจากฐานข้อมูลได้"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadListings();
    window.addEventListener("seller-listings:refresh", loadListings);

    return () => {
      isMounted = false;
      window.removeEventListener("seller-listings:refresh", loadListings);
    };
  }, []);

  return (
    <section className="container pb-12 lg:pb-16">
      <Card className="bg-white">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Badge variant="success">My Listings</Badge>
              <CardTitle className="mt-3 text-2xl">
                รถที่คุณลงขายไว้
              </CardTitle>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                ประกาศที่สร้างจากหน้านี้จะแสดงอยู่ตรงนี้ และจะถูกเพิ่มไปยังหน้าซื้อรถอัตโนมัติ
              </p>
            </div>
            <Badge className="bg-white" variant="outline">
              {vehicles.length} คัน
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {errorMessage ? (
            <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}
          {isLoading ? (
            <p className="mb-4 rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600">
              กำลังโหลดประกาศจากฐานข้อมูล...
            </p>
          ) : null}
          {vehicles.length === 0 ? (
            <div className="flex min-h-36 items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-5 text-center text-sm leading-6 text-muted-foreground">
              ยังไม่มีรถที่คุณลงขาย เมื่อลงประกาศสำเร็จ รถจะมาแสดงในส่วนนี้ทันที
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {vehicles.map((vehicle) => (
                <article
                  className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-line"
                  key={vehicle.id}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
                    <img
                      alt={vehicle.name}
                      className="h-full w-full object-cover"
                      src={vehicle.imageUrl}
                    />
                    <div className="absolute left-3 top-3 flex gap-2">
                      <Badge variant="success">เผยแพร่แล้ว</Badge>
                      <Badge className="border-white/30 bg-white/86 text-zinc-950">
                        {vehicle.year}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-4 p-4">
                    <div>
                      <h3 className="text-lg font-semibold leading-6 text-zinc-950">
                        {vehicle.name}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {vehicle.location}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Gauge className="h-3.5 w-3.5" />
                          {formatMileageKM(vehicle.mileageKM)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-end justify-between gap-3 border-t border-zinc-200 pt-4">
                      <div>
                        <p className="text-xl font-semibold text-zinc-950">
                          {formatCurrencyTHB(vehicle.priceTHB)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ราคาที่คุณตั้งไว้ เผื่อต่อรองได้
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500">
                        <Calendar className="h-3.5 w-3.5" />
                        ประกาศล่าสุด
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
