import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const OUT_DIR = path.join(process.cwd(), "public", "data", "posts");
const INDEX_FILE = path.join(process.cwd(), "src", "lib", "posts-generated.json");

function walkPostDirs() {
  const results = [];
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

async function main() {
  process.env.NODE_ENV = "production";
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const dirs = walkPostDirs();
  const index = [];

  for (const { year, slug, dir } of dirs) {
    const raw = fs.readFileSync(path.join(dir, "blog.mdx"), "utf-8");
    const { data, content } = matter(raw);
    const mdx = await serialize(content);

    // Static JSON for drawer (client fetch)
    const out = {
      title: data.title ?? slug,
      date: data.date ?? "",
      description: data.description ?? "",
      tags: data.tags ?? [],
      mdx,
    };

    fs.writeFileSync(
      path.join(OUT_DIR, `${slug}.json`),
      JSON.stringify(out)
    );

    // Index entry for post listing
    index.push({
      slug,
      year,
      title: data.title ?? slug,
      date: data.date ?? "",
      description: data.description ?? "",
      tags: data.tags ?? [],
      cover: data.cover ?? undefined,
    });

    console.log(`Generated ${slug}.json`);
  }

  // Sort by date descending
  index.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
  console.log(`Generated posts-generated.json with ${index.length} post(s).`);
}

main();
