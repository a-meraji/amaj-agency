import { z } from "zod";
import { articleCategories, contactKinds } from "./database";

const text = (max: number) => z.string().trim().min(1).max(max);
const asBoolean = z.enum(["on"]).optional().transform(value => value === "on");
const integer = (min: number, max: number) =>
  z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().min(min).max(max));

const entry = {
  slug: text(100).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  is_published: asBoolean,
};
const imagePath = z.string().max(512).regex(/^(?:\/images|media)\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*\.(?:avif|gif|jpe?g|png|webp)$/i);
const sortOrder = integer(0, 2147483647);
const projectUrl = text(2048).pipe(z.url({ protocol: /^https?$/, hostname: z.regexes.domain }));
const contactUrl = z.union([
  projectUrl,
  text(2048).pipe(z.string().regex(/^mailto:[^@\s?#]+@[^@\s?#]+$/i)),
  text(2048).pipe(z.string().regex(/^tel:\+?[\d().-]+$/i)),
]);

const schemas = {
  articles: z.object({
    ...entry,
    title: text(200),
    excerpt: text(600),
    body: z.string().max(100000),
    category: z.enum(articleCategories),
    image_path: imagePath,
    publish_date: z.iso.date(),
    read_minutes: integer(1, 180),
    is_featured: asBoolean,
  }),
  projects: z.object({
    ...entry,
    name: text(150),
    description: text(2000),
    url: projectUrl,
    image_path: imagePath,
    sort_order: sortOrder,
  }),
  staff: z.object({
    ...entry,
    name: text(150),
    role: text(120),
    bio: text(3000),
    image_path: imagePath,
    sort_order: sortOrder,
  }),
  testimonials: z.object({
    ...entry,
    name: text(150),
    role: text(160),
    quote: text(1000),
    image_path: imagePath,
    sort_order: sortOrder,
  }),
  contact_links: z.object({
    ...entry,
    label: text(80),
    kind: z.enum(contactKinds),
    url: contactUrl,
    sort_order: sortOrder,
  }),
};

export const entrySchema = z.discriminatedUnion("collection", [
  z.object({ collection: z.literal("articles"), fields: schemas.articles }),
  z.object({ collection: z.literal("projects"), fields: schemas.projects }),
  z.object({ collection: z.literal("staff"), fields: schemas.staff }),
  z.object({ collection: z.literal("testimonials"), fields: schemas.testimonials }),
  z.object({ collection: z.literal("contact_links"), fields: schemas.contact_links }),
]);

export const settingsSchema = z.object({
  contact_eyebrow: text(80),
  contact_heading: text(120),
  contact_heading_accent: text(120),
  contact_intro: text(600),
  footer_tagline: text(160),
});

export const recordIdSchema = z.uuid();
