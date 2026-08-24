"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { person, aboutSections } from "@/data/person";
import type { AboutContent as AboutContentType } from "@/types";

export default function AboutContent({ aboutData }: { aboutData?: AboutContentType }) {
  const heroText = aboutData?.hero?.text ?? person.aboutIntro;
  const professionalText = aboutData?.professionalIdentity?.text ?? person.aboutProfessional;
  const additionalText = aboutData?.professionalIdentity?.additionalText ?? "As the Operations Manager at Ayan Trading House, Sani Ul is responsible for overseeing daily operations, ensuring efficiency, and driving organizational performance across the business.";
  const philosophyQuote = aboutData?.philosophy?.quote ?? person.aboutPhilosophy;
  const leadershipTitle = aboutData?.leadership?.title ?? aboutSections.leadership.title;
  const leadershipItems = aboutData?.leadership?.items ?? aboutSections.leadership.content;
  const personalTitle = aboutData?.personal?.title ?? aboutSections.personal.title;
  const personalContent = aboutData?.personal?.content ?? aboutSections.personal.content;

  return (
    <>
      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-20 bg-ivory">
        <div className="container-main">
          <AnimatedSection>
            <p className="text-xs tracking-[0.25em] uppercase text-accent mb-4 font-medium">
              About
            </p>
            <h1 className="text-editorial text-4xl md:text-5xl lg:text-6xl text-ink font-medium mb-6">
              {aboutData?.hero?.heading ?? "A closer look at"}{" "}
              <span className="italic text-muted">
                {aboutData?.hero?.headingAccent ?? "Sani Ul"}
              </span>
            </h1>
            <p className="text-muted text-base md:text-lg max-w-2xl leading-relaxed font-light">
              {heroText}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Portrait */}
      <section className="py-16 md:py-24 bg-ivory">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <AnimatedSection className="order-2 lg:order-1">
              <div className="relative max-w-lg mx-auto lg:mx-0">
                <div className="relative aspect-[3/4] max-h-[540px] bg-cream border border-sand">
                  {aboutData?.portrait?.image ? (
                    <img
                      src={aboutData.portrait.image}
                      alt="Sani Ul"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-sand flex items-center justify-center">
                          <span className="text-2xl text-stone font-serif">SU</span>
                        </div>
                        <p className="text-xs text-stone tracking-wider uppercase">Professional Portrait</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-4 -right-4 w-full h-full border border-accent/20 -z-10" />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2} className="order-1 lg:order-2">
              <div>
                <h2 className="text-editorial text-2xl md:text-3xl text-ink font-medium mb-6">
                  {aboutData?.professionalIdentity?.title ?? "Professional Identity"}
                </h2>
                <p className="text-muted text-base leading-relaxed font-light mb-6">
                  {professionalText}
                </p>
                <p className="text-muted text-base leading-relaxed font-light">
                  {additionalText}
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Philosophy Quote */}
      <section className="py-16 md:py-24 bg-white border-y border-sand">
        <div className="container-narrow">
          <AnimatedSection>
            <blockquote className="text-center">
              <div className="w-12 h-px bg-accent mx-auto mb-8" />
              <p className="text-editorial text-2xl md:text-3xl lg:text-4xl text-ink font-medium italic leading-snug mb-6">
                &ldquo;{philosophyQuote}&rdquo;
              </p>
              <div className="w-12 h-px bg-accent mx-auto mb-6" />
              <p className="text-sm text-stone tracking-wider uppercase">
                {aboutData?.hero?.headingAccent ?? "Sani Ul"}
              </p>
            </blockquote>
          </AnimatedSection>
        </div>
      </section>

      {/* Leadership & Work */}
      <section className="py-16 md:py-24 bg-ivory">
        <div className="container-main">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Approach"
              title={leadershipTitle}
            />
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadershipItems.map((text, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="p-6 bg-white border border-sand">
                  <div className="w-8 h-px bg-accent mb-4" />
                  <p className="text-muted text-sm leading-relaxed font-light">
                    {text}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Side */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-narrow">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Beyond Work"
              title={personalTitle}
              align="center"
            />
            <p className="text-center text-muted text-base leading-relaxed font-light max-w-xl mx-auto">
              {personalContent}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Career Highlights */}
      <section className="py-16 md:py-24 bg-ivory">
        <div className="container-main">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Milestones"
              title="Career Highlights"
            />
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { year: "Operations Leadership", title: "Ayan Trading House", desc: "Leading day-to-day operations, managing vendor relationships, and driving organizational efficiency across the business." },
              { year: "Entrepreneurial Growth", title: "Sole Proprietorships", desc: "Building and managing multiple sole proprietorship businesses across various sectors, applying operational expertise to new ventures." },
              { year: "Strategic Execution", title: "Business Development", desc: "Developing and implementing strategies that balance short-term performance with long-term sustainable growth." },
              { year: "Relationship Building", title: "Stakeholder Management", desc: "Cultivating strong relationships with partners, vendors, and team members to support business objectives and growth." },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="flex gap-6 p-6 bg-white border border-sand">
                  <div className="shrink-0 w-1 h-full bg-accent/30 rounded-full" />
                  <div>
                    <p className="text-xs tracking-[0.15em] uppercase text-accent font-medium mb-1">
                      {item.year}
                    </p>
                    <h3 className="text-lg text-ink font-medium mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24 bg-white border-y border-sand">
        <div className="container-narrow">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Principles"
              title="Core Values"
              align="center"
            />
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            {[
              { icon: "01", title: "Discipline", desc: "Consistent execution and structured approach to every business endeavor." },
              { icon: "02", title: "Integrity", desc: "Building trust through transparent relationships and responsible business practices." },
              { icon: "03", title: "Growth", desc: "Continuous improvement and pursuit of excellence across all ventures." },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="text-center p-6">
                  <span className="text-3xl text-accent/40 font-serif">{item.icon}</span>
                  <h3 className="text-lg text-ink font-medium mt-4 mb-2">{item.title}</h3>
                  <p className="text-sm text-muted leading-relaxed font-light">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16 md:py-24 bg-ivory">
        <div className="container-narrow">
          <AnimatedSection>
            <blockquote className="text-center">
              <div className="w-12 h-px bg-accent mx-auto mb-8" />
              <p className="text-editorial text-xl md:text-2xl text-ink font-medium leading-snug mb-6">
                To build and operate businesses that create lasting value, driven by discipline, consistency, and meaningful relationships.
              </p>
              <div className="w-12 h-px bg-accent mx-auto mb-6" />
              <p className="text-sm text-stone tracking-wider uppercase">
                Vision Statement
              </p>
            </blockquote>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
