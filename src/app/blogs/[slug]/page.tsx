import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getPublishedArticle, getSiteSettings } from "@/lib/content/public";
import { formatArticleDate, imageUrl } from "@/lib/content/presentation";

type ArticlePageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getPublishedArticle((await params).slug);
  return article
    ? { title: `${article.title} | Amaj Agency`, description: article.excerpt }
    : { title: "Article unavailable | Amaj Agency", robots: { index: false } };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  return (
    <>
      <Navbar />
      <Suspense fallback={<p className="px-6 pt-36 text-center" role="status">Loading article…</p>}>
        <ArticleContent params={params} />
      </Suspense>
    </>
  );
}

async function ArticleContent({ params }: ArticlePageProps) {
  const { slug } = await params;
  const [article, settings] = await Promise.all([getPublishedArticle(slug), getSiteSettings()]);
  if (!article) notFound();

  return (
    <>
      <main id="top" className="min-h-screen bg-ink-950 px-6 pb-24 pt-36 text-white">
        <article className="mx-auto max-w-4xl">
          <Link href="/blogs" className="font-semibold text-[#9bb0ff] hover:underline">← All articles</Link>
          <h1 className="mt-5 text-4xl font-bold sm:text-5xl">{article.title}</h1>
          <p className="mt-4 text-lg text-[#bdc7e4]">{article.excerpt}</p>
          <p className="mt-4 text-sm text-[#a5b4dc]">
            <time dateTime={article.publish_date}>{formatArticleDate(article.publish_date)}</time>
            {" · "}{article.read_minutes} min read
          </p>
          <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl">
            <Image src={imageUrl(article.image_path)} alt="" fill sizes="(max-width: 960px) 100vw, 896px" className="object-cover" />
          </div>
          {article.body && <div className="mt-8 whitespace-pre-wrap break-words text-lg leading-8">{article.body}</div>}
        </article>
      </main>
      <Footer tagline={settings?.footer_tagline} />
    </>
  );
}
