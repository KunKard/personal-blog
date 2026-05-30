import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { updateTimelineEntry, deleteTimelineEntry } from "@/lib/db/timeline";
import type { TimelineEntryUpdate } from "@/lib/types";

export const dynamic = "force-static";

export function generateStaticParams() {
  return [];
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body: TimelineEntryUpdate = await req.json();
  const entry = await updateTimelineEntry(id, body);
  return NextResponse.json(entry);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await deleteTimelineEntry(id);
  return NextResponse.json({ success: true });
}
