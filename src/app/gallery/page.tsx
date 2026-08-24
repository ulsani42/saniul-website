import type { Metadata } from "next";
import { getGalleryImages } from "@/lib/data";
import PublicLayout from "@/components/layout/PublicLayout";
import GalleryContent from "@/components/gallery/GalleryContent";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Professional gallery featuring business events, meetings, conferences, and activities of Sani Ul — business professional and entrepreneur in Bangladesh.",
  keywords: [
    "Sani Ul gallery",
    "Sani Ul photos",
    "business events Bangladesh",
    "entrepreneur photos",
  ],
  openGraph: {
    title: "Gallery — Sani Ul",
    description:
      "Professional gallery featuring business events and activities of Sani Ul.",
  },
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await getGalleryImages();
  return (
    <PublicLayout>
      <GalleryContent images={images} />
    </PublicLayout>
  );
}
