"use client";

import Image from "next/image";
import { useState } from "react";
import { imageUrl } from "@/lib/content/presentation";
import { DashboardIcon } from "./dashboard-ui";

export function MediaPreview({ path, label, image, emptyMessage = "Preview unavailable" }: {
  path?: string;
  label: string;
  image: boolean;
  emptyMessage?: string;
}) {
  const [failedPath, setFailedPath] = useState<string>();
  const url = path ? imageUrl(path) : undefined;
  const showImage = url && image && failedPath !== path;

  return (
    <figure className="grid min-w-0 gap-2">
      {image && (
        <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-md border border-line bg-ink-950">
          {showImage ? (
            <Image src={url} alt={label} fill unoptimized sizes="(max-width: 639px) 90vw, 256px" className="object-contain"
              onError={() => setFailedPath(path)} />
          ) : (
            <div className="grid justify-items-center gap-2 p-3 text-center text-xs text-fg-muted-blue">
              <DashboardIcon name="media" className="size-6" />
              <span>{url ? "Image could not be loaded" : emptyMessage}</span>
            </div>
          )}
        </div>
      )}
      {url && (
        <figcaption className="min-w-0">
          <a href={url} target="_blank" rel="noreferrer" aria-label={`Open ${label} (${path})`}
            className="block break-all rounded-sm text-xs leading-relaxed text-periwinkle underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-periwinkle">
            {path}
          </a>
        </figcaption>
      )}
    </figure>
  );
}
