import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/posts";
import { serialize } from "next-mdx-remote/serialize";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const post = getPostBySlug(slug);
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const mdx = await serialize(post.content);

  return NextResponse.json({
    title: post.title,
    date: post.date,
    description: post.description,
    tags: post.tags,
    mdx,
  });
}
