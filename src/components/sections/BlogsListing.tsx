"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GridBackdrop } from "@/components/ui/GridBackdrop";
import { CalendarIcon, ClockIcon, ArrowRightBlog } from "@/components/icons/ui";

import { articleCategories, type ArticleCategory, type ArticleSummary } from "@/lib/content/database";
import { articleGradients, formatArticleDate, imageUrl } from "@/lib/content/presentation";

type BlogCategory = "all" | ArticleCategory;
type SortOption = "latest" | "oldest" | "readingTime";

const categories = ["all", ...articleCategories] as const;

export function BlogsListing({ articles }: { articles: ArticleSummary[] }) {
  const tPage = useTranslations("BlogsPage");

  const [activeCategory, setActiveCategory] = useState<BlogCategory>("all");
  const [sortOption, setSortOption] = useState<SortOption>("latest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Close custom dropdown on outside click or Escape key
  useEffect(() => {
    if (!isSortOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(e.target as Node)
      ) {
        setIsSortOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSortOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSortOpen]);

  const filteredArticles = useMemo(() => {
    return articles
      .filter((article) => activeCategory === "all" || article.category === activeCategory)
      .sort((a, b) => {
        if (sortOption === "oldest") return a.publish_date.localeCompare(b.publish_date);
        if (sortOption === "readingTime") return a.read_minutes - b.read_minutes;
        return b.publish_date.localeCompare(a.publish_date);
      });
  }, [articles, activeCategory, sortOption]);

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-ink-950 px-6 pt-[120px] pb-[130px] lg:px-10 lg:pt-[150px] lg:pb-[160px]">
      <GridBackdrop className="-z-10" />

      {/* Ambient background glows */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-20 start-1/4 -z-10 h-[500px] w-[600px] rounded-full bg-[#4633ff]/10 blur-[120px]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1/3 end-10 -z-10 h-[450px] w-[550px] rounded-full bg-[#3561ff]/10 blur-[110px]"
      />

      <div className="mx-auto max-w-[1297px]">
        {/* Minimalist Header */}
        <header className="flex flex-col items-center text-center">
          <Eyebrow tone="periwinkle" startLine="w-[60px] lg:w-[120px]" endLine="w-[60px] lg:w-[120px]">
            {tPage("eyebrow")}
          </Eyebrow>

          <h1 className="mt-3 text-[36px] leading-[44px] font-normal text-white sm:text-[46px] sm:leading-[54px] lg:text-[64px] lg:leading-[74px]">
            <span className="block sm:inline font-normal">{tPage("titleLight")}</span>{" "}
            <span className="font-bold text-[#628eff]">{tPage("titleBold")}</span>
          </h1>

          <p className="mt-3 max-w-[620px] text-[14.5px] leading-[23px] text-[#bdc7e4] sm:text-[16px] sm:leading-[26px]">
            {tPage("subtitle")}
          </p>
        </header>

        {/* Filter & Sort Bar (Minimalism and Essentialism) */}
        <div className="mt-10 sm:mt-12 flex flex-col gap-4 border-b border-[#232f55]/80 pb-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Categories Pill Navigation */}
          <div
            role="tablist"
            aria-label="Filter blog by category"
            className="flex flex-wrap items-center gap-2 sm:gap-2.5"
          >
            {categories.map((key) => {
              const isActive = activeCategory === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(key)}
                  className={`cursor-pointer rounded-[12px] px-3.5 py-1.5 text-[13px] sm:px-4 sm:py-2 sm:text-[14px] font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-[#4d6bfe] to-[#45b7fe] text-white shadow-md shadow-[#4d6bfe]/30 font-semibold scale-[1.02]"
                      : "border border-[#232f55] bg-[#111933]/70 text-[#9bb0ff] hover:border-indigo/50 hover:bg-[#162144] hover:text-white"
                  }`}
                >
                  {tPage(`categories.${key}`)}
                </button>
              );
            })}
          </div>

          {/* Sort Controls & Counter */}
          <div className="flex items-center justify-between gap-4 lg:justify-end">
            <span className="text-[12.5px] sm:text-[13px] text-[#8697c7]">
              {tPage("showingCount", { count: filteredArticles.length })}
            </span>

            {/* Custom Dark Glass Dropdown (No native OS white picker!) */}
            <div ref={sortDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setIsSortOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isSortOpen}
                className="group flex cursor-pointer items-center gap-2 rounded-[11px] sm:rounded-xl border border-[#263560] bg-[#111936]/90 px-3.5 py-1.5 text-[12.5px] sm:text-[13.5px] font-medium text-white shadow-sm backdrop-blur-md transition-all hover:border-indigo/50 hover:bg-[#162148] active:scale-95"
              >
                <span className="text-[#8697c7] hidden sm:inline">{tPage("sort.label")}:</span>
                <span className="font-semibold text-[#f1f2fc]">
                  {sortOption === "latest"
                    ? tPage("sort.latest")
                    : sortOption === "oldest"
                    ? tPage("sort.oldest")
                    : tPage("sort.readingTime")}
                </span>
                <svg
                  className={`size-4 text-[#8697c7] transition-transform duration-200 group-hover:text-white ${
                    isSortOpen ? "rotate-180 text-white" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 7.5L10 12.5L15 7.5" />
                </svg>
              </button>

              {/* Custom Dropdown Menu Panel */}
              <div
                role="listbox"
                className={`absolute end-0 top-full mt-2 z-40 min-w-[170px] origin-top-right rounded-[14px] border border-[#2b3a6b] bg-[#0f1733]/95 p-1.5 shadow-2xl shadow-black/80 backdrop-blur-xl transition-all duration-200 ${
                  isSortOpen
                    ? "scale-100 opacity-100 pointer-events-auto"
                    : "scale-95 opacity-0 pointer-events-none"
                }`}
              >
                {(
                  [
                    { value: "latest", labelKey: "sort.latest" },
                    { value: "oldest", labelKey: "sort.oldest" },
                    { value: "readingTime", labelKey: "sort.readingTime" },
                  ] as const
                ).map(({ value, labelKey }) => {
                  const isSelected = value === sortOption;
                  return (
                    <button
                      key={value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setSortOption(value);
                        setIsSortOpen(false);
                      }}
                      className={`flex w-full cursor-pointer items-center justify-between rounded-[10px] px-3 py-2 text-start text-[13px] transition-colors ${
                        isSelected
                          ? "bg-[#4d6bfe]/20 font-semibold text-[#6aa3ff]"
                          : "text-[#cbd5e1] hover:bg-[#18234d] hover:text-white"
                      }`}
                    >
                      <span>{tPage(labelKey)}</span>
                      {isSelected && (
                        <svg
                          className="size-4 text-[#6aa3ff]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Blog Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {filteredArticles.map((article) => {
              return (
                <article
                  key={article.id}
                  className="group flex flex-col overflow-hidden rounded-[20px] border border-[#232f55] bg-[#0d1633]/85 p-4 sm:p-5 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo/50 hover:bg-[#111c40] hover:shadow-2xl hover:shadow-indigo/10"
                >
                  {/* Article Thumbnail */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[14px]">
                    <Image
                      src={imageUrl(article.image_path)}
                      alt=""
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  {/* Body Content */}
                  <div className="mt-4 flex flex-1 flex-col items-start">
                    {/* Category Tag */}
                    <span
                      className={`inline-flex items-center rounded-lg bg-gradient-to-r ${articleGradients[article.category]} px-2.5 py-0.5 text-[11px] sm:text-[12px] font-semibold text-white shadow-sm`}
                    >
                      {tPage(`categories.${article.category}`)}
                    </span>

                    {/* Title */}
                    <h2 className="mt-2.5 text-[17px] sm:text-[19px] leading-[25px] sm:leading-[27px] font-bold text-white transition-colors duration-200 group-hover:text-[#6aa3ff]">
                      {article.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="mt-2 text-[13px] sm:text-[14px] leading-[21px] sm:leading-[22px] text-[#a9b5da] line-clamp-3">
                      {article.excerpt}
                    </p>

                    {/* Meta Footer */}
                    <div className="mt-auto pt-5 w-full flex items-center justify-between border-t border-[#1e2a52] text-[12.5px] sm:text-[13px] text-[#93a2cf]">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <CalendarIcon className="h-3.5 w-3.5" />
                          <time dateTime={article.publish_date}>{formatArticleDate(article.publish_date)}</time>
                        </div>
                        <span aria-hidden="true" className="text-white/20">
                          |
                        </span>
                        <div className="flex items-center gap-1.5">
                          <ClockIcon className="h-3.5 w-3.5" />
                          <span>{tPage("minRead", { minutes: article.read_minutes })}</span>
                        </div>
                      </div>

                      <Link href={`/blogs/${article.slug}`} aria-label={article.title} className="flex items-center gap-1 text-[13px] font-medium text-[#6aa3ff] transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                        <span>{tPage("readArticle")}</span>
                        <ArrowRightBlog className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="mt-16 flex flex-col items-center justify-center text-center p-8 rounded-[20px] border border-[#232f55] bg-[#0d1633]/60">
            <p className="text-[16px] text-[#a9b5da]">{tPage("noArticles")}</p>
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className="mt-4 cursor-pointer rounded-xl bg-gradient-to-r from-[#4d6bfe] to-[#45b7fe] px-4 py-2 text-[14px] font-semibold text-white shadow-md transition-all hover:scale-105"
            >
              {tPage("allCategories")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
