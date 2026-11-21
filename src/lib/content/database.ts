export const articleCategories = ["product", "engineering", "design", "ai", "growth"] as const;
export const contactKinds = ["email", "linkedin", "whatsapp", "telegram", "website", "phone"] as const;

export type ArticleCategory = (typeof articleCategories)[number];
export type ContactKind = (typeof contactKinds)[number];

type ContentEntry = {
  id: string;
  slug: string;
  is_published: boolean;
};

export type Article = ContentEntry & {
  title: string;
  excerpt: string;
  body: string;
  category: ArticleCategory;
  image_path: string;
  publish_date: string;
  read_minutes: number;
  is_featured: boolean;
};

export type ArticleSummary = Omit<Article, "body">;

export type Project = ContentEntry & {
  name: string;
  description: string;
  url: string;
  image_path: string;
  sort_order: number;
};

export type StaffMember = ContentEntry & {
  name: string;
  role: string;
  bio: string;
  image_path: string;
  sort_order: number;
};

export type Testimonial = ContentEntry & {
  name: string;
  role: string;
  quote: string;
  image_path: string;
  sort_order: number;
};

export type ContactLink = ContentEntry & {
  label: string;
  kind: ContactKind;
  url: string;
  sort_order: number;
};

export type SiteSettings = {
  id: number;
  contact_eyebrow: string;
  contact_heading: string;
  contact_heading_accent: string;
  contact_intro: string;
  footer_tagline: string;
};

export type MediaAsset = {
  path: string;
  label: string;
  mime_type: string;
  size_bytes: number;
  state: "pending" | "ready" | "deleting";
  created_at: string;
  upload_expires_at: string;
};

type Table<Row, Defaults extends keyof Row = never> = {
  Row: Row;
  Insert: Omit<Row, Defaults> & Partial<Pick<Row, Defaults>>;
  Update: Partial<Row>;
  Relationships: [];
};

type EntryDefaults = "id" | "is_published";

export type Database = {
  public: {
    Tables: {
      articles: Table<Article, EntryDefaults | "body" | "publish_date" | "read_minutes" | "is_featured">;
      projects: Table<Project, EntryDefaults | "sort_order">;
      staff: Table<StaffMember, EntryDefaults | "sort_order">;
      testimonials: Table<Testimonial, EntryDefaults | "sort_order">;
      contact_links: Table<ContactLink, EntryDefaults | "sort_order">;
      site_settings: Table<SiteSettings, "id">;
      media_assets: {
        Row: MediaAsset & { ready_path: string | null };
        Insert: Pick<MediaAsset, "path" | "label" | "mime_type" | "size_bytes">;
        Update: Partial<Pick<MediaAsset, "label" | "state">>;
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      is_content_admin: { Args: never; Returns: boolean };
    };
  };
};
