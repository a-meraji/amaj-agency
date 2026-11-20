import { z } from "zod";
import { articleCategories, contactKinds } from "./database";

type EditorField = {
  name: string;
  label: string;
  kind?: "textarea" | "number" | "date" | "checkbox" | "select" | "image";
  options?: readonly string[];
  help?: string;
  optional?: boolean;
  min?: number;
  max?: number;
  defaultValue?: string | number;
};

export const collectionNames = ["articles", "projects", "staff", "contact_links"] as const;
export type Collection = (typeof collectionNames)[number];
export const collectionSchema = z.enum(collectionNames);

const slug: EditorField = { name: "slug", label: "URL slug", max: 100, help: "Use lowercase letters, numbers, and hyphens." };
const image: EditorField = { name: "image_path", label: "Image", kind: "image", help: "Use a site image or an uploaded asset." };
const order: EditorField = { name: "sort_order", label: "Display order", kind: "number", min: 0, max: 2147483647, defaultValue: 0 };
const published: EditorField = { name: "is_published", label: "Published", kind: "checkbox" };

export const collections: Record<Collection, { label: string; singular: string; fields: EditorField[] }> = {
  articles: {
    label: "Articles",
    singular: "article",
    fields: [
      { name: "title", label: "Title", max: 200 },
      slug,
      { name: "category", label: "Category", kind: "select", options: articleCategories },
      { name: "excerpt", label: "Excerpt", kind: "textarea", max: 600 },
      { name: "body", label: "Article body", kind: "textarea", max: 100000, optional: true },
      image,
      { name: "publish_date", label: "Published date", kind: "date" },
      { name: "read_minutes", label: "Reading time in minutes", kind: "number", min: 1, max: 180, defaultValue: 5 },
      { name: "is_featured", label: "Feature on the homepage", kind: "checkbox" },
      published,
    ],
  },
  projects: {
    label: "Portfolio",
    singular: "project",
    fields: [
      { name: "name", label: "Project name", max: 150 },
      slug,
      { name: "description", label: "Description", kind: "textarea", max: 2000 },
      { name: "url", label: "Project URL", max: 2048 },
      image,
      order,
      published,
    ],
  },
  staff: {
    label: "Staff",
    singular: "staff profile",
    fields: [
      { name: "name", label: "Full name", max: 150 },
      slug,
      { name: "role", label: "Role", max: 120 },
      { name: "bio", label: "Biography", kind: "textarea", max: 3000 },
      image,
      order,
      published,
    ],
  },
  contact_links: {
    label: "Contact links",
    singular: "contact link",
    fields: [
      { name: "label", label: "Link label", max: 80 },
      slug,
      { name: "kind", label: "Link type", kind: "select", options: contactKinds },
      { name: "url", label: "Destination", max: 2048, help: "Use an HTTPS, email, or phone link." },
      order,
      published,
    ],
  },
};

export const settingsFields: EditorField[] = [
  { name: "contact_eyebrow", label: "Contact section label", max: 80 },
  { name: "contact_heading", label: "Contact heading", max: 120 },
  { name: "contact_heading_accent", label: "Highlighted heading text", max: 120 },
  { name: "contact_intro", label: "Contact introduction", kind: "textarea", max: 600 },
  { name: "footer_tagline", label: "Footer tagline", max: 160 },
];

export type { EditorField };
