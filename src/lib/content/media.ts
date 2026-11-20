export const mediaBucket = "site-media";
export const mediaMaxBytes = 25 * 1024 * 1024;

export const mediaExtensions = {
  "image/avif": "avif",
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
  "video/mp4": "mp4",
  "video/webm": "webm",
} as const;

export function isMediaType(type: string): type is keyof typeof mediaExtensions {
  return Object.hasOwn(mediaExtensions, type);
}

export const managedPathPattern =
  /^media\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(avif|gif|jpg|png|webp|pdf|mp4|webm)$/;
