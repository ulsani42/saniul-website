import { getDb } from "./mongodb";
import { toSlug, toUniqueSlug } from "./slugs";
import type {
  SiteSettings,
  HomepageContent,
  AboutContent,
  Experience,
  Business,
  GalleryImage,
  BlogPost,
} from "@/types";

// Default data to use when database is empty
const defaultSiteSettings: SiteSettings = {
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
    siteTitle: "Sani Ul \u2014 Business Professional \u2022 Entrepreneur \u2022 Operations Manager",
    siteDescription:
      "Sani Ul is a business professional, entrepreneur, and Operations Manager at Ayan Trading House in Bangladesh. Learn about his businesses, professional journey, and how to get in touch.",
    ogImage: "/images/og-image.png",
  },
  updatedAt: new Date(),
};

const defaultHomepage: HomepageContent = {
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
    text: "Sani Ul is a business professional and entrepreneur based in Bangladesh. As the Operations Manager at Ayan Trading House, he oversees day-to-day operations while actively pursuing entrepreneurial ventures through multiple sole proprietorship businesses.",
    image: "https://picsum.photos/seed/sani-about/800/600",
    ctaText: "Read More",
    ctaLink: "/about",
  },
  journey: {
    heading: "Professional Journey",
    subtitle: "A timeline of key milestones and roles that have shaped Sani Ul\u2019s career.",
  },
  businesses: {
    heading: "Businesses & Ventures",
    subtitle: "A portfolio of businesses and entrepreneurial ventures.",
  },
  cta: {
    heading: "Interested in working together?",
    text: "Whether you would like to discuss a business opportunity, learn more about Sani Ul\u2019s ventures, or simply connect, feel free to reach out.",
    ctaText: "Get in Touch",
    ctaLink: "/contact",
  },
  updatedAt: new Date(),
};

const defaultAbout: AboutContent = {
  hero: {
    heading: "A closer look at",
    headingAccent: "Sani Ul",
    text: "Sani Ul is a business professional and entrepreneur based in Bangladesh. As the Operations Manager at Ayan Trading House, he oversees day-to-day operations while actively pursuing entrepreneurial ventures.",
  },
  portrait: {
    image: "https://picsum.photos/seed/sani-portrait/600/750",
  },
  professionalIdentity: {
    title: "Professional Identity",
    text: "With a focus on operations, business management, and responsible execution, Sani approaches every venture with discipline and a long-term perspective. His work spans across trading, operations management, and building businesses from the ground up.",
    additionalText: "As the Operations Manager at Ayan Trading House, Sani Ul is responsible for overseeing daily operations, ensuring efficiency, and driving organizational performance across the business.",
  },
  philosophy: {
    quote: "Good business is built through consistency, relationships and responsible execution.",
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
    content: "Outside of work, Sani values continuous learning, meaningful relationships, and contributing to the business landscape of Bangladesh. He believes in the power of discipline, consistency, and building trust in every professional relationship.",
  },
  updatedAt: new Date(),
};

