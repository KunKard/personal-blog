export type TimelineCategory = "learning" | "jam" | "project" | "milestone" | "demo";

export interface TimelineEntry {
  id: string;
  date: string;
  title: string;
  description: string | null;
  category: TimelineCategory;
  icon: string | null;
  related_project_id: string | null;
  links: { label: string; url: string }[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type TimelineEntryInsert = Omit<TimelineEntry, "id" | "created_at" | "updated_at">;
export type TimelineEntryUpdate = Partial<TimelineEntryInsert>;
