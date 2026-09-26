export default function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Sani Ul",
    description:
      "Sani Ul — Business Professional, Entrepreneur, and Operations Manager at Ayan Trading House.",
    url: "https://saniul.vercel.app",
    author: {
      "@type": "Person",
      name: "Sani Ul",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://saniul.vercel.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
