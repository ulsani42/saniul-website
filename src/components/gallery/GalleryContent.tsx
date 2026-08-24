"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { galleryImages as defaultImages, galleryCategories as defaultCategories } from "@/data/gallery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { GalleryImage as GalleryImageType } from "@/types";

interface GalleryImageItem {
  _id?: string;
  id?: string;
  url?: string;
  title?: string;
  caption?: string;
  altText?: string;
  alt?: string;
  category: string;
}

function getKey(item: GalleryImageItem, index: number): string {
  return String(item._id ?? item.id ?? index);
}

export default function GalleryContent({
  images,
  categories,
}: {
  images?: GalleryImageType[];
  categories?: string[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const prefersReduced = useReducedMotion();

  const displayImages: GalleryImageItem[] = images ?? defaultImages;
  const displayCategories = categories ?? defaultCategories;

  const filteredImages =
    activeCategory === "all"
      ? displayImages
      : displayImages.filter((img) => img.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
  };

  const goPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(
      (lightboxIndex - 1 + filteredImages.length) % filteredImages.length
    );
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    },
    [lightboxIndex, filteredImages.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-20 bg-ivory">
        <div className="container-main">
          <AnimatedSection>
            <p className="text-xs tracking-[0.25em] uppercase text-accent mb-4 font-medium">
              Gallery
            </p>
            <h1 className="text-editorial text-4xl md:text-5xl lg:text-6xl text-ink font-medium mb-6">
              Visual{" "}
              <span className="italic text-muted">moments</span>
            </h1>
            <p className="text-muted text-base md:text-lg max-w-2xl leading-relaxed font-light">
              A collection of professional photographs from business events,
              meetings, and activities.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Filter */}
      <section className="pb-8 bg-ivory">
        <div className="container-wide">
          <AnimatedSection>
            <div className="flex flex-wrap gap-2">
              {displayCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-xs tracking-wider uppercase transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-ink text-white"
                      : "bg-white text-muted border border-sand hover:border-stone hover:text-charcoal"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-20 md:pb-28 bg-ivory">
        <div className="container-wide">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredImages.map((image, index) => (
              <AnimatedSection key={getKey(image, index)} delay={index * 0.05}>
                <div
                  className="cursor-pointer group relative overflow-hidden bg-cream border border-sand"
                  onClick={() => openLightbox(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openLightbox(index);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View ${image.altText ?? image.alt ?? image.title ?? "Photo"}`}
                >
                  {image.url ? (
                    <div className="aspect-[4/3] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.url}
                        alt={image.altText || image.alt || image.title || "Photo"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] flex items-center justify-center">
                      <span className="text-xs text-stone tracking-wider uppercase">
                        {image.caption || image.title || "Photo"}
                      </span>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-all duration-300 flex items-end p-4">
                    <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {image.caption || image.title}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted text-sm">
                No images in this category yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={prefersReduced ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReduced ? {} : { opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/90 backdrop-blur-sm flex flex-col items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-10">
              <p className="text-white/60 text-xs tracking-wider uppercase">
                {filteredImages[lightboxIndex]?.category}
              </p>
              <div className="flex items-center gap-4">
                <p className="text-white/50 text-sm tabular-nums">
                  {String(lightboxIndex + 1).padStart(2, "0")} / {String(filteredImages.length).padStart(2, "0")}
                </p>
                <button
                  onClick={closeLightbox}
                  className="text-white/50 hover:text-white transition-colors duration-200"
                  aria-label="Close lightbox"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Prev */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-all duration-200 z-10 w-10 h-10 flex items-center justify-center rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Next */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-all duration-200 z-10 w-10 h-10 flex items-center justify-center rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={prefersReduced ? {} : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={prefersReduced ? {} : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="max-w-5xl max-h-[78vh] w-full mx-6 md:mx-12 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {filteredImages[lightboxIndex]?.url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={filteredImages[lightboxIndex].url}
                  alt={filteredImages[lightboxIndex].altText || filteredImages[lightboxIndex].alt || filteredImages[lightboxIndex].title || "Photo"}
                  className="max-w-full max-h-[78vh] object-contain rounded-sm"
                />
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-xl text-white/40 font-serif">SU</span>
                  </div>
                  <p className="text-white/50 text-sm">
                    {filteredImages[lightboxIndex]?.caption || filteredImages[lightboxIndex]?.title || "Photo"}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Bottom bar — caption + hint */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-10">
              <p className="text-white/50 text-sm max-w-md truncate">
                {filteredImages[lightboxIndex]?.caption || filteredImages[lightboxIndex]?.title || ""}
              </p>
              <p className="text-white/25 text-xs hidden md:block">
                Press <kbd className="px-1.5 py-0.5 border border-white/15 rounded text-[10px] mx-0.5">ESC</kbd> to close
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
