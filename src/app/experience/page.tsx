import type { Metadata } from "next";
import { getExperiences } from "@/lib/data";
import PublicLayout from "@/components/layout/PublicLayout";
import ExperienceContent from "@/components/experience/ExperienceContent";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Professional journey and career milestones of Sani Ul — Operations Manager at Ayan Trading House, entrepreneur, and business professional in Bangladesh.",
  keywords: [
    "Sani Ul experience",
    "Sani Ul career",
    "operations manager experience",
    "Ayan Trading House",
    "business professional Bangladesh",
  ],
  openGraph: {
    title: "Professional Experience — Sani Ul",
    description:
      "Professional journey and career milestones of Sani Ul — Operations Manager at Ayan Trading House.",
  },
};

export const dynamic = "force-dynamic";

export default async function ExperiencePage() {
  const experiences = await getExperiences();
  return (
    <PublicLayout>
      <ExperienceContent experiences={experiences} />
    </PublicLayout>
  );
}
