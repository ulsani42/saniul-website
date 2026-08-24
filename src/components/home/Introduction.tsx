"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

interface IntroductionData {
  heading: string;
  headingAccent: string;
  text: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}

export default function Introduction({ data }: { data?: IntroductionData }) {
  const headingAccent = data?.headingAccent ?? "Sani Ul";
  const text = data?.text ?? "Sani Ul is a business professional and entrepreneur based in Bangladesh.";
  const ctaText = data?.ctaText ?? "Read More";
  const ctaLink = data?.ctaLink ?? "/about";

  return (
    <section className="py-20 md:py-28 bg-ivory">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <AnimatedSection>
            <p className="text-xs tracking-[0.25em] uppercase text-accent mb-4 font-medium">
              About
            </p>
            <h2 className="text-editorial text-3xl md:text-4xl lg:text-5xl text-ink font-medium mb-6">
              {data?.heading ?? "A closer look at"}{" "}
              <span className="italic text-muted">{headingAccent}</span>
            </h2>
            <div className="space-y-4 mb-8">
              <p className="text-muted text-base md:text-lg leading-relaxed font-light">
                {text}
              </p>
            </div>
            <Link
              href={ctaLink}
              className="inline-flex items-center text-sm text-charcoal font-medium tracking-wide group"
            >
              {ctaText}
              <ArrowRight
                size={16}
                className="ml-2 transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </AnimatedSection>

          {/* Image */}
          <AnimatedSection delay={0.2}>
            <div className="relative max-w-sm mx-auto lg:mx-0">
              <div className="aspect-[4/5] max-h-[420px] bg-cream border border-sand overflow-hidden">
                {data?.image ? (
                  <img
                    src={data.image}
                    alt="Sani Ul"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-sand flex items-center justify-center">
                        <span className="text-2xl text-stone font-serif">SU</span>
                      </div>
                      <p className="text-xs text-stone tracking-wider uppercase">
                        Secondary Portrait
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-accent/20 -z-10" />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
