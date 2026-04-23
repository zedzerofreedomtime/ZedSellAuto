import { CalendarDays, ChevronLeft, Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/layout/site-header";
import { BlogPostCard } from "@/components/resources/blog-post-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  blogPosts,
  getBlogPostBySlug,
  getRelatedBlogPosts
} from "@/lib/resources-data";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedBlogPosts(slug, 3);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf8f3_0%,#f7f8fa_45%,#ffffff_100%)]">
      <SiteHeader backHref="/blog" backLabel="กลับหน้า Blog" />

      <section className="container py-8 lg:py-12">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-line sm:p-8 lg:p-10">
          <Badge variant="success">{post.category}</Badge>

          <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-tight tracking-normal text-zinc-950 sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600 sm:text-lg">
            {post.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
            <div className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {post.publishedAt}
            </div>
            <div className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4" />
              {post.readTime}
            </div>
            <div>โดย {post.author}</div>
          </div>

          <div className="relative mt-8 aspect-[16/8] overflow-hidden rounded-lg bg-zinc-100">
            <Image
              alt={post.title}
              className="h-full w-full object-cover"
              fill
              priority
              sizes="100vw"
              src={post.image}
            />
          </div>
        </div>
      </section>

      <section className="container grid gap-6 pb-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(300px,0.28fr)]">
        <article className="rounded-lg border border-zinc-200 bg-white p-6 shadow-line sm:p-8">
          <div className="space-y-10">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-semibold tracking-normal text-zinc-950">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.body.map((paragraph) => (
                    <p className="text-base leading-8 text-zinc-700" key={paragraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>

        <div className="space-y-4">
          <Card className="bg-white">
            <CardContent className="p-5">
              <p className="text-sm font-medium text-zinc-500">อ่านต่อ</p>
              <Link
                className="mt-3 inline-flex items-center gap-2 text-base font-semibold text-zinc-950 hover:text-emerald-700"
                href="/blog"
              >
                <ChevronLeft className="h-4 w-4" />
                กลับไปหน้ารวมบทความ
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-5">
              <p className="text-sm font-medium text-zinc-500">หมวดบทความ</p>
              <p className="mt-3 text-xl font-semibold text-zinc-950">{post.category}</p>
              <p className="mt-3 text-sm leading-7 text-zinc-600">
                ถ้าคุณกำลังหาข้อมูลก่อนซื้อรถหรือเทียบตัวเลือกที่ใช่ หมวดนี้จะช่วยให้เห็นภาพการตัดสินใจชัดขึ้น
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container pb-12 lg:pb-16">
        <div>
          <Badge variant="outline">Related posts</Badge>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-zinc-950 sm:text-4xl">
            บทความที่น่าอ่านต่อ
          </h2>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {relatedPosts.map((relatedPost) => (
            <BlogPostCard key={relatedPost.slug} post={relatedPost} />
          ))}
        </div>
      </section>
    </main>
  );
}
