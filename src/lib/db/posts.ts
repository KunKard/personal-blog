import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { localStore } from "@/lib/storage/local";
import type { Post, PostInsert, PostUpdate } from "@/lib/types";

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return url && !url.includes("your-supabase-url");
}

async function adminQuery<T>(fn: (admin: ReturnType<typeof createAdminClient>) => Promise<T>): Promise<T> {
  if (isSupabaseConfigured()) {
    return fn(createAdminClient());
  }
  throw new Error("Supabase not configured"); // caught and redirected below
}

async function serverQuery<T>(fn: (server: Awaited<ReturnType<typeof createServerSupabase>>) => Promise<T>): Promise<T> {
  if (isSupabaseConfigured()) {
    return fn(await createServerSupabase());
  }
  throw new Error("Supabase not configured");
}

export async function getPublishedPosts(): Promise<Post[]> {
  if (!isSupabaseConfigured()) {
    const posts = await localStore.findMany<Post>("posts", {
      eq: { status: "published" },
      order: { column: "published_at", ascending: false },
    });
    return posts;
  }
  return serverQuery(async (supabase) => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (error) throw error;
    return data;
  });
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isSupabaseConfigured()) {
    return localStore.findOne<Post>("posts", { eq: { slug, status: "published" } });
  }
  return serverQuery(async (supabase) => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();
    if (error) return null;
    return data;
  });
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  if (!isSupabaseConfigured()) {
    return localStore.findMany<Post>("posts", {
      eq: { status: "published", category },
      order: { column: "published_at", ascending: false },
    });
  }
  return serverQuery(async (supabase) => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .eq("category", category)
      .order("published_at", { ascending: false });
    if (error) throw error;
    return data;
  });
}

export async function getAdminPosts(): Promise<Post[]> {
  if (!isSupabaseConfigured()) {
    return localStore.findMany<Post>("posts", {
      order: { column: "created_at", ascending: false },
    });
  }
  return adminQuery(async (admin) => {
    const { data, error } = await admin.from("posts").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  });
}

export async function getAdminPost(id: string): Promise<Post | null> {
  if (!isSupabaseConfigured()) {
    return localStore.findOne<Post>("posts", { eq: { id } });
  }
  return adminQuery(async (admin) => {
    const { data, error } = await admin.from("posts").select("*").eq("id", id).single();
    if (error) return null;
    return data;
  });
}

export async function createPost(input: PostInsert): Promise<Post> {
  if (!isSupabaseConfigured()) {
    return localStore.insert<Post>("posts", input);
  }
  return adminQuery(async (admin) => {
    const { data, error } = await admin.from("posts").insert(input).select().single();
    if (error) throw error;
    return data;
  });
}

export async function updatePost(id: string, input: PostUpdate): Promise<Post> {
  if (!isSupabaseConfigured()) {
    const result = await localStore.update<Post>("posts", id, input);
    if (!result) throw new Error("Post not found");
    return result;
  }
  return adminQuery(async (admin) => {
    const { data, error } = await admin
      .from("posts")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  });
}

export async function deletePost(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    return localStore.delete("posts", id);
  }
  return adminQuery(async (admin) => {
    const { error } = await admin.from("posts").delete().eq("id", id);
    if (error) throw error;
  });
}
