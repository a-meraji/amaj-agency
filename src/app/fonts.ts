import { Quicksand, Vazirmatn } from "next/font/google";

// Latin text renders in Quicksand; Persian glyphs (absent from Quicksand)
// fall through to Vazirmatn per-character via the shared font stack.
export const quicksand = Quicksand({
  subsets: ["latin", "latin-ext"],
  variable: "--font-quicksand",
  display: "swap",
});

export const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
});
