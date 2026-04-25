import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryInventory } from "@/components/cars/category-inventory";
import { CategorySummary } from "@/components/cars/category-summary";
import { SiteHeader } from "@/components/layout/site-header";
import { getVehicleCategories, getVehicles } from "@/lib/api";
import type { ApiVehicleCategory } from "@/lib/api-types";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

function getFallbackAllCategory(categories: ApiVehicleCategory[]): ApiVehicleCategory {
  return (
    categories.find((category) => category.slug === "all") ?? {
      slug: "all",
      title: "รวมรถทุกประเภท",
      description: "ดูรถมือสองทั้งหมดที่ผ่านการคัดเกรดจาก Zed Auto",
      imageUrl: categories[0]?.imageUrl ?? "",
      count: categories.reduce((sum, category) => sum + category.count, 0)
    }
  );
}

async function resolveCategory(categorySlug: string) {
  const categories = await getVehicleCategories();

  const category =
    categorySlug === "all"
      ? getFallbackAllCategory(categories)
      : categories.find((item) => item.slug === categorySlug);

  return {
    categories,
    category
  };
}

export async function generateMetadata({
  params
}: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const { category } = await resolveCategory(categorySlug);

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
  const { categories, category } = await resolveCategory(categorySlug);

  if (!category) {
    notFound();
  }

  const vehicles = await getVehicles(categorySlug === "all" ? undefined : categorySlug);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf8f3_0%,#f8fafc_42%,#ffffff_100%)]">
      <SiteHeader backHref="/" backLabel="กลับหน้าแรก" />
      <CategorySummary categories={categories} category={category} />
      <CategoryInventory activeCategory={category.slug} vehicles={vehicles} />
    </main>
  );
}
