"use client";

import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
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

export default function BusinessesContent({ businesses, slugMap }: { businesses?: Business[]; slugMap?: Record<string, string> }) {
  const displayBusinesses: BusinessItem[] = businesses ?? defaultBusinesses;

  function getSlug(business: BusinessItem): string {
    if (business._id && slugMap?.[business._id]) return slugMap[business._id];
    return toSlug(business.name);
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-20 bg-ivory">
        <div className="container-main">
          <AnimatedSection>
            <p className="text-xs tracking-[0.25em] uppercase text-accent mb-4 font-medium">
              Portfolio
            </p>
            <h1 className="text-editorial text-4xl md:text-5xl lg:text-6xl text-ink font-medium mb-6">
              Businesses &{" "}
              <span className="italic text-muted">Ventures</span>
            </h1>
            <p className="text-muted text-base md:text-lg max-w-2xl leading-relaxed font-light">
              A portfolio of businesses, responsibilities and entrepreneurial
              pursuits managed by Sani Ul.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Businesses */}
      <section className="py-16 md:py-24 bg-white border-t border-sand">
        <div className="container-wide">
          <div className="space-y-6">
            {displayBusinesses.map((business, index) => (
              <AnimatedSection key={business._id ?? index} delay={index * 0.1}>
                <Link href={`/businesses/${getSlug(business)}`} className="block group">
                  <div className="card-premium overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {/* Image — left side */}
                      <div className="order-1 w-full md:w-[40%] shrink-0 bg-cream border-b md:border-b-0 md:border-r border-sand overflow-hidden">
                        {business.image ? (
                          <img
                            src={business.image}
                            alt={business.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center min-h-[160px]">
                            <span className="text-xs text-stone tracking-wider uppercase">Business Image</span>
                          </div>
                        )}
                      </div>

                      {/* Content — right side, drives card height */}
                      <div className="order-2 flex flex-col md:justify-center py-2 px-5 md:px-8 lg:px-10 md:flex-1">
                        <h3 className="text-xl md:text-2xl text-ink font-medium mb-1 group-hover:text-accent transition-colors duration-200">
                          {business.name}
                        </h3>
                        <p className="text-xs tracking-[0.15em] uppercase text-accent mb-3 font-medium">
                          {business.role}
                        </p>

                        <div className="flex items-center text-xs text-stone mb-2">
                          <span className="w-1 h-1 rounded-full bg-stone mr-2" />
                          {business.industry}
                        </div>

                        <div className="flex items-center text-xs text-muted mb-4">
                          <MapPin size={12} className="mr-1" />
                          {business.location}
                        </div>

                        <span className="inline-flex items-center text-xs text-charcoal font-medium tracking-wide group-hover:text-accent transition-colors duration-200">
                          View Details
                          <ArrowRight size={14} className="ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
