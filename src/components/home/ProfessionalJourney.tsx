"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { experiences as defaultExperiences } from "@/data/experience";
import type { Experience } from "@/types";

interface ExperienceItem {
  _id?: string;
  id?: string;
  role: string;
  organization: string;
  period: string;
  type: "current" | "past" | "entrepreneurial";
  description: string;
  responsibilities: string[];
}

function getKey(item: ExperienceItem, index: number): string {
  return String(item._id ?? item.id ?? index);
}

export default function ProfessionalJourney({
  experiences,
  heading,
  subtitle,
}: {
  experiences?: Experience[];
  heading?: string;
  subtitle?: string;
}) {
  const displayExperiences: ExperienceItem[] = experiences ?? defaultExperiences;

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container-main">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Journey"
            title={heading || "Professional path"}
            subtitle={subtitle || "A timeline of professional milestones and entrepreneurial pursuits."}
          />
        </AnimatedSection>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-sand" />

          <div className="space-y-12">
            {displayExperiences.map((exp, index) => (
              <AnimatedSection key={getKey(exp, index)} delay={index * 0.1}>
                <div className="relative pl-12 md:pl-20">
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-2.5 md:left-6 w-3 h-3 rounded-full border-2 ${
                      exp.type === "current"
                        ? "bg-accent border-accent"
                        : "bg-white border-sand"
                    }`}
                  />

                  <div className="group">
                    <p className="text-xs tracking-[0.2em] uppercase text-stone mb-2 font-medium">
                      {exp.period}
                    </p>
                    <h3 className="text-xl md:text-2xl text-ink font-medium mb-1">
                      {exp.role}
                    </h3>
                    <p className="text-accent text-sm font-medium mb-3">
                      {exp.organization}
                    </p>
                    <p className="text-muted text-sm leading-relaxed max-w-xl font-light">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
