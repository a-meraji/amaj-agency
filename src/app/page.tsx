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

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="top">
        <Hero />
        <Services />
        <div id="content-canvas" className="relative isolate overflow-clip bg-ink-900">
          <GridBackdrop className="pointer-events-none -z-10 [mask-image:linear-gradient(to_bottom,transparent_0%,transparent_60px,black_220px)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,transparent_60px,black_220px)]" />
          <Work />
          <Team />
          <Testimonials />
          <Blog />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
