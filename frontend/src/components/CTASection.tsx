function CTASection() {
  return (
    <section id="cta" className="mx-auto max-w-7xl px-6 pb-24 pt-12 lg:px-10">
      <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/5 p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,70,239,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.18),transparent_30%)]" />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/55">
              Pitch Positioning
            </p>
            <h3 className="mt-3 text-3xl font-black text-white md:text-5xl">
              A trusted intelligent companion for tourists in Morocco.
            </h3>
            <p className="mt-4 text-lg leading-8 text-white/65">
              Not just a tourism app. A scalable smart assistant that improves
              safety, autonomy, trust, and authentic discovery across Moroccan cities.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
            >
              Launch Demo
            </a>

            <a
              href="#problem"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Back to Overview
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;