"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireContentAdmin } from "@/lib/content/authorization";
import { collectionSchema, type Collection } from "@/lib/content/editor-fields";
import { entrySchema, recordIdSchema, settingsSchema } from "@/lib/content/validation";

function validationErrors(error: z.ZodError) {
  return Object.fromEntries(error.issues.map(issue => [String(issue.path.at(-1)), "Check this field."]));
}

type AdminClient = Awaited<ReturnType<typeof requireContentAdmin>>["client"];

function writeEntry(client: AdminClient, entry: z.output<typeof entrySchema>, id: string | null) {
  switch (entry.collection) {
    case "articles": {
      const table = client.from("articles");
      return id === null ? table.insert(entry.fields) : table.update(entry.fields).eq("id", id);
    }
    case "projects": {
      const table = client.from("projects");
      return id === null ? table.insert(entry.fields) : table.update(entry.fields).eq("id", id);
    }
    case "staff": {
      const table = client.from("staff");
      return id === null ? table.insert(entry.fields) : table.update(entry.fields).eq("id", id);
    }
    case "testimonials": {
      const table = client.from("testimonials");
      return id === null ? table.insert(entry.fields) : table.update(entry.fields).eq("id", id);
    }
    case "contact_links": {
      const table = client.from("contact_links");
      return id === null ? table.insert(entry.fields) : table.update(entry.fields).eq("id", id);
    }
  }
}

function refreshPublicPages(collection?: Collection) {
  revalidatePath("/");
  if (collection === "testimonials") return;
  revalidatePath("/blogs");
  revalidatePath("/blogs/[slug]", "page");
}

type EditorState = { message?: string; fields?: Record<string, string> };

export async function saveEntry(
  collection: Collection,
  id: string | null,
  _previous: EditorState,
  form: FormData,
): Promise<EditorState> {
  const { client } = await requireContentAdmin(true);
  if (!collectionSchema.safeParse(collection).success || (id !== null && !recordIdSchema.safeParse(id).success)) {
    return { message: "This entry is invalid." };
  }
  const input = entrySchema.safeParse({ collection, fields: Object.fromEntries(form) });
  if (!input.success) return { message: "Check the highlighted fields.", fields: validationErrors(input.error) };

  const { data, error } = await writeEntry(client, input.data, id).select("id").maybeSingle();
  if (error?.code === "23505") {
    return { message: "This URL slug is already in use.", fields: { slug: "Choose a unique slug." } };
  }
  if (error || !data) return { message: "The entry could not be saved. It may have been removed." };

  refreshPublicPages(collection);
  revalidatePath(`/admin/${collection}`);
  redirect(`/admin/${collection}`);
}

export async function deleteEntry(collection: Collection, id: string): Promise<EditorState> {
  const { client } = await requireContentAdmin(true);
  if (!collectionSchema.safeParse(collection).success || !recordIdSchema.safeParse(id).success) {
    return { message: "This entry is invalid." };
  }
  const { error } = await client.from(collection).delete().eq("id", id);
  if (error) return { message: "The entry could not be deleted." };

  refreshPublicPages(collection);
  revalidatePath(`/admin/${collection}`);
  redirect(`/admin/${collection}`);
}

export async function saveSettings(_previous: EditorState, form: FormData): Promise<EditorState> {
  const { client } = await requireContentAdmin(true);
  const input = settingsSchema.safeParse(Object.fromEntries(form));
  if (!input.success) return { message: "Check the highlighted fields.", fields: validationErrors(input.error) };

  const { error } = await client.from("site_settings").upsert({ id: 1, ...input.data });
  if (error) return { message: "The settings could not be saved." };
  refreshPublicPages();
  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}
