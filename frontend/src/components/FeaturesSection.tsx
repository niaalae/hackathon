const features = [
  {
    title: "Smart Offline Navigation",
    desc: "Clear walking routes, landmarks, and confidence scoring for dense tourist areas and medinas.",
  },
  {
    title: "Anti-Scam Prevention",
    desc: "Alerts for fake guides, overpricing patterns, pressure-selling zones, and misleading claims.",
  },
  {
    title: "Verified Local Recommendations",
    desc: "Trusted riads, restaurants, artisans, cafés, cultural sites, and official guides.",
  },
  {
    title: "AI Personalized Planning",
    desc: "Adaptive suggestions based on travel style, budget, language, group type, and preferences.",
  },
  {
    title: "Transport Price Guidance",
    desc: "Estimated fair pricing for taxis and transfers to reduce uncertainty and tourist abuse.",
  },
  {
    title: "Safety Profiles",
    desc: "Modes for solo women, families, seniors, and first-time visitors with tailored advice.",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300/75">
            Features
          </p>
          <h3 className="mt-3 text-3xl font-black text-white md:text-5xl">
            Premium features built for real tourist pain points.
          </h3>
        </div>

        <p className="max-w-xl text-base leading-7 text-white/60">
          This is not just a map app. It combines local intelligence, trust
          signals, scam prevention, and tourist personalization in one premium experience.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-violet-300/20 hover:bg-white/[0.07]"
          >
            <div className="mb-5 h-12 w-12 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 via-violet-500/20 to-cyan-400/20 ring-1 ring-white/10" />
            <h4 className="text-xl font-semibold text-white">{feature.title}</h4>
            <p className="mt-3 text-sm leading-7 text-white/55">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturesSection;