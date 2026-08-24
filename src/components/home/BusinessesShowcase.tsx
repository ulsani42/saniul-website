"use client";

import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { businesses as defaultBusinesses } from "@/data/businesses";
import { toSlug } from "@/lib/slugs";
import type { Business } from "@/types";

interface BusinessItem {
  _id?: string;
  id?: string;
  name: string;
  role: string;
  industry: string;
  shortDescription?: string;
  fullDescription?: string;
  description?: string;
  location: string;
  image?: string;
}

export default function BusinessesShowcase({
  businesses,
  heading,
  subtitle,
  slugMap,
}: {
  businesses?: Business[];
  heading?: string;
  subtitle?: string;
  slugMap?: Record<string, string>;
}) {
  const displayBusinesses: BusinessItem[] = businesses ?? defaultBusinesses;

  function getSlug(business: BusinessItem): string {
    if (business._id && slugMap?.[business._id]) return slugMap[business._id];
    return toSlug(business.name);
  }

  return (
    <section className="py-20 md:py-28 bg-ivory">
      <div className="container-wide">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Ventures"
            title={heading || "Businesses & Ventures"}
            subtitle={subtitle || "A portfolio of businesses, responsibilities and entrepreneurial pursuits."}
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 [grid-auto-rows:1fr]">
          {displayBusinesses.map((business, index) => (
            <AnimatedSection key={business._id ?? index} delay={index * 0.1} className="h-full">
              <Link href={`/businesses/${getSlug(business)}`} className="block group h-full">
                <div className="card-premium h-full flex flex-col overflow-hidden">
                  {/* Image */}
                  <div className="aspect-[16/9] bg-cream border-b border-sand overflow-hidden">
                    {business.image ? (
                      <img
                        src={business.image}
                        alt={business.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs text-stone tracking-wider uppercase">Business Image</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col p-6 md:p-8">
                    <h3 className="text-lg md:text-xl text-ink font-medium mb-1 group-hover:text-accent transition-colors duration-200">
                      {business.name}
                    </h3>
                    <p className="text-xs tracking-[0.15em] uppercase text-accent mb-3 font-medium">
                      {business.role}
                    </p>

                    <div className="flex items-center text-xs text-stone mb-3">
                      <span className="w-1 h-1 rounded-full bg-stone mr-2" />
                      {business.industry}
                    </div>

                    <div className="flex items-center text-xs text-muted mb-4">
                      <MapPin size={12} className="mr-1" />
                      {business.location}
                    </div>

                    <span className="mt-auto inline-flex items-center text-xs text-charcoal font-medium tracking-wide group-hover:text-accent transition-colors duration-200">
                      View Details
                      <ArrowRight size={14} className="ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
