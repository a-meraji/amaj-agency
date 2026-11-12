import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fa"],
  defaultLocale: "en",
});

export type Locale = (typeof routing.locales)[number];

export const rtlLocales: readonly Locale[] = ["fa"];
export const getDirection = (locale: Locale) =>
  rtlLocales.includes(locale) ? "rtl" : "ltr";
