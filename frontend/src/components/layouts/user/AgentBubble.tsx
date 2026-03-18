import { useEffect, useRef, useState } from 'react'
import { Calendar, Compass, Loader2, MapPin, Send, Sparkles, Users, X } from 'lucide-react'
import { requestHeroAgent } from '@/lib/agent'
import { useWindowSize } from '@/hooks/useWindowSize'
import { useNavigate } from 'react-router-dom'

type BookingSuggestion = {
  title: string
  type: string
  priceRange?: string
  notes?: string
}

type AgentActionType =
  | 'SHOW_TRIPS'
  | 'SHOW_GROUPS'
  | 'SHOW_BOOKINGS'
  | 'SHOW_GUIDES'
  | 'SHOW_MAP'
  | 'SHOW_QUESTS'

type AgentAction = {
  type: AgentActionType
  payload?: Record<string, unknown>
}

type HeroAgentResponse = {
  answer: string
  intent: 'booking' | 'information' | 'collaboration' | 'guide' | 'new_trip'
  followUpQuestion: string | null
  bookings: BookingSuggestion[]
  actions: AgentAction[]
}

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function AgentBubble() {
  const { isMobile } = useWindowSize()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [lastResponse, setLastResponse] = useState<HeroAgentResponse | null>(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showModes, setShowModes] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const knownCities = [
    'Fes',
    'Marrakech',
    'Casablanca',
    'Chefchaouen',
    'Essaouira',
    'Agadir',
    'Rabat',
    'Tangier',
    'Merzouga',
    'Ouarzazate',
    'Imlil',
    'Dakhla',
  ]

  const agentModes = [
    {
      label: 'Booking',
      hint: 'Stays, flights, activities',
      prompt: 'Book a 4 day trip to Marrakech with a 4500 MAD budget',
      icon: Calendar,
      tone: 'bg-orange-100 text-orange-600',
    },
    {
      label: 'Trip info',
      hint: 'Best seasons, tips',
      prompt: 'Give me the best time to visit Chefchaouen',
      icon: Sparkles,
      tone: 'bg-amber-100 text-amber-600',
    },
    {
      label: 'Collaborate',
      hint: 'Join a group trip',
      prompt: 'I want to join a group trip to Tangier next month',
      icon: Users,
      tone: 'bg-orange-100 text-orange-600',
    },
    {
      label: 'Find a guide',
      hint: 'Local experts on demand',
      prompt: 'I need a local guide in Fes for 2 days under 1500 MAD',
      icon: MapPin,
      tone: 'bg-amber-100 text-amber-600',
    },
    {
      label: 'New trip',
      hint: 'Start from scratch',
      prompt: 'Create a new 3 day trip to Rabat with a relaxed vibe',
      icon: Compass,
      tone: 'bg-orange-100 text-orange-600',
    },
  ]

  const actionRoutes: Record<
    AgentActionType,
    { label: string; href: string } | null
  > = {
    SHOW_TRIPS: { label: 'Open trips', href: '/user/trips' },
    SHOW_GROUPS: { label: 'Open groups', href: '/user/groups' },
    SHOW_BOOKINGS: { label: 'See bookings', href: '/user/trips' },
    SHOW_GUIDES: { label: 'Find guides', href: '/user/trips' },
    SHOW_MAP: { label: 'Open map', href: '/user/maps' },
    SHOW_QUESTS: { label: 'Open quests', href: '/user/ai' },
  }

  const intentLabel = (intent?: HeroAgentResponse['intent']) => {
    switch (intent) {
      case 'booking':
        return 'Booking flow'
      case 'collaboration':
        return 'Collaboration'
      case 'guide':
        return 'Guide match'
      case 'new_trip':
        return 'New trip'
      default:
        return 'Travel info'
    }
  }

  const detectCity = (text: string) =>
    knownCities.find((city) => new RegExp(`\\b${city}\\b`, 'i').test(text))

  const runAction = (action: AgentAction, promptOverride?: string) => {
    const target = actionRoutes[action.type]
    if (!target) return
    const lastPrompt =
      promptOverride ||
      [...messages].reverse().find((msg) => msg.role === 'user')?.content ||
      ''
    const payload = {
      ...action.payload,
      prompt: lastPrompt,
      city: detectCity(lastPrompt),
    }
    sessionStorage.setItem(
      'agentAction',
      JSON.stringify({ type: action.type, payload }),
    )
    navigate(target.href)
    setOpen(false)
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, open])

  useEffect(() => {
    if (isMobile) return
    const pendingPrompt = sessionStorage.getItem('heroPrompt')
    if (!pendingPrompt) return
    sessionStorage.removeItem('heroPrompt')
    setOpen(true)
    void sendMessage(pendingPrompt)
  }, [isMobile])

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const history = messages.slice(-6).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-user`, role: 'user', content: trimmed },
    ])
    setInput('')
    setLoading(true)
    setShowModes(false)

    try {
      const { data } = await requestHeroAgent<HeroAgentResponse>(trimmed, history)
      setLastResponse(data)
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          content: data.answer,
        },
      ])
      const followUp = data.followUpQuestion?.trim()
      if (followUp) {
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-followup`,
            role: 'assistant',
            content: followUp,
          },
        ])
      }

      const lowerPrompt = trimmed.toLowerCase()
      const wantsRoute = /(route|map|navigate|navigation|itinerary)/.test(lowerPrompt)
      const autoAction = data.actions?.find((action) => {
        if (wantsRoute && action.type === 'SHOW_MAP') return true
        if (action.type === 'SHOW_GROUPS' && data.intent === 'collaboration') return true
        if (action.type === 'SHOW_GUIDES' && data.intent === 'guide') return true
        if (
          action.type === 'SHOW_TRIPS' &&
          (data.intent === 'booking' || data.intent === 'new_trip')
        ) {
          return true
        }
        return false
      })

      if (autoAction) {
        setTimeout(() => runAction(autoAction, trimmed), 400)
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant-error`,
          role: 'assistant',
          content: 'I had trouble reaching the agent. Try again in a moment.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (isMobile) return null

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-[9999] flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500 text-white shadow-[0_18px_40px_rgba(249,115,22,0.35)] ring-2 ring-white/80 transition duration-200 hover:translate-y-[-1px] hover:shadow-[0_24px_50px_rgba(249,115,22,0.4)] active:scale-95"
        aria-label="Open AI agent"
      >
        {open ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
      </button>

      <div
        className={`fixed bottom-20 right-6 z-[9999] flex h-[720px] w-[360px] max-w-[90vw] max-h-[85vh] flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/95 shadow-[0_24px_70px_rgba(15,23,42,0.18)] ring-1 ring-orange-100/70 backdrop-blur-xl transition-all duration-200 ${
          open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
        }`}
      >
        <div className="flex items-center gap-3 border-b border-zinc-100/80 bg-gradient-to-r from-white via-white to-orange-50 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-[0_10px_24px_rgba(249,115,22,0.35)]">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-zinc-900">Trippple Agent</p>
            <div className="mt-0.5 flex items-center gap-2 text-[11px] text-zinc-400">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Online • Your travel concierge
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 min-h-0 space-y-4 overflow-y-auto px-4 py-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-[0_12px_25px_rgba(249,115,22,0.25)]'
                    : 'border border-zinc-100 bg-white/90 text-zinc-700 shadow-[0_10px_20px_rgba(24,24,27,0.06)]'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl border border-zinc-100 bg-white px-3 py-2 text-xs text-zinc-400 shadow-[0_8px_18px_rgba(24,24,27,0.06)]">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Thinking...
              </div>
            </div>
          )}

          {lastResponse && lastResponse.bookings?.length > 0 && (
            <div className="rounded-2xl border border-orange-100/70 bg-white/90 px-3 py-3 shadow-[0_12px_26px_rgba(249,115,22,0.08)]">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                <span>Booking picks</span>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-semibold text-orange-600">
                  {intentLabel(lastResponse.intent)}
                </span>
              </div>
              <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
                {lastResponse.bookings.slice(0, 4).map((booking, index) => (
                  <div
                    key={`${booking.title}-${index}`}
                    className="min-w-[180px] flex-1 rounded-2xl border border-orange-100/80 bg-white px-3 py-3 shadow-[0_12px_24px_rgba(249,115,22,0.08)]"
                  >
                    <div className="text-[10px] uppercase tracking-[0.2em] text-orange-400">
                      {booking.type}
                    </div>
                    <p className="mt-2 text-sm font-semibold text-zinc-900">{booking.title}</p>
                    {booking.priceRange && (
                      <p className="mt-1 text-xs text-zinc-500">{booking.priceRange}</p>
                    )}
                    {booking.notes && (
                      <p className="mt-2 text-xs text-zinc-400">{booking.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="border-t border-zinc-100/80 bg-white/95 px-3 py-3">
          {lastResponse?.actions?.length ? (
            <div className="mb-3">
              <div className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                Next steps
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
              {lastResponse.actions.map((action, index) => {
                const target = actionRoutes[action.type]
                if (!target) return null
                return (
                  <button
                    key={`${action.type}-${index}`}
                    onClick={() => runAction(action)}
                    className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600 transition hover:bg-orange-100"
                  >
                    {target.label}
                  </button>
                )
              })}
              </div>
            </div>
          ) : null}

          <div className="mb-3">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-zinc-400">
              <span>Quick start</span>
              <button
                onClick={() => setShowModes((prev) => !prev)}
                className="rounded-full border border-orange-100 bg-white px-3 py-1 text-[10px] font-semibold text-orange-600 transition hover:bg-orange-50"
              >
                {showModes ? 'Hide' : 'Show'}
              </button>
            </div>

            {showModes && (
              <div className="mt-3 rounded-2xl border border-orange-100/70 bg-gradient-to-br from-orange-50 via-white to-amber-50 px-3 py-3 shadow-[0_10px_22px_rgba(249,115,22,0.08)]">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                  <span>Agent modes</span>
                  <span className="text-[10px] font-semibold text-orange-600">
                    Tap to start
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {agentModes.map((mode, index) => {
                    const Icon = mode.icon
                    const spanClass =
                      index === agentModes.length - 1 ? 'col-span-2' : ''
                    return (
                      <button
                        key={mode.label}
                        onClick={() => void sendMessage(mode.prompt)}
                        className={`group flex items-center gap-2 rounded-xl border border-white/80 bg-white/90 px-2.5 py-2 text-left shadow-[0_8px_16px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-[0_12px_20px_rgba(249,115,22,0.12)] ${spanClass}`}
                      >
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${mode.tone}`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block text-xs font-semibold text-zinc-900">
                            {mode.label}
                          </span>
                          <span className="block text-[10px] text-zinc-500">
                            {mode.hint}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  void sendMessage(input)
                }
              }}
              placeholder="Ask the Trippple agent..."
              rows={2}
              className="min-h-[56px] flex-1 resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200/50"
            />
            <button
              onClick={() => void sendMessage(input)}
              disabled={loading || !input.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-[0_12px_24px_rgba(249,115,22,0.3)] transition hover:translate-y-[-1px] hover:shadow-[0_16px_30px_rgba(249,115,22,0.35)] disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
