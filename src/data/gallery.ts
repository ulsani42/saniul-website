export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  category: "business" | "portrait" | "event" | "travel" | "personal" | "other";
}

export const galleryImages: GalleryImage[] = [
  {
    id: "gallery-1",
    src: "/images/gallery/gallery-1.jpg",
    alt: "Sani Ul at a business event",
    caption: "Business event",
    category: "event",
  },
  {
    id: "gallery-2",
    src: "/images/gallery/gallery-2.jpg",
    alt: "Professional portrait of Sani Ul",
    caption: "Professional portrait",
    category: "portrait",
  },
  {
    id: "gallery-3",
    src: "/images/gallery/gallery-3.jpg",
    alt: "Business meeting",
    caption: "Business meeting",
    category: "business",
  },
  {
    id: "gallery-4",
    src: "/images/gallery/gallery-4.jpg",
    alt: "Company activity",
    caption: "Company activity",
    category: "business",
  },
  {
    id: "gallery-5",
    src: "/images/gallery/gallery-5.jpg",
    alt: "Conference participation",
    caption: "Conference",
    category: "event",
  },
  {
    id: "gallery-6",
    src: "/images/gallery/gallery-6.jpg",
    alt: "Travel photograph",
    caption: "Travel",
    category: "travel",
  },
];

export const galleryCategories = [
  "all",
  "business",
  "portrait",
  "event",
  "travel",
  "personal",
] as const;
