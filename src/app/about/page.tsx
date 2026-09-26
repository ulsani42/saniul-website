import type { Metadata } from "next";
import { getAbout } from "@/lib/data";
import PublicLayout from "@/components/layout/PublicLayout";
import AboutContent from "@/components/about/AboutContent";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Sani Ul — a business professional, entrepreneur, and Operations Manager at Ayan Trading House in Bangladesh. Discover his professional journey, business philosophy, and leadership approach.",
  keywords: [
    "Sani Ul about",
    "Sani Ul biography",
    "Sani Ul entrepreneur",
    "Ayan Trading House operations manager",
    "Bangladesh businessman",
  ],
  openGraph: {
    title: "About Sani Ul — Business Professional & Entrepreneur",
    description:
      "Learn about Sani Ul — a business professional, entrepreneur, and Operations Manager at Ayan Trading House in Bangladesh.",
  },
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const aboutData = await getAbout();
  return (
    <PublicLayout>
      <AboutContent aboutData={aboutData} />
    </PublicLayout>
  );
}
