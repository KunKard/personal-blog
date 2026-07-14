import { NextResponse } from "next/server";
import { getSiteSettings, updateSiteSettings } from "@/lib/storage/site-settings";

export async function GET() {
  try {
    const settings = getSiteSettings();
    return NextResponse.json(settings);
  } catch (e) {
    return NextResponse.json({ current_project: null }, { status: 200 });
  }
}

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
