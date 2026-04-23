import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ResourceHeroAction = {
  href: string;
  label: string;
  variant?: "accent" | "outline" | "premium";
};

type ResourceHeroProps = {
  actions?: ResourceHeroAction[];
  description: string;
  eyebrow?: string;
  title: string;
};

export function ResourceHero({
  actions = [],
  description,
  eyebrow = "Resources",
  title
}: ResourceHeroProps) {
  return (
    <section className="container py-8 lg:py-12">
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-line sm:p-8 lg:p-10">
        <Badge variant="success">{eyebrow}</Badge>
        <div className="mt-5 max-w-4xl">
          <h1 className="text-4xl font-semibold leading-tight tracking-normal text-zinc-950 sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600 sm:text-lg">
            {description}
          </p>
        </div>

        {actions.length ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {actions.map((action) => (
              <Button
                asChild
                className="h-11 px-5"
                key={action.href}
                variant={action.variant ?? "outline"}
              >
                <Link href={action.href}>{action.label}</Link>
              </Button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
