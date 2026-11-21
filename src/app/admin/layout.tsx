import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content admin | Amaj Agency",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div id="admin-layout" className="min-h-screen bg-ink-950 text-fg">{children}</div>;
}
