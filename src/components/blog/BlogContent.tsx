"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { BlogPost } from "@/types";

interface BlogPostItem {
  _id?: string;
  id?: string;
  title: string;
  excerpt?: string;
  slug: string;
  category?: string;
  featuredImage?: string;
  publishedAt?: Date;
  createdAt?: Date;
}

function getKey(item: BlogPostItem, index: number): string {
  return String(item._id ?? item.id ?? index);
}

export default function BlogContent({ posts }: { posts?: BlogPost[] }) {
  const prefersReduced = useReducedMotion();
  const hasPosts = posts && posts.length > 0;

  return (
    <>
      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-20 bg-ivory">
        <div className="container-main">
          <AnimatedSection>
            <p className="text-xs tracking-[0.25em] uppercase text-accent mb-4 font-medium">
              Insights
            </p>
            <h1 className="text-editorial text-4xl md:text-5xl lg:text-6xl text-ink font-medium mb-6">
              Ideas, observations{" "}
              <span className="italic text-muted">& insights</span>
            </h1>
            <p className="text-muted text-base md:text-lg max-w-2xl leading-relaxed font-light">
              A space for thoughts on business, entrepreneurship, operations and
              lessons learned along the way.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {hasPosts ? (
        /* Posts Grid */
        <section className="py-16 md:py-24 bg-white border-t border-sand">
          <div className="container-wide">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" style={{ gridAutoRows: "1fr" }}>
              {posts!.map((post, index) => (
                <AnimatedSection key={getKey(post, index)} delay={index * 0.1} className="h-full">
                  <Link href={`/blog/${post.slug}`} className="block group h-full">
                    <div className="card-premium h-full p-6 md:p-8 flex flex-col">
                      {(post as BlogPostItem).featuredImage && (
                        <div className="aspect-[16/9] overflow-hidden rounded-lg mb-4 -mt-2 -mx-2 md:-mx-3">
                          <img
                            src={(post as BlogPostItem).featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      {post.category && (
                        <p className="text-xs tracking-[0.15em] uppercase text-accent mb-3 font-medium">
                          {post.category}
                        </p>
                      )}
                      <h2 className="text-lg md:text-xl text-ink font-medium mb-3 group-hover:text-accent transition-colors duration-200">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm text-muted leading-relaxed font-light line-clamp-3 mb-4">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="w-8 h-px bg-sand group-hover:bg-accent transition-colors duration-200" />
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      ) : (
        /* Coming Soon */
        <section className="py-16 md:py-24 bg-white border-t border-sand">
          <div className="container-narrow">
            <AnimatedSection>
              <div className="relative text-center py-16 md:py-24">
                {/* Decorative elements */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-sand/50 rotate-45"
                  animate={
                    prefersReduced
                      ? {}
                      : { rotate: [45, 50, 45] }
                  }
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-sand/30 rotate-12"
                  animate={
                    prefersReduced
                      ? {}
                      : { rotate: [12, 15, 12] }
                  }
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Content */}
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-cream border border-sand flex items-center justify-center">
                    <BookOpen size={24} className="text-accent" />
                  </div>
                  <h2 className="text-editorial text-2xl md:text-3xl text-ink font-medium mb-4">
                    Insights are coming soon
                  </h2>
                  <p className="text-muted text-sm leading-relaxed font-light max-w-md mx-auto mb-8">
                    Sani Ul will be sharing thoughts, experiences and perspectives
                    on business and entrepreneurship here.
                  </p>
                  <div className="w-12 h-px bg-accent mx-auto" />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}
    </>
  );
}
