import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ApiVehicleCategory } from "@/lib/api-types";

type CategoriesSectionProps = {
  categories?: ApiVehicleCategory[];
};

export function CategoriesSection({
  categories = []
}: CategoriesSectionProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="container py-9 lg:py-12" id="categories">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Categories</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-normal sm:text-3xl">
            เลือกดูรถตามประเภท
          </h2>
        </div>
        <Button asChild className="w-full sm:w-auto" variant="outline">
          <Link href="/cars/all">
            รวมรถทุกประเภท
            <ArrowRight />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <Link
            className="group relative min-h-[220px] overflow-hidden rounded-lg border border-zinc-200 bg-zinc-950 shadow-line transition hover:-translate-y-1 hover:shadow-soft"
            href={`/cars/${category.slug}`}
            key={category.slug}
          >
            <Image
              alt={category.title}
              className="object-cover opacity-72 transition duration-500 group-hover:scale-105 group-hover:opacity-84"
              fill
              sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
              src={category.imageUrl}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.08)_0%,rgba(9,9,11,0.82)_100%)]" />
            <div className="relative flex h-full min-h-[220px] flex-col justify-between p-5 text-white">
              <div className="flex items-center justify-between">
                <Badge className="border-white/20 bg-white/14 text-white backdrop-blur">
                  {category.count} คัน
                </Badge>
                <span className="flex h-10 w-10 items-center justify-center rounded-md border border-white/20 bg-white/12 backdrop-blur transition group-hover:bg-white group-hover:text-zinc-950">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold tracking-normal">
                  {category.title}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-white/76">
                  {category.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
