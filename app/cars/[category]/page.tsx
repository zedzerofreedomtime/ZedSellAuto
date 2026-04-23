import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryInventory } from "@/components/cars/category-inventory";
import { CategorySummary } from "@/components/cars/category-summary";
import { SiteHeader } from "@/components/layout/site-header";
import {
  carCategories,
  type CarCategorySlug,
  getVehiclesByCategory
} from "@/lib/car-data";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return carCategories.map((category) => ({
    category: category.slug
  }));
}

export async function generateMetadata({
  params
}: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);

  if (!category) {
    return {
      title: "ไม่พบประเภทรถ | Zed Auto"
    };
  }

  return {
    title: `${category.title} | Zed Auto`,
    description: category.description
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);

  if (!category) {
    notFound();
  }

  const selectedVehicles = getVehiclesByCategory(category.slug);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf8f3_0%,#f8fafc_42%,#ffffff_100%)]">
      <SiteHeader backHref="/" backLabel="กลับหน้าแรก" />
      <CategorySummary category={category} />
      <CategoryInventory activeCategory={category.slug} vehicles={selectedVehicles} />
    </main>
  );
}

function getCategory(categorySlug: string) {
  return carCategories.find(
    (category): category is (typeof carCategories)[number] =>
      category.slug === (categorySlug as CarCategorySlug)
  );
}
