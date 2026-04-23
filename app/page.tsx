import { CategoriesSection } from "@/components/home/categories-section";
import { CertifiedStrip } from "@/components/home/certified-strip";
import { FeaturedInventory } from "@/components/home/featured-inventory";
import { FinanceSection } from "@/components/home/finance-section";
import { HomeHero } from "@/components/home/home-hero";
import { SellSection } from "@/components/home/sell-section";
import { SiteHeader } from "@/components/layout/site-header";
import { getHomePageData } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { categories, featuredVehicles } = await getHomePageData();

  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#faf8f3_0%,#f7f8fa_42%,#ffffff_100%)]">
      <SiteHeader />
      <HomeHero />
      <CertifiedStrip />
      <CategoriesSection categories={categories} />
      <FeaturedInventory vehicles={featuredVehicles} />
      <FinanceSection />
      <SellSection />
    </main>
  );
}
