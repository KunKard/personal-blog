import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { localStore } from "@/lib/storage/local";
import type { Project, ProjectInsert, ProjectUpdate } from "@/lib/types";

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

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    return localStore.findMany<Project>("projects", {
      eq: { status: "published" },
      order: { column: "created_at", ascending: false },
    });
  }
  return serverQuery(async (supabase) => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  });
}

export async function getFeaturedProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    return localStore.findMany<Project>("projects", {
      eq: { status: "published", featured: true },
      order: { column: "sort_order", ascending: false },
      limit: 6,
    });
  }
  return serverQuery(async (supabase) => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "published")
      .eq("featured", true)
      .order("sort_order", { ascending: false })
      .limit(6);
    if (error) throw error;
    return data;
  });
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!isSupabaseConfigured()) {
    return localStore.findOne<Project>("projects", { eq: { slug, status: "published" } });
  }
  return serverQuery(async (supabase) => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();
    if (error) return null;
    return data;
  });
}

export async function getAdminProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    return localStore.findMany<Project>("projects", {
      order: { column: "created_at", ascending: false },
    });
  }
  return adminQuery(async (admin) => {
    const { data, error } = await admin.from("projects").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  });
}

export async function getAdminProject(id: string): Promise<Project | null> {
  if (!isSupabaseConfigured()) {
    return localStore.findOne<Project>("projects", { eq: { id } });
  }
  return adminQuery(async (admin) => {
    const { data, error } = await admin.from("projects").select("*").eq("id", id).single();
    if (error) return null;
    return data;
  });
}

export async function createProject(input: ProjectInsert): Promise<Project> {
  if (!isSupabaseConfigured()) {
    return localStore.insert<Project>("projects", input);
  }
  return adminQuery(async (admin) => {
    const { data, error } = await admin.from("projects").insert(input).select().single();
    if (error) throw error;
    return data;
  });
}

export async function updateProject(id: string, input: ProjectUpdate): Promise<Project> {
  if (!isSupabaseConfigured()) {
    const result = await localStore.update<Project>("projects", id, input);
    if (!result) throw new Error("Project not found");
    return result;
  }
  return adminQuery(async (admin) => {
    const { data, error } = await admin
      .from("projects")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  });
}

export async function deleteProject(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    return localStore.delete("projects", id);
  }
  return adminQuery(async (admin) => {
    const { error } = await admin.from("projects").delete().eq("id", id);
    if (error) throw error;
  });
}
