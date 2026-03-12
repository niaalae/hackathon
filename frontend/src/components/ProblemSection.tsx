const problems = [
  {
    title: "Getting lost in medinas",
    text: "Tourists struggle with maze-like streets, wrong turns, and intrusive fake helpers.",
  },
  {
    title: "Trust and scam issues",
    text: "Taxi overcharging, fake guides, pressure selling, and misleading local advice damage the experience.",
  },
  {
    title: "No reliable local discovery",
    text: "Visitors often fail to identify authentic places they can actually trust.",
  },
  {
    title: "Fragmented tools",
    text: "Maps, bookings, notes, and recommendations are scattered across multiple apps with no local intelligence.",
  },
];

function ProblemSection() {
  return (
    <section id="problem" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <div className="mb-12 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300/75">
          Problem
        </p>
        <h3 className="mt-3 text-3xl font-black text-white md:text-5xl">
          Tourism in Morocco needs a smarter trust layer.
        </h3>
        <p className="mt-4 text-lg leading-8 text-white/60">
          The core issue is not only navigation. It is confidence. Tourists need
          one intelligent product that helps them move safely, avoid common scams,
          and find trusted experiences without friction.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {problems.map((item, index) => (
          <div
            key={item.title}
            className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500/80 via-violet-500/80 to-cyan-400/80 text-sm font-bold text-white">
              0{index + 1}
            </div>
            <h4 className="text-xl font-semibold text-white">{item.title}</h4>
            <p className="mt-3 text-sm leading-7 text-white/55">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProblemSection;