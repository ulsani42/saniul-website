import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { getDb } from "@/lib/mongodb";
import PublicLayout from "@/components/layout/PublicLayout";
import AnimatedSection from "@/components/ui/AnimatedSection";
import type { BlogPost } from "@/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const db = await getDb();
    const post = await db.collection("blog").findOne({ slug });
    if (!post) return null;
    const { _id, ...rest } = post;
    return { ...rest, _id: _id?.toString() } as BlogPost;
  } catch (error) {
    console.error("getPostBySlug error:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found — Sani Ul" };
  }

  return {
    title: `${post.seo?.title || post.title} — Sani Ul`,
    description: post.seo?.description || post.excerpt,
    openGraph: {
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.excerpt,
    },
  };
}

function estimateReadTime(content: string): string {
  const text = content.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const readTime = post.content ? estimateReadTime(post.content) : null;

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-10 md:pb-14 bg-ivory">
        <div className="container-narrow">
          <AnimatedSection>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted hover:text-accent transition-colors duration-200 mb-10"
            >
              <ArrowLeft size={14} />
              Back to Insights
            </Link>

            {post.category && (
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-px bg-accent" />
                <p className="text-xs tracking-[0.25em] uppercase text-accent font-medium">
                  {post.category}
                </p>
              </div>
            )}

            <h1 className="text-editorial text-3xl md:text-4xl lg:text-[2.75rem] text-ink font-medium mb-8 leading-[1.15] tracking-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-5 text-sm text-muted font-light">
              {publishedDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-stone" />
                  <time dateTime={String(post.publishedAt)}>{publishedDate}</time>
                </span>
              )}
              {post.author && (
                <span className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-stone" />
                  {post.author}
                </span>
              )}
              {readTime && (
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-stone" />
                  {readTime}
                </span>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Image */}
      {post.featuredImage && (
        <section className="bg-white py-8 md:py-12">
          <div className="container-narrow">
            <div className="aspect-[16/9] max-h-[520px] overflow-hidden rounded-lg shadow-lg shadow-sand/30">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container-narrow">
          <AnimatedSection delay={0.1}>
            <article
              className="prose-custom text-charcoal leading-[1.8] font-light text-base md:text-lg
                         [&_h2]:text-editorial [&_h2]:text-2xl [&_h2]:text-ink [&_h2]:font-medium [&_h2]:mt-14 [&_h2]:mb-5 [&_h2]:relative [&_h2]:pb-3 [&_h2]:after:content-[''] [&_h2]:after:absolute [&_h2]:after:bottom-0 [&_h2]:after:left-0 [&_h2]:after:w-10 [&_h2]:after:h-px [&_h2]:after:bg-accent/50
                         [&_h3]:text-editorial [&_h3]:text-xl [&_h3]:text-ink [&_h3]:font-medium [&_h3]:mt-12 [&_h3]:mb-4 [&_h3]:pl-4 [&_h3]:border-l-2 [&_h3]:border-accent/40
                         [&_p]:mb-7 [&_p]:text-charcoal/85
                         [&_ul]:mb-7 [&_ul]:pl-6 [&_ul]:list-disc [&_ul_li]:mb-2.5 [&_ul_li]:text-charcoal/85
                         [&_ol]:mb-7 [&_ol]:pl-6 [&_ol]:list-decimal [&_ol_li]:mb-2.5
                         [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-accent/30 [&_a:hover]:decoration-accent [&_a:hover]:text-accent-dark
                         [&_blockquote]:border-l-2 [&_blockquote]:border-accent/50 [&_blockquote]:pl-6 [&_blockquote]:my-10 [&_blockquote]:italic [&_blockquote]:text-muted [&_blockquote]:bg-cream/50 [&_blockquote]:py-5 [&_blockquote]:pr-6 [&_blockquote]:rounded-r-lg
                         [&_img]:rounded-lg [&_img]:my-10 [&_img]:shadow-md [&_img]:shadow-sand/20
                         [&_hr]:border-sand [&_hr]:my-14 [&_hr]:border-dashed
                         [&_strong]:text-ink [&_strong]:font-medium"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <section className="py-8 md:py-10 bg-ivory border-t border-sand">
          <div className="container-narrow">
            <AnimatedSection delay={0.15}>
              <div className="flex flex-wrap gap-2.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 text-[11px] tracking-[0.12em] uppercase text-muted bg-white border border-sand/80 rounded-full font-medium hover:border-accent/40 hover:text-accent transition-colors duration-200 cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Back Link */}
      <section className="py-14 md:py-18 bg-ivory border-t border-sand">
        <div className="container-narrow">
          <AnimatedSection delay={0.1}>
            <div className="flex items-center justify-between">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2.5 text-sm tracking-wide text-muted hover:text-accent transition-colors duration-200 font-medium group"
              >
                <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
                Back to Insights
              </Link>
              <div className="w-12 h-px bg-accent/30" />
            </div>
          </AnimatedSection>
        </div>
      </section>
    </PublicLayout>
  );
}
