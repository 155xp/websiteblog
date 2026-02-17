import { Suspense } from "react";
import { getAllPosts } from "@/lib/posts";
import { HomeClient } from "@/components/home-client";

export default function Home() {
  const posts = getAllPosts();

  // Group by year
  const grouped: Record<string, typeof posts> = {};
  for (const post of posts) {
    const year = post.year;
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(post);
  }

  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <Suspense>
      <HomeClient posts={posts} grouped={grouped} years={years} />
    </Suspense>
  );
}
