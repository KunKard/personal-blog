import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { localStore } from "@/lib/storage/local";

export const dynamic = "force-static";

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return url && !url.includes("your-supabase-url");
}

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();
  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    await localStore.insert("contact_messages", { name, email, message, read: false });
    return NextResponse.json({ success: true });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("contact_messages").insert({ name, email, message });

  if (error) {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
