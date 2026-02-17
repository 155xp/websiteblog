import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  year: string;
  tags?: string[];
  cover?: string;
}

export interface Post extends PostMeta {
  content: string;
}

function walkPostDirs(): { year: string; slug: string; dir: string }[] {
  const results: { year: string; slug: string; dir: string }[] = [];

  if (!fs.existsSync(POSTS_DIR)) return results;

  const years = fs
    .readdirSync(POSTS_DIR)
    .filter((y) => fs.statSync(path.join(POSTS_DIR, y)).isDirectory());

  for (const year of years) {
    const yearDir = path.join(POSTS_DIR, year);
    const slugs = fs
      .readdirSync(yearDir)
      .filter((s) => fs.statSync(path.join(yearDir, s)).isDirectory());

    for (const slug of slugs) {
      const dir = path.join(yearDir, slug);
      const blogFile = path.join(dir, "blog.mdx");
      if (fs.existsSync(blogFile)) {
        results.push({ year, slug, dir });
      }
    }
  }

  return results;
}

export function getAllPosts(): PostMeta[] {
  const dirs = walkPostDirs();

  const posts = dirs.map(({ year, slug, dir }) => {
    const raw = fs.readFileSync(path.join(dir, "blog.mdx"), "utf-8");
    const { data } = matter(raw);

    return {
      slug,
      year,
      title: data.title ?? slug,
      date: data.date ?? "",
      description: data.description ?? "",
      tags: data.tags,
      cover: data.cover,
    } satisfies PostMeta;
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): Post | null {
  const dirs = walkPostDirs();
  const match = dirs.find((d) => d.slug === slug);
  if (!match) return null;

  const raw = fs.readFileSync(path.join(match.dir, "blog.mdx"), "utf-8");
  const { data, content } = matter(raw);

  return {
    slug: match.slug,
    year: match.year,
    title: data.title ?? match.slug,
    date: data.date ?? "",
    description: data.description ?? "",
    tags: data.tags,
    cover: data.cover,
    content,
  };
}
