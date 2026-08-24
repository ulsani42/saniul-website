import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/data";
import PublicLayout from "@/components/layout/PublicLayout";
import BlogContent from "@/components/blog/BlogContent";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Insights, thoughts and perspectives on business, entrepreneurship, operations and lessons learned by Sani Ul — business professional in Bangladesh.",
  keywords: [
    "Sani Ul blog",
    "business insights Bangladesh",
    "entrepreneurship thoughts",
    "operations management tips",
    "business lessons Bangladesh",
  ],
  openGraph: {
    title: "Insights — Sani Ul",
    description:
      "Insights and perspectives on business, entrepreneurship, and operations by Sani Ul.",
  },
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return (
    <PublicLayout>
      <BlogContent posts={posts} />
    </PublicLayout>
  );
}
