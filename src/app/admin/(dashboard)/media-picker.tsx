"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { MediaAsset } from "@/lib/content/database";
import { DashboardIcon, secondaryButton } from "./dashboard-ui";
import { MediaLibrary } from "./media-library";

export function MediaPicker({ assets, value, onSelect }: {
  assets: MediaAsset[];
  value: string;
  onSelect: (path: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useId();

  useEffect(() => {
    if (open && !dialog.current?.open) dialog.current?.showModal();
  }, [open]);

  return (
    <>
      <button type="button" aria-haspopup="dialog" className={secondaryButton + " justify-self-start"} onClick={() => setOpen(true)}>
        <DashboardIcon name="media" /> {value ? "Change image" : "Choose image"}
      </button>
      {open && createPortal(
        <dialog ref={dialog} aria-labelledby={title} onClose={() => setOpen(false)}
          className="m-auto max-h-[calc(100dvh_-_2rem)] w-[calc(100%_-_2rem)] max-w-4xl overflow-y-auto rounded-lg border border-line bg-ink-900 text-fg backdrop:bg-ink-950/80">
          <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-ink-950 p-4 sm:px-6">
            <h2 id={title} className="text-lg font-bold">Choose an image</h2>
            <button type="button" className={secondaryButton} onClick={() => dialog.current?.close()}>Close</button>
          </header>
          <div className="p-4 sm:p-6">
            <MediaLibrary assets={assets} selection={{ value, choose: path => {
              onSelect(path);
              dialog.current?.close();
            } }} />
          </div>
        </dialog>, document.body)}
    </>
  );
}
