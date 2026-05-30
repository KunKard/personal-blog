export * from "./project";
export * from "./post";
export * from "./timeline";

export interface SiteSettings {
  [key: string]: unknown;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Media {
  id: string;
  filename: string;
  storage_path: string;
  public_url: string;
  mime_type: string | null;
  size_bytes: number | null;
  alt_text: string | null;
  created_at: string;
}
