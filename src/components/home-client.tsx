"use client";

import { useState, useEffect } from "react";
import { useQueryState } from "nuqs";
import type { PostMeta } from "@/lib/posts";
import { PostCard } from "./post-card";
import { BlogDrawer } from "./blog-drawer";

const BIRTHDAY = new Date(2009, 5, 6).getTime(); // June 6, 2009
const MS_PER_YEAR = 365.2425 * 24 * 60 * 60 * 1000;

function useAge() {
  const [age, setAge] = useState("");
  useEffect(() => {
    const update = () => {
      const years = (Date.now() - BIRTHDAY) / MS_PER_YEAR;
      setAge(years.toFixed(9));
    };
    update();
    const id = setInterval(update, 50);
    return () => clearInterval(id);
  }, []);
  return age;
}

interface HomeClientProps {
  posts: PostMeta[];
  grouped: Record<string, PostMeta[]>;
  years: string[];
}

export function HomeClient({ grouped, years }: HomeClientProps) {
  const age = useAge();
  const [postSlug, setPostSlug] = useQueryState("post", {
    defaultValue: "",
    clearOnDefault: true,
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-xl px-6 py-16 sm:py-24">
        {/* Header */}
        <header className="mb-16">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            blog.ericencinger.com
          </h1>
          <p className="mt-1 text-sm text-muted">
            Thoughts after{" "}
            <span className="tabular-nums">{age}</span>
            {" "}years
          </p>
        </header>

        {/* Posts grouped by year */}
        <div className="space-y-12">
          {years.map((year) => (
            <section key={year}>
              <h2 className="mb-4 text-sm font-medium text-muted">{year}</h2>
              <div className="space-y-1">
                {grouped[year].map((post) => (
                  <PostCard
                    key={post.slug}
                    post={post}
                    onClick={() => setPostSlug(post.slug)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-20 border-t border-border pt-6">
          <p className="text-xs text-muted">
            Eric Encinger
          </p>
        </footer>
      </div>

      {/* Drawer */}
      <BlogDrawer
        slug={postSlug || null}
        onClose={() => setPostSlug("")}
      />
    </div>
  );
}
