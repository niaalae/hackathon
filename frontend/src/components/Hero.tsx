const cities = ["Fès", "Marrakech", "Meknès", "Rabat", "Casablanca"];

const stats = [
  { value: "5+", label: "launch cities" },
  { value: "92%", label: "trusted route success target" },
  { value: "24/7", label: "smart tourist assistance" },
];

function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-28 lg:pt-24">
      <div>
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-100">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          AI tourist companion for Morocco
        </div>

        <h2 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-tight text-white md:text-6xl xl:text-7xl">
          Move through Morocco with{" "}
          <span className="bg-gradient-to-r from-fuchsia-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
            confidence
          </span>
          , avoid scams, and discover authentic places.
        </h2>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65 md:text-xl">
          A premium intelligent assistant designed for tourists visiting Moroccan
          cities. It simplifies navigation in medinas, prevents common scams,
          and recommends reliable places in real time.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <a
            href="#features"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
          >
            Explore Features
          </a>

          <a
            href="#mvp"
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            See MVP Flow
          </a>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
            >
              <div className="text-3xl font-black text-white">{stat.value}</div>
              <div className="mt-2 text-sm text-white/55">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="rounded-[28px] border border-white/10 bg-[#0a1022] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/45">Live city coverage</p>
                <h3 className="mt-1 text-2xl font-bold text-white">
                  Tourist Companion
                </h3>
              </div>

              <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                Online
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {cities.map((city) => (
                <div
                  key={city}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center text-sm font-medium text-white/85"
                >
                  {city}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10 p-5">
              <p className="text-sm text-white/55">Core promise</p>
              <p className="mt-2 text-lg font-semibold text-white">
                Safer movement, trusted discovery, and a more reassuring tourist
                experience across Morocco.
              </p>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">Anti-scam alerts</p>
                <p className="mt-1 text-sm text-white/55">
                  Detects risky areas and warns users before common tourist traps.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">Verified places</p>
                <p className="mt-1 text-sm text-white/55">
                  Reliable riads, restaurants, artisans, cafés, and cultural spots.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">Smart routing</p>
                <p className="mt-1 text-sm text-white/55">
                  Clear guidance with landmarks, confidence score, and local context.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;