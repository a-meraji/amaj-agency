import { getPublishedArticle } from "@/lib/content/public";
import { contentResponse } from "@/lib/content/response";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return contentResponse(() => getPublishedArticle(slug));
}
