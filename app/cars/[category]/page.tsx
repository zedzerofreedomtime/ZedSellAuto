import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryInventory } from "@/components/cars/category-inventory";
import { CategorySummary } from "@/components/cars/category-summary";
import { SiteHeader } from "@/components/layout/site-header";
import { getVehicleCategories, getVehicles } from "@/lib/api";
import type { CarCategorySlug } from "@/lib/car-data";

export const dynamic = "force-dynamic";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export async function generateMetadata({
  params
}: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const categories = await getVehicleCategories();
  const category = categories.find(
    (item) => item.slug === (categorySlug as CarCategorySlug)
  );

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
  const categories = await getVehicleCategories();
  const category = categories.find(
    (item) => item.slug === (categorySlug as CarCategorySlug)
  );

  if (!category) {
    notFound();
  }

  const selectedVehicles = await getVehicles(category.slug);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf8f3_0%,#f8fafc_42%,#ffffff_100%)]">
      <SiteHeader backHref="/" backLabel="กลับหน้าแรก" />
      <CategorySummary categories={categories} category={category} />
      <CategoryInventory activeCategory={category.slug} vehicles={selectedVehicles} />
    </main>
  );
}
