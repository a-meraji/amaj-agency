import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

// Development-only reference sheet for the design tokens in globals.css.
export default async function Styleguide({
  params,
}: PageProps<"/[locale]/styleguide">) {
  if (process.env.NODE_ENV === "production") notFound();
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="mx-auto max-w-6xl space-y-16 px-6 py-12">
      <header>
        <h1 className="text-h2 font-bold">Amaj — Design Tokens</h1>
        <p className="text-body-lg text-fg-muted">
          Normalized from Figma. Desktop sizes at 1:1, mobile = Figma ÷ 2.
        </p>
      </header>

      <Section title="Surfaces">
        <Swatches
          items={[
            ["ink-950", "bg-ink-950", "#070a19", "hero, services"],
            ["ink-900", "bg-ink-900", "#09122f", "work, team, testimonials, blog"],
            ["ink-800", "bg-ink-800", "#0d183b", "blog panels"],
            ["ink-700", "bg-ink-700", "#142043", "testimonial cards"],
            ["dusk", "bg-dusk", "#171b3d", "section transition"],
            ["card", "bg-card", "#111525", "service cards"],
            ["tile", "bg-tile", "#1a2033", "icon tiles"],
          ]}
        />
      </Section>

      <Section title="Text">
        <Swatches
          items={[
            ["fg", "bg-fg", "#f7f8ff", "headings, primary"],
            ["fg-soft", "bg-fg-soft", "#e3e6f5", "card copy, meta"],
            ["fg-dim", "bg-fg-dim", "#cfd5ea", "blog excerpts"],
            ["fg-muted", "bg-fg-muted", "#b6b9cb", "section leads"],
            ["fg-muted-blue", "bg-fg-muted-blue", "#bdc6e4", "roles, mobile leads"],
            ["fg-faint", "bg-fg-faint", "#626b88", "client logos"],
          ]}
        />
      </Section>

      <Section title="Brand & accents">
        <Swatches
          items={[
            ["brand", "bg-brand", "#4633ff", "primary violet"],
            ["sky", "bg-sky", "#54ccff", "gradient end"],
            ["periwinkle", "bg-periwinkle", "#789aff", "eyebrows"],
            ["indigo", "bg-indigo", "#6a84ff", "rules, tags"],
            ["lilac", "bg-lilac", "#a475ff", "active dot"],
            ["pager", "bg-pager", "#9ca4db", "inactive dot"],
          ]}
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Gradient className="bg-gradient-primary" label="gradient-primary" />
          <Gradient
            className="bg-[linear-gradient(90deg,#ff6a00_0%,#ff974d_38%,#ffd2b2_100%)]"
            label="sunset (hero headline)"
          />
          <Gradient
            className="bg-[linear-gradient(90deg,#6f8eff,#6984ff)]"
            label="indigo (“Blogs”)"
          />
        </div>
      </Section>

      <Section title="Lines">
        <div className="grid gap-4 sm:grid-cols-5">
          {[
            ["line-subtle", "border-line-subtle"],
            ["line", "border-line"],
            ["line-strong", "border-line-strong"],
            ["divider", "border-divider"],
            ["grid", "border-grid"],
          ].map(([name, cls]) => (
            <div key={name} className={`rounded-sm border-2 ${cls} bg-ink-900 p-4`}>
              <code className="text-meta text-fg-soft">{name}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography (desktop → mobile)">
        <div className="space-y-6 rounded-lg bg-ink-900 p-8">
          <TypeRow token="display-light + display" spec="67/400 + 72/700 → 33.5 + 36">
            <span className="text-display-light">Products That </span>
            <span className="text-display font-bold">Deliver</span>
          </TypeRow>
          <TypeRow token="display (sunset)" spec="67/700 → 38">
            <span className="text-display-light font-bold text-gradient-sunset">
              Digital Solutions
            </span>
          </TypeRow>
          <TypeRow token="h2" spec="36/700 → 17">
            <span className="text-h2 font-bold">From Ideas to Impact</span>
          </TypeRow>
          <TypeRow token="h3" spec="24/700 → 12–13">
            <span className="text-h3 font-bold">A Practical Guide to Better UX</span>
          </TypeRow>
          <TypeRow token="h4" spec="20/700 → 15">
            <span className="text-h4 font-bold">AI &amp; Automation</span>
          </TypeRow>
          <TypeRow token="eyebrow" spec="24/700, tracking 0.16em → 10–12">
            <span className="text-eyebrow font-bold uppercase tracking-eyebrow text-periwinkle">
              What we do
            </span>
          </TypeRow>
          <TypeRow token="lead" spec="24/400 → 14.5–17">
            <span className="text-lead text-fg-muted">
              A multidisciplinary team for building, growing, and automating.
            </span>
          </TypeRow>
          <TypeRow token="body-lg" spec="20/400 → 12">
            <span className="text-body-lg text-fg-soft">Business Owner, DrWatch</span>
          </TypeRow>
          <TypeRow token="body" spec="16.5/400 → 12">
            <span className="text-body text-fg-muted">
              Intelligent workflows and AI-powered solutions.
            </span>
          </TypeRow>
          <TypeRow token="ui" spec="17/600 → 17.5–18.5/700">
            <span className="text-ui font-semibold">Start a Project</span>
          </TypeRow>
          <TypeRow token="meta" spec="16.5/500 → 10">
            <span className="text-meta font-medium text-fg-soft">Jan 26, 2025 · 8 min read</span>
          </TypeRow>
          <TypeRow token="overline" spec="13/500, tracking 0.28em → 10.5">
            <span className="text-overline font-medium uppercase tracking-overline text-fg-muted">
              Trusted by leading teams
            </span>
          </TypeRow>
          <TypeRow token="Persian (Vazirmatn)" spec="same scale">
            <span className="text-display-light font-bold" dir="rtl">
              راهکارهای دیجیتال
            </span>
          </TypeRow>
        </div>
      </Section>

      <Section title="Radii">
        <div className="flex flex-wrap gap-6">
          {[
            ["sm · 10", "rounded-sm"],
            ["md · 16", "rounded-md"],
            ["lg · 20", "rounded-lg"],
            ["xl · 28", "rounded-xl"],
          ].map(([name, cls]) => (
            <div
              key={name}
              className={`flex size-28 items-end border border-line bg-ink-800 p-3 ${cls}`}
            >
              <code className="text-meta text-fg-soft">{name}</code>
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-6 text-eyebrow font-bold uppercase tracking-eyebrow text-periwinkle">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Swatches({ items }: { items: [string, string, string, string][] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
      {items.map(([name, cls, hex, use]) => (
        <div key={name}>
          <div className={`h-20 rounded-sm border border-line ${cls}`} />
          <div className="mt-2 text-meta font-bold">{name}</div>
          <div className="text-meta text-fg-muted">{hex}</div>
          <div className="text-overline text-fg-muted">{use}</div>
        </div>
      ))}
    </div>
  );
}

function Gradient({ className, label }: { className: string; label: string }) {
  return (
    <div>
      <div className={`h-16 rounded-sm ${className}`} />
      <div className="mt-2 text-meta text-fg-muted">{label}</div>
    </div>
  );
}

function TypeRow({
  token,
  spec,
  children,
}: {
  token: string;
  spec: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 border-b border-line pb-6 md:grid-cols-[220px_1fr] md:items-baseline">
      <div>
        <code className="text-meta font-bold text-fg">{token}</code>
        <div className="text-overline text-fg-muted">{spec}</div>
      </div>
      <div>{children}</div>
    </div>
  );
}
