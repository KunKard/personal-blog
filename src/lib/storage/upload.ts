import { createAdminClient } from "@/lib/supabase/admin";

export async function uploadImage(file: File, folder = "general"): Promise<{ id: string; publicUrl: string }> {
  const admin = createAdminClient();
  const ext = file.name.split(".").pop() || "png";
  const filename = `${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const buffer = await file.arrayBuffer();

  const { error: uploadError } = await admin.storage
    .from("images")
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = admin.storage.from("images").getPublicUrl(filename);

  const { data: media, error: dbError } = await admin
    .from("media")
    .insert({
      filename: file.name,
      storage_path: filename,
      public_url: publicUrl,
      mime_type: file.type,
      size_bytes: file.size,
    })
    .select()
    .single();

  if (dbError) throw dbError;

  return { id: media.id, publicUrl };
}

export async function deleteImage(storagePath: string): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.storage.from("images").remove([storagePath]);
  if (error) throw error;
}
