import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowRight, Loader2, Sparkles } from 'lucide-react'
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
    } catch {
      setError('Could not reach the trip agent. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (initialPrompt) runAgent(initialPrompt)
  }, [initialPrompt]) // eslint-disable-line

  const bookings = response?.bookings ?? []

  return (
    <PageLayout>
      <div className="min-h-screen bg-white">

        {/* ── Top bar ── */}
        <div className="border-b border-zinc-100 px-4 py-8 sm:py-16 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500">Trip Agent</p>
            <h1 className="mt-2 text-2xl font-bold text-zinc-900 sm:mt-3 sm:text-3xl">What are you planning?</h1>

            <div className="mt-6 flex flex-col sm:mt-8 sm:flex-row gap-2">
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') runAgent(prompt) }}
                placeholder="e.g. 3 days in Fes with friends..."
                className="h-12 sm:h-11 flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-orange-400 focus:bg-white transition-all shadow-sm"
              />
              <button
                onClick={() => runAgent(prompt)}
                disabled={isLoading}
                className="flex h-12 sm:h-11 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 sm:px-5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50 shadow-sm"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                <span className="sm:hidden">Plan Trip</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Response ── */}
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">

          {/* Loading */}
          {isLoading && (
            <div className="space-y-3 py-8 text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-orange-500" />
              <p className="text-sm text-zinc-400">Thinking…</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Answer */}
          {!isLoading && !error && response && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                  <Sparkles className="h-3.5 w-3.5 text-orange-500" />
                  Agent
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-zinc-700">{response.answer}</p>
              </div>

              {response.followUpQuestion && (
                <div className="rounded-xl border border-orange-100 bg-orange-50/50 px-4 py-3 text-sm text-zinc-600">
                  {response.followUpQuestion}
                </div>
              )}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && !response && (
            <p className="py-16 text-center text-sm text-zinc-400">
              Describe your trip above to get started.
            </p>
          )}
        </div>

        {/* ── Bookings ── */}
        {(bookings.length > 0 || isLoading) && (
          <div className="border-t border-zinc-100 px-4 py-10 sm:px-6">
            <div className="mx-auto max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Suggestions</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {isLoading && Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-xl border border-zinc-100 p-4">
                    <div className="h-2.5 w-12 rounded bg-zinc-100" />
                    <div className="mt-3 h-3 w-3/4 rounded bg-zinc-100" />
                    <div className="mt-4 h-2.5 w-full rounded bg-zinc-50" />
                  </div>
                ))}
                {bookings.map((b, i) => (
                  <div key={`${b.title}-${i}`} className="rounded-xl border border-zinc-200 p-4 transition hover:border-orange-200">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-orange-500">{b.type}</p>
                    <p className="mt-1.5 text-sm font-semibold text-zinc-900">{b.title}</p>
                    {b.priceRange && <p className="mt-1 text-xs text-zinc-500">{b.priceRange}</p>}
                    {b.notes && <p className="mt-2 text-xs leading-relaxed text-zinc-400">{b.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
