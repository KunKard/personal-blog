import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { localStore } from "@/lib/storage/local";
import type { TimelineEntry, TimelineEntryInsert, TimelineEntryUpdate } from "@/lib/types";

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return url && !url.includes("your-supabase-url");
}

async function serverQuery<T>(fn: (server: Awaited<ReturnType<typeof createServerSupabase>>) => Promise<T>): Promise<T> {
  return fn(await createServerSupabase());
}

async function adminQuery<T>(fn: (admin: ReturnType<typeof createAdminClient>) => Promise<T>): Promise<T> {
  return fn(createAdminClient());
}

export async function getTimelineEntries(): Promise<TimelineEntry[]> {
  if (!isSupabaseConfigured()) {
    return localStore.findMany<TimelineEntry>("timeline", {
      order: { column: "date", ascending: false },
    });
  }
  return serverQuery(async (supabase) => {
    const { data, error } = await supabase
      .from("timeline_entries")
      .select("*")
      .order("date", { ascending: false });
    if (error) throw error;
    return data;
  });
}

export async function getTimelineEntriesByCategory(category: string): Promise<TimelineEntry[]> {
  if (!isSupabaseConfigured()) {
    return localStore.findMany<TimelineEntry>("timeline", {
      eq: { category },
      order: { column: "date", ascending: false },
    });
  }
  return serverQuery(async (supabase) => {
    const { data, error } = await supabase
      .from("timeline_entries")
      .select("*")
      .eq("category", category)
      .order("date", { ascending: false });
    if (error) throw error;
    return data;
  });
}

export async function getAdminTimeline(): Promise<TimelineEntry[]> {
  if (!isSupabaseConfigured()) {
    return localStore.findMany<TimelineEntry>("timeline", {
      order: { column: "date", ascending: false },
    });
  }
  return adminQuery(async (admin) => {
    const { data, error } = await admin
      .from("timeline_entries")
      .select("*")
      .order("date", { ascending: false });
    if (error) throw error;
    return data;
  });
}

export async function createTimelineEntry(input: TimelineEntryInsert): Promise<TimelineEntry> {
  if (!isSupabaseConfigured()) {
    return localStore.insert<TimelineEntry>("timeline", input);
  }
  return adminQuery(async (admin) => {
    const { data, error } = await admin
      .from("timeline_entries")
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data;
  });
}

export async function updateTimelineEntry(id: string, input: TimelineEntryUpdate): Promise<TimelineEntry> {
  if (!isSupabaseConfigured()) {
    const result = await localStore.update<TimelineEntry>("timeline", id, input);
    if (!result) throw new Error("Timeline entry not found");
    return result;
  }
  return adminQuery(async (admin) => {
    const { data, error } = await admin
      .from("timeline_entries")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  });
}

export async function deleteTimelineEntry(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    return localStore.delete("timeline", id);
  }
  return adminQuery(async (admin) => {
    const { error } = await admin.from("timeline_entries").delete().eq("id", id);
    if (error) throw error;
  });
}
