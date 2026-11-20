"use client";

import { useActionState, useState, useTransition } from "react";
import type { MediaAsset } from "@/lib/content/database";
import { deleteMedia, finishUpload, renameMedia } from "../../media-actions";

const buttonClass = "min-h-10 rounded-lg border border-slate-600 px-3 text-sm font-semibold hover:bg-slate-800 disabled:opacity-60";

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
            <input name="label" defaultValue={asset.label} maxLength={180} required className="min-h-10 min-w-0 rounded-lg border border-slate-600 bg-slate-950 px-3" />
          </label>
          <button type="submit" disabled={renaming || busy} className={buttonClass}>{renaming ? "Saving…" : "Rename"}</button>
        </form>
      )}
      {asset.state === "pending" && (
        <button type="button" disabled={busy} onClick={verify} className={`${buttonClass} justify-self-start`}>Check upload</button>
      )}
      {asset.state === "deleting" ? (
        <button type="button" disabled={busy} onClick={remove} className={`${buttonClass} justify-self-start`}>Retry cleanup</button>
      ) : (
        <details>
          <summary className="cursor-pointer text-sm font-semibold text-rose-200">Delete file</summary>
          <p className="mt-2 text-sm text-slate-300">This removes the file from the media library.</p>
          <button type="button" disabled={busy || renaming} onClick={remove} className="mt-2 min-h-10 rounded-lg bg-rose-300 px-3 text-sm font-bold text-slate-950 disabled:opacity-60">Confirm delete</button>
        </details>
      )}
      {error && <p role="alert" className="text-sm text-rose-200">{error}</p>}
      {!error && message && <p role="status" className="text-sm text-emerald-200">{message}</p>}
    </div>
  );
}
