"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import { credibilityItems } from "@/data/person";

interface CredibilityItem {
  label: string;
  value: string;
}

export default function CredibilityStrip({ items }: { items?: CredibilityItem[] }) {
  const displayItems = items ?? credibilityItems;

  return (
    <section className="bg-white border-y border-sand">
      <div className="container-wide py-8 md:py-10">
        <AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {displayItems.map((item) => (
              <div key={item.label} className="text-center md:text-left">
                <p className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-stone mb-1 font-medium">
                  {item.label}
                </p>
                <p className="text-sm md:text-base text-charcoal font-medium">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
