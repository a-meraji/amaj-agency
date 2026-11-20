import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GridBackdrop } from "@/components/ui/GridBackdrop";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { Team } from "@/components/sections/Team";
import { Testimonials } from "@/components/sections/Testimonials";
import { Blog } from "@/components/sections/Blog";
import { Contact } from "@/components/sections/Contact";
import { getHomepageContent } from "@/lib/content/public";

export default function Home() {
  return (
    <>
      <Navbar onHome />
      <main id="top">
        <Hero />
        <Services />
        <Suspense fallback={<p className="p-8 text-center" role="status">Loading site content…</p>}>
          <HomeContent />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <HomeFooter />
      </Suspense>
    </>
  );
}
import { Suspense } from "react";

async function HomeContent() {
  const { projects, staff, articles, contactLinks, settings } = await getHomepageContent();
  return (
    <div id="content-canvas" className="relative isolate overflow-clip bg-ink-900">
      <GridBackdrop className="pointer-events-none -z-10 [mask-image:linear-gradient(to_bottom,transparent_0%,transparent_60px,black_220px)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,transparent_60px,black_220px)]" />
      <Work projects={projects} />
      <Team members={staff} />
      <Testimonials />
      <Blog articles={articles} />
      <Contact links={contactLinks} settings={settings} />
    </div>
  );
}

async function HomeFooter() {
  const { settings } = await getHomepageContent();
  return <Footer tagline={settings?.footer_tagline} />;
}
