function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <a href="#" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400 shadow-lg shadow-violet-950/40">
            <span className="text-lg font-black text-white">M</span>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
              Hackathon IA
            </p>
            <h1 className="text-base font-semibold text-white">
              Morocco Trust Travel
            </h1>
          </div>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#problem" className="text-sm text-white/70 transition hover:text-white">
            Problem
          </a>
          <a href="#features" className="text-sm text-white/70 transition hover:text-white">
            Features
          </a>
          <a href="#mvp" className="text-sm text-white/70 transition hover:text-white">
            MVP
          </a>
          <a href="#cta" className="text-sm text-white/70 transition hover:text-white">
            Contact
          </a>
        </nav>

        <a
          href="#cta"
          className="rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/15"
        >
          View Project
        </a>
      </div>
    </header>
  );
}

export default Navbar;