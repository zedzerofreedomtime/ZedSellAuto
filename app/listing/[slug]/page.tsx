import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/layout/site-header";
import { ListingDetails } from "@/components/listing/listing-details";
import { ListingGallery } from "@/components/listing/listing-gallery";
import { ListingOverview } from "@/components/listing/listing-overview";
import { MarketInsights } from "@/components/listing/market-insights";
import { RelatedVehicles } from "@/components/listing/related-vehicles";
import { SellerServices } from "@/components/listing/seller-services";
import { getVehicleDetail } from "@/lib/api";

export const dynamic = "force-dynamic";

type ListingPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params
}: ListingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getVehicleDetail(slug);
  const vehicle = payload?.vehicle;

  if (!vehicle) {
    return {
      title: "ไม่พบรถคันนี้ | Zed Auto"
    };
  }

  return {
    title: `${vehicle.year} ${vehicle.name} | Zed Auto`,
    description: vehicle.description
  };
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { slug } = await params;
  const payload = await getVehicleDetail(slug);
  const vehicle = payload?.vehicle;

  if (!vehicle) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_50%,#ffffff_100%)]">
      <SiteHeader backHref={`/cars/${vehicle.category}`} backLabel="กลับไปหน้าค้นหา" />
      <ListingGallery gallery={vehicle.gallery} image={vehicle.image} name={vehicle.name} />
      <ListingOverview vehicle={vehicle} />
      <ListingDetails vehicle={vehicle} />
      <MarketInsights vehicle={vehicle} />
      <SellerServices services={payload?.services ?? []} vehicle={vehicle} />
      <RelatedVehicles vehicles={payload?.related ?? []} />
    </main>
  );
}
