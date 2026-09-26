import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data";
import PublicLayout from "@/components/layout/PublicLayout";
import ContactContent from "@/components/contact/ContactContent";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Sani Ul — business professional, entrepreneur, and Operations Manager at Ayan Trading House in Bangladesh. Contact for business inquiries, partnerships, or general inquiries.",
  keywords: [
    "contact Sani Ul",
    "Sani Ul phone",
    "Sani Ul email",
    "Ayan Trading House contact",
    "business inquiry Bangladesh",
  ],
  openGraph: {
    title: "Contact Sani Ul — Business Professional & Entrepreneur",
    description:
      "Get in touch with Sani Ul for business inquiries, partnerships, or general inquiries.",
  },
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return (
    <PublicLayout>
      <ContactContent
        contactData={{
          email: settings.contact.email,
          phone: settings.contact.phone,
          whatsapp: settings.contact.whatsapp,
          location: settings.contact.location,
        }}
      />
    </PublicLayout>
  );
}
