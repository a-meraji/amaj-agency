"use client";

import type { MediaAsset } from "@/lib/content/database";
import { adminPanel, primaryButton } from "./dashboard-ui";
import { MediaControls } from "./media-controls";
import { MediaPreview } from "./media-preview";
import { MediaUpload } from "./media-upload";

const sizeFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

export function MediaLibrary({ assets, selection }: {
  assets: MediaAsset[];
  selection?: { value: string; choose: (path: string) => void };
}) {
  const Heading = selection ? "h3" : "h2";

  return (
    <div className="grid gap-5">
      <section className={adminPanel + " p-4 sm:p-5"}>
        <Heading className="mb-3 font-bold">Upload media</Heading>
        <MediaUpload imagesOnly={Boolean(selection)} />
        <p className="mt-3 text-sm text-fg-muted-blue">
          {selection ? "Images" : "Images, PDFs, and MP4 or WebM videos"} up to 25 MiB. Ready files can be opened by anyone with their link.
        </p>
      </section>
      {assets.length === 0 ? (
        <p className="text-sm text-fg-muted-blue">{selection ? "There are no uploaded images yet." : "There are no uploaded files yet."}</p>
      ) : (
        <ul className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {assets.map(asset => {
            const ready = asset.state === "ready";
            const selected = selection?.value === asset.path;
            const size = asset.size_bytes >= 1024 * 1024
              ? `${sizeFormat.format(asset.size_bytes / (1024 * 1024))} MiB`
              : `${sizeFormat.format(asset.size_bytes / 1024)} KiB`;
            return (
              <li key={asset.path} className={adminPanel + " grid min-w-0 content-start gap-3 p-4"}>
                <div className="min-w-0">
                  <Heading className="break-all font-bold">{asset.label}</Heading>
                  <p className="mt-1 text-sm text-fg-muted-blue">
                    {ready ? asset.mime_type : asset.state === "pending" ? "Awaiting upload confirmation" : "Cleanup pending"} · {size}
                  </p>
                </div>
                {ready && <MediaPreview path={asset.path} label={asset.label} image={asset.mime_type.startsWith("image/")} />}
                {selection && ready && (
                  <button type="button" onClick={() => selection.choose(asset.path)} className={primaryButton + " justify-self-start"}
                    aria-label={`${selected ? "Keep" : "Use"} ${asset.label}`}>
                    {selected ? "Keep this image" : "Use image"}
                  </button>
                )}
                <details className="min-w-0 border-t border-line">
                  <summary className="min-h-[44px] cursor-pointer py-3 text-sm font-semibold text-fg-muted-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-periwinkle">
                    Manage file
                  </summary>
                  <MediaControls asset={asset} />
                </details>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
