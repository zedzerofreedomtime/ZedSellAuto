import { Badge } from "@/components/ui/badge";
import { CategoryFilter } from "@/components/cars/category-filter";
import type { CarCategorySlug } from "@/lib/car-data";
import { getCategoryCount } from "@/lib/car-data";

type CategorySummaryProps = {
  category: {
    slug: CarCategorySlug;
    title: string;
    description: string;
  };
};

export function CategorySummary({ category }: CategorySummaryProps) {
  return (
    <section className="container py-7 lg:py-10">
      <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-line sm:p-7">
        <div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success">{getCategoryCount(category.slug)} คัน</Badge>
              <Badge variant="outline" className="bg-white">
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

          <CategoryFilter activeCategory={category.slug} />
        </div>
      </div>
    </section>
  );
}
