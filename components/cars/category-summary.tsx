import { CategoryFilter } from "@/components/cars/category-filter";
import { Badge } from "@/components/ui/badge";
import type { ApiVehicleCategory } from "@/lib/api-types";

type CategorySummaryProps = {
  categories: ApiVehicleCategory[];
  category: ApiVehicleCategory;
};

export function CategorySummary({
  categories,
  category
}: CategorySummaryProps) {
  return (
    <section className="container py-7 lg:py-10">
      <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-line sm:p-7">
        <div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success">{category.count} คัน</Badge>
              <Badge className="bg-white" variant="outline">
                Certified Inventory
              </Badge>
            </div>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-normal text-zinc-950 sm:text-5xl">
              {category.title}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-600 sm:text-lg">
              {category.description}
            </p>
          </div>

          <CategoryFilter activeCategory={category.slug} categories={categories} />
        </div>
      </div>
    </section>
  );
}
