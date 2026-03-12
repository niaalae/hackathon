import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import PageLayout from '@/components/layouts/PageLayout'
import api from '@/lib/api'

type BookingSuggestion = {
  title: string
  type: string
  priceRange?: string
  notes?: string
}

type HeroAgentResponse = {
  answer: string
  intent?: 'booking' | 'information' | 'collaboration' | 'guide' | 'new_trip'
  followUpQuestion?: string
  bookings?: BookingSuggestion[]
}

export default function Dashboard() {
  const [searchParams] = useSearchParams()
  const initialPrompt =
    searchParams.get('prompt') ??
    sessionStorage.getItem('heroPrompt') ??
    ''

  const [prompt, setPrompt] = useState(initialPrompt)
  const [response, setResponse] = useState<HeroAgentResponse | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const runAgent = async (value: string) => {
    const trimmed = value.trim()
    if (!trimmed || isLoading) return
    setIsLoading(true)
    setError('')
    try {
      const { data } = await api.post<HeroAgentResponse>('/agent/hero', { prompt: trimmed })
      setResponse(data)
    } catch (err) {
      setError('We could not reach the trip agent. Please try again in a moment.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (initialPrompt) runAgent(initialPrompt)
  }, [initialPrompt])

  return (
    <PageLayout>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-16 sm:px-6 lg:px-10">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-20 top-10 h-48 w-48 rounded-full bg-orange-400 blur-3xl" />
          <div className="absolute right-0 top-24 h-56 w-56 rounded-full bg-sky-400 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl text-white">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                <Sparkles className="h-4 w-4" />
                Trip Agent Dashboard
              </div>
              <h1 className="mt-4 text-3xl font-semibold sm:text-4xl lg:text-5xl">
                Your trip agent is already working.
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-white/70 sm:text-base">
                We translate your request into a plan, shortlist bookings, and a first itinerary.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
              Status: {isLoading ? 'Searching offers...' : 'Ready'}
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.35)]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Your Prompt</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') runAgent(prompt)
                  }}
                  placeholder="Describe your trip, budget, and vibe..."
                  className="h-12 flex-1 rounded-2xl border border-white/10 bg-white/10 px-4 text-sm text-white placeholder:text-white/50 outline-none focus:border-orange-300/60"
                />
                <button
                  onClick={() => runAgent(prompt)}
                  disabled={isLoading}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 text-sm font-semibold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? 'Working...' : 'Regenerate'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                {error ? (
                  <p className="text-sm text-red-300">{error}</p>
                ) : isLoading ? (
                  <div className="space-y-3 text-white/70">
                    <div className="h-3 w-2/3 rounded-full bg-white/10" />
                    <div className="h-3 w-5/6 rounded-full bg-white/10" />
                    <div className="h-3 w-1/2 rounded-full bg-white/10" />
                  </div>
                ) : (
                  <div className="space-y-3 text-sm text-white/80">
                    <p>{response?.answer ?? 'Enter your trip idea to get instant recommendations.'}</p>
                    {response?.intent && (
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
                        Intent: {response.intent.replace('_', ' ')}
                      </div>
                    )}
                    {response?.followUpQuestion && (
                      <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-xs text-white/80">
                        {response.followUpQuestion}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Next Steps</p>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li>Confirm dates and group size</li>
                <li>Pick a budget tier</li>
                <li>Lock top 3 booking options</li>
              </ul>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4 text-xs text-white/60">
                Your dashboard will sync bookings, itinerary, and group chat once you confirm.
              </div>
            </div>
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Booking Suggestions</h2>
              <span className="text-xs text-white/60">Auto-generated shortlist</span>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(response?.bookings ?? []).length === 0 && !isLoading && (
                <div className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
                  Submit a prompt to get booking suggestions.
                </div>
              )}
              {(response?.bookings ?? []).map((booking, index) => (
                <div
                  key={`${booking.title}-${index}`}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_40px_rgba(15,23,42,0.25)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
                    {booking.type}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {booking.title}
                  </p>
                  {booking.priceRange && (
                    <p className="mt-1 text-xs text-white/60">{booking.priceRange}</p>
                  )}
                  {booking.notes && (
                    <p className="mt-3 text-xs text-white/70">{booking.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
