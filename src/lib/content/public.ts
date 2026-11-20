import "server-only";
import { createClient } from "@supabase/supabase-js";
import { connection } from "next/server";
import { cache } from "react";
import type { ArticleSummary, Database } from "./database";
import { supabaseConfig } from "../supabase/config";

const summaryColumns =
  "id,slug,title,excerpt,category,image_path,publish_date,read_minutes,is_featured,is_published";

async function publicClient() {
  await connection();
  const { url, key } = supabaseConfig();
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

function read<T>(response: { data: T; error: { code: string; message: string } | null }): T {
  if (response.error) {
    throw new Error(`Content query failed (${response.error.code}): ${response.error.message}`);
  }
  return response.data;
}

function publishedArticleSummaries(db: Awaited<ReturnType<typeof publicClient>>) {
  return db.from("articles").select(summaryColumns).eq("is_published", true);
}

export async function getPublishedArticles(): Promise<ArticleSummary[]> {
  const db = await publicClient();
  return read(await publishedArticleSummaries(db)
    .order("publish_date", { ascending: false })
    .order("slug")) ?? [];
}

export const getPublishedArticle = cache(async (slug: string) => {
  if (slug.length > 100 || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return null;
  const db = await publicClient();
  return read(await db.from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle());
});

export async function getSiteSettings() {
  const db = await publicClient();
  return read(await db.from("site_settings").select("*").eq("id", 1).maybeSingle());
}

export const getHomepageContent = cache(async () => {
  const db = await publicClient();
  const [articles, projects, staff, contactLinks, settings] = await Promise.all([
    publishedArticleSummaries(db)
      .order("is_featured", { ascending: false })
      .order("publish_date", { ascending: false })
      .order("slug")
      .limit(6),
    db.from("projects").select("*").eq("is_published", true).order("sort_order").order("slug"),
    db.from("staff").select("*").eq("is_published", true).order("sort_order").order("slug"),
    db.from("contact_links").select("*").eq("is_published", true).order("sort_order").order("slug"),
    db.from("site_settings").select("*").eq("id", 1).maybeSingle(),
  ]);

  return {
    articles: read(articles) ?? [],
    projects: read(projects) ?? [],
    staff: read(staff) ?? [],
    contactLinks: read(contactLinks) ?? [],
    settings: read(settings),
  };
});
