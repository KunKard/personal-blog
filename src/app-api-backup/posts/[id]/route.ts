import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { getAdminPost, updatePost, deletePost } from "@/lib/db/posts";
import type { PostUpdate } from "@/lib/types";

export const dynamic = "force-static";

export function generateStaticParams() {
  return [];
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getAdminPost(id);
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body: PostUpdate = await req.json();
  const post = await updatePost(id, body);
  return NextResponse.json(post);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await deletePost(id);
  return NextResponse.json({ success: true });
}
