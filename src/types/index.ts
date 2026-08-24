export interface SiteSettings {
  _id?: string;
  siteName: string;
  tagline: string;
  description: string;
  logo?: string;
  favicon?: string;
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    location: string;
  };
  social: {
    linkedin: string;
    facebook: string;
    instagram: string;
  };
  seo: {
    siteTitle: string;
    siteDescription: string;
    ogImage: string;
  };
  updatedAt: Date;
}

export interface HomepageContent {
  _id?: string;
  hero: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    description: string;
    image: string;
    cta1Text: string;
    cta1Link: string;
    cta2Text: string;
    cta2Link: string;
  };
  credibility: {
    label: string;
    value: string;
  }[];
  introduction: {
    heading: string;
    headingAccent: string;
    text: string;
    image: string;
    ctaText: string;
    ctaLink: string;
  };
  journey: {
    heading: string;
    subtitle: string;
  };
  businesses: {
    heading: string;
    subtitle: string;
  };
  cta: {
    heading: string;
    text: string;
    ctaText: string;
    ctaLink: string;
  };
  updatedAt: Date;
}

export interface AboutContent {
  _id?: string;
  hero: {
    heading: string;
    headingAccent: string;
    text: string;
  };
  portrait: {
    image: string;
  };
  professionalIdentity: {
    title: string;
    text: string;
    additionalText: string;
  };
  philosophy: {
    quote: string;
  };
  leadership: {
    title: string;
    items: string[];
  };
  personal: {
    title: string;
    content: string;
  };
  updatedAt: Date;
}

export interface Experience {
  _id?: string;
  role: string;
  organization: string;
  period: string;
  startDate?: string;
  endDate?: string;
  current: boolean;
  type: "current" | "past" | "entrepreneurial";
  description: string;
  responsibilities: string[];
  image?: string;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Business {
  _id?: string;
  name: string;
  role: string;
  industry: string;
  shortDescription: string;
  fullDescription: string;
  location: string;
  established?: string;
  website?: string;
  phone?: string;
  email?: string;
  image?: string;
  galleryImages: string[];
  order: number;
  featured: boolean;
  published: boolean;
  responsibilities: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GalleryImage {
  _id?: string;
  url: string;
  publicId: string;
  title: string;
  caption: string;
  altText: string;
  category: string;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  category: string;
  tags: string[];
  published: boolean;
  publishedAt?: Date;
  seo: {
    title: string;
    description: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactMessage {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface AdminUser {
  _id?: string;
  email: string;
  password: string;
  name: string;
  role: "admin";
  createdAt: Date;
  updatedAt: Date;
}
