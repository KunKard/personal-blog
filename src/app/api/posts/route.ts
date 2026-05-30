import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { getAdminPosts, createPost } from "@/lib/db/posts";
import type { PostInsert } from "@/lib/types";

export const dynamic = "force-static";

export async function GET() {
  const posts = await getAdminPosts();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: PostInsert = await req.json();
  const post = await createPost(body);
  return NextResponse.json(post, { status: 201 });
}
