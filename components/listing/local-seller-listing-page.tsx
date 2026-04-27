"use client";

import { useEffect, useState } from "react";

import { SiteHeader } from "@/components/layout/site-header";
import { ListingDetails } from "@/components/listing/listing-details";
import { ListingGallery } from "@/components/listing/listing-gallery";
import { ListingOverview } from "@/components/listing/listing-overview";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchSellerListing } from "@/lib/client-api";
import type { ApiVehicle } from "@/lib/api-types";
import { sellerListingToApiVehicle } from "@/lib/seller-vehicle-mapper";
import Link from "next/link";

export function LocalSellerListingPage({ slug }: { slug: string }) {
  const [vehicle, setVehicle] = useState<ApiVehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadListing() {
      try {
        const listing = await fetchSellerListing(slug);

        if (isMounted) {
          setVehicle(sellerListingToApiVehicle(listing));
        }
      } catch {
        if (isMounted) {
          setVehicle(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadListing();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (!vehicle) {
    return (
      <main className="min-h-screen bg-white">
        <SiteHeader backHref="/cars/all" backLabel="กลับไปหน้าค้นหา" />
        <section className="container py-12">
          <Card className="mx-auto max-w-xl bg-white">
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-semibold text-zinc-950">
                ไม่พบประกาศนี้ในเครื่อง
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {isLoading
                  ? "กำลังโหลดประกาศจากฐานข้อมูล..."
                  : "ไม่พบประกาศนี้ในฐานข้อมูล หรือ backend ยังไม่พร้อมใช้งาน"}
              </p>
              <Button asChild className="mt-5" variant="premium">
                <Link href="/sell">ไปหน้าขายรถ</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_50%,#ffffff_100%)]">
      <SiteHeader backHref="/cars/all" backLabel="กลับไปหน้าค้นหา" />
      <ListingGallery gallery={vehicle.gallery} image={vehicle.imageUrl} name={vehicle.name} />
      <ListingOverview vehicle={vehicle} />
      <ListingDetails vehicle={vehicle} />
    </main>
  );
}
