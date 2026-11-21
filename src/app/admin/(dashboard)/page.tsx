import Link from "next/link";
import { adminPanel, DashboardIcon, dashboardLinks, pageTitle } from "./dashboard-ui";

export default function Dashboard() {
  return (
    <>
      <h1 className={pageTitle}>Manage site content</h1>
      <p className="mt-2 text-body text-fg-muted-blue">Choose a section to update the Amaj website.</p>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {dashboardLinks.slice(1).map(({ href, icon, label, description }) => (
          <Link key={href} href={href} className={adminPanel + " group flex min-w-0 items-start gap-4 p-4 transition-colors hover:border-periwinkle/60 hover:bg-ink-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-periwinkle sm:p-5"}>
            <span className="grid size-11 shrink-0 place-items-center rounded-sm border border-periwinkle/25 bg-ink-700 text-periwinkle">
              <DashboardIcon name={icon} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-h4 font-bold text-fg">{label}</span>
              <span className="mt-1 block text-sm leading-relaxed text-fg-muted-blue">{description}</span>
            </span>
            <DashboardIcon name="next" className="mt-1 size-4 shrink-0 text-periwinkle transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </>
  );
}
