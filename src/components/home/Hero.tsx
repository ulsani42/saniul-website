"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface HeroData {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  image: string;
  cta1Text: string;
  cta1Link: string;
  cta2Text: string;
  cta2Link: string;
}

interface CredibilityItem {
  label: string;
  value: string;
}

export default function Hero({
  heroData,
  credibilityItems,
}: {
  heroData?: HeroData;
  credibilityItems?: CredibilityItem[];
}) {
  const prefersReduced = useReducedMotion();

  const eyebrow = heroData?.eyebrow ?? "BUSINESS \u2022 OPERATIONS \u2022 ENTREPRENEURSHIP";
  const description = heroData?.description ?? "Sani Ul is a business professional, entrepreneur, and Operations Manager at Ayan Trading House \u2020 committed to building and operating businesses with discipline and purpose.";
  const cta1Text = heroData?.cta1Text ?? "Explore My Journey";
  const cta1Link = heroData?.cta1Link ?? "/experience";
  const cta2Text = heroData?.cta2Text ?? "Get in Touch";
  const cta2Link = heroData?.cta2Link ?? "/contact";

  const floatingRole = credibilityItems?.[0]?.value ?? "Operations Manager";
  const floatingOrg = credibilityItems?.[1]?.value ?? "Ayan Trading House";

  return (
    <section className="relative flex items-center bg-ivory">
      <div className="container-wide w-full pt-28 pb-16 md:pt-32 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 order-1 lg:order-1">
            <motion.div
              initial={prefersReduced ? {} : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <p className="text-xs tracking-[0.3em] uppercase text-accent mb-6 font-medium">
                {eyebrow}
              </p>
            </motion.div>

            <motion.h1
              className="text-editorial text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-ink font-medium leading-[1.1] mb-6"
              initial={prefersReduced ? {} : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              {heroData?.title ?? "Building businesses"}{" "}
              <span className="text-muted italic">
                {heroData?.titleAccent ?? "with discipline, purpose and consistency."}
              </span>
            </motion.h1>

            <motion.p
              className="text-muted text-base md:text-lg max-w-xl leading-relaxed mb-8 font-light"
              initial={prefersReduced ? {} : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              {description}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
            >
              <Button href={cta1Link} variant="primary" size="lg">
                {cta1Text}
                <ArrowRight size={16} className="ml-2" />
              </Button>
              <Button href={cta2Link} variant="outline" size="lg">
                {cta2Text}
              </Button>
            </motion.div>
          </div>

          {/* Image */}
          <motion.div
            className="lg:col-span-5 order-2 lg:order-2"
            initial={prefersReduced ? {} : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative max-w-md mx-auto lg:mx-0">
              <div className="relative aspect-[3/4] max-h-[480px] bg-cream border border-sand">
                {heroData?.image ? (
                  <img
                    src={heroData.image}
                    alt="Sani Ul"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-sand flex items-center justify-center">
                        <span className="text-3xl text-stone font-serif">SU</span>
                      </div>
                      <p className="text-xs text-stone tracking-wider uppercase">
                        Professional Portrait
                      </p>
                    </div>
                  </div>
                )}
                {/* Decorative corner — right top of image */}
                <div className="absolute top-0 right-0 w-10 h-10 sm:w-12 sm:h-12 border-t-2 border-r-2 border-accent/50 translate-x-2 -translate-y-2 pointer-events-none" />
              </div>

              {/* Floating metadata card */}
              <motion.div
                className="absolute -bottom-6 left-4 md:-left-8 bg-white border border-sand p-4 shadow-lg"
                initial={prefersReduced ? {} : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <p className="text-xs tracking-[0.15em] uppercase text-accent font-medium mb-1">
                  {floatingRole}
                </p>
                <p className="text-sm text-charcoal font-medium">
                  {floatingOrg}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
