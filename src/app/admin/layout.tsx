import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content admin | Amaj Agency",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#090e20] text-slate-100">{children}</div>;
}
