import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BlogsListing } from "@/components/sections/BlogsListing";

export const metadata: Metadata = {
  title: "Blog & Articles — Amaj Agency",
  description:
    "Articles, ideas, and practical lessons on engineering, product design, AI, and growth from the Amaj team.",
};

export default function BlogsPage() {
  return (
    <>
      <Navbar />
      <main id="top">
        <BlogsListing />
      </main>
      <Footer />
    </>
  );
}
