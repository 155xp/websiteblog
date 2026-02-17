import postsData from "./posts-generated.json";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  year: string;
  tags?: string[];
  cover?: string;
}

export function getAllPosts(): PostMeta[] {
  return postsData as PostMeta[];
}
