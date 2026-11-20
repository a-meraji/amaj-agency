"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireContentAdmin } from "@/lib/content/authorization";
import type { MediaAsset } from "@/lib/content/database";
import { isMediaType, managedPathPattern, mediaBucket, mediaExtensions, mediaMaxBytes } from "@/lib/content/media";

const pathSchema = z.string().regex(managedPathPattern);
const labelSchema = z.string().trim().min(1).max(180);
const requestSchema = z.object({
  label: labelSchema,
  type: z.string().refine(isMediaType),
  size: z.number().int().min(1).max(mediaMaxBytes),
});

export async function prepareUpload(request: { label: string; type: string; size: number }) {
  const { client } = await requireContentAdmin(true);
  const parsed = requestSchema.safeParse(request);
  if (!parsed.success || !isMediaType(parsed.data.type)) {
    return { error: "Choose an allowed file up to 25 MiB." } as const;
  }

  const { label, type, size } = parsed.data;
  const path = `media/${randomUUID()}.${mediaExtensions[type]}`;
  const { error: reserveError } = await client.from("media_assets")
    .insert({ path, label, mime_type: type, size_bytes: size });
  if (reserveError) return { error: "The upload could not be prepared." } as const;

  const { data, error } = await client.storage.from(mediaBucket).createSignedUploadUrl(path);
  if (error) return { error: "Storage could not start the upload. Try again." } as const;
  return { path, token: data.token } as const;
}

export async function finishUpload(path: string): Promise<{ asset?: Pick<MediaAsset, "path" | "label" | "mime_type">; error?: string }> {
  const { client } = await requireContentAdmin(true);
  if (!pathSchema.safeParse(path).success) return { error: "Invalid media path." };

  const { data: asset, error } = await client.from("media_assets")
    .select("path,label,mime_type,size_bytes,state").eq("path", path).maybeSingle();
  if (error || !asset || asset.state === "deleting") return { error: "The upload is unavailable." };
  const { label, mime_type } = asset;
  if (asset.state === "ready") return { asset: { path, label, mime_type } };

  const { data: stored, error: storageError } = await client.storage.from(mediaBucket).info(path);
  if (storageError || stored.size !== asset.size_bytes || stored.contentType !== mime_type) {
    return { error: "The stored file could not be verified. Check the upload or start a new one." };
  }

  const { data: ready, error: updateError } = await client.from("media_assets")
    .update({ state: "ready" }).eq("path", path).in("state", ["pending", "ready"]).select("path").maybeSingle();
  if (updateError || !ready) return { error: "The upload changed while it was being verified. Refresh the library." };

  revalidatePath("/admin/media");
  return { asset: { path, label, mime_type } };
}

type MediaFeedback = { error?: string; message?: string };

export async function renameMedia(path: string, _previous: MediaFeedback, form: FormData): Promise<MediaFeedback> {
  const { client } = await requireContentAdmin(true);
  const label = labelSchema.safeParse(form.get("label"));
  if (!pathSchema.safeParse(path).success || !label.success) return { error: "Enter a label up to 180 characters." };

  const { data, error } = await client.from("media_assets")
    .update({ label: label.data }).eq("path", path).eq("state", "ready").select("path").maybeSingle();
  if (error || !data) return { error: "The label could not be updated." };
  revalidatePath("/admin/media");
  return { message: "Label saved." };
}

export async function deleteMedia(path: string): Promise<MediaFeedback> {
  const { client } = await requireContentAdmin(true);
  if (!pathSchema.safeParse(path).success) return { error: "Invalid media path." };

  // Moving to deleting releases the ready key and fails while content references it.
  const { data: asset, error } = await client.from("media_assets")
    .update({ state: "deleting" }).eq("path", path).select("upload_expires_at").maybeSingle();
  if (error?.code === "23503") return { error: "This image is in use. Replace it in the content editor first." };
  if (error) return { error: "The file could not be marked for deletion." };
  if (!asset) return { message: "File deleted." };

  revalidatePath("/admin/media");
  const { error: removeError } = await client.storage.from(mediaBucket).remove([path]);
  if (removeError) return { error: "Storage could not delete the file. Retry from the media library." };

  // Retain a record until any issued upload link has expired, so a retried upload
  // cannot leave an untracked file behind after removal.
  if (Date.parse(asset.upload_expires_at) > Date.now()) {
    return { message: "File removed. Final cleanup is available after its upload link expires." };
  }
  const { error: cleanupError } = await client.from("media_assets").delete().eq("path", path);
  if (cleanupError) return { error: "The file was removed. Retry to clear its library record." };
  revalidatePath("/admin/media");
  return { message: "File deleted." };
}
