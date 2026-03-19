import { CheckCircle2, MapPin, RefreshCcw, Sparkles, Star, Wallet } from 'lucide-react'
import type { MatchSessionResult } from '@/types/match'

type MatchSummaryProps = {
  result: MatchSessionResult
  onRestart: () => void
}

export default function MatchSummary({ result, onRestart }: MatchSummaryProps) {
  const main = result.topPicks[0] ?? null
  const backup = result.topPicks[1] ?? null
  const extra = result.topPicks.slice(2)

  return (
    <div className="space-y-4">
      <div className="rounded-[24px] border border-zinc-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-orange-500">
          <CheckCircle2 className="h-4 w-4" />
          Top Trip Pick
        </div>

        {main ? (
          <div className="grid gap-4 md:grid-cols-[130px_1fr]">
            <img src={main.image} alt={main.title} className="h-[130px] w-full rounded-2xl object-cover" />

            <div>
              <h3 className="text-xl font-semibold text-zinc-900">{main.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-500">{main.description}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {main.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-orange-500/10 px-3 py-1 text-xs text-orange-600">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-3 grid gap-2 text-sm text-zinc-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {main.city}, {main.country}
                </div>
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  {main.budget}
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-current text-amber-500" />
                  {main.rating.toFixed(1)} rating
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-zinc-500">No top pick found.</p>
        )}
      </div>

      {backup && (
        <div className="rounded-[24px] border border-zinc-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-700">
            <Sparkles className="h-4 w-4 text-orange-500" />
            Backup Pick
          </div>

          <div className="grid gap-4 md:grid-cols-[120px_1fr]">
            <img src={backup.image} alt={backup.title} className="h-[120px] w-full rounded-2xl object-cover" />
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">{backup.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-500">{backup.description}</p>
            </div>
          </div>
        </div>
      )}

      {extra.length > 0 && (
        <div className="rounded-[24px] border border-zinc-200 bg-white p-4 text-sm text-zinc-600 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
          <div className="mb-2 font-semibold text-zinc-800">More liked trips</div>
          <div className="flex flex-wrap gap-2">
            {extra.map((trip) => (
              <span key={trip.id} className="rounded-full bg-zinc-100 px-3 py-1 text-xs">
                {trip.title}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600">
        Total swipes this run: <span className="font-semibold text-zinc-900">{result.totalSwiped}</span>
      </div>

      <button
        onClick={onRestart}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:bg-zinc-50 hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 motion-reduce:transform-none"
      >
        <RefreshCcw className="h-4 w-4" />
        Restart Matching
      </button>
    </div>
  )
}
