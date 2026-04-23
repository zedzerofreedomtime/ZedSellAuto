import { SiteHeader } from "@/components/layout/site-header";
import { BlogPostCard } from "@/components/resources/blog-post-card";
import { ResourceHero } from "@/components/resources/resource-hero";
import { Badge } from "@/components/ui/badge";
import { blogPosts } from "@/lib/resources-data";

const [featuredPost, ...otherPosts] = blogPosts;

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf8f3_0%,#f7f8fa_45%,#ffffff_100%)]">
      <SiteHeader backHref="/" backLabel="กลับหน้าแรก" />

      <ResourceHero
        actions={[
          { href: "/how-it-works", label: "How it works", variant: "outline" },
          { href: "/pricing", label: "Pricing", variant: "outline" }
        ]}
        description="รวมบทความ คู่มือซื้อรถมือสอง เคล็ดลับเรื่องไฟแนนซ์ และมุมมองจากทีม Zed Auto ที่ช่วยให้การตัดสินใจซื้อขายรถง่ายขึ้น"
        title="Blog"
      />

      <section className="container py-2 lg:py-4">
        <div>
          <Badge variant="success">Featured story</Badge>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-zinc-950 sm:text-4xl">
            บทความเด่นประจำสัปดาห์
          </h2>
        </div>

        <div className="mt-6">
          <BlogPostCard featured post={featuredPost} />
        </div>
      </section>

      <section className="container py-8 lg:py-12">
        <div>
          <Badge variant="outline">Latest posts</Badge>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-zinc-950 sm:text-4xl">
            บทความล่าสุด
          </h2>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {otherPosts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
}
