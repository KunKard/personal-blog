import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { getAdminTimeline, createTimelineEntry } from "@/lib/db/timeline";
import type { TimelineEntryInsert } from "@/lib/types";

export const dynamic = "force-static";

export async function GET() {
  const entries = await getAdminTimeline();
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: TimelineEntryInsert = await req.json();
  const entry = await createTimelineEntry(body);
  return NextResponse.json(entry, { status: 201 });
}
