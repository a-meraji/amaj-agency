import "server-only";
import { requireContentAdmin } from "./authorization";
import type { Collection } from "./editor-fields";

export async function listEntries(collection: Collection) {
  const { client } = await requireContentAdmin();
  const listings = {
    articles: () => client.from("articles").select("id,slug,is_published,label:title").order("publish_date", { ascending: false }),
    projects: () => client.from("projects").select("id,slug,is_published,label:name").order("sort_order"),
    staff: () => client.from("staff").select("id,slug,is_published,label:name").order("sort_order"),
    testimonials: () => client.from("testimonials").select("id,slug,is_published,label:name").order("sort_order"),
    contact_links: () => client.from("contact_links").select("id,slug,is_published,label").order("sort_order"),
  };
  const { data, error } = await listings[collection]().order("slug");
  if (error) throw new Error("Unable to load this collection.");
  return data;
}

export async function getEntry(collection: Collection, id: string) {
  const { client } = await requireContentAdmin();
  const { data, error } = await client.from(collection).select("*").eq("id", id).maybeSingle();
  if (error) throw new Error("Unable to load this entry.");
  return data;
}

export async function getEditableSettings() {
  const { client } = await requireContentAdmin();
  const { data, error } = await client.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw new Error("Unable to load site settings.");
  return data;
}

export async function listMedia({ imagesOnly = false } = {}) {
  const { client } = await requireContentAdmin();
  const query = client.from("media_assets").select("path,label,mime_type,size_bytes,state,created_at,upload_expires_at");
  const listing = imagesOnly ? query.eq("state", "ready").like("mime_type", "image/%") : query;
  const { data, error } = await listing.order("created_at", { ascending: false }).order("path");
  if (error) throw new Error("Unable to load the media library.");
  return data;
}
