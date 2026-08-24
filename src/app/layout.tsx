import type { Metadata } from "next";
import { person } from "@/data/person";
import CustomCursor from "@/components/ui/CustomCursor";
import PersonSchema from "@/components/seo/PersonSchema";
import WebsiteSchema from "@/components/seo/WebsiteSchema";
import "./globals.css";
import "./cursor.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://saniul.com"),
  title: {
    default: `${person.name} — ${person.title}`,
    template: `%s — ${person.name}`,
  },
  description: `${person.name} is a business professional, entrepreneur, and Operations Manager at ${person.organization} in Bangladesh. Explore his businesses, professional journey, and get in touch.`,
  keywords: [
    person.name,
    "Sani Ul",
    "Sani Ul Bangladesh",
    "entrepreneur Bangladesh",
    "business professional Bangladesh",
    "operations manager",
    "Ayan Trading House",
    "businessman Bangladesh",
    "entrepreneurship",
    "business operations",
    "trading house Bangladesh",
    "business leader Bangladesh",
    "sole proprietorship Bangladesh",
  ],
  authors: [{ name: person.name }],
  creator: person.name,
  publisher: person.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://saniul.com",
    siteName: person.name,
    title: `${person.name} — ${person.title}`,
    description: `${person.name} is a business professional, entrepreneur, and Operations Manager at ${person.organization} in Bangladesh.`,
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: `${person.name} — ${person.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${person.name} — ${person.title}`,
    description: `${person.name} is a business professional, entrepreneur, and Operations Manager at ${person.organization} in Bangladesh.`,
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://saniul.com",
  },
  icons: {
    icon: "/images/navbar.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <PersonSchema />
        <WebsiteSchema />
      </head>
      <body className="antialiased">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
