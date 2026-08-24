import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Globe, Calendar } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import { getBusinessBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const business = await getBusinessBySlug(id);
  if (!business) return { title: "Business Not Found" };
  return {
    title: business.name,
    description: business.shortDescription || business.fullDescription || "",
  };
}

export default async function BusinessDetailPage({ params }: Props) {
  const { id } = await params;
  const business = await getBusinessBySlug(id);
  if (!business) notFound();

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-ivory">
        <div className="container-main">
          <Link
            href="/businesses"
            className="inline-flex items-center text-sm text-muted hover:text-ink transition-colors mb-8"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Businesses
          </Link>
          <p className="text-xs tracking-[0.25em] uppercase text-accent mb-4 font-medium">
            {business.industry}
          </p>
          <h1 className="text-editorial text-4xl md:text-5xl lg:text-6xl text-ink font-medium mb-3">
            {business.name}
          </h1>
          <p className="text-xs tracking-[0.15em] uppercase text-accent font-medium">
            {business.role}
          </p>
        </div>
      </section>

      {/* Image */}
      {business.image && (
        <section className="bg-white py-10 md:py-14">
          <div className="container-wide">
            <div className="aspect-[16/9] max-h-[560px] overflow-hidden rounded-sm">
              <img
                src={business.image}
                alt={business.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Description */}
      <section className="py-16 md:py-24 bg-white border-t border-sand">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20">
            {/* Left — heading + meta */}
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-accent mb-3 font-medium">
                {business.industry}
              </p>
              <h2 className="text-editorial text-2xl md:text-3xl text-ink font-medium mb-4">
                About {business.name}
              </h2>
              <div className="w-12 h-px bg-accent/40 mb-6" />
              <div className="space-y-3 text-sm text-muted">
                <div className="flex items-center">
                  <MapPin size={14} className="mr-2 text-stone" />
                  {business.location}
                </div>
                {business.established && (
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-2 text-stone" />
                    Est. {business.established}
                  </div>
                )}
                {business.website && (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-accent hover:text-accent-dark transition-colors"
                  >
                    <Globe size={14} className="mr-2" />
                    Visit Website
                  </a>
                )}
              </div>
            </div>

            {/* Right — content */}
            <div>
              <p className="text-muted text-base md:text-lg leading-relaxed font-light mb-10">
                {business.fullDescription || business.shortDescription || ""}
              </p>

              {business.responsibilities && business.responsibilities.length > 0 && (
                <div>
                  <h3 className="text-xs tracking-[0.2em] uppercase text-accent mb-5 font-medium">
                    Key Responsibilities
                  </h3>
                  <ul className="space-y-3">
                    {business.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start text-muted text-sm leading-relaxed font-light">
                        <span className="w-1 h-1 rounded-full bg-accent mt-2 mr-3 shrink-0" />
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
