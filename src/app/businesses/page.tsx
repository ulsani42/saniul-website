import type { Metadata } from "next";
import { getBusinesses, getBusinessSlugMap } from "@/lib/data";
import PublicLayout from "@/components/layout/PublicLayout";
import BusinessesContent from "@/components/businesses/BusinessesContent";

export const metadata: Metadata = {
  title: "Businesses",
  description:
    "Explore the businesses and ventures of Sani Ul — a portfolio of entrepreneurial pursuits, trading operations, and business management in Bangladesh.",
  keywords: [
    "Sani Ul businesses",
    "Sani Ul ventures",
    "Ayan Trading House",
    "Bangladesh trading business",
    "entrepreneurship Bangladesh",
  ],
  openGraph: {
    title: "Businesses & Ventures — Sani Ul",
    description:
      "Explore the businesses and ventures of Sani Ul — a portfolio of entrepreneurial pursuits in Bangladesh.",
  },
};

export const dynamic = "force-dynamic";

export default async function BusinessesPage() {
  const [businesses, slugMap] = await Promise.all([getBusinesses(), getBusinessSlugMap()]);
  return (
    <PublicLayout>
      <BusinessesContent businesses={businesses} slugMap={slugMap} />
    </PublicLayout>
  );
}
