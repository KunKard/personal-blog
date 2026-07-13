import { NextResponse } from "next/server";
import { updateSiteSettings } from "@/lib/storage/site-settings";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    updateSiteSettings(body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Failed to save settings:", e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
