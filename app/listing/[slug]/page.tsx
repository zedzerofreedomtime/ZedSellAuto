import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/layout/site-header";
import { LocalSellerListingPage } from "@/components/listing/local-seller-listing-page";
import { ListingDetails } from "@/components/listing/listing-details";
import { ListingGallery } from "@/components/listing/listing-gallery";
import { ListingOverview } from "@/components/listing/listing-overview";
import { MarketInsights } from "@/components/listing/market-insights";
import { RelatedVehicles } from "@/components/listing/related-vehicles";
import { SellerServices } from "@/components/listing/seller-services";
import { getVehicleDetail } from "@/lib/api";

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

  if (!payload) {
    return {
      title: "ไม่พบรถคันนี้ | Zed Auto"
    };
  }

  return {
    title: `${payload.vehicle.year} ${payload.vehicle.name} | Zed Auto`,
    description: payload.vehicle.description
  };
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { slug } = await params;
  const payload = await getVehicleDetail(slug);

  if (!payload) {
    if (slug.startsWith("seller-listing-")) {
      return <LocalSellerListingPage slug={slug} />;
    }

    notFound();
  }

  const { related, services, vehicle } = payload;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_50%,#ffffff_100%)]">
      <SiteHeader
        backHref={`/cars/${vehicle.categorySlug}`}
        backLabel="กลับไปหน้าค้นหา"
      />
      <ListingGallery
        gallery={vehicle.gallery}
        image={vehicle.imageUrl}
        name={vehicle.name}
      />
      <ListingOverview vehicle={vehicle} />
      <ListingDetails vehicle={vehicle} />
      <MarketInsights vehicle={vehicle} />
      <SellerServices services={services} vehicle={vehicle} />
      <RelatedVehicles vehicles={related} />
    </main>
  );
}
