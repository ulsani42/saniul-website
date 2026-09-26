"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
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

export default function ExperienceContent({ experiences }: { experiences?: Experience[] }) {
  const displayExperiences: ExperienceItem[] = experiences ?? defaultExperiences;

  return (
    <>
      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-20 bg-ivory">
        <div className="container-main">
          <AnimatedSection>
            <p className="text-xs tracking-[0.25em] uppercase text-accent mb-4 font-medium">
              Career
            </p>
            <h1 className="text-editorial text-4xl md:text-5xl lg:text-6xl text-ink font-medium mb-6">
              Professional{" "}
              <span className="italic text-muted">journey</span>
            </h1>
            <p className="text-muted text-base md:text-lg max-w-2xl leading-relaxed font-light">
              A timeline of professional milestones, roles, and entrepreneurial
              pursuits that have shaped Sani Ul&apos;s career.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Experience Cards */}
      <section className="py-16 md:py-24 bg-white border-t border-sand">
        <div className="container-main">
          <div className="space-y-12">
            {displayExperiences.map((exp, index) => (
              <AnimatedSection key={getKey(exp, index)} delay={index * 0.1}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                  {/* Left — Card */}
                  <div className="card-premium p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          exp.type === "current" ? "bg-accent" : "bg-stone"
                        }`}
                      />
                      <p className="text-xs tracking-[0.2em] uppercase text-stone font-medium">
                        {exp.period}
                      </p>
                    </div>
                    <h2 className="text-2xl md:text-3xl text-ink font-medium mb-2">
                      {exp.role}
                    </h2>
                    <p className="text-accent text-sm font-medium mb-4">
                      {exp.organization}
                    </p>
                    <p className="text-muted text-sm leading-relaxed font-light">
                      {exp.description}
                    </p>
                  </div>

                  {/* Right — Responsibilities */}
                  {exp.responsibilities.length > 0 && (
                    <div className="bg-ivory border border-sand p-6 md:p-8">
                      <p className="text-xs tracking-[0.15em] uppercase text-stone mb-4 font-medium">
                        Key Responsibilities
                      </p>
                      <ul className="space-y-3">
                        {exp.responsibilities.map((resp, i) => (
                          <li
                            key={i}
                            className="flex items-start text-sm text-muted font-light"
                          >
                            <span className="w-1 h-1 rounded-full bg-accent mt-2 mr-3 shrink-0" />
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
