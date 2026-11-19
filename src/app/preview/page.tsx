import Link from "next/link";

export default function PreviewPage() {
  const sections = [
    {
      title: "1. Border: Our Work ⟵⟶ Our Team (Continuous and Aligned Grid)",
      img: "/images/previews/final_mode2_work_to_team.png",
      desc: "Grid lines transition seamlessly from beneath Our Work cards into Our Team without offset or interruptions.",
    },
    {
      title: "2. Border: Our Team ⟵⟶ Testimonials (Soft photo fade and coherent grid)",
      img: "/images/previews/final_mode2_team_to_testimonials.png",
      desc: "Team portrait fades softly into the dark background with zero hard cutoffs.",
    },
    {
      title: "3. Detail View of Photo Bottom Fade",
      img: "/images/previews/team_photo_fade_detail.png",
      desc: "Delicate and gradual dissolution of photo torso into deep navy ink background.",
    },
    {
      title: "4. Border: Testimonials ⟵⟶ AMAJ Blog (Full continuity to footer)",
      img: "/images/previews/final_mode2_testimonials_to_blog.png",
      desc: "Exact 85px grid step alignment from client testimonials into Amaj Blog header.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#040816] text-white p-6 sm:p-10 font-sans" dir="ltr">
      <header className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6 mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Seam Continuity Implementation (Coherent Grid)
          </h1>
          <p className="text-sm text-[#8ca0cc] mt-1">
            Global continuous alignment of backdrop grids across all sections.
          </p>
        </div>
        <Link
          href="/"
          className="rounded-full bg-cyan-500/20 border border-cyan-400/50 px-5 py-2.5 text-sm font-semibold text-cyan-200 hover:bg-cyan-500/30 transition-all"
        >
          ← View Live on Homepage
        </Link>
      </header>

      <main className="max-w-6xl mx-auto space-y-12">
        {sections.map((s, i) => (
          <section
            key={i}
            className="rounded-2xl border border-white/10 bg-[#080e24] p-6 shadow-2xl overflow-hidden"
          >
            <h2 className="text-xl font-bold text-cyan-300 mb-2">{s.title}</h2>
            <p className="text-xs sm:text-sm text-[#a8b8db] mb-4">{s.desc}</p>
            <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.img}
                alt={s.title}
                className="w-full h-auto block"
              />
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
