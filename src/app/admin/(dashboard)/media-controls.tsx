"use client";

import { useActionState, useState, useTransition } from "react";
import type { MediaAsset } from "@/lib/content/database";
import { deleteMedia, finishUpload, renameMedia } from "../media-actions";

import { adminInput, secondaryButton } from "./dashboard-ui";

export function MediaControls({ asset }: { asset: MediaAsset }) {
  const [feedback, rename, renaming] = useActionState(renameMedia.bind(null, asset.path), {});
  const [operation, setOperation] = useState<{ message?: string; error?: string }>({});
  const [busy, startTransition] = useTransition();

  function verify() {
    startTransition(async () => {
      const result = await finishUpload(asset.path);
      setOperation(result.error ? { error: result.error } : { message: "Upload confirmed." });
    });
  }

  function remove() {
    startTransition(async () => setOperation(await deleteMedia(asset.path)));
  }

  const error = operation.error || feedback.error;
  const message = operation.message || feedback.message;

  return (
    <div className="mt-3 grid gap-3">
      {asset.state === "ready" && (
        <form action={rename} className="flex flex-wrap items-end gap-2">
          <label className="grid min-w-0 flex-1 gap-1 text-sm font-semibold">
            File label
            <input name="label" defaultValue={asset.label} maxLength={180} required className={adminInput + " min-w-0"} />
          </label>
          <button type="submit" disabled={renaming || busy} className={secondaryButton}>{renaming ? "Saving…" : "Rename"}</button>
        </form>
      )}
      {asset.state === "pending" && (
        <button type="button" disabled={busy} onClick={verify} className={`${secondaryButton} justify-self-start`}>Check upload</button>
      )}
      {asset.state === "deleting" ? (
        <button type="button" disabled={busy} onClick={remove} className={`${secondaryButton} justify-self-start`}>Retry cleanup</button>
      ) : (
        <details>
          <summary className="min-h-[44px] cursor-pointer py-3 text-sm font-semibold text-rose-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-periwinkle">Delete file</summary>
          <p className="mt-2 text-sm text-fg-muted-blue">This removes the file from the media library.</p>
          <button type="button" disabled={busy || renaming} onClick={remove} className="mt-2 min-h-[44px] rounded-lg bg-rose-300 px-3 text-sm font-bold text-ink-950 disabled:opacity-60">Confirm delete</button>
        </details>
      )}
      {error && <p role="alert" className="text-sm text-rose-200">{error}</p>}
      {!error && message && <p role="status" className="text-sm text-emerald-200">{message}</p>}
    </div>
  );
}
