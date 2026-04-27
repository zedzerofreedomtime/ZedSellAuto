import { vehicles as fallbackVehicles } from "@/lib/car-data";
import type { ApiVehicle } from "@/lib/api-types";
import {
  buildVehicleTitle,
  type StoredSellerListing,
  type ValuationVehicleInput
} from "@/lib/valuation-storage";

const fallbackImage = fallbackVehicles[0]?.image ?? "/placeholder.svg";

export function sellerListingToApiVehicle(listing: StoredSellerListing): ApiVehicle {
  const imageUrl = listing.imageUrls?.[0] ?? fallbackImage;
  const priceTHB = listing.priceTHB || parseNumber(listing.vehicle.expectedPriceTHB);

  return {
    id: listing.id,
    slug: listing.id,
    categorySlug: listing.categorySlug ?? inferCategory(listing.vehicle),
    name: listing.title || buildVehicleTitle(listing.vehicle) || "รถของคุณ",
    year: parseNumber(listing.vehicle.year) || new Date(listing.listedAt).getFullYear(),
    priceTHB,
    monthlyPaymentTHB: Math.max(0, Math.round(priceTHB / 60)),
    location: listing.vehicle.location || "ไม่ระบุพื้นที่",
    mileageKM: parseNumber(listing.vehicle.mileageKM),
    fuelType: listing.vehicle.fuelType || "ไม่ระบุ",
    tag: "ประกาศของคุณ",
    tone: "success",
    imageUrl,
    gallery: listing.imageUrls?.length ? listing.imageUrls : [imageUrl],
    transmission: listing.vehicle.transmission || "ไม่ระบุ",
    driveTrain: listing.vehicle.driveTrain || "ไม่ระบุ",
    engine: listing.vehicle.engine || "ไม่ระบุ",
    exteriorColor: listing.vehicle.exteriorColor || "ไม่ระบุ",
    interiorColor: listing.vehicle.interiorColor || "ไม่ระบุ",
    seats: 5,
    ownerSummary: listing.vehicle.ownerSummary || "ไม่ระบุ",
    description: listing.vehicle.description || "ประกาศรถจากผู้ขายบน Zed Auto",
    sellerName: listing.contact.sellerName || "ผู้ขาย Zed Auto",
    sellerEmailVerified: true,
    sellerPhoneVerified: true,
    sellerZedPayReady: false,
    isFeatured: false,
    estimatedMarketPrice: Math.round(priceTHB * 1.04),
    nearbyListingCount: 0,
    avgDaysOnMarket: 0
  };
}

function parseNumber(value: string) {
  const normalized = value.replace(/[^\d]/g, "");
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

function inferCategory(vehicle: ValuationVehicleInput) {
  const text = [
    vehicle.brand,
    vehicle.model,
    vehicle.fuelType,
    vehicle.driveTrain,
    vehicle.engine
  ]
    .join(" ")
    .toLowerCase();

  if (/(ev|electric|ไฟฟ้า|tesla)/i.test(text)) {
    return "ev";
  }

  if (/(pickup|hilux|revo|ranger|d-max|triton|กระบะ)/i.test(text)) {
    return "pickup";
  }

  if (/(suv|macan|q5|rx|x3|x5|fortuner|pajero|cr-v|cx-5)/i.test(text)) {
    return "suv";
  }

  if (/(porsche|audi|lexus|mercedes|benz|bmw|luxury)/i.test(text)) {
    return "luxury";
  }

  return "sedan";
}
