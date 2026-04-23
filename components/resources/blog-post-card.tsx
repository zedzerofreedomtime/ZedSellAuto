import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { BlogPost } from "@/lib/resources-data";

type BlogPostCardProps = {
  featured?: boolean;
  post: BlogPost;
};

export function BlogPostCard({ featured = false, post }: BlogPostCardProps) {
  return (
    <Card className="overflow-hidden bg-white">
      <Link className="block" href={`/blog/${post.slug}`}>
        <div className={featured ? "grid lg:grid-cols-[1.05fr_0.95fr]" : ""}>
          <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
            <Image
              alt={post.title}
              className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]"
              fill
              sizes={featured ? "(min-width: 1024px) 52vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
              src={post.image}
            />
          </div>

          <CardContent className={featured ? "flex flex-col justify-center p-6 lg:p-8" : "p-5"}>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{post.category}</Badge>
              <span className="text-sm text-zinc-500">{post.publishedAt}</span>
              <span className="text-sm text-zinc-400">•</span>
              <span className="text-sm text-zinc-500">{post.readTime}</span>
            </div>

            <h2
              className={
                featured
                  ? "mt-4 text-3xl font-semibold leading-tight text-zinc-950"
                  : "mt-4 text-xl font-semibold leading-snug text-zinc-950"
              }
            >
              {post.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-zinc-600 sm:text-base">
              {post.excerpt}
            </p>

            <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
              อ่านบทความ
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </CardContent>
        </div>
      </Link>
    </Card>
  );
}
