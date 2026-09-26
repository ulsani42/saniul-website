import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

interface CTAData {
  heading: string;
  text: string;
  ctaText: string;
  ctaLink: string;
}

export default function CTA({ data }: { data?: CTAData }) {
  const heading = data?.heading ?? "Interested in working together?";
  const text = data?.text ?? "Whether you would like to discuss a business opportunity, learn more about Sani Ul's ventures, or simply connect, feel free to reach out.";
  const ctaText = data?.ctaText ?? "Get in Touch";
  const ctaLink = data?.ctaLink ?? "/contact";

  return (
    <section className="py-20 md:py-28 bg-charcoal text-white">
      <div className="container-main text-center">
        <AnimatedSection>
          <p className="text-xs tracking-[0.25em] uppercase text-white/40 mb-4 font-medium">
            Get in Touch
          </p>
          <h2 className="text-editorial text-3xl md:text-4xl lg:text-5xl font-medium mb-6">
            {heading}
          </h2>
          <p className="text-white/50 text-base md:text-lg max-w-xl mx-auto mb-8 font-light leading-relaxed">
            {text}
          </p>
          <Link
            href={ctaLink}
            className="inline-flex items-center px-8 py-4 text-sm tracking-wide border border-white/30 text-white hover:bg-white hover:text-ink transition-all duration-300"
          >
            {ctaText}
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
