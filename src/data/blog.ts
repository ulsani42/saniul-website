export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  slug: string;
  published: boolean;
}

export const blogPosts: BlogPost[] = [
  // No published articles yet. Articles can be added here in the future.
  // Example:
  // {
  //   id: "post-1",
  //   title: "Lessons in Operations Management",
  //   excerpt: "Key insights from managing operations at scale.",
  //   date: "2026-01-15",
  //   category: "Operations",
  //   slug: "lessons-in-operations-management",
  //   published: true,
  // },
];

export const publishedPosts = blogPosts.filter((post) => post.published);
