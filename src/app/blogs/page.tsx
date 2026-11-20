import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BlogsListing } from "@/components/sections/BlogsListing";
import { getPublishedArticles, getSiteSettings } from "@/lib/content/public";

export const metadata: Metadata = {
  title: "Blog & Articles — Amaj Agency",
  description:
    "Articles, ideas, and practical lessons on engineering, product design, AI, and growth from the Amaj team.",
};

export default function BlogsPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<p className="px-6 pt-36 text-center" role="status">Loading articles…</p>}>
        <BlogsContent />
      </Suspense>
    </>
  );
}

async function BlogsContent() {
  const [articles, settings] = await Promise.all([getPublishedArticles(), getSiteSettings()]);
  return (
    <>
      <main id="top">
        <BlogsListing articles={articles} />
      </main>
      <Footer tagline={settings?.footer_tagline} />
    </>
  );
}
