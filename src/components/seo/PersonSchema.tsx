export default function PersonSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Sani Ul",
    jobTitle: "Operations Manager",
    worksFor: {
      "@type": "Organization",
      name: "Ayan Trading House",
    },
    description:
      "Sani Ul is a business professional, entrepreneur, and Operations Manager at Ayan Trading House based in Bangladesh.",
    url: "https://saniul.com",
    sameAs: [],
    address: {
      "@type": "PostalAddress",
      addressCountry: "BD",
    },
    knowsAbout: [
      "Business Operations",
      "Entrepreneurship",
      "Business Management",
      "Operations Management",
      "Trading",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
