const steps = [
  "The tourist arrives in a Moroccan city and opens the app.",
  "They choose a destination such as a riad, restaurant, monument, artisan shop, or activity.",
  "The app generates a clear route with reassurance, landmarks, and a confidence level.",
  "It displays scam prevention alerts and transport advice when needed.",
  "It recommends nearby verified and authentic places.",
  "The user reaches the destination and leaves feedback to enrich the trust map.",
];

function MVPSection() {
  return (
    <section id="mvp" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-fuchsia-300/75">
            MVP Scenario
          </p>
          <h3 className="mt-3 text-3xl font-black text-white md:text-4xl">
            From arrival to destination, the experience stays guided and trusted.
          </h3>
          <p className="mt-4 text-base leading-8 text-white/60">
            The MVP proves one thing clearly: a tourist can move independently,
            safely, and confidently without relying on unreliable outside help.
          </p>

          <div className="mt-8 rounded-[28px] border border-violet-400/20 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10 p-6">
            <p className="text-sm text-white/55">Main KPI</p>
            <p className="mt-2 text-2xl font-bold text-white">
              Trusted Trip Success Rate
            </p>
            <p className="mt-3 text-sm leading-7 text-white/60">
              Percentage of trips completed successfully without unreliable help,
              major disorientation, or avoidable tourist issues.
            </p>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-[#0a1022] p-6 md:p-8">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className="flex gap-4 rounded-3xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-black text-slate-900">
                  {index + 1}
                </div>

                <div>
                  <p className="text-base leading-7 text-white/80">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MVPSection;