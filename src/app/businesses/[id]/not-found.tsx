import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";

export default function BusinessNotFound() {
  return (
    <PublicLayout>
      <section className="pt-32 md:pt-40 pb-20 bg-ivory">
        <div className="container-main text-center">
          <h1 className="text-editorial text-4xl md:text-5xl text-ink font-medium mb-4">
            Business Not Found
          </h1>
          <p className="text-muted text-base mb-8">
            The business you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/businesses"
            className="inline-flex items-center text-sm text-charcoal font-medium tracking-wide hover:text-accent transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Businesses
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
