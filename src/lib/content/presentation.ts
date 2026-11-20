import type { ArticleCategory } from "./database";
import { supabaseConfig } from "../supabase/config";
import { mediaBucket } from "./media";

export const articleGradients: Record<ArticleCategory, string> = {
  product: "from-[#4b66f6] to-[#6091fa]",
  engineering: "from-[#10b981] to-[#34d399]",
  design: "from-[#8b5cf6] to-[#a78bfa]",
  growth: "from-[#f59e0b] to-[#fbbf24]",
  ai: "from-[#ec4899] to-[#f472b6]",
};

const articleDateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

export function formatArticleDate(date: string) {
  return articleDateFormat.format(new Date(`${date}T00:00:00Z`));
}

export function imageUrl(path: string) {
  if (path.startsWith("/images/")) return path;
  const { url } = supabaseConfig();
  return new URL(`/storage/v1/object/public/${mediaBucket}/${path}`, url).href;
}
