export interface Business {
  id: string;
  name: string;
  industry: string;
  role: string;
  description: string;
  location: string;
  established?: string;
  website?: string;
  image?: string;
  featured: boolean;
  responsibilities?: string[];
}

export const businesses: Business[] = [
  {
    id: "ayan-trading-house",
    name: "Ayan Trading House",
    industry: "[Industry]",
    role: "Operations Manager",
    description:
      "Ayan Trading House is a trading business where Sani Ul serves as Operations Manager, overseeing daily operations and driving organizational performance.",
    location: "Bangladesh",
    established: "[Year]",
    website: "[Website URL]",
    image: "/images/business-ayan.jpg",
    featured: true,
    responsibilities: [
      "Overseeing daily operations",
      "Managing operational workflows",
      "Ensuring organizational efficiency",
      "Driving business performance",
    ],
  },
  {
    id: "business-two",
    name: "[Business Name]",
    industry: "[Industry]",
    role: "[Role]",
    description:
      "[Business Description — a brief overview of what this business does and Sani's involvement.]",
    location: "Bangladesh",
    established: "[Year]",
    image: "/images/business-placeholder.jpg",
    featured: false,
    responsibilities: ["[Responsibility 1]", "[Responsibility 2]"],
  },
  {
    id: "business-three",
    name: "[Business Name]",
    industry: "[Industry]",
    role: "[Role]",
    description:
      "[Business Description — a brief overview of what this business does and Sani's involvement.]",
    location: "Bangladesh",
    established: "[Year]",
    image: "/images/business-placeholder.jpg",
    featured: false,
    responsibilities: ["[Responsibility 1]", "[Responsibility 2]"],
  },
];
