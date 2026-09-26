import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function NotFound() {
  return (
    <PublicLayout>
      <section className="pt-32 md:pt-40 pb-16 md:pb-24 bg-ivory">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="text-xs tracking-[0.25em] uppercase text-accent mb-4 font-medium">
              404
            </p>
            <h1 className="text-editorial text-3xl md:text-4xl text-ink font-medium mb-6">
              Post not found
            </h1>
            <p className="text-muted text-sm md:text-base leading-relaxed font-light max-w-md mx-auto mb-10">
              The insight you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm tracking-wide text-muted hover:text-accent transition-colors duration-200 font-medium"
            >
              <ArrowLeft size={16} />
              Back to Insights
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </PublicLayout>
  );
}
