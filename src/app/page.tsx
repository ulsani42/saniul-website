import { getHomepage, getExperiences, getBusinesses, getBusinessSlugMap } from "@/lib/data";
import PublicLayout from "@/components/layout/PublicLayout";
import Hero from "@/components/home/Hero";
import CredibilityStrip from "@/components/home/CredibilityStrip";
import Introduction from "@/components/home/Introduction";
import ProfessionalJourney from "@/components/home/ProfessionalJourney";
import BusinessesShowcase from "@/components/home/BusinessesShowcase";
import CTA from "@/components/home/CTA";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [homepage, experiences, businesses, slugMap] = await Promise.all([
    getHomepage(),
    getExperiences(),
    getBusinesses(),
    getBusinessSlugMap(),
  ]);

  return (
    <PublicLayout>
      <Hero heroData={homepage.hero} credibilityItems={homepage.credibility} />
      <CredibilityStrip items={homepage.credibility} />
      <Introduction data={homepage.introduction} />
      <ProfessionalJourney
        experiences={experiences}
        heading={homepage.journey.heading}
        subtitle={homepage.journey.subtitle}
      />
      <BusinessesShowcase
        businesses={businesses}
        heading={homepage.businesses.heading}
        subtitle={homepage.businesses.subtitle}
        slugMap={slugMap}
      />
      <CTA data={homepage.cta} />
    </PublicLayout>
  );
}
