import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BlogsListing } from "@/components/sections/BlogsListing";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/blogs">): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "fa" ? "وبلاگ و مقالات — آماج" : "Blog & Articles — Amaj Agency",
    description:
      locale === "fa"
        ? "مقاله‌ها، فریم‌ورک‌ها و درس‌های کاربردی تیم آماج دربارهٔ مهندسی، طراحی محصول، هوش مصنوعی و رشد."
        : "Articles, ideas, and practical lessons on engineering, product design, AI, and growth from the Amaj team.",
  };
}

export default async function BlogsPage({ params }: PageProps<"/[locale]/blogs">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      <main>
        <BlogsListing />
      </main>
      <Footer />
    </>
  );
}
