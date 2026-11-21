import Image from "next/image";
import { listMedia } from "@/lib/content/admin";
import { imageUrl } from "@/lib/content/presentation";
import { MediaUpload } from "../media-upload";
import { MediaControls } from "./media-controls";

const sizeFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

export default async function MediaLibrary() {
  const assets = await listMedia();

  return (
    <>
      <h1 className="text-[28px] leading-tight font-bold tracking-tight sm:text-h2">Media library</h1>
      <section className="mt-6 rounded-xl border border-line bg-ink-800 p-4 sm:p-6">
        <h2 className="mb-3 text-lg font-bold">Upload media</h2>
        <MediaUpload />
        <p className="mt-3 text-sm text-fg-muted-blue">
          Images, PDFs, and MP4 or WebM videos up to 25 MiB. Ready files can be opened by anyone with their link.
        </p>
      </section>
      {assets.length === 0 ? (
        <p className="mt-6 text-fg-muted-blue">There are no uploaded files yet.</p>
      ) : (
        <ul className="mt-6 grid gap-3">
          {assets.map(asset => {
            const ready = asset.state === "ready";
            const size = asset.size_bytes >= 1024 * 1024
              ? `${sizeFormat.format(asset.size_bytes / (1024 * 1024))} MiB`
              : `${sizeFormat.format(asset.size_bytes / 1024)} KiB`;
            return (
              <li key={asset.path} className="flex flex-col gap-4 rounded-xl border border-line bg-ink-800 p-4 sm:flex-row">
                {ready && asset.mime_type.startsWith("image/") && (
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-ink-950">
                    <Image src={imageUrl(asset.path)} alt="" fill sizes="80px" className="object-cover" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h2 className="break-words font-bold">{asset.label}</h2>
                  <p className="mt-1 text-sm text-fg-muted-blue">
                    {ready ? asset.mime_type : asset.state === "pending" ? "Awaiting upload confirmation" : "Cleanup pending"} · {size}
                  </p>
                  {ready && (
                    <a className="mt-2 inline-block text-sm text-periwinkle hover:underline" href={imageUrl(asset.path)} target="_blank" rel="noreferrer">
                      Open file
                    </a>
                  )}
                  <MediaControls asset={asset} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
