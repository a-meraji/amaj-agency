import { getHomepageContent } from "@/lib/content/public";
import { contentResponse } from "@/lib/content/response";

export function GET() {
  return contentResponse(getHomepageContent);
}
