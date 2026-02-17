"use client";

import type { PostMeta } from "@/lib/posts";

interface PostCardProps {
  post: PostMeta;
  onClick: () => void;
}

export function PostCard({ post, onClick }: PostCardProps) {
  const date = new Date(post.date);
  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-lg px-4 py-4 -mx-4 transition-colors hover:bg-card-hover cursor-pointer"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-base font-medium text-foreground group-hover:text-foreground/90 transition-colors">
          {post.title}
        </h3>
        <time
          dateTime={post.date}
          className="shrink-0 text-sm text-muted tabular-nums"
        >
          {formatted}
        </time>
      </div>
      <p className="mt-1 text-sm text-muted line-clamp-1">{post.description}</p>
    </button>
  );
}
