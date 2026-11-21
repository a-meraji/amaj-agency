"use client";

import { createClient } from "@supabase/supabase-js";
import { useRef, useState, useTransition } from "react";
import type { MediaAsset } from "@/lib/content/database";
import { isMediaType, mediaBucket, mediaExtensions, mediaMaxBytes } from "@/lib/content/media";
import { supabaseConfig } from "@/lib/supabase/config";
import { finishUpload, prepareUpload } from "../media-actions";

type UploadedAsset = Pick<MediaAsset, "path" | "label" | "mime_type">;

export function MediaUpload({ imagesOnly = false, onUploaded }: {
  imagesOnly?: boolean;
  onUploaded?: (asset: UploadedAsset) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [pending, startTransition] = useTransition();
  const accept = Object.keys(mediaExtensions).filter(type => !imagesOnly || type.startsWith("image/")).join(",");

  function upload() {
    if (!file || pending) return;
    setMessage("");
    setError(false);

    if (!isMediaType(file.type) || (imagesOnly && !file.type.startsWith("image/")) || file.size < 1 || file.size > mediaMaxBytes) {
      setError(true);
      setMessage("Choose a supported file up to 25 MiB.");
      return;
    }

    startTransition(async () => {
      try {
        const ticket = await prepareUpload({ label: file.name.slice(0, 180), type: file.type, size: file.size });
        if (!ticket.token) {
          setError(true);
          setMessage(ticket.error ?? "The upload could not be prepared.");
          return;
        }

        const { url, key } = supabaseConfig();
        const client = createClient(url, key, {
          auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
        });
        const { error: uploadError } = await client.storage.from(mediaBucket)
          .uploadToSignedUrl(ticket.path, ticket.token, file, { cacheControl: "300", contentType: file.type });
        const result = await finishUpload(ticket.path);
        if (!result.asset) {
          setError(true);
          setMessage(uploadError ? "The upload was interrupted. Try again or check the media library." : (result.error ?? "The upload could not be verified."));
          return;
        }

        onUploaded?.(result.asset);
        if (input.current) input.current.value = "";
        setFile(undefined);
        setMessage("Upload complete.");
      } catch {
        setError(true);
        setMessage("Upload could not be completed. Try again or check the media library.");
      }
    });
  }

  return (
    <div className="grid gap-2">
      <label className="grid gap-2 text-sm font-semibold">
        {imagesOnly ? "Upload a new image" : "Choose a media file"}
        <input
          ref={input}
          type="file"
          accept={accept}
          disabled={pending}
          onChange={event => { setFile(event.currentTarget.files?.[0]); setMessage(""); setError(false); }}
          className="w-full text-sm text-fg-muted-blue file:me-3 file:min-h-[44px] file:rounded-lg file:border-0 file:bg-ink-700 file:px-3 file:text-fg"
        />
      </label>
      <button
        type="button"
        disabled={!file || pending}
        onClick={upload}
        className="min-h-[44px] justify-self-start rounded-lg border border-line-strong px-3 text-sm font-semibold hover:bg-ink-700 disabled:opacity-50"
      >
        {pending ? "Uploading…" : "Upload file"}
      </button>
      {message && <p role={error ? "alert" : "status"} className={error ? "text-sm text-rose-200" : "text-sm text-emerald-200"}>{message}</p>}
    </div>
  );
}
