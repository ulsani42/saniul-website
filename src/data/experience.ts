export interface Experience {
  id: string;
  role: string;
  organization: string;
  period: string;
  type: "current" | "past" | "entrepreneurial";
  description: string;
  responsibilities: string[];
}

export const experiences: Experience[] = [
  {
    id: "current-role",
    role: "Operations Manager",
    organization: "Ayan Trading House",
    period: "Present",
    type: "current",
    description:
      "Leading operations at Ayan Trading House, overseeing daily business activities and driving organizational performance.",
    responsibilities: [
      "Managing day-to-day operations",
      "Overseeing operational workflows and processes",
      "Ensuring efficiency across business functions",
      "Driving performance and accountability",
      "Building and maintaining key business relationships",
    ],
  },
  {
    id: "entrepreneurial-ventures",
    role: "Business Owner",
    organization: "Sole Proprietorship Businesses",
    period: "Ongoing",
    type: "entrepreneurial",
    description:
      "Building and operating multiple sole proprietorship businesses, applying operational expertise across different ventures.",
    responsibilities: [
      "Establishing and managing business operations",
      "Strategic planning and execution",
      "Business development and growth",
      "Financial oversight and management",
    ],
  },
  {
    id: "earlier-experience",
    role: "[Role Title]",
    organization: "[Organization Name]",
    period: "[Start Date] — [End Date]",
    type: "past",
    description:
      "[Description of earlier professional experience. Replace with actual career history.]",
    responsibilities: [
      "[Responsibility 1]",
      "[Responsibility 2]",
      "[Responsibility 3]",
    ],
  },
];
