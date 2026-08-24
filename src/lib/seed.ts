import { getDb } from "./mongodb";

const COLLECTIONS = [
  "users",
  "siteSettings",
  "homepage",
  "about",
  "experiences",
  "businesses",
  "blog",
  "gallery",
];

export async function seedDatabase(): Promise<{ success: boolean; message: string }> {
  try {
    const db = await getDb();

    // Drop all existing collections
    for (const name of COLLECTIONS) {
      try {
        await db.dropCollection(name);
      } catch {
        // collection may not exist — ignore
      }
    }

    const now = new Date();

    // ─── 1. Users ───────────────────────────────────────────────────────────────
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;
    if (!passwordHash) {
      return { success: false, message: "ADMIN_PASSWORD_HASH environment variable is required" };
    }

    await db.collection("users").insertOne({
      email: process.env.ADMIN_EMAIL,
      password: passwordHash,
      name: "Sani Ul",
      role: "admin",
      createdAt: now,
      updatedAt: now,
    });

    // ─── 2. Site Settings ───────────────────────────────────────────────────────
    await db.collection("siteSettings").insertOne({
      siteName: "Sani Ul",
      tagline: "Business Professional \u2022 Entrepreneur \u2022 Operations Manager",
      description:
        "Sani Ul is a business professional, entrepreneur, and Operations Manager at Ayan Trading House in Bangladesh.",
      contact: {
        email: process.env.CONTACT_EMAIL || "contact@example.com",
        phone: "",
        whatsapp: "",
        location: "Dhaka, Bangladesh",
      },
      social: {
        linkedin: "",
        facebook: "",
        instagram: "",
      },
      seo: {
        siteTitle:
          "Sani Ul \u2014 Business Professional \u2022 Entrepreneur \u2022 Operations Manager",
        siteDescription:
          "Sani Ul is a business professional, entrepreneur, and Operations Manager at Ayan Trading House in Bangladesh.",
        ogImage: "/images/og-image.png",
      },
      createdAt: now,
      updatedAt: now,
    });

    // ─── 3. Homepage ────────────────────────────────────────────────────────────
    await db.collection("homepage").insertOne({
      hero: {
        eyebrow: "BUSINESS \u2022 OPERATIONS \u2022 ENTREPRENEURSHIP",
        title: "Building businesses",
        titleAccent: "with discipline, purpose and consistency.",
        description:
          "Sani Ul is a business professional, entrepreneur, and Operations Manager at Ayan Trading House \u2014 committed to building and operating businesses with discipline and purpose.",
        image: "https://picsum.photos/seed/sani-hero/800/1000",
        cta1Text: "Explore My Journey",
        cta1Link: "/experience",
        cta2Text: "Get in Touch",
        cta2Link: "/contact",
      },
      credibility: [
        { label: "CURRENT ROLE", value: "Operations Manager" },
        { label: "ORGANIZATION", value: "Ayan Trading House" },
        { label: "FOCUS", value: "Operations \u2022 Business \u2022 Entrepreneurship" },
        { label: "LOCATION", value: "Bangladesh" },
      ],
      introduction: {
        heading: "A closer look at",
        headingAccent: "Sani Ul",
        text: "Sani Ul is a business professional and entrepreneur based in Bangladesh. As the Operations Manager at Ayan Trading House, he oversees day-to-day operations while actively pursuing entrepreneurial ventures through multiple sole proprietorship businesses. His journey is driven by a commitment to building sustainable businesses with discipline and purpose.",
        image: "https://picsum.photos/seed/sani-about/800/600",
        ctaText: "Read More",
        ctaLink: "/about",
      },
      journey: {
        heading: "Professional Journey",
        subtitle:
          "A timeline of key milestones and roles that have shaped Sani Ul\u2019s career in business and operations.",
      },
      businesses: {
        heading: "Businesses & Ventures",
        subtitle: "A portfolio of businesses and entrepreneurial ventures managed by Sani Ul.",
      },
      cta: {
        heading: "Interested in working together?",
        text: "Whether you would like to discuss a business opportunity, learn more about Sani Ul\u2019s ventures, or simply connect, feel free to reach out.",
        ctaText: "Get in Touch",
        ctaLink: "/contact",
      },
      createdAt: now,
      updatedAt: now,
    });

    // ─── 4. About ──────────────────────────────────────────────────────────────
    await db.collection("about").insertOne({
      hero: {
        heading: "A closer look at",
        headingAccent: "Sani Ul",
        text: "Sani Ul is a business professional and entrepreneur based in Bangladesh. As the Operations Manager at Ayan Trading House, he oversees day-to-day operations while actively pursuing entrepreneurial ventures.",
      },
      portrait: { image: "https://picsum.photos/seed/sani-portrait/600/750" },
      professionalIdentity: {
        title: "Professional Identity",
        text: "With a focus on operations, business management, and responsible execution, Sani approaches every venture with discipline and a long-term perspective. His work spans across trading, operations management, and building businesses from the ground up.",
        additionalText:
          "As the Operations Manager at Ayan Trading House, Sani Ul is responsible for overseeing daily operations, ensuring efficiency, and driving organizational performance across the business. His role involves strategic planning, team leadership, and maintaining strong relationships with partners and stakeholders.",
      },
      philosophy: {
        quote:
          "Good business is built through consistency, relationships and responsible execution.",
      },
      leadership: {
        title: "Leadership & Work",
        items: [
          "As Operations Manager at Ayan Trading House, Sani Ul is responsible for overseeing daily operations, ensuring efficiency, and driving organizational performance.",
          "His approach to business is grounded in practical decision-making, strong relationship management, and a commitment to sustainable growth.",
          "Beyond his role at Ayan Trading House, Sani actively builds and manages sole proprietorship businesses, applying his operational expertise across multiple ventures.",
        ],
      },
      personal: {
        title: "Personal Side",
        content:
          "Outside of work, Sani values continuous learning, meaningful relationships, and contributing to the business landscape of Bangladesh. He believes in the power of discipline, consistency, and building trust in every professional relationship.",
      },
      createdAt: now,
      updatedAt: now,
    });

    // ─── 5. Experiences ────────────────────────────────────────────────────────
    await db.collection("experiences").insertMany([
      {
        role: "Operations Manager",
        organization: "Ayan Trading House",
        period: "2019 \u2013 Present",
        current: true,
        type: "current",
        description:
          "Leading and managing the daily operations of Ayan Trading House, ensuring organizational efficiency and business growth. Overseeing vendor relationships, workflow optimization, and strategic planning.",
        responsibilities: [
          "Overseeing daily operations and workflow management",
          "Ensuring organizational efficiency and productivity",
          "Managing vendor and client relationships",
          "Driving business performance and strategic initiatives",
        ],
        order: 1,
        published: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        role: "Business Owner",
        organization: "Sole Proprietorship Ventures",
        period: "2017 \u2013 Present",
        current: true,
        type: "entrepreneurial",
        description:
          "Building and operating multiple sole proprietorship businesses across various sectors in Bangladesh. From inception to execution, each venture is managed with a focus on sustainable growth.",
        responsibilities: [
          "Establishing and managing new business ventures",
          "Strategic planning and business development",
          "Operations setup and team coordination",
          "Financial planning and performance monitoring",
        ],
        order: 2,
        published: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        role: "Operations Associate",
        organization: "Previous Organization",
        period: "2016 \u2013 2019",
        current: false,
        type: "past",
        description:
          "Gained foundational experience in operations management, contributing to process improvement and team coordination in a dynamic business environment.",
        responsibilities: [
          "Assisted in daily operational activities",
          "Coordinated with cross-functional teams",
          "Supported process improvement initiatives",
          "Built strong professional relationships",
        ],
        order: 3,
        published: true,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // ─── 6. Businesses ─────────────────────────────────────────────────────────
    await db.collection("businesses").insertMany([
      {
        name: "Ayan Trading House",
        role: "Operations Manager",
        industry: "Trading & Commerce",
        shortDescription:
          "A trading company where Sani Ul manages day-to-day operations, vendor relationships, and business growth initiatives.",
        fullDescription:
          "Ayan Trading House is a trading company based in Bangladesh where Sani Ul serves as Operations Manager. In this role, he oversees daily operations, manages vendor and client relationships, and drives strategic business initiatives to ensure sustainable growth. The company operates across multiple sectors, handling import, export, and domestic trading activities.",
        location: "Bangladesh",
        established: "",
        website: "",
        phone: "",
        email: "",
        image: "https://picsum.photos/seed/sani-business-1/600/400",
        galleryImages: [],
        order: 1,
        featured: true,
        published: true,
        responsibilities: [
          "Overseeing daily operations and workflow management",
          "Managing vendor and client relationships",
          "Ensuring organizational efficiency",
          "Driving business performance and growth",
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Personal Ventures",
        role: "Founder & Owner",
        industry: "Entrepreneurship",
        shortDescription:
          "A portfolio of sole proprietorship businesses managed by Sani Ul across various sectors in Bangladesh.",
        fullDescription:
          "Beyond Ayan Trading House, Sani Ul has built a portfolio of sole proprietorship businesses. Each venture is established with a focus on sustainable growth, operational excellence, and long-term value creation. His entrepreneurial approach combines practical experience with strategic vision.",
        location: "Bangladesh",
        established: "",
        website: "",
        phone: "",
        email: "",
        image: "https://picsum.photos/seed/sani-business-2/600/400",
        galleryImages: [],
        order: 2,
        featured: false,
        published: true,
        responsibilities: [
          "Establishing and managing new business ventures",
          "Strategic planning and business development",
          "Operations setup and team coordination",
          "Financial planning and performance monitoring",
        ],
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // ─── 7. Blog ───────────────────────────────────────────────────────────────
    await db.collection("blog").insertMany([
      {
        title: "The Art of Building Sustainable Businesses",
        slug: "art-of-building-sustainable-businesses",
        excerpt:
          "Lessons learned from building and managing businesses in Bangladesh \u2014 the importance of discipline, consistency, and responsible execution.",
        content: `<p>Building a sustainable business requires more than just a good idea. It demands discipline, consistency, and a commitment to responsible execution. Over the years, I\u2019ve learned that the most successful ventures are those built on strong foundations \u2014 solid relationships, efficient operations, and a clear vision for the future.</p><p>In Bangladesh, the business landscape is dynamic and full of opportunities. From trading to operations management, each sector presents unique challenges and rewards. The key is to approach every venture with a long-term perspective, focusing on sustainable growth rather than quick wins.</p><p>One of the most important lessons I\u2019ve learned is the value of relationships. In business, trust is everything. Building strong relationships with partners, vendors, and clients creates a network that supports growth and resilience.</p><p>Operations efficiency is another cornerstone of sustainable business. Streamlining processes, managing resources effectively, and maintaining high standards of quality are essential for long-term success.</p>`,
        featuredImage: "https://picsum.photos/seed/sani-blog-1/800/400",
        author: "Sani Ul",
        category: "Business",
        tags: ["business", "entrepreneurship", "operations", "Bangladesh"],
        published: true,
        publishedAt: new Date("2024-12-15"),
        seo: {
          title: "The Art of Building Sustainable Businesses",
          description: "Lessons learned from building and managing businesses in Bangladesh.",
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "Operations Management: Principles That Drive Results",
        slug: "operations-management-principles",
        excerpt:
          "Key principles of effective operations management that have helped drive organizational performance and business growth.",
        content: `<p>Operations management is the backbone of any successful organization. It\u2019s about ensuring that every process, every workflow, and every team is aligned toward achieving the company\u2019s goals.</p><p>Here are some principles that have guided my approach to operations management:</p><p><strong>Clarity of Process:</strong> Every team member should understand their role and how it contributes to the bigger picture. Clear processes reduce confusion and improve efficiency.</p><p><strong>Continuous Improvement:</strong> The best operations are never static. They evolve through feedback, data analysis, and a commitment to doing better every day.</p><p><strong>Strong Relationships:</strong> Operations don\u2019t happen in isolation. Building strong relationships with vendors, partners, and team members ensures smooth execution.</p><p><strong>Data-Driven Decisions:</strong> Every decision should be backed by data. This removes guesswork and leads to more consistent, predictable results.</p>`,
        featuredImage: "https://picsum.photos/seed/sani-blog-2/800/400",
        author: "Sani Ul",
        category: "Operations",
        tags: ["operations", "management", "leadership", "business"],
        published: true,
        publishedAt: new Date("2024-11-20"),
        seo: {
          title: "Operations Management: Principles That Drive Results",
          description: "Key principles of effective operations management.",
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "Entrepreneurship in Bangladesh: Opportunities and Lessons",
        slug: "entrepreneurship-bangladesh-opportunities",
        excerpt:
          "Exploring the entrepreneurial landscape in Bangladesh \u2014 the opportunities, challenges, and lessons learned along the way.",
        content: `<p>Bangladesh is a land of opportunity for entrepreneurs. The economy is growing, the market is dynamic, and there are countless sectors waiting to be explored.</p><p>Starting a business in Bangladesh comes with its own set of challenges. From navigating regulations to building a reliable team, every step requires patience and persistence. But the rewards \u2014 both personal and professional \u2014 are worth the effort.</p><p>One of the biggest lessons I\u2019ve learned is the importance of starting small and scaling thoughtfully. Every successful business started as an idea. The key is to validate that idea, build a strong foundation, and grow organically.</p><p>Networking is also crucial. In Bangladesh, relationships matter. Building a strong network of mentors, partners, and peers can open doors that would otherwise remain closed.</p><p>As I continue my entrepreneurial journey, I\u2019m excited about the future. Bangladesh has so much potential, and I\u2019m committed to contributing to its growth and development through responsible business practices.</p>`,
        featuredImage: "https://picsum.photos/seed/sani-blog-3/800/400",
        author: "Sani Ul",
        category: "Entrepreneurship",
        tags: ["entrepreneurship", "Bangladesh", "business", "startups"],
        published: true,
        publishedAt: new Date("2024-10-10"),
        seo: {
          title: "Entrepreneurship in Bangladesh: Opportunities and Lessons",
          description: "Exploring the entrepreneurial landscape in Bangladesh.",
        },
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // ─── 8. Gallery ────────────────────────────────────────────────────────────
    await db.collection("gallery").insertMany([
      {
        url: "https://picsum.photos/seed/sani-gallery-1/800/600",
        publicId: "",
        title: "Business Event",
        caption: "At a business networking event",
        altText: "Sani Ul at a business event",
        category: "event",
        order: 1,
        published: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        url: "https://picsum.photos/seed/sani-gallery-2/600/800",
        publicId: "",
        title: "Professional Portrait",
        caption: "Professional headshot",
        altText: "Professional portrait of Sani Ul",
        category: "portrait",
        order: 2,
        published: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        url: "https://picsum.photos/seed/sani-gallery-3/800/600",
        publicId: "",
        title: "Business Meeting",
        caption: "Meeting with partners",
        altText: "Business meeting discussion",
        category: "business",
        order: 3,
        published: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        url: "https://picsum.photos/seed/sani-gallery-4/800/600",
        publicId: "",
        title: "Conference",
        caption: "Industry conference participation",
        altText: "Conference participation",
        category: "event",
        order: 4,
        published: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        url: "https://picsum.photos/seed/sani-gallery-5/800/600",
        publicId: "",
        title: "Office Workspace",
        caption: "Daily operations at work",
        altText: "Office workspace",
        category: "business",
        order: 5,
        published: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        url: "https://picsum.photos/seed/sani-gallery-6/800/600",
        publicId: "",
        title: "Team Collaboration",
        caption: "Working with the team",
        altText: "Team collaboration session",
        category: "business",
        order: 6,
        published: true,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    return { success: true, message: "Database seeded successfully" };
  } catch (error) {
    console.error("Seed error:", error);
    return { success: false, message: "Failed to seed database" };
  }
}
