import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";

import type { VehicleCategorySummary } from "@/lib/api";
import type { CarCategorySlug } from "@/lib/car-data";

export function CategoryFilter({
  activeCategory,
  categories
}: {
  activeCategory: CarCategorySlug;
  categories: VehicleCategorySummary[];
}) {
  return (
    <aside className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50/70 p-4 text-zinc-950">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">ตัวกรองด่วน</p>
          <p className="mt-1 text-xl font-semibold">เลือกประเภทอื่น</p>
        </div>
        <SlidersHorizontal className="h-5 w-5 text-emerald-600" />
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {categories.map((item) => (
          <Link
            className={`flex min-h-12 items-center justify-between rounded-md border px-3 py-2 text-sm transition ${
              item.slug === activeCategory
                ? "border-zinc-950 bg-zinc-950 text-white"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-950 hover:text-zinc-950"
            }`}
            href={`/cars/${item.slug}`}
            key={item.slug}
          >
            <span>{item.title}</span>
            <span className="text-xs opacity-70">{item.count} คัน</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
