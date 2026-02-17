"use client";

import { useEffect, useState } from "react";
import { Drawer } from "vaul";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

interface BlogDrawerProps {
  slug: string | null;
  onClose: () => void;
}

interface PostData {
  title: string;
  date: string;
  description: string;
  tags?: string[];
  mdx: MDXRemoteSerializeResult;
}

export function BlogDrawer({ slug, onClose }: BlogDrawerProps) {
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slug) {
      setPost(null);
      return;
    }

    setLoading(true);
    fetch(`/api/post?slug=${encodeURIComponent(slug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const date = post
    ? new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <Drawer.Root
      open={!!slug}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 flex max-h-[94vh] flex-col rounded-t-2xl bg-background">
          <div className="mx-auto mt-4 h-1.5 w-12 shrink-0 rounded-full bg-border" />

          <Drawer.Title className="sr-only">
            {post?.title ?? "Loading..."}
          </Drawer.Title>

          <div className="overflow-y-auto overscroll-contain px-6 pb-16 pt-6">
            <div className="mx-auto max-w-lg">
              {loading && (
                <div className="flex items-center justify-center py-20">
                  <div className="h-4 w-4 animate-spin rounded-full border-[1.5px] border-muted/30 border-t-foreground/60" />
                </div>
              )}

              {!loading && post && (
                <>
                  <header className="mb-10">
                    <time
                      dateTime={post.date}
                      className="text-xs text-muted"
                    >
                      {date}
                    </time>
                    <h1 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                      {post.title}
                    </h1>
                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-foreground/5 px-2 py-0.5 text-[11px] font-medium text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </header>

                  <article className="prose prose-sm prose-neutral max-w-none prose-p:leading-relaxed prose-p:text-foreground/70 prose-headings:text-base prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-foreground prose-li:text-foreground/70 prose-li:leading-relaxed prose-strong:text-foreground/90 prose-strong:font-medium prose-a:text-foreground prose-a:underline-offset-2 prose-blockquote:text-foreground/50 prose-blockquote:font-normal prose-blockquote:not-italic prose-hr:border-border">
                    <MDXRemote {...post.mdx} />
                  </article>
                </>
              )}

              {!loading && !post && slug && (
                <div className="py-20 text-center text-sm text-muted">
                  Post not found.
                </div>
              )}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