const defaultExperiences: Experience[] = [
  {
    _id: "default-1",
    role: "Operations Manager",
    organization: "Ayan Trading House",
    period: "2019 \u2013 Present",
    current: true,
    type: "current",
    description: "Leading and managing the daily operations of Ayan Trading House, ensuring organizational efficiency and business growth.",
    responsibilities: [
      "Overseeing daily operations and workflow management",
      "Ensuring organizational efficiency and productivity",
      "Managing vendor and client relationships",
      "Driving business performance and strategic initiatives",
    ],
    order: 1,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "default-2",
    role: "Business Owner",
    organization: "Sole Proprietorship Ventures",
    period: "2017 \u2013 Present",
    current: true,
    type: "entrepreneurial",
    description: "Building and operating multiple sole proprietorship businesses across various sectors in Bangladesh.",
    responsibilities: [
      "Establishing and managing new business ventures",
      "Strategic planning and business development",
      "Operations setup and team coordination",
      "Financial planning and performance monitoring",
    ],
    order: 2,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const defaultBusinesses: Business[] = [
  {
    _id: "default-1",
    name: "Ayan Trading House",
    role: "Operations Manager",
    industry: "Trading & Commerce",
    shortDescription: "A trading company where Sani Ul manages day-to-day operations, vendor relationships, and business growth initiatives.",
    fullDescription: "Ayan Trading House is a trading company based in Bangladesh where Sani Ul serves as Operations Manager. In this role, he oversees daily operations, manages vendor and client relationships, and drives strategic business initiatives to ensure sustainable growth.",
    location: "Bangladesh",
    responsibilities: [
      "Overseeing daily operations and workflow management",
      "Managing vendor and client relationships",
      "Ensuring organizational efficiency",
      "Driving business performance and growth",
    ],
    image: "https://picsum.photos/seed/sani-business-1/600/400",
    galleryImages: [],
    order: 1,
    featured: true,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "default-2",
    name: "Personal Ventures",
    role: "Founder & Owner",
    industry: "Entrepreneurship",
    shortDescription: "A portfolio of sole proprietorship businesses managed by Sani Ul across various sectors in Bangladesh.",
    fullDescription: "Beyond Ayan Trading House, Sani Ul has built a portfolio of sole proprietorship businesses. Each venture is established with a focus on sustainable growth, operational excellence, and long-term value creation.",
    location: "Bangladesh",
    responsibilities: [
      "Establishing and managing new business ventures",
      "Strategic planning and business development",
      "Operations setup and team coordination",
      "Financial planning and performance monitoring",
    ],
    image: "https://picsum.photos/seed/sani-business-2/600/400",
    galleryImages: [],
    order: 2,
    featured: false,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const db = await getDb();
    const settings = await db.collection("siteSettings").findOne({});
    if (!settings) return defaultSiteSettings;
    const { _id, ...rest } = settings;
    return { ...rest, _id: _id?.toString() } as SiteSettings;
  } catch (error) {
    console.error("getSiteSettings error:", error);
    return defaultSiteSettings;
  }
}

export async function getHomepage(): Promise<HomepageContent> {
  try {
    const db = await getDb();
    const homepage = await db.collection("homepage").findOne({});
    if (!homepage) return defaultHomepage;
    const { _id, ...rest } = homepage;
    return { ...rest, _id: _id?.toString() } as HomepageContent;
  } catch (error) {
    console.error("getHomepage error:", error);
    return defaultHomepage;
  }
}

export async function getAbout(): Promise<AboutContent> {
  try {
    const db = await getDb();
    const about = await db.collection("about").findOne({});
    if (!about) return defaultAbout;
    const { _id, ...rest } = about;
    return { ...rest, _id: _id?.toString() } as AboutContent;
  } catch (error) {
    console.error("getAbout error:", error);
    return defaultAbout;
  }
}

export async function getExperiences(): Promise<Experience[]> {
  try {
    const db = await getDb();
    const experiences = await db
      .collection("experiences")
      .find({ published: true })
      .sort({ order: 1 })
      .toArray();
    return experiences.map(({ _id, ...rest }) => ({
      ...rest,
      _id: _id?.toString(),
    })) as Experience[];
  } catch (error) {
    console.error("getExperiences error:", error);
    return defaultExperiences as Experience[];
  }
}

export async function getAllExperiences(): Promise<Experience[]> {
  try {
    const db = await getDb();
    const experiences = await db
      .collection("experiences")
      .find({})
      .sort({ order: 1 })
      .toArray();
    return experiences.map(({ _id, ...rest }) => ({
      ...rest,
      _id: _id?.toString(),
    })) as Experience[];
  } catch (error) {
    console.error("getAllExperiences error:", error);
    return defaultExperiences as Experience[];
  }
}

export async function getBusinesses(): Promise<Business[]> {
  try {
    const db = await getDb();
    const businesses = await db
      .collection("businesses")
      .find({ published: true })
      .sort({ order: 1 })
      .toArray();
    return businesses.map(({ _id, ...rest }) => ({
      ...rest,
      _id: _id?.toString(),
    })) as Business[];
  } catch (error) {
    console.error("getBusinesses error:", error);
    return defaultBusinesses as Business[];
  }
}

export async function getAllBusinesses(): Promise<Business[]> {
  try {
    const db = await getDb();
    const businesses = await db
      .collection("businesses")
      .find({})
      .sort({ order: 1 })
      .toArray();
    return businesses.map(({ _id, ...rest }) => ({
      ...rest,
      _id: _id?.toString(),
    })) as Business[];
  } catch (error) {
    console.error("getAllBusinesses error:", error);
    return defaultBusinesses as Business[];
  }
}

export async function getBusinessById(id: string): Promise<Business | null> {
  try {
    const db = await getDb();
    const { ObjectId } = await import("mongodb");
    let business;
    if (ObjectId.isValid(id)) {
      business = await db.collection("businesses").findOne({ _id: new ObjectId(id) });
    } else {
      business = await db.collection("businesses").findOne({ _id: id } as Record<string, unknown>);
    }
    if (!business) return null;
    const { _id, ...rest } = business;
    return { ...rest, _id: _id?.toString() } as Business;
  } catch (error) {
    console.error("getBusinessById error:", error);
    return null;
  }
}

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  try {
    const db = await getDb();
    const businesses = await db
      .collection("businesses")
      .find({})
      .sort({ order: 1 })
      .toArray();
    const slugs = businesses.map((b) => toSlug(b.name));
    const index = slugs.indexOf(slug);
    if (index === -1) return null;
    const { _id, ...rest } = businesses[index];
    return { ...rest, _id: _id?.toString() } as Business;
  } catch (error) {
    console.error("getBusinessBySlug error:", error);
    return null;
  }
}

export async function getBusinessSlugMap(): Promise<Record<string, string>> {
  try {
    const db = await getDb();
    const businesses = await db
      .collection("businesses")
      .find({})
      .sort({ order: 1 })
      .toArray();
    const usedSlugs: string[] = [];
    const map: Record<string, string> = {};
    for (const b of businesses) {
      const slug = toUniqueSlug(b.name, usedSlugs);
      usedSlugs.push(slug);
      map[b._id.toString()] = slug;
    }
    return map;
  } catch (error) {
    console.error("getBusinessSlugMap error:", error);
    return {};
  }
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const db = await getDb();
    const images = await db
      .collection("gallery")
      .find({ published: true })
      .sort({ order: 1, createdAt: -1 })
      .toArray();
    return images.map(({ _id, ...rest }) => ({
      ...rest,
      _id: _id?.toString(),
    })) as GalleryImage[];
  } catch (error) {
    console.error("getGalleryImages error:", error);
    return [];
  }
}

export async function getAllGalleryImages(): Promise<GalleryImage[]> {
  try {
    const db = await getDb();
    const images = await db
      .collection("gallery")
      .find({})
      .sort({ order: 1 })
      .toArray();
    return images.map(({ _id, ...rest }) => ({
      ...rest,
      _id: _id?.toString(),
    })) as GalleryImage[];
  } catch (error) {
    console.error("getAllGalleryImages error:", error);
    return [];
  }
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const db = await getDb();
    const posts = await db
      .collection("blog")
      .find({ published: true })
      .sort({ publishedAt: -1 })
      .toArray();
    return posts.map(({ _id, ...rest }) => ({
      ...rest,
      _id: _id?.toString(),
    })) as BlogPost[];
  } catch (error) {
    console.error("getPublishedPosts error:", error);
    return [];
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const db = await getDb();
    const posts = await db
      .collection("blog")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return posts.map(({ _id, ...rest }) => ({
      ...rest,
      _id: _id?.toString(),
    })) as BlogPost[];
  } catch (error) {
    console.error("getAllPosts error:", error);
    return [];
  }
}
